package com.example.employeemodule.Service;

import com.example.employeemodule.Repository.EmployeRepository;
import com.example.employeemodule.Repository.QuestionRepository;
import com.example.employeemodule.Repository.SurveyResponseRepository;
import com.example.employeemodule.dto.SurveyResponseDTO;
import com.example.employeemodule.entity.Employe;
import com.example.employeemodule.entity.Question;
import com.example.employeemodule.entity.SurveyResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SurveyResponseService {

    @Autowired
    private SurveyResponseRepository surveyResponseRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private EmployeRepository employeepository;


    public SurveyResponseDTO save(SurveyResponseDTO dto) {
        SurveyResponse response = new SurveyResponse();
        response.setAnswerValue(dto.getAnswerValue());
        response.setDate(dto.getDate());

        Employe user = employeepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        response.setUser(user);

        List<Question> questions = questionRepository.findAllById(dto.getQuestionIds());
        response.setQuestions(questions);



        SurveyResponse saved = surveyResponseRepository.save(response);
        return convertToDTO(saved);
    }

    public List<SurveyResponseDTO> getAll() {
        List<SurveyResponse> responses = surveyResponseRepository.findAll();
        return responses.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private SurveyResponseDTO convertToDTO(SurveyResponse response) {
        SurveyResponseDTO dto = new SurveyResponseDTO();
        dto.setResponseId(response.getResponseId());
        dto.setAnswerValue(response.getAnswerValue());
        dto.setDate(response.getDate());
        dto.setUserId(response.getUser().getId());


        List<Long> questionIds = response.getQuestions().stream()
                .map(Question::getQuestionId)
                .collect(Collectors.toList());
        dto.setQuestionIds(questionIds);

        return dto;
    }
}
