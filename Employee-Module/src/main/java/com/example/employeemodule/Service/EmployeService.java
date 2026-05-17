package com.example.employeemodule.Service;

import com.example.employeemodule.Repository.*;
import com.example.employeemodule.dto.*;
import com.example.employeemodule.entity.*;
import com.example.employeemodule.exception.DuplicateFieldException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.employeemodule.exception.ResourceNotFoundException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmployeService {

    @Autowired
    private EmailService emailService ;
    @Autowired
    private EmployeRepository employeRepository;
    @Autowired
    private ContractTypeRepository contractTypeRepository ;
    @Autowired
    private DepartmentRepository departmentRepository ;
    @Autowired
    private InsuranceRepository insuranceRepository ;
    @Autowired
    private PasswordEncoder passwordEncoder;

    // src/main/java/com/example/loginpfe/service/EmployeService.java
    @Transactional
    public Employe updateFromDTO(Long id, EmployeUpdateDTO dto) {
        Employe exist = employeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employé non trouvé : " + id));

        // 1️⃣ Champs simples
        exist.setFirstname(dto.getFirstname());
        exist.setLastname(dto.getLastname());
        exist.setEmail(dto.getEmail());
        exist.setCIN(dto.getCin());
        exist.setPersonalPhone(dto.getPersonalPhone());
        exist.setBirthPlace(dto.getBirthPlace());
        exist.setBirthDate(dto.getBirthDate());
        exist.setAddress(dto.getAddress());
        exist.setWorkplace(dto.getWorkplace());
        exist.setProfessionalemail(dto.getProfessionalemail());
       // exist.setBusinessUnit(dto.getBusinessUnit());
        exist.setSalary(dto.getSalary());
        exist.setJobTitle(dto.getJobTitle());
        exist.setWorktime(Employe.Worktime.valueOf(dto.getWorktime()));
        // … autres champs simples …

        // 2️⃣ Relations
        if (dto.getManagerId() != null) {
            Employe mgr = employeRepository.findById(dto.getManagerId())
                    .orElseThrow(() -> new RuntimeException("Manager non trouvé : " + dto.getManagerId()));
            exist.setManager(mgr);
        } else {
            exist.setManager(null);
        }

        if (dto.getInsuranceGroupId() != null) {
            Insurance ins = insuranceRepository.findById(dto.getInsuranceGroupId())
                    .orElseThrow(() -> new RuntimeException("Assurance non trouvée : " + dto.getInsuranceGroupId()));
            exist.setInsuranceGroup(ins);
        } else {
            exist.setInsuranceGroup(null);
        }

        if (dto.getContractTypeId() != null) {
            ContractType ct = contractTypeRepository.findById(dto.getContractTypeId())
                    .orElseThrow(() -> new RuntimeException("ContractType non trouvé : " + dto.getContractTypeId()));
            exist.setContractType(ct);
        } else {
            exist.setContractType(null);
        }

        if (dto.getDepartmentId() != null) {
            Department dep = departmentRepository.findById(dto.getDepartmentId())
                    .orElseThrow(() -> new RuntimeException("Department non trouvé : " + dto.getDepartmentId()));
            exist.setDepartment(dep);
        } else {
            exist.setDepartment(null);
        }

        // 3️⃣ Sauvegarde
        return employeRepository.save(exist);
    }

    public Employe getEmployeById(Long id) {
        return employeRepository.findById(id).orElse(null);
    }

    @Transactional
    public EmployeCreateDTO updateFromCreateDTO(Long id, EmployeCreateDTO dto) {
        Employe exist = employeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employé non trouvé : " + id));

        // 1️⃣ Champs simples
        exist.setFirstname(dto.getFirstname());
        exist.setLastname(dto.getLastname());
        exist.setEmail(dto.getEmail());
        exist.setCIN(dto.getCin());
        exist.setBirthPlace(dto.getBirthPlace());
        exist.setBirthDate(dto.getBirthDate());
        exist.setAddress(dto.getAddress());
        exist.setMobilePhone(dto.getMobilePhone());
        exist.setPersonalPhone(dto.getPersonalPhone());
        exist.setWorkplace(dto.getWorkplace());
        exist.setRole(dto.getRole());
        exist.setProfessionalemail(dto.getProfessionalemail());
        exist.setSalary(dto.getSalary());
        exist.setSeniority(dto.getSeniority());
        exist.setJobTitle(dto.getJobTitle());
        exist.setWorktime(dto.getWorktime());
        exist.setPersonalAddress(dto.getPersonalAddress());
        exist.setNationality(dto.getNationality());
        exist.setBankAccountNumber(dto.getBankAccountNumber());
        exist.setSocialSecurityCode(dto.getSocialSecurityCode());
        exist.setGender(dto.getGender());
        exist.setMartialStatus(dto.getMartialStatus());
        exist.setNumberOfChildren(dto.getNumberOfChildren());
        // … ajoutez ici tout autre champ primitif …

        // 2️⃣ Relations
        if (dto.getManagerId() != null) {
            Employe mgr = employeRepository.findById(dto.getManagerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Manager non trouvé : " + dto.getManagerId()));
            exist.setManager(mgr);
        } else {
            exist.setManager(null);
        }

        if (dto.getInsuranceGroupId() != null) {
            Insurance ins = insuranceRepository.findById(dto.getInsuranceGroupId())
                    .orElseThrow(() -> new ResourceNotFoundException("Assurance non trouvée : " + dto.getInsuranceGroupId()));
            exist.setInsuranceGroup(ins);
        } else {
            exist.setInsuranceGroup(null);
        }

        if (dto.getContractTypeId() != null) {
            ContractType ct = contractTypeRepository.findById(dto.getContractTypeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Type de contrat non trouvé : " + dto.getContractTypeId()));
            exist.setContractType(ct);
        } else {
            exist.setContractType(null);
        }

        if (dto.getDepartmentId() != null) {
            Department dep = departmentRepository.findById(dto.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Département non trouvé : " + dto.getDepartmentId()));
            exist.setDepartment(dep);
        } else {
            exist.setDepartment(null);
        }

        // 3️⃣ Sauvegarde
        Employe saved = employeRepository.save(exist);

        // 4️⃣ Conversion en DTO
        return convertToEmployeCreateDTO(saved);
    }
    public Employe saveEmploye(Employe employe) {
        return employeRepository.save(employe);
    }  public Employe findEntityById(Long id) {
    return employeRepository.findById(id).orElse(null);
} public Employe createEmploye(EmployeCreateDTO dto) {
        Employe employe = new Employe();

        employe.setAddress(dto.getAddress());
        employe.setFirstname(dto.getFirstname());
        employe.setLastname(dto.getLastname());
        employe.setEmail(dto.getEmail());
        employe.setCIN(dto.getCin());
        employe.setRole(dto.getRole()) ;

        employe.setMobilePhone(dto.getMobilePhone());
        employe.setPersonalPhone(dto.getPersonalPhone());
        employe.setWorkplace(dto.getWorkplace());
        employe.setProfessionalemail(dto.getProfessionalemail());
    //    employe.setBusinessUnit(dto.getBusinessUnit());
        employe.setSalary(dto.getSalary());
        employe.setSeniority(dto.getSeniority());
        employe.setJobTitle(dto.getJobTitle());
        employe.setWorktime(dto.getWorktime());
        employe.setPersonalAddress(dto.getPersonalAddress());
        employe.setNationality(dto.getNationality());
        employe.setBankAccountNumber(dto.getBankAccountNumber());
        employe.setSocialSecurityCode(dto.getSocialSecurityCode());
        employe.setGender(dto.getGender());
        employe.setMartialStatus(dto.getMartialStatus());
        employe.setNumberOfChildren(dto.getNumberOfChildren());
        employe.setBirthDate(dto.getBirthDate());
        employe.setBirthPlace(dto.getBirthPlace());
      //  employe.setPolicyNumberIns(dto.getPolicyNumberIns());

        if (dto.getManagerId() != null) {
            var manager = employeRepository.findById(dto.getManagerId()).orElse(null);
            System.out.println("Manager trouvé: " + manager);
            employe.setManager(manager);
        }


        if (dto.getDepartmentId() != null) {
            employe.setDepartment(departmentRepository.findById(dto.getDepartmentId()).orElse(null));
        }

        if (dto.getContractTypeId() != null) {
            employe.setContractType(contractTypeRepository.findById(dto.getContractTypeId()).orElse(null));
        }

        if (dto.getInsuranceGroupId() != null) {
            employe.setInsuranceGroup(insuranceRepository.findById(dto.getInsuranceGroupId()).orElse(null));
        }


        return employeRepository.save(employe);
    }

    public void deleteEmploye(Long id) {
        employeRepository.deleteById(id);
    }
   /* public List<Employe> getAllManagers() {
        return employeRepository.findByRole(User.Role.MANAGER);
    }*/
    public EmployeCreateDTO getEmployeById(long id) {
        Employe employe = employeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employé non trouvé avec l'id : " + id));
        return convertToEmployeCreateDTO(employe);
    }
    // In EmployeService.java
    public List<EmployeDTO> getEmployeesByManagerId(Long managerId) {
        List<Employe> employees = employeRepository.findByManagerId(managerId);
        return employees.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // Add this method to convert Employe to EmployeDTO
    private EmployeDTO toDTO(Employe employe) {
        EmployeDTO dto = new EmployeDTO();
        dto.setId(employe.getId());
        dto.setFirstname(employe.getFirstname());
        dto.setLastname(employe.getLastname());
       dto.setProfessionalEmail(employe.getProfessionalemail());
        dto.setJobTitle(employe.getJobTitle());
        // Add other fields as needed, e.g.:
        dto.setSalary(employe.getSalary());
      //  dto.setSeniority(employe.getSeniority() != null ? employe.getSeniority().toString() : null);
        //dto.setWorktime(employe.getWorktime() != null ? employe.getWorktime().toString() : null);
        // Optionally include manager details (avoid infinite recursion)
        if (employe.getManager() != null) {
            dto.setManagerId(employe.getManager().getId());
        }
        // Include department if needed
      /*  if (employe.getDepartment() != null) {
            dto.setDepartmentId(employe.getDepartment().getId());
            // Assuming departmentName is a field in Department
            dto.setDepartmentName(employe.getDepartment().getDepartmentName());
        }*/
        return dto;
    }
    public boolean isEmployeeUnderManager(Long employeId, Long managerId) {
        Employe employe = employeRepository.findById(employeId).orElse(null);
        return employe != null && employe.getManager() != null && employe.getManager().getId().equals(managerId);
    }    private EmployeDTO convertToEmployeDTO(Employe employe) {
        EmployeDTO dto = new EmployeDTO();
        dto.setId(employe.getId());
        dto.setFirstname(employe.getFirstname());
        dto.setLastname(employe.getLastname());
        dto.setEmail(employe.getEmail());
        dto.setCin(employe.getCIN());
        dto.setPersonalPhone(employe.getPersonalPhone());
        dto.setBirthDate(employe.getBirthDate());
        dto.setRole(employe.getRole());
        dto.setWorkplace(employe.getWorkplace());
        dto.setProfessionalEmail(employe.getProfessionalemail());
        dto.setMobilePhone(employe.getMobilePhone());
        dto.setJobTitle(employe.getJobTitle());
       // dto.setBusinessUnit(employe.getBusinessUnit());
        dto.setSeniority(employe.getSeniority());
     //   dto.setContract(employe.getContract());
        dto.setSalary(employe.getSalary());
        dto.setPersonalAddress(employe.getPersonalAddress());
        dto.setNationality(employe.getNationality());
        dto.setBankAccountNumber(employe.getBankAccountNumber());
        dto.setSocialSecurityCode(employe.getSocialSecurityCode());
        dto.setGender(employe.getGender());
        dto.setMartialStatus(employe.getMartialStatus());
        dto.setNumberOfChildren(employe.getNumberOfChildren());
        dto.setBirthPlace(employe.getBirthPlace());
        dto.setPolicyNumberIns(employe.getPolicyNumberIns());

        // Conversion des relations
        if (employe.getManager() != null) {
            dto.setManagerId(employe.getManager().getId());
        }

        if (employe.getInsuranceGroup() != null) {
            dto.setInsuranceGroupId(employe.getInsuranceGroup().getId());
        }


        return dto;
    }

    private EmployeDTO convertToManagerDTO(Employe manager) {
        EmployeDTO dto = new EmployeDTO();
        dto.setId(manager.getId());
        dto.setFirstname(manager.getFirstname());
        dto.setLastname(manager.getLastname());
        dto.setEmail(manager.getEmail());
        dto.setProfessionalEmail(manager.getProfessionalemail());
        return dto;
    }

    private InsuranceDTO convertToInsuranceDTO(Insurance insurance) {
        InsuranceDTO dto = new InsuranceDTO();
        dto.setId(insurance.getId());
        dto.setName(insurance.getName());
        dto.setDescription(insurance.getDescription());
        dto.setStartDate(insurance.getStartDate());
        dto.setEndDate(insurance.getEndDate());
        dto.setInsuranceProvider(insurance.getInsuranceProvider());
        dto.setContactInfo(insurance.getContactInfo());
        return dto;
    }
    public String getEmailFromEmployeId(Long employeId) {
        return employeRepository.findById(employeId)
                .map(Employe::getProfessionalemail)
                .orElseThrow(() -> new RuntimeException("Employé non trouvé avec l'ID: " + employeId));
    }
    public List<Long> getEmployeeIdsUnderManager(Long managerId) {
        return employeRepository.findByManagerId(managerId)
                .stream()
                .map(Employe::getId)
                .collect(Collectors.toList());
    }

    public Employe findByEmail(String email) {
        return employeRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Employé non trouvé"));
    }
    public List<EmployeDTO> getAllEmployes() {
        List<Employe> employes = employeRepository.findAll();
        return employes.stream()
                .map(EmployeDTO::fromEntity)
                .collect(Collectors.toList());
    }
    public List<EmployeDTO> getAllManagers() {
        List<Employe> managers = employeRepository.findByRole(User.Role.MANAGER);
        return managers.stream()
                .map(this::convertToManagerDTO)
                .collect(Collectors.toList());
    }

    public Employe fromDTO(
            EmployeCreateDTO dto,
            DepartmentService departmentService,
            ContractTypeService contractTypeService,
            InsuranceService insuranceService
    ) {
        Employe employe = new Employe();
        employe.setFirstname(dto.getFirstname());
        employe.setLastname(dto.getLastname());
        employe.setEmail(dto.getEmail());
        employe.setCIN(dto.getCin());
        employe.setRole(dto.getRole());
        employe.setAddress(dto.getAddress());
        employe.setMobilePhone(dto.getMobilePhone());
        employe.setPersonalPhone(dto.getPersonalPhone());
        employe.setWorkplace(dto.getWorkplace());
        employe.setProfessionalemail(dto.getProfessionalemail());
        employe.setHireDate(dto.getHireDate());
        employe.setSalary(dto.getSalary());
        employe.setSeniority(dto.getSeniority());
        employe.setJobTitle(dto.getJobTitle());
        employe.setWorktime(dto.getWorktime());
        employe.setPersonalAddress(dto.getPersonalAddress());
        employe.setNationality(dto.getNationality());
        employe.setBankAccountNumber(dto.getBankAccountNumber());
        employe.setSocialSecurityCode(dto.getSocialSecurityCode());
        employe.setGender(dto.getGender());
        employe.setMartialStatus(dto.getMartialStatus());
        employe.setNumberOfChildren(dto.getNumberOfChildren());
        employe.setBirthDate(dto.getBirthDate());
        employe.setBirthPlace(dto.getBirthPlace());
        //employe.setPolicyNumberIns(dto.getPolicyNumberIns());

        if (dto.getManagerId() != null)
            employe.setManager(employeRepository.findById(dto.getManagerId()).orElse(null));

        if (dto.getDepartmentId() != null)
            employe.setDepartment(departmentService.findById(dto.getDepartmentId()));

        if (dto.getContractTypeId() != null)
            employe.setContractType(contractTypeService.findById(dto.getContractTypeId()));

        if (dto.getInsuranceGroupId() != null)
            employe.setInsuranceGroup(insuranceService.findById(dto.getInsuranceGroupId()));

        return employe;
    }
    public EmployeCreateDTO createEmploye(Employe employe) {
        // Save the employee entity
        if (employeRepository.existsByEmail(employe.getEmail())) {
            throw new DuplicateFieldException("email", employe.getEmail());
        }
        if (employeRepository.existsByCIN(employe.getCIN())) {
            throw new DuplicateFieldException("cin", employe.getCIN());
        }
        Employe savedEmploye = employeRepository.save(employe);

        // Convert to EmployeCreateDTO
        return convertToDTO(savedEmploye);
    }
    private EmployeCreateDTO convertToEmployeCreateDTO(Employe e) {
        EmployeCreateDTO dto = new EmployeCreateDTO();
        dto.setId(e.getId());
        dto.setFirstname(e.getFirstname());
        dto.setLastname(e.getLastname());
        dto.setEmail(e.getEmail());
        dto.setCin(e.getCIN());
        dto.setBirthDate(e.getBirthDate());
        dto.setBirthDate(e.getBirthDate());
        dto.setBirthPlace(e.getBirthPlace());
        dto.setAddress(e.getAddress());
        dto.setMobilePhone(e.getMobilePhone());
        dto.setPersonalPhone(e.getPersonalPhone());
        dto.setWorkplace(e.getWorkplace());
        dto.setRole(e.getRole());
        dto.setProfessionalemail(e.getProfessionalemail());
        dto.setSalary(e.getSalary());
        dto.setSeniority(e.getSeniority());
        dto.setJobTitle(e.getJobTitle());
        dto.setManagerId(e.getManager() != null ? e.getManager().getId() : null);
        dto.setWorktime(e.getWorktime());
        dto.setPersonalAddress(e.getPersonalAddress());
        dto.setNationality(e.getNationality());
        dto.setBankAccountNumber(e.getBankAccountNumber());
        dto.setSocialSecurityCode(e.getSocialSecurityCode());
        dto.setGender(e.getGender());
        dto.setHireDate(e.getHireDate());
        dto.setMartialStatus(e.getMartialStatus());
        dto.setNumberOfChildren(e.getNumberOfChildren());
        dto.setInsuranceGroupId(e.getInsuranceGroup() != null ? e.getInsuranceGroup().getId() : null);
        dto.setContractTypeId(e.getContractType() != null ? e.getContractType().getId() : null);
        dto.setDepartmentId(e.getDepartment() != null ? e.getDepartment().getId() : null);

        // Names for related entities
        dto.setInsuranceGroupName(
                e.getInsuranceGroup() != null ? e.getInsuranceGroup().getName() : null
        );
        dto.setContractTypeName(
                e.getContractType() != null ? e.getContractType().getContractTypeName() : null
        );
        dto.setDepartmentName(
                e.getDepartment() != null ? e.getDepartment().getDepartmentName() : null
        );

        // Convert diplomas to DTOs
        if (e.getDiplomas() != null && !e.getDiplomas().isEmpty()) {
            List<DiplomaDTO> diplomaDTOs = e.getDiplomas().stream()
                    .map(DiplomaDTO::fromEntity)
                    .collect(Collectors.toList());
            dto.setDiplomas(diplomaDTOs);
        } else {
            dto.setDiplomas(null); // or an empty list: Collections.emptyList()
        }

        return dto;
    }

    private EmployeCreateDTO convertToDTO(Employe employe) {
        EmployeCreateDTO dto = new EmployeCreateDTO();
        dto.setId(employe.getId());
        dto.setFirstname(employe.getFirstname());
        dto.setLastname(employe.getLastname());
        dto.setEmail(employe.getEmail());
        // Set other fields as necessary
        return dto;
    }
    // What malek Added
    //what malek added in the service 09/06
    public List<EmployeeInterviewerDTO> getAllInterviewers() {
        return employeRepository.findAll().stream()
                .map(emp -> new EmployeeInterviewerDTO(emp.getId(), emp.getFirstname() + " " + emp.getLastname()))
                .collect(Collectors.toList());
    }

    public List<Employe> getEmployeesByIds(List<Long> ids) {
        return employeRepository.findAllById(ids);
    }

    // what Malek added for trainig Recommendation

    public List<EmployeeTrainingDTO> getEmployeesForTraining() {
        return employeRepository.findAll().stream()
                .map(employe -> new EmployeeTrainingDTO(
                        employe.getId(),
                        employe.getFirstname()+" "+employe.getLastname(),
                        employe.getJobTitle(), // ✅ le champ correspond à ta colonne
                        employe.getDepartment().getDepartmentName()
                ))
                .toList();
    }

    @Transactional
    public String resetPasswordAndSendEmail(long employeeId) {
        Employe emp = employeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found: " + employeeId));

        // Generate password
        String newPassword = PasswordGenerator.generateRandomPassword(12);

        // Encode password, but don't save yet
        emp.setPassword(passwordEncoder.encode(newPassword));

        try {
            // Try sending email
            emailService.sendNewPassword(emp.getProfessionalemail(), emp.getFirstname(), newPassword);

            // If success → update status & save
            emp.setResetStatus(Employe.ResetStatus.SUCCESS);  // or emp.setResetStatus(ResetStatus.SUCCESS)
            employeRepository.save(emp);

            return "A new password has been sent to: " + maskEmail(emp.getProfessionalemail());

        } catch (Exception e) {
            // If email fails → rollback / keep old state
            emp.setResetStatus(Employe.ResetStatus.FAILED);  // or emp.setResetStatus(ResetStatus.FAILED)
            // You can still save if you want to log the failure
            employeRepository.save(emp);

            throw new RuntimeException("Failed to send email. Password was not updated.", e);
        }
    }


    private String maskEmail(String email) {
        if (email == null || !email.contains("@")) return "hidden";
        String[] parts = email.split("@", 2);
        String local = parts[0];
        if (local.length() <= 2) return "***@" + parts[1];
        return local.substring(0, 2) + "***@" + parts[1];
    }
    // EmployeService.java
    @Transactional
    public void updateResetStatus(long employeeId, Employe.ResetStatus status) {
        Employe emp = employeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found: " + employeeId));
        emp.setResetStatus(status);
        employeRepository.save(emp);
    }

}
