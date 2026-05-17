package com.example.moduleleave.controller;

import com.example.moduleleave.Feign.EmployeClient;
import com.example.moduleleave.Service.*;
import com.example.moduleleave.dto.*;

import com.example.moduleleave.entity.Employe;
import com.example.moduleleave.entity.LeaveRequest;
import com.example.moduleleave.entity.WorkflowLeave;
import com.example.moduleleave.exception.LeaveRequestNotFoundException;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/conge")
public class DemandeCongeController {

    @Value("${camunda.rest-url}")
    private String camundaRestUrl;

    @Value("${camunda.process.key}")
    private String processKey;

    @Value("${camunda.task.manager}")
    private String taskManagerKey;

    @Value("${camunda.task.rh}")
    private String taskRhKey;

    @Value("${camunda.group.manager}")
    private String groupManager;

    @Value("${camunda.group.rh}")
    private String groupRh;
    @Value("${camunda.task.keys}")
    private String taskKeys;

    @Value("${camunda.task.decision-keys}")
    private String decisionKeys;

    @Value("${camunda.task.comment-keys}")
    private String commentKeys;

    @Value("${camunda.task.approve-statuses}")
    private String approveStatuses;

    @Value("${camunda.task.reject-statuses}")
    private String rejectStatuses;
    @Value("${camunda.topic.rejection}")
    private String topicRejection;

    @Value("${camunda.topic.final-approval}")
    private String topicFinalApproval;
    @Value("${camunda.task.approve-statuses}")
    private String rawApproveStatuses;
    @Value("${camunda.task.reject-statuses}")
    private String rawRejectStatuses;
    private final RestTemplate restTemplate = new RestTemplate();
@Autowired
    HistoryWorkflowLeaveService historyService ;
    @Autowired
    private EmployeClient employeClient;
    private final LeaveRequestService leaveRequestService;
    private final WorkflowLeaveService workflowService;
    private final LeaveSoldService leaveSoldService;
    private List<String> taskKeysr;
    private List<String> decisionKeysr;
    private List<String> commentKeysr;
    private List<String> approveStatusesr;
    private List<String> rejectStatusesr;
    @Autowired
    private EmailServiceCamunda emailServiceCamunda;

    // services, restTemplate, etc…

    /** 3) Cette méthode est appelée juste après l’injection des @Value */
    @PostConstruct
    public void initTaskConfig() {
        taskKeysr        = split(taskKeys);
        decisionKeysr    = split(decisionKeys);
        commentKeysr     = split(commentKeys);
        approveStatusesr = split(rawApproveStatuses);
        rejectStatusesr  = split(rawRejectStatuses);
    }

    private List<String> split(String raw) {
        return Arrays.stream(raw.split(","))
                .map(String::trim)
                .toList();
    }

    public DemandeCongeController(

            LeaveRequestService leaveRequestService,
            WorkflowLeaveService workflowService,
            LeaveSoldService leaveSoldService) {

        this.leaveRequestService = leaveRequestService;
        this.workflowService = workflowService;
        this.leaveSoldService = leaveSoldService;
    }

    @PostMapping("/reset-camunda")
    public ResponseEntity<String> resetCamunda() {
        try {
            // Supprimer toutes les instances de processus
            List<Map<String, Object>> instances = restTemplate.exchange(
                    camundaRestUrl + "/process-instance",
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<Map<String, Object>>>() {}
            ).getBody();
            if (instances != null) {
                instances.forEach(i ->
                        restTemplate.delete(camundaRestUrl + "/process-instance/" + i.get("id"))
                );
            }
            // Supprimer tous les déploiements
            List<Map<String, Object>> deployments = restTemplate.exchange(
                    camundaRestUrl + "/deployment",
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<Map<String, Object>>>() {}
            ).getBody();
            if (deployments != null) {
                deployments.forEach(d ->
                        restTemplate.delete(camundaRestUrl + "/deployment/" + d.get("id") + "?cascade=true")
                );
            }
            return ResponseEntity.ok("Base Camunda réinitialisée avec succès");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de la réinitialisation: " + e.getMessage());
        }
    }

