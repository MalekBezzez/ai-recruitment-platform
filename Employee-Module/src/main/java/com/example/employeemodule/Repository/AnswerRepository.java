package com.example.employeemodule.Repository;

import com.example.employeemodule.entity.Answer;
import com.example.employeemodule.entity.Employe;
import com.example.employeemodule.entity.Questionnaire;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnswerRepository extends JpaRepository<Answer, Long> {
    long countDistinctEmployeByQuestionnaire(Questionnaire questionnaire);

    @Query("SELECT COUNT(DISTINCT a.employe.id) FROM Answer a WHERE a.questionnaire.questionnaireId = :questionnaireId")
    int countDistinctEmployeByQuestionnaireId(@Param("questionnaireId") Long questionnaireId);


    boolean existsByQuestionnaire_QuestionnaireIdAndEmploye_Id(Long questionnaireId, Long employeId);

    // Pour statistique/affichage
    @Query("SELECT DISTINCT a.employe.id FROM Answer a WHERE a.questionnaire.questionnaireId = :questionnaireId")
    List<Long> findDistinctEmployeIdsByQuestionnaire(Long questionnaireId);
    List<Answer> findByQuestionnaireQuestionnaireId(Long questionnaireId);
    List<Answer> findByQuestionnaire_QuestionnaireIdAndEmploye_Id(Long questionnaireId, Long employeId);
    @Query("SELECT DISTINCT a.employe FROM Answer a WHERE a.questionnaire.questionnaireId = :questionnaireId")
    List<Employe> findDistinctEmployesByQuestionnaireId(Long questionnaireId);
    List<Answer> findByQuestionnaire_QuestionnaireId(Long questionnaireId);

}
