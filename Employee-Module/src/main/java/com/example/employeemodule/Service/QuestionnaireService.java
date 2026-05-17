package com.example.employeemodule.Service;

import com.example.employeemodule.Repository.AnswerRepository;
import com.example.employeemodule.Repository.EmployeRepository;
import com.example.employeemodule.Repository.QuestionnaireRepository;
import com.example.employeemodule.dto.*;
import com.example.employeemodule.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class QuestionnaireService {
    @Autowired
    private AnswerRepository answerRepository;
    @Autowired
    private QuestionnaireRepository questionnaireRepository;

    @Autowired
    private EmployeRepository employeRepository;

    public QuestionnaireDTO save(QuestionnaireDTO dto) {
        Questionnaire questionnaire = new Questionnaire();
        questionnaire.setTitle(dto.getTitle());
        questionnaire.setDescription(dto.getDescription());

        // 🔗 Liens aux employés
        if (dto.getEmployeIds() != null && !dto.getEmployeIds().isEmpty()) {
            List<Employe> users = employeRepository.findAllById(dto.getEmployeIds());
            questionnaire.setEmployes(users);
        } else {
            questionnaire.setEmployes(List.of());
        }

        // 🔗 Liens aux questions
        if (dto.getQuestions() != null && !dto.getQuestions().isEmpty()) {
            List<Question> questions = dto.getQuestions().stream().map(qdto -> {
                Question question = new Question();
                question.setQuestionText(qdto.getQuestionText());
                question.setTheme(qdto.getTheme());
                question.setQuestionType(qdto.getQuestionType());
                question.setWeight(qdto.getWeight()); // Set weight
                if (qdto.getQuestionType() == Question.QuestionType.BOOLEAN) {
                    question.setScaleMax(2); // Fixe à 2 pour les questions booléennes
                } else {
                    question.setScaleMax(qdto.getScaleMax()); // Autres types conservent la valeur fournie
                }


                if (qdto.getQuestionType() == Question.QuestionType.CHOICE && qdto.getChoices() != null) {
                    List<Choice> choices = qdto.getChoices().stream()
                            .map(choiceText -> {
                                Choice choice = new Choice();
                                choice.setText(choiceText);
                                choice.setQuestion(question);
                                return choice;
                            }).toList();
                    question.setChoices(choices);
                }

                if (qdto.getQuestionType() == Question.QuestionType.LIKERT && qdto.getLikertLabels() != null) {
                    question.setLikertLabels(qdto.getLikertLabels());
                }

                return question;
            }).toList();

            questionnaire.setQuestions(questions);
        }

        Questionnaire saved = questionnaireRepository.save(questionnaire);
        return convertToDTO(saved);
    }
    public List<QuestionnaireDTO> getAll() {
        return questionnaireRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    public QuestionnaireDTO getById(Long id) {
        Questionnaire questionnaire = questionnaireRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Questionnaire not found"));
        return convertToDTO(questionnaire);
    }

    private QuestionnaireDTO convertToDTO(Questionnaire questionnaire) {
        QuestionnaireDTO dto = new QuestionnaireDTO();
        dto.setQuestionnaireId(questionnaire.getQuestionnaireId());
        dto.setTitle(questionnaire.getTitle());
        dto.setDescription(questionnaire.getDescription());

        // 🔁 Employés
        dto.setEmployeIds(questionnaire.getEmployes().stream()
                .map(Employe::getId)
                .collect(Collectors.toList()));

        // 🔁 Questions
        if (questionnaire.getQuestions() != null) {
            List<QuestionDTO> questionDTOs = questionnaire.getQuestions().stream().map(q -> {
                QuestionDTO qdto = new QuestionDTO();
                qdto.setQuestionId(q.getQuestionId());
                qdto.setQuestionText(q.getQuestionText());
                qdto.setTheme(q.getTheme());
                qdto.setQuestionType(q.getQuestionType());
                qdto.setWeight(q.getWeight()); // Include weight
                qdto.setScaleMax(q.getScaleMax()); // Include scaleMax

                if (q.getQuestionType() == Question.QuestionType.CHOICE && q.getChoices() != null) {
                    qdto.setChoices(q.getChoices().stream()
                            .map(Choice::getText)
                            .collect(Collectors.toList()));
                }

                if (q.getQuestionType() == Question.QuestionType.LIKERT && q.getLikertLabels() != null) {
                    qdto.setLikertLabels(q.getLikertLabels());
                }

                return qdto;
            }).collect(Collectors.toList());

            dto.setQuestions(questionDTOs);
        }

        return dto;
    }
    public List<QuestionnaireWithAnswersDTO> getQuestionnairesWithAnswers() {
        List<Questionnaire> questionnaires = questionnaireRepository.findAll();
        List<QuestionnaireWithAnswersDTO> result = new ArrayList<>();

        for (Questionnaire q : questionnaires) {
            List<Answer> answers = answerRepository.findByQuestionnaireQuestionnaireId(q.getQuestionnaireId());

            Map<Long, List<Answer>> groupedByEmploye = answers.stream()
                    .collect(Collectors.groupingBy(a -> a.getEmploye().getId()));

            List<QuestionnaireWithAnswersDTO.EmployeAnswerSummary> summaries = new ArrayList<>();

            for (Map.Entry<Long, List<Answer>> entry : groupedByEmploye.entrySet()) {
                Long empId = entry.getKey();
                List<Answer> empAnswers = entry.getValue();

                Employe emp = empAnswers.get(0).getEmploye(); // Assume not null

                QuestionnaireWithAnswersDTO.EmployeAnswerSummary summary = new QuestionnaireWithAnswersDTO.EmployeAnswerSummary();
                summary.setEmployeId(emp.getId());
                summary.setEmployeName(emp.getFirstname() + " " + emp.getLastname());
                        summary.setAnswerCount(empAnswers.size());

                summaries.add(summary);
            }

            QuestionnaireWithAnswersDTO dto = new QuestionnaireWithAnswersDTO();
            dto.setQuestionnaireId(q.getQuestionnaireId());
            dto.setTitle(q.getTitle());
            dto.setResponses(summaries);

            result.add(dto);
        }

        return result;
    }
    public List<EmployeAnswerSummaryDTO> getAnswersByQuestionnaireId(Long questionnaireId) {
        List<Answer> answers = answerRepository.findByQuestionnaireQuestionnaireId(questionnaireId);

        return answers.stream()
                .collect(Collectors.groupingBy(a -> a.getEmploye().getId()))
                .entrySet().stream()
                .map(entry -> {
                    Long empId = entry.getKey();
                    List<Answer> empAnswers = entry.getValue();
                    Employe emp = empAnswers.get(0).getEmploye();

                    EmployeAnswerSummaryDTO dto = new EmployeAnswerSummaryDTO();
                    dto.setEmployeId(emp.getId());
                    dto.setEmployeName(emp.getFirstname() + " " + emp.getLastname());
                    dto.setAnswerCount(empAnswers.size());
                    return dto;
                }).collect(Collectors.toList());
    }
    public List<Map<String, Object>> getAllWithRespondentCount() {
        List<Questionnaire> all = questionnaireRepository.findAll();

        return all.stream().map(q -> {
            Map<String, Object> dto = new HashMap<>();
            dto.put("questionnaireId", q.getQuestionnaireId());
            dto.put("title", q.getTitle());
            dto.put("description", q.getDescription());
            long count = answerRepository.countDistinctEmployeByQuestionnaire(q);
            dto.put("respondentCount", count);
            return dto;
        }).collect(Collectors.toList());
    }

    public void deleteQuestionnaire(Long id) {
        questionnaireRepository.deleteById(id);
    }
    public List<DetailedAnswerDTO> getDetailedAnswers(Long questionnaireId) {
        List<Answer> answers = answerRepository.findByQuestionnaireQuestionnaireId(questionnaireId);

        return answers.stream().map(answer -> {
            DetailedAnswerDTO dto = new DetailedAnswerDTO();
            dto.setEmployeeId(answer.getEmploye().getId());

            Question q = answer.getQuestion();
            dto.setQuestionId(q.getQuestionId());
            dto.setQuestionType(q.getQuestionType());
            dto.setQuestionText(q.getQuestionText());
            dto.setWeight(q.getWeight());
            dto.setAnswer(answer.getResponseText());
            dto.setScaleMax(q.getScaleMax());

            if (q.getQuestionType() == Question.QuestionType.LIKERT) {
                dto.setLikertLabels(q.getLikertLabels());
            }

            return dto;
        }).collect(Collectors.toList());
    }

}
