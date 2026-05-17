package com.example.moduleproject.dto;



public class ProjectNameIdDTO {
    private Long id;
    private String name;

    public ProjectNameIdDTO(Long id, String name) {
        this.id = id;
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }
}
