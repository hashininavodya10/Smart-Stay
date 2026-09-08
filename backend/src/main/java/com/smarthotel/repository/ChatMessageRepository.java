package com.smarthotel.repository;

import com.smarthotel.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    java.util.List<ChatMessage> findByRoomTokenOrderByCreatedAtAsc(String token);
}
