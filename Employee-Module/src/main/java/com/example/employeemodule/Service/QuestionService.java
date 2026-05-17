package com.example.employeemodule.Service;

import com.example.employeemodule.Repository.AnswerRepository;
import com.example.employeemodule.Repository.QuestionRepository;
import com.example.employeemodule.Repository.QuestionnaireRepository;
import com.example.employeemodule.dto.AnswerDTO;
import com.example.employeemodule.dto.QuestionDTO;
import com.example.employeemodule.dto.QuestionResponseDTO;
import com.example.employeemodule.entity.Answer;
import com.example.employeemodule.entity.Choice;
import com.example.employeemodule.entity.Question;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class QuestionService {

    @Autowired
    private QuestionRepository questionRepository;
    @Autowired
    private AnswerRepository answerRepository;
@Autowired
    private QuestionnaireRepository questionnaireRepository;
@Autowired
    private EmployeService employeRepository;
    public QuestionDTO save(QuestionDTO dto) {
        Question question = new Question();
        question.setQuestionText(dto.getQuestionText());
        question.setTheme(dto.getTheme());
        question.setQuestionType(dto.getQuestionType());
        question.setWeight(dto.getWeight());

        // CHOICE ou LIKERT → enregistrer les choix
        if ((dto.getQuestionType() == Question.QuestionType.CHOICE || dto.getQuestionType() == Question.QuestionType.LIKERT)
                && dto.getChoices() != null) {
            List<Choice> choices = new ArrayList<>();
            for (String choiceText : dto.getChoices()) {
                Choice choice = new Choice();
                choice.setText(choiceText);
                choice.setQuestion(question); // lien bidirectionnel
                choices.add(choice);
            }
            question.setChoices(choices);
        }

        // SCALE MAX si fourni
        if (dto.getScaleMax() != null) {
            question.setScaleMax(dto.getScaleMax());
        }

        // LIKERT labels (si utilisé séparément de choices)
        if (dto.getQuestionType() == Question.QuestionType.LIKERT && dto.getLikertLabels() != null) {
            question.setLikertLabels(dto.getLikertLabels());
        }

        Question saved = questionRepository.save(question);
        return convertToDTO(saved);
    }


    public List<QuestionDTO> getAll() {
        return questionRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public void saveAnswers(List<AnswerDTO> answerDTOs) {
        List<Answer> answers = new ArrayList<>();

        for (AnswerDTO dto : answerDTOs) {
            Question question = questionRepository.findById(dto.getQuestionId())
                    .orElseThrow(() -> new IllegalArgumentException("Question non trouvée"));

            // 🔍 Validation selon le type de question
            String response = dto.getResponseText();

            switch (question.getQuestionType()) {
                case BOOLEAN:
                    if (!response.equalsIgnoreCase("oui") && !response.equalsIgnoreCase("non")) {
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
            }

            // ✅ Création et association de l'Answer
            Answer answer = new Answer();
            answer.setResponseText(response);
            answer.setQuestion(question);
            answer.setQuestionnaire(questionnaireRepository.findById(dto.getQuestionnaireId())
                    .orElseThrow(() -> new IllegalArgumentException("Questionnaire non trouvé")));
            answer.setEmploye(employeRepository.findEntityById(dto.getEmployeId())
                );

            answers.add(answer);
        }

        answerRepository.saveAll(answers);
    }
    public List<QuestionResponseDTO> getQuestionsWithAnswersByQuestionnaire(Long questionnaireId) {
        // Log initial : Entrée dans la méthode avec le questionnaireId
        System.out.println("🔍 Requête pour questionnaireId : " + questionnaireId);

        // Récupérer les réponses depuis le repository
        List<Answer> answers = answerRepository.findByQuestionnaire_QuestionnaireId(questionnaireId);
        System.out.println("📋 Nombre d'answers récupérées : " + (answers != null ? answers.size() : 0));

        // Traiter chaque réponse avec un stream
        List<QuestionResponseDTO> dtos = answers.stream().map(a -> {
                    Question question = a.getQuestion();
                    if (question == null) {
                        System.out.println("⚠️ Attention : Question est null pour une réponse avec employeeId : " + a.getEmploye().getId());
                        return null; // Gérer le cas où la question est null
                    }

                    // Log des détails de la question
                    System.out.println("📝 Détails de la question - questionId: " + question.getQuestionId() +
                            ", questionText: " + question.getQuestionText() +
                            ", questionType: " + question.getQuestionType() +
                            ", weight: " + question.getWeight() +
                            ", scaleMax: " + question.getScaleMax() +
                            ", likertLabels: " + (question.getLikertLabels() != null ? question.getLikertLabels() : "null"));

                    // Log des détails de la réponse
                    System.out.println("📥 Réponse - employeeId: " + a.getEmploye().getId() +
                            ", responseText: " + a.getResponseText());

                    // Construction du DTO
                    QuestionResponseDTO dto = new QuestionResponseDTO(
                            question.getQuestionId(),
                            question.getQuestionText(),
                            a.getEmploye().getId(),
                            a.getResponseText(),
                            question.getQuestionType(), // Ajout du type de question
                            question.getWeight() != null ? question.getWeight() : 1.0, // Poids avec valeur par défaut
                            question.getScaleMax(), // Échelle maximale
                            question.getLikertLabels() != null ? question.getLikertLabels() : null // Labels Likert
                    );

                    // Log du DTO construit
                    System.out.println("✅ DTO créé - questionId: " + dto.getQuestionId() +
                            ", employeeId: " + dto.getEmployeeId() +
                            ", responseText: " + dto.getResponseText() +
                            ", questionType: " + dto.getQuestionType() +
                            ", weight: " + dto.getWeight() +
                            ", scaleMax: " + dto.getScaleMax() +
                            ", likertLabels: " + (dto.getLikertLabels() != null ? dto.getLikertLabels() : "null"));

                    return dto;
                }).filter(dto -> dto != null) // Filtrer les nulls en cas de problème
                .collect(Collectors.toList());

        // Log final : Nombre de DTOs retournés
        System.out.println("📤 Nombre de QuestionResponseDTO retournés : " + dtos.size());

        return dtos;
    }
    private QuestionDTO convertToDTO(Question question) {
        QuestionDTO dto = new QuestionDTO();
        dto.setQuestionId(question.getQuestionId());
        dto.setQuestionText(question.getQuestionText());
        dto.setTheme(question.getTheme());
        dto.setQuestionType(question.getQuestionType());
        // dto.setResponseId(question.getResponseId()); // ← Ajoute cette ligne
        dto.setWeight(question.getWeight());

        if (question.getQuestionType() == Question.QuestionType.CHOICE && question.getChoices() != null) {
            List<String> choiceTexts = question.getChoices().stream()
                    .map(Choice::getText)
                    .collect(Collectors.toList());
            dto.setChoices(choiceTexts);
        }

        return dto;
    }}
