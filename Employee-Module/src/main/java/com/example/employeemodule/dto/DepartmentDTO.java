package com.example.employeemodule.dto;



import com.example.employeemodule.entity.Department;
import lombok.Data;

@Data
public class DepartmentDTO {
    private Long id;
    private String departmentName;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }
    public static DepartmentDTO fromEntity(Department department) {
        if (department == null) {
            return null; // Retourner null ou une valeur par défaut, selon ton besoin
        }

        DepartmentDTO dto = new DepartmentDTO();
        dto.setId(department.getId());
        dto.setDepartmentName(department.getDepartmentName());
        return dto;
    }
    public static Department toEntity(DepartmentDTO dto) {
        if (dto == null) {
            return null; // Retourner null ou une nouvelle instance par défaut selon le besoin
        }

        Department department = new Department();
        department.setId(dto.getId());
        department.setDepartmentName(dto.getDepartmentName());
        return department;
    }


}

