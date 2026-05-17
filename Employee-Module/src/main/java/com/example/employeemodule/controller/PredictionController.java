package com.example.employeemodule.controller;

import com.example.employeemodule.Service.PredictionResultService;
import com.example.employeemodule.Service.PredictionService;
import com.example.employeemodule.config.FolderMessageAnalyzer;
import com.example.employeemodule.dto.*;
import com.example.employeemodule.entity.PredictionItem;
import com.example.employeemodule.entity.PredictionResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/prediction")
public class PredictionController {

    private final PredictionService predictionService;
    private final PredictionResultService predictionResultService;
    private final FolderMessageAnalyzer folderMessageAnalyzer;

    @Autowired
    public PredictionController(
            PredictionService predictionService,
            PredictionResultService predictionResultService,
            FolderMessageAnalyzer folderMessageAnalyzer
    ) {
        this.predictionService = predictionService;
        this.predictionResultService = predictionResultService;
        this.folderMessageAnalyzer = folderMessageAnalyzer;
    }

    @PostMapping("/save-result")
    public ResponseEntity<?> saveResult(@RequestBody PredictionItemDTO resultDTO) {
        try {
            if (resultDTO == null ) {
                return ResponseEntity.badRequest().body("Le champ predictions est obligatoire et ne peut pas être vide.");
            }
            PredictionItem saved = predictionResultService.save(resultDTO);
            return ResponseEntity.ok("Résultat sauvegardé avec ID : " + saved.getId());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erreur lors de la sauvegarde : " + e.getMessage());
        }
    }
    @GetMapping("/save-result/discussion-results/by-idtest/{idTest}")
    public ResponseEntity<?> getPredictionsByIdTest(@PathVariable String idTest) {
        try {
            List<PredictionItemDTO> predictions = predictionResultService.getPredictionsByIdTest(idTest);
            if (predictions.isEmpty()) {
                return ResponseEntity.status(404).body("Aucune prédiction trouvée pour idTest: " + idTest);
            }
            return ResponseEntity.ok(predictions);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erreur lors de la récupération : " + e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<String> predict(@RequestBody MessageInputDTO inputDto) {
        try {
            if (inputDto == null || inputDto.getMessages() == null || inputDto.getMessages().isEmpty()) {
                return ResponseEntity.badRequest().body("MessageInputDTO ou messages ne peuvent pas être nuls ou vides");
            }
            predictionService.sendToRabbitMQ(inputDto);
            System.out.println("📤 Message envoyé à RabbitMQ pour prédiction.");
            return ResponseEntity.accepted().body("Message de prédiction en file d'attente.");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erreur : " + e.getMessage());
        }
    }

    @GetMapping("/results/{predictionResultId}")
    public ResponseEntity<?> getResultsByPredictionResultId(@PathVariable Long predictionResultId) {
        try {
            ChartDataDTO chartData = predictionResultService.getChartDataByPredictionResultId(predictionResultId);
            if (chartData.getSentimentCounts().isEmpty() && chartData.getEmotionCounts().isEmpty() && chartData.getTopicCounts().isEmpty()) {
                return ResponseEntity.status(404).body("Aucun résultat trouvé pour le PredictionResult ID : " + predictionResultId);
            }
            return ResponseEntity.ok(chartData);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erreur lors de la récupération des résultats : " + e.getMessage());
        }
    }
    @GetMapping("/save-result/discussion-results/grouped")
    public ResponseEntity<?> getAllDiscussionGroupedByTestId() {
        try {
            List<GroupedPredictionResultDTO> groupedResults = predictionResultService.getAllGroupedByIdTest();

            if (groupedResults.isEmpty()) {
                System.out.println(groupedResults);
                return ResponseEntity.status(404).body("Aucune prédiction trouvée.");
            }
            return ResponseEntity.ok(groupedResults);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erreur lors de la récupération : " + e.getMessage());
        }
    }

  /*  @GetMapping("/analyse-dossier")
    public ResponseEntity<?> analyseMessagesFromFile() {
        try {
            folderMessageAnalyzer.analyzeMessagesFromFile();
            return ResponseEntity.accepted().body("Analyse déclenchée pour les messages du dossier.");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erreur : " + e.getMessage());
        }
    }*/
    @GetMapping("/results/by-idtest/{idTest}")
    public ResponseEntity<?> getChartByIdTest(@PathVariable String idTest) {
        try {
            ChartDataDTO chartData = predictionResultService.getChartDataByIdTest(idTest);
            return ResponseEntity.ok(chartData);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erreur : " + e.getMessage());
        }
    }

}