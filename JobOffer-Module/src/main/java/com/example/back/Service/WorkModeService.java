package com.example.back.Service;

import com.example.back.Repository.WorkModeRepository;
import com.example.back.entity.WorkMode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WorkModeService {

    private final WorkModeRepository workModeRepository ;


    // CREATE
    public WorkMode saveWorkMode(WorkMode workMode) {
        return workModeRepository.save(workMode);
    }

    // READ ALL
    public List<WorkMode> getAllWorkModes() {
        return workModeRepository.findAll();
    }

    // READ ONE
    public WorkMode getWorkModeById(Long id) {
        return workModeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Work mode not found with id: " + id));
    }

    // UPDATE
    public WorkMode updateWorkMode(Long id, WorkMode newWorkMode) {
        WorkMode existing = getWorkModeById(id);
        existing.setWorkModeName(newWorkMode.getWorkModeName());
        return workModeRepository.save(existing);
    }

    // DELETE
    public void deleteWorkMode(Long id) {
        workModeRepository.deleteById(id);
    }

}
