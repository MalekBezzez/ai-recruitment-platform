package com.example.moduleproject.Service;



import com.example.moduleproject.dto.CommentDTO;
import com.example.moduleproject.entity.Comment;
import com.example.moduleproject.entity.Task;
import com.example.moduleproject.entity.User;
import com.example.moduleproject.Repository.CommentRepository;
import com.example.moduleproject.Repository.TaskRepository;
import com.example.moduleproject.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepo;

    @Autowired
    private TaskRepository taskRepo;

    @Autowired
    private UserRepository userRepo;

    public List<CommentDTO> getCommentsByTask(Long taskId) {
        return commentRepo.findByTask_TaskId(taskId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public CommentDTO addComment(CommentDTO dto) {
        Comment comment = new Comment();
        comment.setContent(dto.getContent());
        comment.setCreatedDate(LocalDateTime.now());
        comment.setTask(taskRepo.findById(dto.getTaskId()).orElse(null));
        comment.setAuthor(userRepo.findById(dto.getAuthorId()).orElse(null));
        return toDTO(commentRepo.save(comment));
    }

    public void deleteComment(Long id) {
        commentRepo.deleteById(id);
    }

    private CommentDTO toDTO(Comment comment) {
        CommentDTO dto = new CommentDTO();
        dto.setCommentId(comment.getCommentId());
        dto.setContent(comment.getContent());
        dto.setCreatedDate(comment.getCreatedDate());
        dto.setAuthorId(comment.getAuthor().getId());
        dto.setTaskId(comment.getTask().getTaskId());
        return dto;
    }
}
