package com.example.authentification.Repository;

import com.example.authentification.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findById(int id);
    List<User>  findByTokenExpirationBefore(LocalDateTime date) ;
    Optional<User> findByResetToken(String token);

}
