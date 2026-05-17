package com.example.employeemodule.Service;

import com.example.employeemodule.dto.NotificationDTO;
import com.example.employeemodule.entity.Notification;

public class NotificationMapper {

    public static NotificationDTO toDto(Notification notif) {
        NotificationDTO dto = new NotificationDTO();
        dto.setId(notif.getId());
        dto.setMessage(notif.getMessage());
        dto.setCreatedAt(notif.getCreatedAt());
        dto.setRead(notif.isRead());
        return dto;
    }

    public static Notification toEntity(NotificationDTO dto) {
        Notification notif = new Notification();
        notif.setId(dto.getId());
        notif.setMessage(dto.getMessage());
        notif.setCreatedAt(dto.getCreatedAt());
        notif.setRead(dto.isRead());
        return notif;
    }
}
