// GlobalExceptionHandler.java
package com.example.employeemodule.exception;

import org.hibernate.exception.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Ton exception custom reste
    @ExceptionHandler(DuplicateFieldException.class)
    public ResponseEntity<Map<String, Object>> handleDup(DuplicateFieldException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("field", ex.getField());
        body.put("value", ex.getValue());
        body.put("message", "Duplicate value");
        return ResponseEntity.status(HttpStatus.CONFLICT).body(body);
    }

    // Handler robuste pour les violations de contraintes uniques
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, Object>> handleSql(DataIntegrityViolationException ex) {
        String constraint = extractConstraintName(ex); // << clé
        String field = mapConstraintToField(constraint); // << mapping clair

        Map<String, Object> body = new HashMap<>();
        body.put("field", field != null ? field : "unknown");
        body.put("message", "Duplicate value");
        body.put("constraint", constraint); // utile pour debug
        return ResponseEntity.status(HttpStatus.CONFLICT).body(body);
    }

    private String extractConstraintName(DataIntegrityViolationException ex) {
        // Cherche une ConstraintViolationException Hibernate dans la cause
        Throwable cause = ex.getCause();
        while (cause != null) {
            if (cause instanceof ConstraintViolationException cve) {
                if (StringUtils.hasText(cve.getConstraintName())) {
                    return cve.getConstraintName();
                }
            }
            // Certains drivers mettent l’info dans la SQLException
            if (cause instanceof SQLException sqlEx && StringUtils.hasText(sqlEx.getMessage())) {
                // Dernier recours: retourne le message SQL (debug)
                return sqlEx.getMessage();
            }
            cause = cause.getCause();
        }
        return null;
    }

    // Mappe le nom de contrainte -> champ fonctionnel
    // ⚠️ Adapte selon les vrais noms dans ta DB (chez toi ET chez ton collègue)
    private String mapConstraintToField(String constraintName) {
        if (!StringUtils.hasText(constraintName)) return null;

        String c = constraintName.toLowerCase();
        if (c.contains("email")) return "email";
        if (c.contains("cin"))   return "cin";

        // Si vos contraintes s’appellent différemment :
        // if (c.equals("employee_email_key")) return "email";
        // if (c.equals("uk_employee_email")) return "email";
        // if (c.equals("uk_employee_cin")) return "cin";

        return null;
    }
}
