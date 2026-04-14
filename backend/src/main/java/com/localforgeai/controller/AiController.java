package com.localforgeai.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.localforgeai.dto.ModelInfo;
import com.localforgeai.dto.ai.PromptRequest;
import com.localforgeai.exception.OllamaServiceException;
import com.localforgeai.model.Conversation;
import com.localforgeai.repository.ConversationRepository;
import com.localforgeai.service.AiService;
import com.localforgeai.service.ConversationService;
import com.localforgeai.service.OllamaService;

@RestController
@RequestMapping("/api")
public class AiController {

    private final AiService aiService;
    private final OllamaService ollamaService;
    private final ConversationRepository conversationRepository;
    private final ConversationService conversationService;

    public AiController(AiService aiService, OllamaService ollamaService, ConversationRepository conversationRepository, ConversationService conversationService) {
        this.aiService = aiService;
        this.ollamaService = ollamaService;
        this.conversationRepository = conversationRepository;
        this.conversationService = conversationService;
    }

    @PostMapping("/ollama/chat")
    public String chat(@RequestBody PromptRequest promptRequest) {
        try {
            String response = aiService.generateResponse(
                    promptRequest.getPrompt(),
                    promptRequest.getModel(),
                    promptRequest.getMode()
            );

            Conversation conversation = new Conversation();
            conversation.setPrompt(promptRequest.getPrompt());
            conversation.setResponse(response);
            conversationRepository.save(conversation);

            return response;
        } catch (Exception e) {
            throw new OllamaServiceException("Failed to get AI response: " + e.getMessage(), e);
        }
    }

    @GetMapping("/conversations")
    public List<Conversation> listConversations() {
        return conversationRepository.findAllByOrderByIdDesc();
    }

    @DeleteMapping("/conversations/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteConversation(@PathVariable Long id) {
        conversationService.deleteConversation(id);
    }

    @GetMapping("/ai/models")
    public List<ModelInfo> listModels() {
        return ollamaService.fetchModels();
    }
}
