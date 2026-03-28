# 🎯 Interview Slot Booking System

A Full Stack Web Application for managing interview scheduling, slot booking, feedback and hiring reports.

## Tech Stack
- **Backend**: Spring Boot 3.5, Java 21, MySQL 8, JWT Security
- **Frontend**: React 18 + Vite, Bootstrap 5, Axios

## Features
- JWT Authentication & Authorization
- Role-based access control (ADMIN / HR / INTERVIEWER / CANDIDATE)
- Job Listings Management
- Interview Slot Booking
- Feedback Collection
- Reports & Analytics
- Dark Mode

## Project Structure
```
Mini-Project/
├── interview-system/          # Spring Boot Backend
└── interview-slot-system-frontend/  # React Frontend
```

## How to Run

### Prerequisites
- Java 21
- Node.js 18+
- MySQL 8

### Backend
1. Create MySQL database:
   ```sql
   CREATE DATABASE interview_system;
   ```
2. Update `src/main/resources/application.properties` with your MySQL credentials
3. Run `InterviewSystemApplication.java` in Eclipse
4. Runs on: `http://localhost:8080`

### Frontend
1. Install dependencies and start:
   ```bash
   cd interview-slot-system-frontend
   npm install
   npm run dev
   ```
2. Open: `http://localhost:5173`

## Login Credentials
| Role | Email | Password |
|---|---|---|
| Admin | admin@test.com | admin123 |
| HR | hr@test.com | hr123 |
| Interviewer | interviewer@test.com | inter123 |
| Candidate | candidate@test.com | cand123 |