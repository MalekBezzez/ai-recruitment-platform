package com.example.moduleleave.Service;

import com.example.moduleleave.entity.Employe;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailServiceCamunda {

    @Autowired
    private JavaMailSender mailSender;



    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendDecisionEmail(String employeEmail, String decision, String commentaire, String decisionType) {
        try {
           // Employe employe = employeService.getEmployeById(employeId);
         /*   if (employe == null) {
                System.out.println ("Employé non trouvé avec l'ID: {}" + employeId);
                return;
            }*/

            String subject;
            String content;
            if ("manager".equals(decisionType)) {
                subject = decision.equals("APPROUVER")
                        ? "Your leave request has been approved by your manager"
                        : "Your leave request has been rejected by your manager";

                content = String.format(
                        "Hello,\n\nYour leave request has been %s by your manager.\n" +
                                "Comment: %s\n\nBest regards,\nThe HR Team",
                        decision.equals("APPROUVER") ? "approved" : "rejected",
                        commentaire
                );
            } else { // RH
                subject = "Final decision on your leave request";
                content = String.format(
                        "Hello,\n\nThe final HR decision regarding your leave request: %s.\n" +
                                "HR Comment: %s\n\nBest regards,\nThe HR Team",
                        decision.equals("APPROUVER") ? "Approved" : "Rejected",
                        commentaire
                );
            }


                    SimpleMailMessage message = new SimpleMailMessage();
                    message.setFrom(fromEmail);
                    message.setTo(employeEmail);
                    message.setSubject(subject);
                    message.setText(content);

                    mailSender.send(message);
            System.out.println("Email successfully sent to " + employeEmail);
        } catch (Exception e) {
            System.out.println("Failed to send email to " + employeEmail + e);
            throw new RuntimeException("Failed to send email", e);
        }

    }
            }
