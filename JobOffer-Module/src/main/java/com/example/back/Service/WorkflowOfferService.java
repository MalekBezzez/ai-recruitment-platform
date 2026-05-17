package com.example.back.Service;

import com.example.back.Repository.OfferRepository;
import com.example.back.Repository.WorkflowJobOfferRepository;
import com.example.back.dto.*;
import com.example.back.entity.Offer;
import com.example.back.entity.WorkflowJobOffer;
import com.example.back.feign.EmployerClient;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WorkflowOfferService {


    private final WorkflowJobOfferRepository workflowJobOfferRepository;
    private final OfferRepository offerRepository;
    private final CamundaService camundaService;

    private final ApplicationService applicationService;

    private final EmployerClient employerClient; // 🔹 Feign Client


/*    @Value("${my.process.key}")
    private String processKey;
*/

    public boolean isJobOfferInProcess(Long offerId) {
        return workflowJobOfferRepository.existsByJobOffer_Id(offerId);
    }

    //READ ONE
    public WorkflowJobOffer getByProcessInstanceId(String processInstanceId) {
        return workflowJobOfferRepository
                .findByProcessInstanceId(processInstanceId)
                .orElseThrow(() -> new EntityNotFoundException("WorkflowJobOffer not found for processInstanceId : " + processInstanceId));
    }

   //CREATE
    public WorkflowJobOffer startWorkflow(Long offerId) {

        // the manager of the Owner can be Null

        Offer offer = offerRepository.findById(offerId)
                .orElseThrow(() -> new RuntimeException("Offer not found "));

        String ownerId = String.valueOf(offer.getCreatedById());

        // Utilisation du Feign Client pour récupérer l'employé
        EmployeeLightDTO owner = employerClient.getEmployeById(offer.getCreatedById());


        // ManagerId peut être null
        String managerId = (owner.managerId() != null)
                ? String.valueOf(owner.managerId())
                : "null";

        System.out.println("*************************************"+managerId);
        String ownerMail = owner.professionalEmail();

        System.out.println("*******This is the Owner mail : ****"+ ownerMail);

        System.out.println("*******This is the Owner ID : ****"+ ownerId);



        String processInstanceId = camundaService.startProcessInstance(
                "JobOfferRequestWorkflow",
                Map.of("Decision", "PENDING",
                           "DecisionManager","PENDING",
                               "CommentManager","",
                        "DecisionHR","PENDING",
                        "CommentHR","",
                        "Comment", "",
                        "OwnerId", ownerId,
                        "ManagerId", managerId,
                        "OwnerProfessionalMail", ownerMail)
        );






        WorkflowJobOffer workflow = WorkflowJobOffer.builder()
                .processInstanceId(processInstanceId)
                .statusJobOffer("PENDING")
                .jobOffer(offer)
                .build();
// recently what i modified
        offer.setCurStatus("In Process");
        offer.setRequestDate(new Date());
        offerRepository.save(offer);

        return workflowJobOfferRepository.save(workflow);
    }

    // COMPLISH TASK
    public void completeUserTaskWithUpdate(String taskId, String decision, String comment, String completedBy  ) {
        // 1. Récupérer les détails de la tâche
        TaskResponse taskResponse = camundaService.getTaskById(taskId);

        // 2. Identifier le type de tâche (Manager ou RH)
        boolean isManagerTask = taskResponse.getAssignee() != null;

        // 3. Construire les variables à envoyer
        Map<String, Object> variablesToUpdate = new HashMap<>();

        // Variables utilisées dans le gateway (toujours mises à jour)
        variablesToUpdate.put("Decision", decision);
        variablesToUpdate.put("Comment", comment);

        // Variables spécifiques selon le type de tâche
        if (isManagerTask) {
            variablesToUpdate.put("DecisionManager", decision);
            variablesToUpdate.put("CommentManager", comment);
            variablesToUpdate.put("CompletedByManager", completedBy);
        } else {
            variablesToUpdate.put("DecisionHR", decision);
            variablesToUpdate.put("CommentHR", comment);
            variablesToUpdate.put("CompletedByHR", completedBy);
        }

        // Métadonnée utile
        variablesToUpdate.put("CompletedBy", completedBy);

        // 4. Mise à jour dans la base de données
        String processInstanceId = taskResponse.getProcessInstanceId();
        WorkflowJobOffer workflowJobOffer = workflowJobOfferRepository.findByProcessInstanceId(processInstanceId)
                .orElseThrow(() -> new RuntimeException("WorkflowJobOffer introuvable"));

        String statusWithTaskName = decision + " - " + taskResponse.getName();
        workflowJobOffer.setStatusJobOffer(statusWithTaskName);
        workflowJobOfferRepository.save(workflowJobOffer);

        // what i recently modified
        Offer offer = workflowJobOffer.getJobOffer();
        offer.setCurStatus(statusWithTaskName);
        offerRepository.save(offer);

        // 6. Compléter la tâche (sans renvoyer les variables, déjà envoyées)
        camundaService.completeTask(taskId, variablesToUpdate);


        // 7. Vérifier si le process est terminé et la décision est Approved
        boolean isEnded = camundaService.isProcessInstanceEnded(processInstanceId);

        if (isEnded && "Approved".equalsIgnoreCase(decision)) {

            if (!workflowJobOffer.isPublished()) {
                workflowJobOffer.setPublished(true);
                workflowJobOffer.setPublishedDate(new Date());
                workflowJobOfferRepository.save(workflowJobOffer);

                // recently

                    // Mettre à jour le statut de l'offre
                    offer.setCurStatus("Published"); //  "Approved"
                    offerRepository.save(offer);

            }
        }

    }

    //Extract valua from camunda variables
    public String extractCamundaVariableValue(Map<String, Object> variables, String key) {
        Map<String, Object> valueMap = (Map<String, Object>) variables.get(key);
        return valueMap != null ? (String) valueMap.get("value") : null;
    }

    //TASKS RECUPERATIONS  // cbn
    public List<JobOfferTaskDTO> getUserTasks(Long userId) {
        List<JobOfferTaskDTO> result = new ArrayList<>();


        // ✅ Appel Feign pour récupérer l'employé et son rôle
        EmployeeLightDTO employe = employerClient.getEmployeById(userId);
        String userRole = employe.role().toString();
        String userIdStr = userId.toString();

        // 1. Tâches assignées directement
        List<TaskResponse> assignedTasks = camundaService.getTasksAssignedToUser(userIdStr);
        for (TaskResponse task : assignedTasks) {
            // j'ai des task actiive dont leur process n'existe pas dans la table workflow, des process ajouté starté sans passer par save
            WorkflowJobOffer existing = getByProcessInstanceId(task.getProcessInstanceId());
            result.add(new JobOfferTaskDTO(
                    existing.getJobOffer().getId(),
                    existing.getJobOffer().getJobTitle(),
                    task.getId(),
                    task.getName()
            ));
        }

        // 2. Tâches par groupe (rôle)
        List<TaskResponse> groupTasks = camundaService.getTasksByCandidateGroup(userRole);
        for (TaskResponse task : groupTasks) {
            boolean alreadyExists = result.stream().anyMatch(t -> t.taskId().equals(task.getId()));
            if (alreadyExists) continue;

            WorkflowJobOffer existing = getByProcessInstanceId(task.getProcessInstanceId());
            result.add(new JobOfferTaskDTO(
                    existing.getJobOffer().getId(),
                    existing.getJobOffer().getJobTitle(),
                    task.getId(),
                    task.getName()
            ));
        }

        return result;
    }
    // USER JOB OFFER STATE JUST FOR SIMPLE  VISUALIZATION (resumé) //cbn
    public List<JobOfferRequestStateDTO> getUserInitiatedRequests(Long userId) {

        List<JobOfferRequestStateDTO> result = new ArrayList<>();


        // Récupérer toutes les offres initiées par l'utilisateur

        List<WorkflowJobOffer> offers = workflowJobOfferRepository.findByJobOffer_CreatedById(userId);

        for (WorkflowJobOffer offer : offers) {
            String processInstanceId = offer.getProcessInstanceId();
            // ICI  y'a un bug
            String previousComment = camundaService.getPreviousCommentFromProcessVariables(processInstanceId);
            System.out.println("this the previous comment hereee  of Resume display "+previousComment);
            String currentTaskName;
            if (isProcessEnded(offer)) {
                currentTaskName = "ENDED";
            } else {
                // Sinon, on cherche la tâche active
                currentTaskName = camundaService.getCurrentActiveTaskName(processInstanceId);
            }


            // Construire le DTO
            JobOfferRequestStateDTO dto = new JobOfferRequestStateDTO(
                    offer.getJobOffer().getId(),
                    offer.getJobOffer().getJobTitle(),
                    offer.getStatusJobOffer(),
                    previousComment,
                    currentTaskName
            );

            result.add(dto);
        }

        return result;
    }

    // VERIFY IF PROCESS TERMINATED
    private boolean isProcessEnded(WorkflowJobOffer offer) {
        return "REJECTED".equalsIgnoreCase(offer.getStatusJobOffer());
    }


    // ********HISTORY PART*****
    // For Owner
    // on va l'enlever
    public List<OwnerTaskHistoryDTO> getHistoryForOwner(Long ownerId) {
        // Step 1: Get WorkflowJobOffers by owner
        List<WorkflowJobOffer> offers = workflowJobOfferRepository.findByJobOffer_CreatedById(ownerId);

        List<String> processInstanceIds = offers.stream()
                .map(WorkflowJobOffer::getProcessInstanceId)
                .filter(Objects::nonNull)
                .toList();

        // Step 2: Call Camunda history
        List<HistoryDetail> historyDetails = camundaService.getHistoryByProcessInstances(processInstanceIds);

        // Step 3: Regroup by taskId
        Map<String, List<HistoryDetail>> groupedByTask = historyDetails.stream()
                .filter(detail -> detail.taskId() != null)
                .collect(Collectors.groupingBy(HistoryDetail::taskId));
        //{
        //  "t1": [
        //          { "taskId": "t1", "variableName": "Decision", value: "Approved" },
        //          { "taskId": "t1", "variableName": "Comment",  value: "All good" }
        //        ],
        //  "t2": [
        //          { "taskId": "t2", "variableName": "Decision", value: "Rejected" },
        //          { "taskId": "t2", "variableName": "Comment",  value: "Not qualified" }
        //        ]
        //}


        // Step 4: Build DTOs
        List<OwnerTaskHistoryDTO> dtos = new ArrayList<>();

        for (Map.Entry<String, List<HistoryDetail>> entry : groupedByTask.entrySet()) { // entrySet() : Itérer sur les paires clé-valeur
            // entry c'est un clé valeur paire , on parcourir GroupByTask
            String taskId = entry.getKey(); // key it's the id task
            List<HistoryDetail> taskDetails = entry.getValue(); // value

            // Extract processInstanceId (assumed same for all in the group)
            String processInstanceId = taskDetails.get(0).processInstanceId();

            WorkflowJobOffer workflowJobOffer = workflowJobOfferRepository.findByProcessInstanceId(processInstanceId).orElse(null);
            if (workflowJobOffer == null) continue; // impossible null

            String jobTitle = workflowJobOffer.getJobOffer().getJobTitle();  // JobTile recuperation

            String decision = getVariableValue(taskDetails, "Decision"); // return the value
            String comment = getVariableValue(taskDetails, "Comment");
            String completedById = getVariableValue(taskDetails, "CompletedBy");
            Long employeeId = completedById == null ? null : Long.valueOf(completedById);

            String completedByName = "Unknown"; // Valeur par défaut
            if (employeeId != null) {
                try {
                    EmployeeLightDTO employe = employerClient.getEmployeById(employeeId);
                    completedByName = employe.firstname() + " " + employe.lastname();
                } catch (Exception e) {
                    System.err.println("Erreur Feign: impossible de récupérer l'employé " + employeeId);
                }
            }


            //Extract task name, startTime and endTime using a call to /history/task or similar.
            HistoricTask taskInfo = camundaService.getHistoricTask(taskId);

            String taskName = taskInfo != null ? taskInfo.name() : "Unknown";
            LocalDateTime startTime = taskInfo != null ? taskInfo.startTime().toLocalDateTime() : null;
            LocalDateTime endTime = taskInfo != null ? taskInfo.endTime().toLocalDateTime() : null;

            dtos.add(new OwnerTaskHistoryDTO(
                    processInstanceId,
                    taskName, // Replace if you fetch it
                    startTime, // Replace if you fetch it
                    endTime, // We take the time of the variable update as endTime
                    jobTitle,
                    decision,
                    comment,
                    completedByName
            ));
        }

        return dtos;
    }


    private String getVariableValue(List<HistoryDetail> details, String variableName) {
        return details.stream()
                .filter(d -> variableName.equals(d.variableName()))
                .map(d -> d.value().toString())
                .findFirst()
                .orElse(null);
    }



    // For Validator

    public List<ValidatorTaskHistoryDTO> getHistoryForValidator(Long userId) {
        // 1. Récupère tâches assignées (cas Manager)

        String userIdStr = userId.toString();

        List<TaskResponse> assignedTasks = camundaService.getHistoricTasksAssignedTo(userIdStr);

        // 2. Récupère rôle de l'utilisateur (ex: "HR")
        String role = "";
        try {
            EmployeeLightDTO employe = employerClient.getEmployeById(userId);
            role = employe.role().toString();
        } catch (Exception e) {
            System.err.println("Impossible de récupérer le rôle pour l'utilisateur " + userId);
        }


        // 3. Récupère identity-link-log par groupe
        List<IdentityLinkLogResponse> identityLinks = camundaService.getHistoricIdentityLinksByGroup(role);
        Set<String> taskIdsFromGroup = identityLinks.stream()
                .map(IdentityLinkLogResponse::getTaskId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        // 4. Récupère les tasks groupées finies
        List<TaskResponse> groupTasks = taskIdsFromGroup.stream()
                .map(camundaService::getHistoricTaskById)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .filter(task -> "completed".equalsIgnoreCase(task.getTaskState()))
                .collect(Collectors.toList());

        // 5. Fusionne les deux listes
        List<TaskResponse> allTasks = new ArrayList<>();
        allTasks.addAll(assignedTasks);
        allTasks.addAll(groupTasks);


        // Filtrer uniquement les tâches complétées
        allTasks = allTasks.stream()
                .filter(task -> "Completed".equalsIgnoreCase(task.getTaskState()))
                .collect(Collectors.toList());
        // filter that their processInstanceId exist in our case
        List<String> allowedProcessInstanceIds = workflowJobOfferRepository
                .findAll()
                .stream()
                .map(WorkflowJobOffer::getProcessInstanceId)
                .collect(Collectors.toList());

        // Étape 2: Filtrer les TaskResponse
        List<TaskResponse> filteredTasks = allTasks
                .stream()
                .filter(task -> allowedProcessInstanceIds.contains(task.getProcessInstanceId()))
                .collect(Collectors.toList());



        System.out.print(filteredTasks);
        // 6. Crée les DTOs
        return filteredTasks.stream().map(task -> {
            String processInstanceId = task.getProcessInstanceId();
            boolean isManager = task.getAssignee() != null;

            String decisionVar = isManager ? "DecisionManager" : "DecisionHR";
            String commentVar = isManager ? "CommentManager" : "CommentHR";

            String decision = camundaService.getHistoricVariable(processInstanceId, decisionVar);
            String comment = camundaService.getHistoricVariable(processInstanceId, commentVar);

            WorkflowJobOffer workflowJobOffer = workflowJobOfferRepository.findByProcessInstanceId(processInstanceId)
                    .orElse(null);

            String fullname = "Unkhnown employee";
            if (workflowJobOffer != null && workflowJobOffer.getJobOffer().getCreatedById() != null) {
                try {
                    //  Récupération employé via Feign
                    EmployeeLightDTO employee = employerClient.getEmployeById(workflowJobOffer.getJobOffer().getCreatedById());
                    fullname = employee.firstname() + " " + employee.lastname();
                } catch (Exception e) {
                    System.err.println("Erreur récupération employé pour l'offre : " + e.getMessage());
                }
            }





            return new ValidatorTaskHistoryDTO(
                    processInstanceId,
                    task.getId(),
                    task.getName(),
                    task.getStartTime(),
                    task.getEndTime(),
                    workflowJobOffer != null ? workflowJobOffer.getJobOffer().getJobTitle() : null,
                    workflowJobOffer != null ? fullname : null,
                    decision,
                    comment
            );
        }).collect(Collectors.toList());
    }

    private String getAnyProcessInstanceId(List<HistoryDetail> details) {
        return details.stream()
                .map(HistoryDetail::processInstanceId)
                .filter(Objects::nonNull)
                .findFirst()
                .orElse(null);
    }


    public List<PublishedOfferDTO> getPublishedOffersWithStats() {
        List<WorkflowJobOffer> publishedWorkflowOffers = workflowJobOfferRepository.findByIsPublishedTrue();
        System.out.println("this is the published offers list "+publishedWorkflowOffers);

        return publishedWorkflowOffers.stream()
                .map(workflowJobOffer -> {
                    Offer offer = workflowJobOffer.getJobOffer();

                    // 🔹 Récupération du département via Feign
                    DepartmentDTO department = employerClient.getDepartmentById(offer.getDepartmentId());

                    int nbApplications = applicationService.countApplicationsByOfferId(offer.getId());

                    return new PublishedOfferDTO(
                            offer.getId(),
                            offer.getJobTitle(),
                            department != null ? department.departmentName() : "N/A", // ✅ Découplé
                            workflowJobOffer.getPublishedDate(),
                            nbApplications,
                            workflowJobOffer.isCompleted(),
                            workflowJobOffer.getCompletedDate()
                    );
                })
                .collect(Collectors.toList());
    }



}
