package com.localforgeai.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.localforgeai.exception.OllamaServiceException;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(OllamaServiceException.class)
    public ResponseEntity<Map<String, String>> handleOllamaServiceException(OllamaServiceException e) {
        Map<String, String> error = new HashMap<>();
        error.put("error", "OLLAMA_ERROR");
        error.put("message", e.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGenericException(Exception e) {
        Map<String, String> error = new HashMap<>();
        error.put("error", "INTERNAL_ERROR");
        error.put("message", "An unexpected error occurred: " + e.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}