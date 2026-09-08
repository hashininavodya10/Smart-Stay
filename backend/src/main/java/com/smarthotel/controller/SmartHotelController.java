package com.smarthotel.controller;

import com.smarthotel.model.ChatMessage;
import com.smarthotel.model.Room;
import com.smarthotel.model.ServiceRequest;
import com.smarthotel.model.User;
import com.smarthotel.repository.ChatMessageRepository;
import com.smarthotel.repository.RoomRepository;
import com.smarthotel.repository.ServiceRequestRepository;
import com.smarthotel.repository.UserRepository;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Controller
public class SmartHotelController {

    private final SimpMessagingTemplate messagingTemplate;
    private final UserRepository userRepository;
    private final RoomRepository roomRepository;
    private final ServiceRequestRepository serviceRequestRepository;
    private final ChatMessageRepository chatMessageRepository;

    public SmartHotelController(SimpMessagingTemplate messagingTemplate,
                                UserRepository userRepository,
                                RoomRepository roomRepository,
                                ServiceRequestRepository serviceRequestRepository,
                                ChatMessageRepository chatMessageRepository) {
        this.messagingTemplate = messagingTemplate;
        this.userRepository = userRepository;
        this.roomRepository = roomRepository;
        this.serviceRequestRepository = serviceRequestRepository;
        this.chatMessageRepository = chatMessageRepository;
    }

    // Helper to get or create a guest user
    private User getOrCreateUser(String username, User.Role role) {
        return userRepository.findByUsername(username).orElseGet(() -> {
            User newUser = new User();
            newUser.setUsername(username);
            newUser.setPassword("password"); // Default password
            newUser.setRole(role);
            return userRepository.save(newUser);
        });
    }

    // Helper to get or create a room
    private Room getOrCreateRoom(String roomToken) {
        return roomRepository.findByToken(roomToken).orElseGet(() -> {
            Room newRoom = new Room();
            newRoom.setToken(roomToken);
            newRoom.setRoomNumber(roomToken.replace("TEST-", ""));
            newRoom.setStatus("OCCUPIED");
            return roomRepository.save(newRoom);
        });
    }

    // Handles incoming service requests from guests
    @MessageMapping("/request/{roomToken}")
    public void handleServiceRequest(@DestinationVariable String roomToken, @Payload TaskRequest requestData) {
        Room room = getOrCreateRoom(roomToken);
        User guest = getOrCreateUser("guest_" + roomToken, User.Role.GUEST);

        ServiceRequest request = new ServiceRequest();
        request.setRoom(room);
        request.setGuest(guest);
        request.setDescription(requestData.getDescription());

        // Parse Request Type safely
        ServiceRequest.RequestType requestType;
        try {
            String typeStr = requestData.getType().toUpperCase();
            if (typeStr.equals("DINING")) typeStr = "MEALS";
            if (typeStr.equals("EMERGENCY")) typeStr = "SECURITY";
            requestType = ServiceRequest.RequestType.valueOf(typeStr);
        } catch (Exception e) {
            requestType = ServiceRequest.RequestType.HOUSEKEEPING;
        }
        request.setType(requestType);
        
        // Parse Priority from description if possible, default to LOW
        ServiceRequest.Priority priority = ServiceRequest.Priority.LOW;
        if (requestData.getDescription().contains("HIGH")) {
            priority = ServiceRequest.Priority.HIGH;
        } else if (requestData.getDescription().contains("MEDIUM")) {
            priority = ServiceRequest.Priority.MEDIUM;
        }
        request.setPriority(priority);
        request.setStatus(ServiceRequest.RequestStatus.NEW);

        ServiceRequest savedRequest = serviceRequestRepository.save(request);

        // Broadcast saved task update
        TaskBroadcast broadcastData = new TaskBroadcast();
        broadcastData.setId(savedRequest.getId());
        broadcastData.setRoomToken(roomToken);
        broadcastData.setType(requestData.getType());
        broadcastData.setDescription(requestData.getDescription());
        broadcastData.setStatus("NEW");
        broadcastData.setPriority(priority.name());
        broadcastData.setCreatedAt(savedRequest.getCreatedAt());
        broadcastData.setAcceptedAt(savedRequest.getAcceptedAt());

        messagingTemplate.convertAndSend("/topic/tasks", broadcastData);
        messagingTemplate.convertAndSend("/topic/room/" + roomToken, broadcastData);
    }

    // Handles incoming chat messages from guests and admin
    @MessageMapping("/chat/{roomToken}")
    public void handleChatMessage(@DestinationVariable String roomToken, @Payload ChatMessageDTO chatData) {
        Room room = getOrCreateRoom(roomToken);
        
        User.Role role = chatData.getSender().equalsIgnoreCase("ADMIN") ? User.Role.ADMIN : User.Role.GUEST;
        User sender = getOrCreateUser(chatData.getSender().toLowerCase() + "_" + roomToken, role);

        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setRoom(room);
        chatMessage.setSender(sender);
        chatMessage.setContent(chatData.getContent());
        chatMessage.setIsAutomated(false);
        chatMessage.setPriority(ChatMessage.Priority.LOW);

        chatMessageRepository.save(chatMessage);

        // Broadcast to clients
        chatData.setRoomToken(roomToken);
        messagingTemplate.convertAndSend("/topic/room/" + roomToken, chatData);
        messagingTemplate.convertAndSend("/topic/chat", chatData);
    }
    
