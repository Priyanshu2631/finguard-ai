package finguard_backend.controller;

import finguard_backend.service.AiAssistantService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class AiAssistantController {

    private final AiAssistantService aiAssistantService;

    public AiAssistantController(
            AiAssistantService aiAssistantService
    ) {
        this.aiAssistantService = aiAssistantService;
    }

    @PostMapping("/assistant")
    public Map<String, Object> askAssistant(
            @RequestBody Map<String, Object> request
    ) {

        return aiAssistantService.askAssistant(request);
    }

    @PostMapping("/insights")
    public Map<String, Object> generateInsights(
            @RequestBody Map<String, Object> request
    ) {

        return aiAssistantService.generateInsights(request);
    }
}