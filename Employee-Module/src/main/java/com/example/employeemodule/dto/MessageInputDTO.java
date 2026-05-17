package com.example.employeemodule.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class MessageInputDTO {
    private String IdTest ;
    @JsonProperty("messages")
    private List<ResponseDTO1> messages;

    public String getIdTest() {
        return IdTest;
    }

    public void setIdTest(String idTest) {
        IdTest = idTest;
    }

    public MessageInputDTO() {
    }

    public List<ResponseDTO1> getMessages() {
        return messages;
    }

    public void setMessages(List<ResponseDTO1> messages) {
        this.messages = messages;
    }
}
