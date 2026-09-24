package finguard_backend.service;

import finguard_backend.model.FraudRequest;
import finguard_backend.model.FraudResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class FraudDetectionService {

    private final RestTemplate restTemplate;

    private static final String ML_SERVICE_URL =
            "http://localhost:5000/predict";

    public FraudDetectionService() {
        this.restTemplate =
                new RestTemplate();
    }

    public FraudResponse predictFraud(
            FraudRequest request
    ) {

        ResponseEntity<FraudResponse> response =
                restTemplate.postForEntity(
                        ML_SERVICE_URL,
                        request,
                        FraudResponse.class
                );

        return response.getBody();
    }
}