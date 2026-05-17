package com.example.employeemodule.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail(String to, String subject, String text) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("your-email@gmail.com");
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            
            mailSender.send(message);
            logger.info("Email envoyé avec succès à : {}", to);
            
        } catch (Exception e) {
            logger.error("Erreur lors de l'envoi de l'email à : {}", to, e);
            throw new RuntimeException("Erreur lors de l'envoi de l'email", e);
        }
    }

    public void sendEmail2(String to, String link) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("your-email@gmail.com");
            message.setTo(to);
            message.setSubject("Reset your password");
            message.setText("Click here to reset your password: " + link);
            
            mailSender.send(message);
            logger.info("Email de reset envoyé avec succès à : {}", to);
            
        } catch (Exception e) {
            logger.error("Erreur lors de l'envoi de l'email de reset à : {}", to, e);
            throw new RuntimeException("Erreur lors de l'envoi de l'email de reset", e);
        }
    }

    public void sendTestEmail(String to) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("your-email@gmail.com");
            message.setTo(to);
            message.setSubject("Test Email");
            message.setText("Ceci est un e-mail de test - " + java.time.LocalDateTime.now());
            
            mailSender.send(message);
            logger.info("Email de test envoyé avec succès à : {}", to);
            
        } catch (Exception e) {
            logger.error("Erreur lors de l'envoi de l'email de test à : {}", to, e);
            throw new RuntimeException("Erreur lors de l'envoi de l'email de test", e);
        }
    }

    // Méthode pour tester manuellement la connexion
    public boolean isEmailServiceWorking() {
        try {
            sendTestEmail("khalilsaidani0077@gmail.com"); // Remplacez par votre email
            return true;
        } catch (Exception e) {
            logger.error("Le service email ne fonctionne pas", e);
            return false;
        }
    }

    public void sendNewPassword(String to, String name, String plainPassword) {
        String subject = "Your New Password";
        String body = String.format("""
Hello %s,

A temporary password has been generated for your account:

    %s

For security reasons:
• Please change it as soon as you log in
• Do not share this password
• Delete this email after using it

Best regards,
HR Team
""", (name != null ? name : ""), plainPassword);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
    }
}