package com.smarthotel.model;

import jakarta.persistence.*;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
@Table(name = "rooms")
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "room_number", unique = true, nullable = false)
    private String roomNumber;

    @Column(unique = true, nullable = false)
    private String token; // For QR code access, e.g. /room/:token

    @ManyToOne
    @JoinColumn(name = "guest_id")
    private User currentGuest;

    @Column(nullable = false)
    private String status = "AVAILABLE"; // AVAILABLE, OCCUPIED, MAINTENANCE

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public User getCurrentGuest() { return currentGuest; }
    public void setCurrentGuest(User currentGuest) { this.currentGuest = currentGuest; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
