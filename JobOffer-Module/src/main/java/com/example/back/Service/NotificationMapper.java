package com.example.back.Service;

import com.example.back.dto.NotificationDTO;
import com.example.back.entity.Notification;

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
