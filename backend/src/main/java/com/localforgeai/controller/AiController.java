package com.localforgeai.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.localforgeai.dto.ModelInfo;
import com.localforgeai.dto.ai.PromptRequest;
import com.localforgeai.exception.OllamaServiceException;
import com.localforgeai.service.AiService;
import com.localforgeai.service.OllamaService;

@RestController
@RequestMapping("/api")
public class AiController {

    private final AiService aiService;
    private final OllamaService ollamaService;

    public AiController(AiService aiService, OllamaService ollamaService) {
        this.aiService = aiService;
        this.ollamaService = ollamaService;
    }

    @PostMapping("/ollama/chat")
    public String chat(@RequestBody PromptRequest promptRequest) {
        try {
            return aiService.generateResponse(
                    promptRequest.getPrompt(),
                    promptRequest.getModel(),
                    promptRequest.getMode()
            );
        } catch (Exception e) {
            throw new OllamaServiceException("Failed to get AI response: " + e.getMessage(), e);
        }
    }

    @GetMapping("/ai/models")
    public List<ModelInfo> listModels() {
        return ollamaService.fetchModels();
    }
}
