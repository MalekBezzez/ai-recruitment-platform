package com.example.back.Service;

import com.example.back.Repository.OfferRepository;
import com.example.back.dto.*;
import com.example.back.entity.Offer;
import com.example.back.feign.EmployerClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor

public class OfferService {
    //private final EmployeService employeService;
    private final DiplomaTypeService diplomaTypeService;
    private final CurrencyService currencyService;
    // private final ContractTypeService contractTypeService;
    // private final DepartmentService departmentService;
    private final WorkModeService workModeService;
    private final OfferRepository offerRepository;
    private final WorkflowOfferService workflowOfferService;

    private final EmployerClient employerClient;
   // private final  OfferMapper mapper;


    // CREATE
    public OfferResponseDTO createOffer(OfferRequestDTO dto) {
        System.out.println("*******************DTO reçu: {}" + dto.toString());

        Offer newoffer = Offer.builder()
                .jobTitle(dto.jobTitle())
                .contractTypeId(dto.contractId())
                .yearsOfExp(dto.yearsOfExp())
                .workMode(workModeService.getWorkModeById(dto.workModeId()))
                .departmentId(dto.departmentId())
                .reference(dto.reference())
                .salary(dto.salary())
                .numberOfPos(dto.numberOfPos())
                .diploma(diplomaTypeService.getDiplomaById(dto.diplomaId()))
                .projectOrClient(dto.projectOrClient())
                .startingDate(dto.startingDate())
                .expirationDate(dto.expirationDate())
                .sections(dto.sections())
                .createdById(dto.createdby())
                .curStatus("Draft")
                .creationDate(new Date()) // <-- Ajout ici
                .currency(currencyService.getCurrencyById(dto.currencyId()))
                .build();

        // recently


        Offer savedOffer = offerRepository.save(newoffer);

        return new OfferResponseDTO(
                savedOffer.getJobTitle(),
                savedOffer.getContractTypeId(),       // attention ici
                savedOffer.getYearsOfExp(),
                savedOffer.getWorkMode().getIdWorkMode(),
                savedOffer.getDepartmentId(),
                savedOffer.getReference(),
                savedOffer.getSalary(),
                savedOffer.getCurrency().getIdCurrency(),
                savedOffer.getNumberOfPos(),
                savedOffer.getDiploma().getIdDiplomaType(),
                savedOffer.getProjectOrClient(),
                savedOffer.getStartingDate(),
                savedOffer.getExpirationDate(),
                savedOffer.getSections()
        );
    }

    // recently
    public List<OfferSummarizeDTO> getOffersCreatedBy(Long id) {
        return offerRepository.findByCreatedById(id).stream()
                .sorted(Comparator.comparing(Offer::getCreationDate).reversed())
                .map(offer -> {
                    ContractTypeDTO contractType = employerClient.getContractTypeById(offer.getContractTypeId());
                    DepartmentDTO department = employerClient.getDepartmentById(offer.getDepartmentId());

                    return new OfferSummarizeDTO(
                            offer.getId(),
                            offer.getJobTitle(),
                            contractType != null ? contractType.contractTypeName() : "N/A",
                            department != null ? department.departmentName() : "N/A",
                            offer.getReference(),
                            offer.getNumberOfPos(),
                            offer.getCreationDate(),
                            offer.getStartingDate(),
                            offer.getExpirationDate(),
                            offer.getRequestDate(),
                            offer.getPublishDate(),
                            offer.isPublished(),
                            offer.getCurStatus(),
                            workflowOfferService.isJobOfferInProcess(offer.getId())
                    );
                })
                .toList();
    }


    public void deleteOfferById(Long id) {
        if (!offerRepository.existsById(id)) {
            throw new RuntimeException("Offre non trouvée avec l'ID : " + id);
        }
        offerRepository.deleteById(id);
    }

