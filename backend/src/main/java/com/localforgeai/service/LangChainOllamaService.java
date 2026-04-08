package com.localforgeai.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.model.StreamingResponseHandler;
import dev.langchain4j.model.chat.StreamingChatLanguageModel;
import dev.langchain4j.model.ollama.OllamaStreamingChatModel;
import dev.langchain4j.model.output.Response;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@Service
public class LangChainOllamaService {

    @Value("${localforge.ollama.host:http://localhost:11434}")
    private String ollamaHost;

    private final ObjectMapper mapper = new ObjectMapper();

    public StreamingChatLanguageModel createModel(String modelName) {
        return OllamaStreamingChatModel.builder()
                .baseUrl(ollamaHost)
                .modelName(modelName)
                .timeout(Duration.ofMinutes(5))
                .build();
    }

    public StreamingResponseHandler<AiMessage> createResponseHandler(SseEmitter emitter, StringBuilder responseBuilder) {
        return new StreamingResponseHandler<AiMessage>() {
            @Override
            public void onNext(String token) {
                try {
                    responseBuilder.append(token);
                    Map<String, Object> event = new HashMap<>();
                    event.put("section", "summary"); // Default to summary
                    event.put("content", token);
                    String payloadJson = mapper.writeValueAsString(event);
                    @SuppressWarnings("null")
                    var eventData = SseEmitter.event().name("message").data(payloadJson);
                    emitter.send(eventData);
                } catch (IOException e) {
                    // Client likely disconnected
                }
            }

            @Override
            public void onComplete(Response<AiMessage> response) {
                try {
                    emitter.send(SseEmitter.event().name("done").data("done"));
                    emitter.complete();
                } catch (IOException e) {
                    // Client likely disconnected
                }
            }

            @Override
            public void onError(Throwable error) {
                try {
                    String errorMessage = error.getMessage() != null ? error.getMessage() : "Unknown error";
                    @SuppressWarnings("null")
                    var eventData = SseEmitter.event().name("error").data(errorMessage);
                    emitter.send(eventData);
                    emitter.completeWithError(error);
                } catch (IOException e) {
                    // Client likely disconnected
                }
            }
        };
    }
}
