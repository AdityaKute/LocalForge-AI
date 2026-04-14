package com.localforgeai.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.localforgeai.repository.ConversationRepository;

@Service
public class ConversationService {

    private final ConversationRepository conversationRepository;

    public ConversationService(ConversationRepository conversationRepository) {
        this.conversationRepository = conversationRepository;
    }

    @Transactional
    public void deleteConversation(Long id) {
        if (!conversationRepository.existsById(id)) {
            throw new IllegalArgumentException("Conversation not found: " + id);
        }
        conversationRepository.hardDeleteById(id);
        conversationRepository.flush();
    }
}