    public OfferResponseDTO updateOffer(Long id, OfferRequestDTO updatedDTO) {
        Offer existingOffer = offerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Offer not found with ID: " + id));

        // Mise à jour des champs
        existingOffer.setJobTitle(updatedDTO.jobTitle());
        existingOffer.setContractTypeId(updatedDTO.contractId());
        existingOffer.setYearsOfExp(updatedDTO.yearsOfExp());
        existingOffer.setWorkMode(workModeService.getWorkModeById(updatedDTO.workModeId()));
        existingOffer.setDepartmentId(updatedDTO.departmentId());
        existingOffer.setReference(updatedDTO.reference());
        existingOffer.setSalary(updatedDTO.salary());
        existingOffer.setNumberOfPos(updatedDTO.numberOfPos());
        existingOffer.setDiploma(diplomaTypeService.getDiplomaById(updatedDTO.diplomaId()));
        existingOffer.setProjectOrClient(updatedDTO.projectOrClient());
        existingOffer.setStartingDate(updatedDTO.startingDate());
        existingOffer.setExpirationDate(updatedDTO.expirationDate());
        existingOffer.setSections(updatedDTO.sections());
        existingOffer.setCurrency(currencyService.getCurrencyById(updatedDTO.currencyId()));

        // Sauvegarde
        Offer savedOffer = offerRepository.save(existingOffer);

        // Construction et retour du DTO
        return new OfferResponseDTO(
                savedOffer.getJobTitle(),
                savedOffer.getContractTypeId(),
                savedOffer.getYearsOfExp(),
                savedOffer.getWorkMode().getIdWorkMode(),
                savedOffer.getDepartmentId(),
                savedOffer.getReference(),
                savedOffer.getSalary(),
                savedOffer.getCurrency().getIdCurrency(),
                savedOffer.getNumberOfPos(),
                savedOffer.getDiploma().getIdDiplomaType(),
                savedOffer.getProjectOrClient(),
                savedOffer.getStartingDate(),
                savedOffer.getExpirationDate(),
                savedOffer.getSections()
        );
    }


    public OfferResponseDTO getOfferById(Long id) {
        // Trouver l'entité Offer dans la base de données
        Offer offer = offerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Offer not found with ID: " + id));

        return new OfferResponseDTO(
                offer.getJobTitle(),
                offer.getContractTypeId(),
                offer.getYearsOfExp(),
                offer.getWorkMode().getIdWorkMode(),  // Assumant que WorkMode est un objet avec un ID
                offer.getDepartmentId(),  // Même logique pour Department
                offer.getReference(),
                offer.getSalary(),
                offer.getCurrency().getIdCurrency(),
                offer.getNumberOfPos(),
                offer.getDiploma().getIdDiplomaType(),  // Assumant que Diploma est un objet avec un ID
                offer.getProjectOrClient(),
                offer.getStartingDate(),
                offer.getExpirationDate(),
                offer.getSections() // Assumant que c'est un Map<String, String>
                 // Assumant que createdBy est un utilisateur avec un ID
        );


    }

    public OfferDetailsDTO getOfferDetailsById(Long id) {
        Offer offer = offerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Offer not found with ID: " + id));


        // 🔹 Récupération des données distantes via Feign
        ContractTypeDTO contractType = employerClient.getContractTypeById(offer.getContractTypeId());
        DepartmentDTO department = employerClient.getDepartmentById(offer.getDepartmentId());

        return new OfferDetailsDTO(
                offer.getJobTitle(),
                contractType != null ? contractType.contractTypeName() : "N/A"  , // contractName si tu veux vraiment le nom, voir en bas
                offer.getYearsOfExp(),
                offer.getWorkMode().getWorkModeName(),
                department != null ? department.departmentName() : "N/A",
                offer.getReference(),
                offer.getSalary(),
                offer.getCurrency().getCurrencyName(),
                offer.getNumberOfPos(),
                offer.getDiploma().getDiplomaName(),
                offer.getDiploma().getSpeciality(), // Assure-toi que ça existe
                offer.getProjectOrClient(),
                offer.getStartingDate(),
                offer.getExpirationDate(),
                offer.getSections()
        );
    }

    public String getJobTitleById(Long id) {
        Optional<Offer> jobOffer = offerRepository.findById(id);
        return jobOffer.map(Offer::getJobTitle).orElse(null);
    }



    }



