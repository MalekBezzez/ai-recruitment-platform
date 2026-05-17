package com.example.back.Repository;

import com.example.back.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findBySiteId(Long siteId);
}
