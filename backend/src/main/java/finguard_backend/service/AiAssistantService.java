package finguard_backend.service;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class AiAssistantService {

    private final RestTemplate restTemplate;

    private static final String AI_SERVICE_URL =
            "http://localhost:5000/assistant";

    private static final String INSIGHTS_SERVICE_URL =
            "http://localhost:5000/insights";

    public AiAssistantService() {
        this.restTemplate = new RestTemplate();
    }

    public Map<String, Object> askAssistant(
            Map<String, Object> request
    ) {

        ResponseEntity<Map> response =
                restTemplate.postForEntity(
                        AI_SERVICE_URL,
                        request,
                        Map.class
                );

        return response.getBody();
    }

    public Map<String, Object> generateInsights(
            Map<String, Object> request
    ) {

        ResponseEntity<Map> response =
                restTemplate.postForEntity(
                        INSIGHTS_SERVICE_URL,
                        request,
                        Map.class
                );

        return response.getBody();
    }
}