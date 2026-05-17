package com.example.moduleproject.Repository;


import com.example.moduleproject.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByTask_TaskId(Long taskId);
}
