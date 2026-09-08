package com.smarthotel.controller;

import com.smarthotel.model.ChatMessage;
import com.smarthotel.model.Room;
import com.smarthotel.model.ServiceRequest;
import com.smarthotel.model.User;
import com.smarthotel.repository.ChatMessageRepository;
import com.smarthotel.repository.RoomRepository;
import com.smarthotel.repository.ServiceRequestRepository;
import com.smarthotel.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ServiceRequestRestController {

    private final ServiceRequestRepository serviceRequestRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;

    public ServiceRequestRestController(ServiceRequestRepository serviceRequestRepository,
                                        ChatMessageRepository chatMessageRepository,
                                        RoomRepository roomRepository,
                                        UserRepository userRepository) {
        this.serviceRequestRepository = serviceRequestRepository;
        this.chatMessageRepository = chatMessageRepository;
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/requests/room/{roomToken}")
    public List<ServiceRequest> getRequestsByRoom(@PathVariable String roomToken) {
        return serviceRequestRepository.findByRoomTokenOrderByCreatedAtDesc(roomToken);
    }

    @GetMapping("/requests/all")
    public List<ServiceRequest> getAllRequests() {
        return serviceRequestRepository.findAll();
    }

    @GetMapping("/rooms")
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    @GetMapping("/chats/room/{roomToken}")
    public List<ChatMessage> getChatHistory(@PathVariable String roomToken) {
        return chatMessageRepository.findByRoomTokenOrderByCreatedAtAsc(roomToken);
    }

    @GetMapping("/chats/all")
    public List<ChatMessage> getAllChatHistory() {
        return chatMessageRepository.findAll();
    }

    // ─── Analytics Endpoint ───────────────────────────────────────────────────

    @GetMapping("/analytics")
    public AnalyticsDTO getAnalytics() {
        LocalDateTime startOfToday   = LocalDate.now().atStartOfDay();
        LocalDateTime twentyFourHoursAgo = LocalDateTime.now().minusHours(24);

        // All requests created today
        List<ServiceRequest> todayRequests =
                serviceRequestRepository.findByCreatedAtAfterOrderByCreatedAtDesc(startOfToday);

        // High priority in the last 24 hours
        List<ServiceRequest> highPriorityLast24h =
                serviceRequestRepository.findByPriorityAndCreatedAtAfter(
                        ServiceRequest.Priority.HIGH, twentyFourHoursAgo);

        // Average resolution time (acceptedAt - createdAt) for requests that have been accepted
        List<ServiceRequest> resolvedRequests = serviceRequestRepository.findAll().stream()
                .filter(r -> r.getAcceptedAt() != null && r.getCreatedAt() != null)
                .collect(Collectors.toList());

        long avgResolutionMinutes = 0;
        if (!resolvedRequests.isEmpty()) {
            avgResolutionMinutes = (long) resolvedRequests.stream()
                    .mapToLong(r -> Duration.between(r.getCreatedAt(), r.getAcceptedAt()).toMinutes())
                    .average()
                    .orElse(0);
        }

        // Staff count
        List<User> staffUsers = userRepository.findByRole(User.Role.STAFF);

        // Category breakdown (all-time, for chart)
        List<ServiceRequest> allRequests = serviceRequestRepository.findAll();
        Map<String, Long> categoryBreakdown = new LinkedHashMap<>();
        for (ServiceRequest.RequestType type : ServiceRequest.RequestType.values()) {
            categoryBreakdown.put(type.name(), 0L);
        }
        allRequests.forEach(r -> {
            if (r.getType() != null) {
                categoryBreakdown.merge(r.getType().name(), 1L, Long::sum);
            }
        });

        // Recent HIGH priority requests (up to 5)
        List<RecentActivity> recentHighPriority = highPriorityLast24h.stream()
                .limit(5)
                .map(r -> {
                    RecentActivity activity = new RecentActivity();
                    activity.setId(r.getId());
                    activity.setRoomToken(r.getRoom() != null ? r.getRoom().getToken() : "");
                    activity.setDescription(r.getDescription());
                    activity.setPriority(r.getPriority() != null ? r.getPriority().name() : "");
                    activity.setStatus(r.getStatus() != null ? r.getStatus().name() : "");
                    activity.setCreatedAt(r.getCreatedAt());
                    return activity;
                })
                .collect(Collectors.toList());

        // Build and return DTO
        AnalyticsDTO dto = new AnalyticsDTO();
        dto.setTotalRequestsToday(todayRequests.size());
        dto.setAvgResolutionMinutes(avgResolutionMinutes);
        dto.setHighPriorityLast24h(highPriorityLast24h.size());
        dto.setTotalStaff(staffUsers.size());
        dto.setCategoryBreakdown(categoryBreakdown);
        dto.setTotalAllTimeRequests(allRequests.size());
        dto.setRecentHighPriority(recentHighPriority);
        return dto;
    }

    // ─── DTOs ────────────────────────────────────────────────────────────────

    public static class AnalyticsDTO {
        private int totalRequestsToday;
        private long avgResolutionMinutes;
        private int highPriorityLast24h;
        private int totalStaff;
        private int totalAllTimeRequests;
        private Map<String, Long> categoryBreakdown;
        private List<RecentActivity> recentHighPriority;

        public int getTotalRequestsToday() { return totalRequestsToday; }
        public void setTotalRequestsToday(int v) { this.totalRequestsToday = v; }
        public long getAvgResolutionMinutes() { return avgResolutionMinutes; }
        public void setAvgResolutionMinutes(long v) { this.avgResolutionMinutes = v; }
        public int getHighPriorityLast24h() { return highPriorityLast24h; }
        public void setHighPriorityLast24h(int v) { this.highPriorityLast24h = v; }
        public int getTotalStaff() { return totalStaff; }
        public void setTotalStaff(int v) { this.totalStaff = v; }
        public int getTotalAllTimeRequests() { return totalAllTimeRequests; }
        public void setTotalAllTimeRequests(int v) { this.totalAllTimeRequests = v; }
        public Map<String, Long> getCategoryBreakdown() { return categoryBreakdown; }
        public void setCategoryBreakdown(Map<String, Long> v) { this.categoryBreakdown = v; }
        public List<RecentActivity> getRecentHighPriority() { return recentHighPriority; }
        public void setRecentHighPriority(List<RecentActivity> v) { this.recentHighPriority = v; }
    }

    public static class RecentActivity {
        private Long id;
        private String roomToken;
        private String description;
        private String priority;
        private String status;
        private LocalDateTime createdAt;

        public Long getId() { return id; }
        public void setId(Long v) { this.id = v; }
        public String getRoomToken() { return roomToken; }
        public void setRoomToken(String v) { this.roomToken = v; }
        public String getDescription() { return description; }
        public void setDescription(String v) { this.description = v; }
        public String getPriority() { return priority; }
        public void setPriority(String v) { this.priority = v; }
        public String getStatus() { return status; }
        public void setStatus(String v) { this.status = v; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime v) { this.createdAt = v; }
    }
}

