package finguard_backend.controller;

import finguard_backend.model.FraudRequest;
import finguard_backend.model.FraudResponse;
import finguard_backend.service.FraudDetectionService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/fraud")
@CrossOrigin(origins = "http://localhost:5173")
public class FraudController {

    private final FraudDetectionService fraudDetectionService;

    public FraudController(FraudDetectionService fraudDetectionService) {
        this.fraudDetectionService = fraudDetectionService;
    }

    @PostMapping("/predict")
    public FraudResponse predictFraud(
            @RequestBody FraudRequest request) {

        return fraudDetectionService.predictFraud(request);
    }
}