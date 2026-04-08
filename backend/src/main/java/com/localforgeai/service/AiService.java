package com.localforgeai.service;

import java.util.concurrent.CompletableFuture;

import org.springframework.stereotype.Service;

import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.model.StreamingResponseHandler;
import dev.langchain4j.model.chat.StreamingChatLanguageModel;
import dev.langchain4j.model.output.Response;

@Service
public class AiService {

    private final LangChainOllamaService langChainOllamaService;

    public AiService(LangChainOllamaService langChainOllamaService) {
        this.langChainOllamaService = langChainOllamaService;
    }

    public String generateResponse(String prompt, String modelName, String mode) {
        try {
            String effectivePrompt = buildPrompt(prompt, mode);
            StringBuilder assistantOutput = new StringBuilder();

            StreamingChatLanguageModel model = langChainOllamaService.createModel(modelName);

            // Use a synchronous approach - wait for the complete response
            CompletableFuture<String> future = new CompletableFuture<>();

            StreamingResponseHandler<AiMessage> handler = new StreamingResponseHandler<>() {
                @Override
                public void onNext(String token) {
                    assistantOutput.append(token);
                }

                @Override
                public void onComplete(Response<AiMessage> response) {
                    future.complete(assistantOutput.toString());
                }

                @Override
                public void onError(Throwable error) {
                    future.completeExceptionally(error);
                }
            };

            model.generate(effectivePrompt, handler);

            // Wait for completion
            return future.get();

        } catch (Exception e) {
            throw new RuntimeException("Failed to generate AI response: " + e.getMessage(), e);
        }
    }

    private String buildPrompt(String prompt, String mode) {
        if (mode == null || !mode.equalsIgnoreCase("summarized")) {
            return prompt;
        }
        return "Please answer with compact information... User prompt: " + prompt;
    }
}
