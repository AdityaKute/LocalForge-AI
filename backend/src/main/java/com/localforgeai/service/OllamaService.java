package com.localforgeai.service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.localforgeai.dto.ModelInfo;

@Service
public class OllamaService {

    @Value("${localforge.ollama.host:http://localhost:11434}")
    private String ollamaHost;

    private final HttpClient client = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    private final ObjectMapper mapper = new ObjectMapper();

    public List<ModelInfo> fetchModels() {
        List<ModelInfo> models = fetchModelsFromEndpoint("/api/tags");
        if (!models.isEmpty()) {
            return models;
        }

        models = fetchModelsFromEndpoint("/api/models");
        if (!models.isEmpty()) {
            return models;
        }

        return fetchModelsFromEndpoint("/v1/models");
    }

    private List<ModelInfo> fetchModelsFromEndpoint(String endpoint) {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(ollamaHost + endpoint))
                    .timeout(Duration.ofSeconds(8))
                    .GET()
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() != 200 || response.body() == null || response.body().isBlank()) {
                return List.of();
            }

            return parseModelList(response.body());
        } catch (IOException | InterruptedException ex) {
            return List.of();
        }
    }

    private List<ModelInfo> parseModelList(String body) throws IOException {
        JsonNode root = mapper.readTree(body);
        List<ModelInfo> result = new ArrayList<>();

        if (root.isObject()) {
            JsonNode modelsNode = root.get("models");
            if (modelsNode == null) {
                modelsNode = root.get("data");
            }
            if (modelsNode != null && modelsNode.isArray()) {
                modelsNode.forEach(node -> {
                    String modelName = extractModelName(node);
                    if (modelName != null && !modelName.isBlank()) {
                        result.add(new ModelInfo(modelName));
                    }
                });
            }
        } else if (root.isArray()) {
            root.forEach(node -> {
                String modelName = extractModelName(node);
                if (modelName != null && !modelName.isBlank()) {
                    result.add(new ModelInfo(modelName));
                }
            });
        }

        Set<String> uniqueNames = new HashSet<>();
        List<ModelInfo> distinct = new ArrayList<>();
        for (ModelInfo model : result) {
            if (uniqueNames.add(model.getName())) {
                distinct.add(model);
            }
        }
        return distinct;
    }

    private String extractModelName(JsonNode node) {
        if (node == null || !node.isObject()) {
            return null;
        }

        if (node.hasNonNull("name")) {
            return node.get("name").asText();
        }
        if (node.hasNonNull("id")) {
            return node.get("id").asText();
        }
        if (node.hasNonNull("model")) {
            return node.get("model").asText();
        }
        return null;
    }
}
