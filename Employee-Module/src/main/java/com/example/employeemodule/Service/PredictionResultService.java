package com.example.employeemodule.Service;
import java.util.stream.Collectors;

import com.example.employeemodule.Repository.PredictionItemRepository;
import com.example.employeemodule.dto.*;
import com.example.employeemodule.entity.PredictionResult;
import com.example.employeemodule.entity.PredictionItem;
import com.example.employeemodule.Repository.PredictionResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PredictionResultService {

    @Autowired
    private PredictionResultRepository repository;
    @Autowired

    private PredictionItemRepository predictionItemRepository ;
    public PredictionItem save(PredictionItemDTO dto) {
        PredictionItem entity = new PredictionItem();

        entity.setEmployeeId(dto.getEmployeeId());
        entity.setIdTest(dto.getIdTest());
        entity.setEmployeeName(dto.getEmployeeName());
        entity.setMessage(dto.getMessage());
        entity.setSentiment(dto.getSentiment());
        entity.setEmotion(dto.getEmotion());
        entity.setGeneralEmotion(dto.getGeneralEmotion());
        entity.setTopic(dto.getTopic());
        entity.setGeneralTopic(dto.getGeneralTopic());
        entity.setAnalyzedAt(dto.getAnalyzedAt() != null ? dto.getAnalyzedAt() : LocalDateTime.now());

        return predictionItemRepository.save(entity);
    }


    // ...
    public ChartDataDTO getChartDataByIdTest(String idTest) {
        List<PredictionItem> items = predictionItemRepository.findByIdTest(idTest);
        if (items.isEmpty()) {
            throw new RuntimeException("Aucun item trouvé pour idTest " + idTest);
        }

        Map<String, Integer> sentimentCounts      = new HashMap<>();
        Map<String, Integer> generalEmotionCounts = new HashMap<>();
        Map<String, Integer> generalTopicCounts   = new HashMap<>();

        for (PredictionItem item : items) {
            sentimentCounts.merge(item.getSentiment() != null ? item.getSentiment() : "Unknown", 1, Integer::sum);
            String genEmo = item.getGeneralEmotion() != null ? item.getGeneralEmotion() : "Unknown";
            generalEmotionCounts.merge(genEmo, 1, Integer::sum);
            String genTop = item.getGeneralTopic() != null ? item.getGeneralTopic() : "Unknown";
            generalTopicCounts.merge(genTop, 1, Integer::sum);
        }

        List<SimpleItemDTO> simpleItems = items.stream()
                .map(it -> new SimpleItemDTO(
                        it.getEmployeeId() != null ? String.valueOf(it.getEmployeeId()) : null,
                        it.getEmployeeName(),
                        it.getSentiment(),
                        it.getGeneralTopic() != null ? it.getGeneralTopic() : it.getTopic(),
                        it.getGeneralEmotion() != null ? it.getGeneralEmotion() : it.getEmotion()
                ))
                .collect(Collectors.toList());

        ChartDataDTO chartData = new ChartDataDTO();
        chartData.setPredictionResultId(null);
        chartData.setSentimentCounts(sentimentCounts);
        chartData.setEmotionCounts(generalEmotionCounts);
        chartData.setTopicCounts(generalTopicCounts);
        chartData.setItems(simpleItems); // ✅ clé pour le filtre employé

        return chartData;
    }


    public List<GroupedPredictionResultDTO> getAllGroupedByIdTest() {
        List<PredictionItem> allItems = predictionItemRepository.findAll();

        Map<String, List<PredictionItemDTO>> groupedMap = allItems.stream()
                .collect(Collectors.groupingBy(
                        item -> item.getIdTest(),
                        Collectors.mapping(PredictionItemDTO::fromEntity, Collectors.toList())
                ));

        return groupedMap.entrySet().stream()
                .map(entry -> new GroupedPredictionResultDTO(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());
    }


    public List<PredictionItemDTO> getPredictionsByIdTest(String idTest) {
        List<PredictionItem> items = predictionItemRepository.findByIdTest(idTest);

        return items.stream()
                .map(PredictionItemDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public ChartDataDTO getChartDataByPredictionResultId(Long predictionResultId) {
        Optional<PredictionResult> result = repository.findById(predictionResultId);
        if (!result.isPresent()) {
            throw new RuntimeException("PredictionResult avec ID " + predictionResultId + " non trouvé");
        }

        PredictionResult predictionResult = result.get();

        // Agrégation des données pour les graphiques
        Map<String, Integer> sentimentCounts = new HashMap<>();
        Map<String, Integer> emotionCounts = new HashMap<>();
        Map<String, Integer> topicCounts = new HashMap<>();

        for (PredictionItem item : predictionResult.getPredictions()) {
            // Compter les sentiments
            sentimentCounts.merge(item.getSentiment() != null ? item.getSentiment() : "Unknown", 1, Integer::sum);
            // Compter les émotions
            emotionCounts.merge(item.getEmotion() != null ? item.getEmotion() : "Unknown", 1, Integer::sum);
            // Compter les sujets
            topicCounts.merge(item.getTopic() != null ? item.getTopic() : "Unknown", 1, Integer::sum);
        }

        ChartDataDTO chartData = new ChartDataDTO();
        chartData.setPredictionResultId(predictionResultId);
        chartData.setSentimentCounts(sentimentCounts);
        chartData.setEmotionCounts(emotionCounts);
        chartData.setTopicCounts(topicCounts);

        return chartData;
    }

    private PredictionItem toEntity(PredictionItemDTO dto) {
        PredictionItem item = new PredictionItem();
        item.setMessage(dto.getMessage());
        item.setSentiment(dto.getSentiment());
        item.setEmotion(dto.getEmotion());
        item.setTopic(dto.getTopic());
        return item;
    }
}