    @PostMapping("/demandes")
    public ResponseEntity<?> demarrerProcessusPourDemandeExistante(
            @RequestParam Long leaveRequestId,
            @RequestParam Long employeId
    ) {
        try {
            LeaveRequest lr = leaveRequestService.getLeaveRequestById(leaveRequestId);
            if (lr == null) throw new LeaveRequestNotFoundException("ID: " + leaveRequestId);

            if (! lr.getEmployee().getId().equals(employeId)) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "L'employeeId ne correspond pas à la demande"));
            }

            EmployeCreateDTO empDto = employeClient.getEmployeById(employeId);
            Employe emp = empDto.toEntity();
            Long mgr = emp.getManagerId();
            if (mgr == null) return ResponseEntity.badRequest()
                    .body(Map.of("error", "Aucun manager assigné à l'employé"));

            // <-- ici on ne transmet que ces 5 variables
            Map<String,Object> vars = Map.of(
                    "variables", Map.of(
                            "leaveRequestId",    Map.of("value", lr.getId(),      "type", "Long"),
                            "employeId",         Map.of("value", employeId.toString(), "type", "String"),
                            "managerId",         Map.of("value", mgr.toString(), "type", "String"),
                            "emailDestinataire", Map.of("value", emp.getEmail(),   "type", "String"),
                            "commentaire",       Map.of("value", lr.getDescription(),"type", "String")
                    )
            );

            ResponseEntity<Map> resp = restTemplate.postForEntity(
                    camundaRestUrl + "/process-definition/key/" + processKey + "/start",
                    vars,
                    Map.class
            );

            if (resp.getStatusCode() == HttpStatus.OK && resp.getBody() != null) {
                String pi = (String) resp.getBody().get("id");
                WorkflowLeave wf = workflowService.createWorkflow(lr.getId(), pi);
                leaveRequestService.updateLeaveRequestStatus(lr.getId(), wf.getStatus().toString());
                return ResponseEntity.ok(Map.of(
                        "message", "Processus démarré avec succès",
                        "processInstanceId", pi
                ));
            }

            return ResponseEntity.status(resp.getStatusCode())
                    .body(Map.of("error", "Échec du démarrage du processus"));
        }
        catch (LeaveRequestNotFoundException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
        catch (HttpClientErrorException e) {
            return ResponseEntity.status(e.getStatusCode())
                    .body(Map.of("error", e.getResponseBodyAsString()));
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }


    @GetMapping("/taches/manager")
    public ResponseEntity<List<TaskDTO>> getTachesManager(@RequestParam Long managerId) {
        try {
            String url = camundaRestUrl
                    + "/task"
                    + "?processDefinitionKey=" + processKey
                    + "&taskDefinitionKey="  + taskManagerKey
                    + "&assignee="           + managerId;
            TaskResponse[] tasks = restTemplate.getForEntity(url, TaskResponse[].class).getBody();
            if (tasks == null) return ResponseEntity.ok(List.of());

            List<TaskDTO> dtos = Arrays.stream(tasks)
                    .map(this::mapToTaskDTO)
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.emptyList());
        }
    }

    @GetMapping("/taches/rh")
    public ResponseEntity<List<TaskDTO>> getTachesRH() {
        try {
            String url = camundaRestUrl
                    + "/task?processDefinitionKey=" + processKey
                    + "&taskDefinitionKey=" + taskRhKey
                    + "&unassigned=true" ;
            TaskResponse[] tasks = restTemplate.getForEntity(url, TaskResponse[].class).getBody();
            if (tasks == null) return ResponseEntity.ok(List.of());

            List<TaskDTO> dtos = Arrays.stream(tasks)
                    .map(this::mapToTaskDTO)
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.emptyList());
        }
    }

    @PostMapping("/traiter/{taskId}")
    public ResponseEntity<?> traiterDecision(
            @PathVariable String taskId,
            @RequestBody Map<String, Object> payload) {

        // --- 1) Récupération et validation de la tâche Camunda ---
        List<TaskResponse> tasks = restTemplate.exchange(
                camundaRestUrl + "/task?taskId=" + taskId,
                HttpMethod.GET, null,
                new ParameterizedTypeReference<List<TaskResponse>>() {}
        ).getBody();
        if (tasks == null || tasks.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Tâche non trouvée : " + taskId));
        }
        TaskResponse task = tasks.get(0);

        // --- 2) Détermination de l’étape pour statuts et variables ---
        int idx = taskKeysr.indexOf(task.getTaskDefinitionKey());
        if (idx < 0) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Tâche non configurée : " + task.getTaskDefinitionKey()));
        }

        // --- 3) Lecture des variables de processus existantes pour récupérer leaveRequestId ---
        Map<String, VariableValue> procVarsBefore =
                getProcessVariables(task.getProcessInstanceId());
        Long lrId = getLongVariableValue(procVarsBefore.get("leaveRequestId"));
        if (lrId == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Impossible de récupérer leaveRequestId"));
        }

        // --- 4) Chargement de la LeaveRequest et de l’Employé demandeur ---
        LeaveRequest lr = leaveRequestService.getLeaveRequestById(lrId);
        Employe demandeur = lr.getEmployee();

        // --- 5) Normalisation de la décision utilisateur ---
        String rawDecision = payload.get("decision").toString();
        String decisionVal = rawDecision.equalsIgnoreCase("Approuver") ? "APPROUVER"
                : rawDecision.equalsIgnoreCase("Rejeter")   ? "REJETER"
                : rawDecision;
        boolean approved = "APPROUVER".equalsIgnoreCase(decisionVal);

        // --- 6) Construction du map "variables" pour la complétion Camunda ---
        Map<String, Object> variablesToSend = Map.of(
                decisionKeysr.get(idx), Map.of("value", decisionVal,                  "type", "String"),
                commentKeysr.get(idx),  Map.of("value", payload.get("commentaire"),   "type", "String")

                );
        Map<String, Object> completePayload = Map.of("variables", variablesToSend);

        // --- 7) Complétion de la tâche Camunda (avec les nouvelles vars) ---
        ResponseEntity<Void> completeResp = restTemplate.postForEntity(
                camundaRestUrl + "/task/" + taskId + "/complete",
                new HttpEntity<>(completePayload, jsonHeaders()),
                Void.class
        );
        if (completeResp.getStatusCode() != HttpStatus.NO_CONTENT) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error","Échec de la complétion Camunda"));
        }

        // --- 8) Mise à jour métier et persistance de l’historique ---
        String newStatus = approved
                ? approveStatusesr.get(idx)
                : rejectStatusesr.get(idx);
        workflowService.updateStatus(task.getProcessInstanceId(), newStatus);
        leaveRequestService.updateLeaveRequestStatus(lrId, newStatus);
        String notifMessage = "Your leave request from " + lr.getStartDate() + " to " + lr.getEndDate()
                + " has been " + (approved ? "APPROUVER" : "REJETER") + " by your manager.";



        if (idx == taskKeysr.size() - 1 && approved) {
            long days = ChronoUnit.DAYS.between(lr.getStartDate(), lr.getEndDate()) + 1;
            leaveSoldService.decrementSolde(
                    lr.getEmployee().getId(),
                    lr.getLeaveType().getIdLeaveType(),
                    days
            );
        }
