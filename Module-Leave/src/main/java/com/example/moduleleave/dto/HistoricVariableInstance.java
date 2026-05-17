package com.example.moduleleave.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * DTO pour mapper une variable historique Camunda ("processVariables" entry)
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class HistoricVariableInstance {

    /** Nom de la variable (champ JSON "variableName") */
    @JsonProperty("variableName")
    private String name;

    /** Valeur de la variable */
    private Object value;

    /** Type de la variable */
    private String type;

    public HistoricVariableInstance() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Object getValue() {
        return value;
    }

    public void setValue(Object value) {
        this.value = value;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
