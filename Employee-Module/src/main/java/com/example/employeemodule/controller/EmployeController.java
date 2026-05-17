package com.example.employeemodule.controller;

import com.example.employeemodule.Service.*;
import com.example.employeemodule.dto.*;
import com.example.employeemodule.entity.Employe;
import com.example.employeemodule.entity.LeaveSold;
import com.example.employeemodule.entity.LeaveType;
import com.example.employeemodule.feign.LeaveSoldClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/employee")
public class EmployeController {
    @Autowired
    private LeaveSoldClient leaveTypeService;


    @Autowired
    private EmployeService employeService ;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private DepartmentService departmentService;

    @Autowired
    private ContractTypeService contractTypeService;

    @Autowired
    private InsuranceService insuranceService;
    @Autowired
    private PasswordGenerator passwordGenerator;
    @Autowired
    private EmailService emailService;
    @Autowired
    private CamundaServicee camundaRunService;
    @GetMapping("/all-employees")
    // @PreAuthorize("hasRole('ADMIN')")

    public ResponseEntity<List<EmployeDTO>> getAllEmployes() {
        List<EmployeDTO> employeDTOs = employeService.getAllEmployes();
        return ResponseEntity.ok(employeDTOs);
    }
    @GetMapping("/{id}")
    public ResponseEntity<EmployeCreateDTO> getEmployeById(@PathVariable int id) {
        EmployeCreateDTO employeDTO = employeService.getEmployeById(id);
        return ResponseEntity.ok(employeDTO);
    }

    // In EmployeService.java


    @PostMapping(
            value    = "/employees",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<EmployeCreateDTO> createEmploye(@RequestBody EmployeCreateDTO dto) {
        // 1) Génération et encodage du mot de passe temporaire
        String rawPassword = passwordGenerator.generateRandomPassword(12);
        String encodedPassword = passwordEncoder.encode(rawPassword);

        // 2) Conversion du DTO en entité Employe
        Employe employe = employeService.fromDTO(dto, departmentService, contractTypeService, insuranceService);
        employe.setPassword(encodedPassword);

        // 3) Récupération de tous les LeaveType et création des LeaveSold correspondants
        List<LeaveTypeWithSoldDTO> leaveTypeDTOs = leaveTypeService.getAllLeaveTypes();

        List<LeaveSold> leaveSolds = leaveTypeDTOs.stream()
                .map(leaveDto -> {
                    // Conversion du DTO vers une entité LeaveType
                    LeaveType leaveType = new LeaveType();
                    leaveType.setIdLeaveType(leaveDto.getIdLeaveType());
                    leaveType.setType(leaveDto.getType());

                    // Création de LeaveSold
                    LeaveSold leaveSold = new LeaveSold();
                    leaveSold.setLeaveType(leaveType);
                    leaveSold.setSolde(leaveDto.getSolde());
                    leaveSold.setEmploye(employe);

                    return leaveSold;
                })
                .collect(Collectors.toList());

        employe.setLeaveSolds(leaveSolds);



        // 4) Sauvegarde de l'employé (avec tous les leaveSolds en cascade)
        EmployeCreateDTO saved = employeService.createEmploye(employe);
        System.out.println("Tentative d'envoi de mail à : " );
        // 5) Envoi de l'email avec le mot de passe brut
        try {
            emailService.sendEmail(
                    saved.getEmail(),
                    "Account Creation",
                    "Hello " + saved.getFirstname() + ",\n\nYour temporary password is: " + rawPassword
            );
        } catch (Exception e) {
            e.printStackTrace();  // At least print the error to the console
        }


        // 6) Création de l'utilisateur dans Camunda
        try {
            camundaRunService.createUser(
                    saved.getId(),
                    saved.getFirstname(),
                    saved.getEmail()
            );
            String group = switch (saved.getRole()) {
                case MANAGER -> "managers";
                case RH      -> "rh";
                default      -> "employees";
            };
            camundaRunService.assignToGroup(saved.getId().toString(), group);
        } catch (Exception ex) {
            System.err.println("Erreur Camunda : " + ex.getMessage());
        }

        // 7) Conversion en DTO pour la réponse

        return ResponseEntity.ok(saved);
    }



    @DeleteMapping("/{id}")
    // @PreAuthorize("hasRole('ADMIN')")
    public void deleteEmploye(@PathVariable Long id) {
        employeService.deleteEmploye(id);
    }
    @PutMapping(
            path = "/update/{id}",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<EmployeCreateDTO> updateEmploye(
            @PathVariable Long id,
            @RequestBody EmployeCreateDTO dto
    ) {
        EmployeCreateDTO updatedDto = employeService.updateFromCreateDTO(id, dto);
        return ResponseEntity.ok(updatedDto);
    }
    @GetMapping("/managers")
    public ResponseEntity<List<EmployeDTO>> getAllManagers() {
        List<EmployeDTO> managerDTOs = employeService.getAllManagers();
        return ResponseEntity.ok(managerDTOs);
    }

    @GetMapping("/by-manager/{managerId}")
    public ResponseEntity<List<EmployeDTO>> getEmployeesByManagerId(@PathVariable Long managerId) {
        List<EmployeDTO> employees = employeService.getEmployeesByManagerId(managerId);
        return new ResponseEntity<>(employees, HttpStatus.OK);
    }
    @GetMapping("/test-email")
public ResponseEntity<String> testEmail() {
    try {
        emailService.sendTestEmail("votre-email@gmail.com");
        return ResponseEntity.ok("Email de test envoyé !");
    } catch (Exception e) {
        return ResponseEntity.status(500).body("Erreur : " + e.getMessage());
    }
}
// What Malek added

    @GetMapping("/interviewers")
    public List<EmployeeInterviewerDTO> getAllInterviewers() {
        return employeService.getAllInterviewers();
    }

    //What Malek added when docker

    @GetMapping("/training-candidates")
    public List<EmployeeTrainingDTO> getEmployeesForTraining() {
        return employeService.getEmployeesForTraining();
    }

    @PostMapping("/{id}/reset-password")
    public ResponseEntity<?> resetPassword(@PathVariable("id") long employeeId) {
        String message = employeService.resetPasswordAndSendEmail(employeeId);
        return ResponseEntity.ok(Map.of("message", message));
    }
}