// … après decrementSolde éventuel …
// 9) Envoi d’un email de notification
        String userEmail = demandeur.getProfessionalemail();
        emailServiceCamunda.sendDecisionEmail(
                userEmail,
                decisionVal,
                payload.get("commentaire").toString(),
                idx == taskKeysr.size() - 1 ? "rh" : "manager"
        );

        return ResponseEntity.ok(Map.of("message","Décision enregistrée"));


    }






    private HttpHeaders jsonHeaders() {
        HttpHeaders h = new HttpHeaders();
        h.setContentType(MediaType.APPLICATION_JSON);
        return h;
    }


    private HttpHeaders createJsonHeaders() {
        HttpHeaders h = new HttpHeaders();
        h.setContentType(MediaType.APPLICATION_JSON);
        return h;
    }




    // Récupérer les détails d'une tâche spécifique
    @GetMapping("/taches/details/{taskId}")
    public ResponseEntity<TaskDTO> getTaskDetails(@PathVariable String taskId) {
        try {
            ResponseEntity<TaskResponse> taskResp =
                    restTemplate.getForEntity(camundaRestUrl + "/task/" + taskId, TaskResponse.class);
            if (taskResp.getStatusCode() != HttpStatus.OK || taskResp.getBody() == null) {
                return ResponseEntity.notFound().build();
            }
            TaskResponse task = taskResp.getBody();

            ResponseEntity<Map<String, VariableValue>> varsResp = restTemplate.exchange(
                    camundaRestUrl + "/process-instance/" + task.getProcessInstanceId() + "/variables",
                    HttpMethod.GET, null,
                    new ParameterizedTypeReference<Map<String, VariableValue>>() {}
            );
            Map<String, VariableValue> vars = varsResp.getBody();
            if (varsResp.getStatusCode() != HttpStatus.OK || vars == null) {
                return ResponseEntity.notFound().build();
            }

            Long lrId = getLongVariableValue(vars.get("leaveRequestId"));
            if (lrId == null) {
                return ResponseEntity.notFound().build();
            }

            LeaveRequest lr = leaveRequestService.getLeaveRequestById(lrId);
            String startDate = lr.getStartDate().toString();
            String endDate   = lr.getEndDate().toString();
            Employe emp = lr.getEmployee();
            String typeLabel = (lr.getLeaveType() != null)
                    ? lr.getLeaveType().getType()
                    : "—";

            TaskDTO dto = new TaskDTO(
                    task.getId(),
                    task.getName(),
                    task.getAssignee(),
                    task.getProcessInstanceId(),
                    task.getCreated(),
                    emp.getId(),
                    emp.getFirstname(),
                    emp.getLastname(),
                    typeLabel,


                    startDate,
                    endDate,
                    getStringVariableValue(vars.get("commentaire"))
            );

            return ResponseEntity.ok(dto);

        } catch (LeaveRequestNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }





    private Long getLongVariableValue(VariableValue variable) {
        if (variable == null) return null;
        Object value = variable.getValue();
        if (value instanceof Number) {
            return ((Number) value).longValue();
        } else if (value instanceof String) {
            try {
                return Long.parseLong((String) value);
            } catch (NumberFormatException e) {
                return null;
            }
        }
        return null;
    }

    private String getStringVariableValue(VariableValue variable) {
        if (variable == null) return "";
        Object value = variable.getValue();
        return value != null ? value.toString() : "";
    }

    // Classes internes pour le mapping des réponses JSON
    private static class TaskResponse {
        private String id;
        private String name;
        private String assignee;
        private String processInstanceId;
        private Date created;
        private String taskDefinitionKey;

        // Getters et Setters
        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getAssignee() { return assignee; }
        public void setAssignee(String assignee) { this.assignee = assignee; }
        public String getProcessInstanceId() { return processInstanceId; }
        public void setProcessInstanceId(String processInstanceId) { this.processInstanceId = processInstanceId; }
        public Date getCreated() { return created; }
        public void setCreated(Date created) { this.created = created; }
        public String getTaskDefinitionKey() { return taskDefinitionKey; }
        public void setTaskDefinitionKey(String taskDefinitionKey) { this.taskDefinitionKey = taskDefinitionKey; }
    }

    private static class VariableValue {
        private Object value;
        private String type;

        // Getters et Setters
        public Object getValue() { return value; }
        public void setValue(Object value) { this.value = value; }
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
    }
    private Map<String, VariableValue> getProcessVariables(String processInstanceId) {
        ResponseEntity<Map<String, VariableValue>> response = restTemplate.exchange(
                camundaRestUrl + "/process-instance/" + processInstanceId + "/variables",
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<Map<String, VariableValue>>() {}
        );
        return response.getBody() != null
                ? response.getBody()
                : Collections.emptyMap();
    }
    /**
     * Convertit une réponse Camunda en DTO métier.
     */

    private TaskDTO mapToTaskDTO(TaskResponse t) {
        // 1) Récupération des variables pour obtenir l'ID de la LeaveRequest
        Map<String, VariableValue> vars = getProcessVariables(t.getProcessInstanceId());
        Long lrId = getLongVariableValue(vars.get("leaveRequestId"));
        if (lrId == null) return null;

        // 2) Charger la LeaveRequest depuis la BDD
        LeaveRequest lr;
        try {
            lr = leaveRequestService.getLeaveRequestById(lrId);
        } catch (LeaveRequestNotFoundException e) {
            return null;
        }
        Employe emp = lr.getEmployee();

        // 3) Formater le type de congé
        String type = lr.getLeaveType() != null
                ? lr.getLeaveType().getType()
                : "—";

        // 4) Récupérer directement les dates depuis l'entité
        //    Vous pouvez formater la date selon vos besoins
        String startDate = lr.getStartDate().toString();  // e.g. "2025-05-01"
        String endDate   = lr.getEndDate().toString();    // e.g. "2025-05-10"

        // 5) Construire et retourner le DTO
        return new TaskDTO(
                t.getId(),
                t.getName(),
                t.getAssignee(),
                t.getProcessInstanceId(),
                t.getCreated(),
                emp.getId(),
                emp.getFirstname(),
                emp.getLastname(),
                type,
                startDate,
                endDate,
                getStringVariableValue(vars.get("commentaire"))  // si vous gardez le commentaire issu de Camunda
        );
    }

    @GetMapping("/history/manager/{managerId}")
    public ResponseEntity<List<ValidationHistoryDTO>> getManagerValidatedTasks(
            @PathVariable Long managerId) {

        // 1) Récupérer les tâches terminées du manager
        String taskUrl = camundaRestUrl
                + "/history/task"
                + "?taskDefinitionKey=" + taskManagerKey
                + "&taskAssignee="     + managerId
                + "&finished=true";
        HistoricTaskResponse[] history = restTemplate.getForObject(
                taskUrl,
                HistoricTaskResponse[].class
        );
        if (history == null || history.length == 0) {
            return ResponseEntity.ok(List.of());
        }

        List<ValidationHistoryDTO> dtos = Arrays.stream(history)
                .map(ht -> {
                    // --- 1) Récup leaveRequestId ---
                    String varUrl = camundaRestUrl
                            + "/history/variable-instance"
                            + "?processInstanceId=" + ht.getProcessInstanceId()
                            + "&variableName=leaveRequestId";
                    HistoricVariableInstance[] varInst = restTemplate.getForObject(
                            varUrl, HistoricVariableInstance[].class
                    );
                    if (varInst == null || varInst.length == 0 || varInst[0].getValue() == null) {
                        return null;
                    }
                    Long leaveRequestId = Long.valueOf(varInst[0].getValue().toString());

                    // --- 2) Récup decisionManager ---
                    String decisionUrl = camundaRestUrl
                            + "/history/variable-instance"
                            + "?processInstanceId=" + ht.getProcessInstanceId()
                            + "&variableName=decisionManager";
                    HistoricVariableInstance[] decInst = restTemplate.getForObject(
                            decisionUrl, HistoricVariableInstance[].class
                    );
                    String decision = (decInst != null
                            && decInst.length > 0
                            && decInst[0].getValue() != null)
                            ? decInst[0].getValue().toString()
                            : "UNKNOWN";

                    // --- 3) Charger la LeaveRequest + Employé ---
                    LeaveRequest lr;
                    try {
                        lr = leaveRequestService.getLeaveRequestById(leaveRequestId);
                    } catch (LeaveRequestNotFoundException e) {
                        return null;
                    }
                    Employe emp = lr.getEmployee();

                    // --- 4) Calculer la durée de validation ---
                //    long durationMs = ht.getEndTime().getTime() - ht.getStartTime().getTime();
                    String type = lr.getLeaveType() != null
                            ? lr.getLeaveType().getType()
                            : "—";
                    // --- 5) Construire le DTO final ---
                    ValidationHistoryDTO dto = new ValidationHistoryDTO();
                    dto.setTaskDefinitionKey(ht.getTaskDefinitionKey());
                    dto.setName(ht.getName());
                    dto.setManagerId(managerId);
                    dto.setRequesterId(emp.getId());
                    dto.setRequesterName(emp.getFirstname() + " " + emp.getLastname());
                    dto.setStartDate(lr.getStartDate());
                    dto.setEndDate(lr.getEndDate());
                    dto.setType(type);
                    dto.setStartDate(ht.getStartTime());
                    dto.setEndTime(ht.getEndTime());
                    dto.setEndDate(ht.getEndTime());
                    dto.setDecision(decision);
                    dto.setAssignee(ht.getAssignee()); ;
                    return dto;
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }





    @GetMapping("/validated-by-rh")
    public ResponseEntity<List<LeaveRequestValidatedDTO>> getValidatedByRH() {
        List<LeaveRequestValidatedDTO> dtos = leaveRequestService
                .findByStatus("Validated by HR")  // or whatever your RH-approved status is
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }





    private LeaveRequestValidatedDTO toDto(LeaveRequest lr) {
        LeaveRequestValidatedDTO dto = new LeaveRequestValidatedDTO();
        dto.setId(lr.getId());
        dto.setEmployeeId(lr.getEmployee().getId());
        dto.setEmployeeFirstName(lr.getEmployee().getFirstname());
        dto.setEmployeeLastName(lr.getEmployee().getLastname());
        dto.setEmployeeCin(lr.getEmployee().getCIN());
        dto.setStartDate(lr.getStartDate());
        dto.setEndDate(lr.getEndDate());
        dto.setLeaveTypeName(lr.getLeaveType().getType());
        dto.setStatus(lr.getStatus());
        return dto;
    }
    /**
     * Récupère toutes les tâches (user-tasks) terminées dans Camunda.
     */
    @GetMapping("/history/tasks")
    public ResponseEntity<List<HistoricTaskResponse>> getAllFinishedTasks() {
        // 1) Appel à l’API History de Camunda avec finished=true
        String url = camundaRestUrl + "/history/task?finished=true";
        HistoricTaskResponse[] history = restTemplate
                .getForObject(url, HistoricTaskResponse[].class);

        // 2) Retourne la liste (vide si null)
        List<HistoricTaskResponse> list = (history != null)
                ? Arrays.asList(history)
                : Collections.emptyList();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/history/tasks/employees")
    public ResponseEntity<List<EmployeeNameDTO>> getFinishedTasksEmployeeNames() {
        // 1) Récupérer toutes les tâches terminées
        String url = camundaRestUrl + "/history/task?finished=true";
        HistoricTaskResponse[] history = restTemplate
                .getForObject(url, HistoricTaskResponse[].class);

        List<EmployeeNameDTO> result = new ArrayList<>();

        if (history != null) {
            for (HistoricTaskResponse h : history) {
                String procInstId = h.getTaskDefinitionKey();
                // 2) Récupérer le workflowLeave puis la leaveRequest + employé
                WorkflowLeave wf = workflowService.findByProcessInstanceId(procInstId);
                if (wf != null && wf.getLeaveRequest() != null) {
                    Employe emp = wf.getLeaveRequest().getEmployee();
                    if (emp != null) {
                        result.add(new EmployeeNameDTO(
                                h.getId(),
                                emp.getFirstname(),
                                emp.getLastname()
                        ));
                    }
                }
            }
        }

        return ResponseEntity.ok(result);
    }

}