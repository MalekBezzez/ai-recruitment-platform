package com.example.back.Repository;

import com.example.back.entity.WorkMode;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkModeRepository extends JpaRepository<WorkMode, Long> {

    WorkMode findByWorkModeName(String workModeName);
}
