package com.example.moduleleave.dto;

import lombok.Data;

@Data
public class ContractTypeDTO {

    private Long id;
    private String contractTypeName;

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


}
