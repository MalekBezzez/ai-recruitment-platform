package com.example.employeemodule.Repository;

import com.example.employeemodule.entity.Photo;
import com.example.employeemodule.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PhotoRepository extends JpaRepository<Photo, Long> {
    Photo findByUserId(Long userId);
    Photo findByUser(User userId);
}
