package com.example.employeemodule.Service;

import com.example.employeemodule.Repository.AnswerRepository;
import com.example.employeemodule.Repository.EmployeRepository;
import com.example.employeemodule.Repository.QuestionRepository;
import com.example.employeemodule.Repository.QuestionnaireRepository;
import com.example.employeemodule.dto.AnswerDTO;
import com.example.employeemodule.dto.AnswerDisplayDTO;
import com.example.employeemodule.dto.EmployeDTO;
import com.example.employeemodule.entity.Answer;
import com.example.employeemodule.entity.Employe;
import com.example.employeemodule.entity.Question;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AnswerService {

    @Autowired
    private AnswerRepository answerRepository;
    @Autowired
    private QuestionRepository questionRepository;
    @Autowired
    private QuestionnaireRepository questionnaireRepository;
    @Autowired
    private EmployeRepository employeRepository;

    public void saveAnswers(List<AnswerDTO> answerDTOs) {
        List<Answer> answers = new ArrayList<>();

        for (AnswerDTO dto : answerDTOs) {
            Question question = questionRepository.findById(dto.getQuestionId())
                    .orElseThrow(() -> new IllegalArgumentException("Question non trouvée"));

            // 🔍 Validation selon le type de question
            String response = dto.getResponseText();

            switch (question.getQuestionType()) {
                case BOOLEAN:
                    if (!response.equalsIgnoreCase("Yes") && !response.equalsIgnoreCase("No")) {
                        throw new IllegalArgumentException("Réponse booléenne invalide : doit être 'Oui' ou 'Non'");
                    }
                    break;

                case TEXT:
                    if (response.matches("\\d+")) {
                        throw new IllegalArgumentException("Réponse textuelle invalide : ne peut pas être uniquement numérique");
                    }
                    break;

                case CHOICE:
                    try {
                        int numeric = Integer.parseInt(response);
                        if (question.getScaleMax() != null && (numeric < 1 || numeric > question.getScaleMax())) {
                            throw new IllegalArgumentException("Réponse CHOICE hors limites");
                        }
                    } catch (NumberFormatException e) {
                        throw new IllegalArgumentException("Réponse CHOICE doit être un nombre");
                    }
                    break;

                case LIKERT:
                    if (question.getLikertLabels() != null && !question.getLikertLabels().containsValue(Integer.parseInt(response))) {
                        throw new IllegalArgumentException("Réponse LIKERT invalide : valeur non autorisée");
                    }
                    break;




                default:
                    throw new IllegalArgumentException("Type de question non pris en charge");
            } Answer answer = new Answer();
            answer.setQuestion(question);
            answer.setQuestionnaire(
                    questionnaireRepository.findById(dto.getQuestionnaireId())
                            .orElseThrow(() -> new IllegalArgumentException("Questionnaire non trouvé"))
            );
            answer.setEmploye(
                    employeRepository.findById(dto.getEmployeId())
                            .orElseThrow(() -> new IllegalArgumentException("Employé non trouvé"))
            );
            answer.setResponseText(response);

            answerRepository.save(answer); // ✅ C’est ça qui persistait les réponses
        }}

    public List<AnswerDisplayDTO> getAnswersByQuestionnaireAndEmployee(Long questionnaireId, Long employeId) {
        List<Answer> answers = answerRepository.findByQuestionnaire_QuestionnaireIdAndEmploye_Id(questionnaireId, employeId);

        return answers.stream()
                .map(answer -> new AnswerDisplayDTO(
                        answer.getQuestion().getQuestionText(),
                        answer.getResponseText(),
                        answer.getEmploye().getFirstname() + " " + answer.getEmploye().getLastname()
                ))
                .collect(Collectors.toList());
    }
    public List<EmployeDTO> getEmployeesWhoAnswered(Long questionnaireId) {
        List<Employe> employes = answerRepository.findDistinctEmployesByQuestionnaireId(questionnaireId);
        return employes.stream().map(e -> {
            EmployeDTO dto = new EmployeDTO();
            dto.setId(e.getId());
            dto.setFirstname(e.getFirstname());
            dto.setLastname(e.getLastname());
            return dto;
        }).collect(Collectors.toList());
    }
    public boolean hasAnswered(Long questionnaireId, Long employeId) {
        return answerRepository.existsByQuestionnaire_QuestionnaireIdAndEmploye_Id(questionnaireId, employeId);
    }
    public int countEmployeesWhoAnswered(Long questionnaireId) {
        return answerRepository.countDistinctEmployeByQuestionnaireId(questionnaireId);
    }


}

