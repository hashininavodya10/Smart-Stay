package com.smarthotel.repository;

import com.smarthotel.model.ServiceRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, Long> {
    java.util.List<ServiceRequest> findByRoomTokenOrderByCreatedAtDesc(String token);
    java.util.List<ServiceRequest> findByStaffUsernameOrderByCreatedAtDesc(String username);
    java.util.List<ServiceRequest> findByCreatedAtAfterOrderByCreatedAtDesc(java.time.LocalDateTime since);
    java.util.List<ServiceRequest> findByPriorityAndCreatedAtAfter(com.smarthotel.model.ServiceRequest.Priority priority, java.time.LocalDateTime since);
}
