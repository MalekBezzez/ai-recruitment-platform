package com.example.employeemodule.dto;

import com.example.employeemodule.entity.ContractType;
import lombok.Data;

@Data
public class ContractTypeDTO {

    private Long id;
    private String contractTypeName;
    public static ContractTypeDTO fromEntity(ContractType contractType) {
        if (contractType == null){return null ;}
        ContractTypeDTO dto = new ContractTypeDTO();
        dto.setId(contractType.getId());
        dto.setContractTypeName(contractType.getContractTypeName());
        return dto;
    }
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getContractTypeName() {
        return contractTypeName;
    }

    public void setContractTypeName(String contractTypeName) {
        this.contractTypeName = contractTypeName;
    }
    public static ContractType toEntity(ContractTypeDTO dto) {
        if (dto == null) {
            return null; // Ou retourner une nouvelle instance de ContractType selon le besoin
        }

        ContractType contractType = new ContractType();
        contractType.setId(dto.getId());
        contractType.setContractTypeName(dto.getContractTypeName()); // Exemple
        return contractType;
    }

}