    // Handles staff assignment from Admin dashboard
    @MessageMapping("/assign")
    public void handleStaffAssignment(@Payload TaskAssignment assignment) {
        Room room = getOrCreateRoom(assignment.getRoomToken());
        User staff = getOrCreateUser(assignment.getStaffName(), User.Role.STAFF);

        ServiceRequest request = null;
        if (assignment.getId() != null) {
            request = serviceRequestRepository.findById(assignment.getId()).orElse(null);
        } else {
            // Fallback for older clients
            List<ServiceRequest> activeRequests = serviceRequestRepository.findByRoomTokenOrderByCreatedAtDesc(assignment.getRoomToken());
            if (!activeRequests.isEmpty()) {
                request = activeRequests.get(0);
            }
        }

        if (request != null) {
            request.setStaff(staff);
            request.setStatus(ServiceRequest.RequestStatus.ACCEPTED);
            request.setAcceptedAt(java.time.LocalDateTime.now());
            serviceRequestRepository.save(request);
            // Ensure ID is passed along in the broadcast
            assignment.setId(request.getId());
            assignment.setCreatedAt(request.getCreatedAt());
            assignment.setAcceptedAt(request.getAcceptedAt());
        }

        // Route assignment update
        messagingTemplate.convertAndSend("/topic/room/" + assignment.getRoomToken(), assignment);
        messagingTemplate.convertAndSend("/topic/tasks", assignment);
    }
    
    // Handles task status updates from Staff dashboard
    @MessageMapping("/status")
    public void handleTaskStatus(@Payload TaskAssignment statusUpdate) {
        ServiceRequest request = null;
        if (statusUpdate.getId() != null) {
            request = serviceRequestRepository.findById(statusUpdate.getId()).orElse(null);
        } else {
            // Fallback for older clients
            List<ServiceRequest> activeRequests = serviceRequestRepository.findByRoomTokenOrderByCreatedAtDesc(statusUpdate.getRoomToken());
            if (!activeRequests.isEmpty()) {
                request = activeRequests.get(0);
            }
        }

        if (request != null) {
            try {
                request.setStatus(ServiceRequest.RequestStatus.valueOf(statusUpdate.getStatus().toUpperCase()));
                serviceRequestRepository.save(request);
                // Ensure ID is passed along in the broadcast
                statusUpdate.setId(request.getId());
                statusUpdate.setCreatedAt(request.getCreatedAt());
                statusUpdate.setAcceptedAt(request.getAcceptedAt());
            } catch (Exception ignored) {}
        }

        messagingTemplate.convertAndSend("/topic/room/" + statusUpdate.getRoomToken(), statusUpdate);
        messagingTemplate.convertAndSend("/topic/tasks", statusUpdate);
    }

    // DTOs
    public static class TaskRequest {
        private String roomToken;
        private String type;
        private String description;

        public String getRoomToken() { return roomToken; }
        public void setRoomToken(String roomToken) { this.roomToken = roomToken; }
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
    }

    public static class TaskBroadcast {
        private Long id;
        private String roomToken;
        private String type;
        private String description;
        private String status;
        private String priority;
        private java.time.LocalDateTime createdAt;
        private java.time.LocalDateTime acceptedAt;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getRoomToken() { return roomToken; }
        public void setRoomToken(String roomToken) { this.roomToken = roomToken; }
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public String getPriority() { return priority; }
        public void setPriority(String priority) { this.priority = priority; }
        public java.time.LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(java.time.LocalDateTime createdAt) { this.createdAt = createdAt; }
        public java.time.LocalDateTime getAcceptedAt() { return acceptedAt; }
        public void setAcceptedAt(java.time.LocalDateTime acceptedAt) { this.acceptedAt = acceptedAt; }
    }

    public static class TaskAssignment {
        private Long id;
        private String roomToken;
        private String staffName;
        private String status;
        private java.time.LocalDateTime createdAt;
        private java.time.LocalDateTime acceptedAt;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getRoomToken() { return roomToken; }
        public void setRoomToken(String roomToken) { this.roomToken = roomToken; }
        public String getStaffName() { return staffName; }
        public void setStaffName(String staffName) { this.staffName = staffName; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public java.time.LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(java.time.LocalDateTime createdAt) { this.createdAt = createdAt; }
        public java.time.LocalDateTime getAcceptedAt() { return acceptedAt; }
        public void setAcceptedAt(java.time.LocalDateTime acceptedAt) { this.acceptedAt = acceptedAt; }
    }
    
    public static class ChatMessageDTO {
        private String roomToken;
        private String sender;
        private String content;

        public String getRoomToken() { return roomToken; }
        public void setRoomToken(String roomToken) { this.roomToken = roomToken; }
        public String getSender() { return sender; }
        public void setSender(String sender) { this.sender = sender; }
        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
    }
}
