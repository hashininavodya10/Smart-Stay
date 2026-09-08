# Smart Hotel Management System

A comprehensive, real-time Hotel Management System featuring a Spring Boot backend, an Angular web dashboard for Staff and Administrators, and a React Native (Expo) mobile application for Guests.

## Prerequisites

To run this project locally, the following software must be installed:

1. **Java Development Kit (JDK) 17 or higher**

   * Required to run the Spring Boot backend.

2. **Node.js (v18 or higher) and npm**

   * Required for the Angular web application and React Native Expo mobile application.

3. **MySQL Server**

   * Required for database management.
   * The MySQL server should run on port `3307`.
   * The default root password is `123`.
   * If the MySQL configuration is different, update the following file:
     `backend/src/main/resources/application.properties`

4. **Angular CLI**

   * Install globally using:

   ```bash
   npm install -g @angular/cli
   ```

5. **Expo CLI**

   * Install globally using:

   ```bash
   npm install -g expo-cli
   ```

## Running the Project

The system consists of three main modules:

* Spring Boot Backend
* Angular Web Dashboard
* React Native (Expo) Guest Application

It is recommended to open three separate terminal windows so that all modules can run simultaneously.

### 1. Start the MySQL Database

Ensure that the MySQL Server is installed, running, and accessible.

The backend is configured to automatically create the `smart_hotel_db` database and the required tables when the application starts.

### 2. Start the Backend

Open a terminal and navigate to the backend directory:

```bash
cd backend
./mvnw spring-boot:run
```

The Spring Boot backend will run at:

`http://localhost:8080`

The backend is responsible for database communication, API services, and real-time WebSocket communication.

### 3. Start the Web Dashboard

Open a second terminal and navigate to the frontend directory:

```bash
cd frontend
npm install
ng serve
```

The Angular web application will run at:

`http://localhost:4200`

The system provides separate interfaces for Administrators and Staff:

* **Admin Dashboard:** `http://localhost:4200/admin`
* **Staff Dashboard:** `http://localhost:4200/staff`

### 4. Start the Guest Mobile Application

Open a third terminal and navigate to the mobile application directory:

```bash
cd mobile
npm install
npx expo start --web -c
```

The Expo application will be available at:

`http://localhost:8081`

To open the application in a web browser, press `w` in the Expo terminal.

Alternatively, install the **Expo Go** application on an Android or iOS device and scan the QR code displayed in the terminal to run the application on a physical device.

## Testing the System Flow

The following steps can be used to test the main system workflow:

1. Open the Guest Mobile Application.
2. Enter a mock Room Token such as `ROOM-101` to simulate guest authentication.
3. Open the Admin Dashboard at `http://localhost:4200/admin`.
4. Submit a service request, such as a Maintenance request, through the Guest Application.
5. Verify that the request appears in the Admin Dashboard in real time.
6. Assign an available Staff Member to the service request.
7. Open the Staff Dashboard at `http://localhost:4200/staff`.
8. Verify that the assigned task is displayed on the Staff Dashboard.
9. The Staff Member can select **Start Job** to begin the task.
10. After completing the task, the Staff Member can select **Mark Completed** to update the request status.

## Configuration for Another Computer

When the Guest Mobile Application is executed on a physical mobile device or emulator, it needs to communicate with the backend running on the development computer.

Therefore, the hardcoded IP address `172.20.10.3` must be replaced with the local IPv4 address of the computer running the backend.

### Finding the Local IP Address

**Windows**

Open Command Prompt and run:

```bash
ipconfig
```

Locate the **IPv4 Address** under the active network connection.

**macOS**

Open Terminal and run:

```bash
ifconfig | grep inet
```

Alternatively, the local IP address can be found through the network settings.

### Files Requiring IP Address Updates

Replace `172.20.10.3` with the computer's actual local IPv4 address in the following files:

1. `mobile/src/services/WebSocketService.ts` — approximately line 18
2. `mobile/src/screens/GuestScreen.tsx` — approximately lines 36 and 41
3. `mobile/src/screens/LoginScreen.tsx` — approximately line 26
4. `mobile/src/screens/StaffScreen.tsx` — approximately line 17

### Web Dashboard Configuration

The Angular web dashboard communicates with the backend using:

`http://localhost:8080`

Therefore, no IP address modification is required when both the Angular frontend and Spring Boot backend are running on the same computer.

If the web dashboard needs to be accessed from another device on the same network, the frontend's backend URL configuration may also need to be updated to use the host computer's local IPv4 address.

## System Architecture

The Smart Hotel Management System consists of the following components:

| Component               | Technology          | Purpose                                                       |
| ----------------------- | ------------------- | ------------------------------------------------------------- |
| Backend                 | Spring Boot         | API services, database management and WebSocket communication |
| Database                | MySQL               | Stores system and service request data                        |
| Web Application         | Angular             | Provides Admin and Staff dashboards                           |
| Mobile Application      | React Native / Expo | Provides the Guest interface                                  |
| Real-Time Communication | WebSocket           | Enables real-time service request updates                     |

## Notes

Ensure that the MySQL Server, Spring Boot backend, Angular frontend, and Expo application are running correctly before testing the complete system workflow.

For mobile testing on a physical device, the computer and mobile device should normally be connected to the same local network so that the mobile application can communicate with the backend.
