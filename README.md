# MeetMind AI

**MeetMind AI** is a full-stack application that turns meeting recordings into useful, structured notes using AI.

Upload an audio recording and get a transcript, meeting summary, important decisions, and actionable tasks in one place.

## Highlights

* Audio recording upload
* Automatic speech transcription
* AI-generated meeting summaries
* Key decisions and discussion points
* Action-item extraction
* Task owner and priority information
* Meeting history
* Searchable meeting records
* Full transcript view
* Responsive web interface

## Built With

### Frontend

* React
* Vite
* Tailwind CSS
* Lucide React

### Backend

* Java
* Spring Boot
* Spring Data JPA
* Hibernate
* Maven

### AI & Storage

* Groq API
* Whisper large-v3
* GPT-OSS-120B
* H2 Database

## How It Works

```text
Audio Recording
      ↓
React Web App
      ↓
Spring Boot REST API
      ↓
Speech Transcription
      ↓
AI Meeting Analysis
      ↓
Summary + Decisions + Action Items
      ↓
H2 Database
```

## Project Layout

```text
meetmind-ai/
├── backend/
│   ├── src/
│   ├── pom.xml
│   └── mvnw.cmd
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## Requirements

Before running the application, install:

* JDK 21+
* Node.js 18+
* npm
* Git
* Groq API key

Check your installations:

```bash
java -version
node -v
npm -v
git --version
```

## Configuration

Set your Groq API key as an environment variable.

### Windows CMD

```cmd
set GROQ_API_KEY=YOUR_GROQ_API_KEY
```

### PowerShell

```powershell
$env:GROQ_API_KEY="YOUR_GROQ_API_KEY"
```

Never commit your real API key to GitHub.

## Run the Backend

```cmd
cd backend
mvnw.cmd spring-boot:run
```

Backend:

```text
http://localhost:8080
```

## Run the Frontend

Open another terminal:

```cmd
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

## API

| Method | Endpoint               | Purpose                     |
| ------ | ---------------------- | --------------------------- |
| POST   | `/api/meetings/upload` | Process a meeting recording |
| GET    | `/api/meetings`        | Retrieve meetings           |
| GET    | `/api/meetings/{id}`   | Retrieve meeting details    |
| DELETE | `/api/meetings/{id}`   | Remove a meeting            |

## Typical Workflow

1. Start the backend.
2. Start the frontend.
3. Open the web application.
4. Upload a meeting recording.
5. Wait for AI processing.
6. Review the generated summary and transcript.
7. Check decisions and action items.
8. Manage the meeting from the dashboard.

## Future Improvements

* User authentication
* Speaker identification
* Multi-language support
* PDF export
* Calendar integration
* Advanced meeting analytics
* Cloud database support

## Author

**WASUKI NATH CHOUDHARY**

---

**MeetMind AI — Turn conversations into actionable information.**
