package com.localforgeai.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.localforgeai.model.Conversation;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    List<Conversation> findAllByOrderByIdDesc();

    @Modifying
    @Query("DELETE FROM Conversation c WHERE c.id = :id")
    void hardDeleteById(@Param("id") Long id);
}