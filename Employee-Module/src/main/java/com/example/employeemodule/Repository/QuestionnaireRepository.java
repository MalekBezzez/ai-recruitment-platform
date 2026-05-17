package com.example.employeemodule.Repository;

import com.example.employeemodule.entity.Answer;
import com.example.employeemodule.entity.Questionnaire;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuestionnaireRepository extends JpaRepository<Questionnaire, Long> {


}
