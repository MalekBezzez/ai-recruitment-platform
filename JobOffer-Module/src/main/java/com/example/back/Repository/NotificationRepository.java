package com.example.back.Repository;

import com.example.back.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserIdAndCreatedAtAfter(Long userId, LocalDateTime since);

    long countByUserIdAndReadIsFalse(Long userId);
}
