package com.example.moduleleave.Feign;

import com.example.moduleleave.config.FeignAuthConfig;
import com.example.moduleleave.dto.ProjectDTO;
import com.example.moduleleave.dto.TaskDTO1;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;


    @FeignClient(name = "Project-Module",
            configuration = FeignAuthConfig.class)
    public interface ProjectClient {
        @GetMapping("/projects/{id}")
        ProjectDTO getProjectById(@PathVariable Long id);
        @GetMapping("/tasks/{id}")
        TaskDTO1 getTaskById(@PathVariable Long id);
    }


