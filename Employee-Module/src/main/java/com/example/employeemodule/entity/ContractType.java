package com.example.employeemodule.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity

@NoArgsConstructor
@AllArgsConstructor
public class ContractType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "contract_type_name")
    private String contractTypeName;

    // LeaveRequest.java

    @OneToMany(mappedBy = "contractType",
            cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JsonManagedReference("employe-contractType")

    private List<Employe> employee;


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

    public List<Employe> getEmployes() {
        return employee;
    }

    public void setEmployes(List<Employe> employes) {
        this.employee = employes;
    }
}
