-- Insert Admin Users
INSERT INTO users (username, password, role) VALUES ('admin_super', '123', 'ADMIN');
INSERT INTO users (username, password, role) VALUES ('admin_night', '123', 'ADMIN');

-- Insert Staff Users
-- Maintenance
INSERT INTO users (username, password, role) VALUES ('Mike (Maintenance)', '123', 'STAFF');
INSERT INTO users (username, password, role) VALUES ('Tom (Maintenance)', '123', 'STAFF');
INSERT INTO users (username, password, role) VALUES ('Dave (Maintenance)', '123', 'STAFF');
INSERT INTO users (username, password, role) VALUES ('Chris (Maintenance)', '123', 'STAFF');

-- Housekeeping
INSERT INTO users (username, password, role) VALUES ('Anna (Housekeeping)', '123', 'STAFF');
INSERT INTO users (username, password, role) VALUES ('Maria (Housekeeping)', '123', 'STAFF');
INSERT INTO users (username, password, role) VALUES ('Rosa (Housekeeping)', '123', 'STAFF');
INSERT INTO users (username, password, role) VALUES ('Elena (Housekeeping)', '123', 'STAFF');

-- Manager / Security
INSERT INTO users (username, password, role) VALUES ('Sarah (Manager)', '123', 'STAFF');
INSERT INTO users (username, password, role) VALUES ('James (Security)', '123', 'STAFF');
INSERT INTO users (username, password, role) VALUES ('Robert (Security)', '123', 'STAFF');
INSERT INTO users (username, password, role) VALUES ('Linda (Manager)', '123', 'STAFF');

-- Dining
INSERT INTO users (username, password, role) VALUES ('John (Dining)', '123', 'STAFF');
INSERT INTO users (username, password, role) VALUES ('Peter (Dining)', '123', 'STAFF');
INSERT INTO users (username, password, role) VALUES ('Alice (Dining)', '123', 'STAFF');
INSERT INTO users (username, password, role) VALUES ('Mark (Dining)', '123', 'STAFF');

-- Insert Dummy Guests (Optional)
INSERT INTO users (username, password, role) VALUES ('guest_101', '123', 'GUEST');
INSERT INTO users (username, password, role) VALUES ('guest_102', '123', 'GUEST');

-- Insert Rooms 
INSERT INTO rooms (room_number, token, guest_id, status) VALUES ('101', 'ROOM-101', NULL, 'AVAILABLE');
INSERT INTO rooms (room_number, token, guest_id, status) VALUES ('102', 'ROOM-102', NULL, 'AVAILABLE');
INSERT INTO rooms (room_number, token, guest_id, status) VALUES ('103', 'ROOM-103', NULL, 'AVAILABLE');
INSERT INTO rooms (room_number, token, guest_id, status) VALUES ('201', 'ROOM-201', NULL, 'AVAILABLE');
INSERT INTO rooms (room_number, token, guest_id, status) VALUES ('202', 'ROOM-202', NULL, 'AVAILABLE');
