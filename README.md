# 🎨 Collaborative Drawing Application

A full-stack web application that allows users to create, edit, and manage digital drawings with real-time collaboration.

**Built with:** Spring Boot, React, TypeScript, Socket.IO, PostgreSQL, JWT

---

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication with secure token storage
- Username validation (2–32 characters) and password validation (8–128 characters)
- Protected routes with Pinia and localStorage
- Role-based access control – only the author can modify or delete their drawings

### 🖌️ Drawing Editor
- Create new drawings or load existing ones
- Drawing tools: **Pencil**, **Eraser**, **Color Picker**, **Brush Size** controls
- Canvas resizing ([1, 24] limits) with content preservation
- Save (POST) and update (PATCH) drawings — only the author can permanently save changes

### 🖼️ Gallery
- Paginated display of all saved drawings
- Filter by **author username**
- Thumbnail previews for quick browsing
- Delete and edit options with confirmation dialogs for destructive actions

### 👥 Real-Time Collaboration
- Multiple users can edit the same canvas simultaneously
- Live cursor tracking — see other users' cursors in real time
- Built with **Socket.IO** for low-latency WebSocket communication
- Changes are broadcast to all connected clients instantly

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| **Java 21** | Core language |
| **Spring Boot** | REST API framework |
| **Spring Security** | Authentication & authorization |
| **JWT** | Token-based authentication |
| **PostgreSQL** | Relational database |
| **Hibernate/JPA** | ORM for database operations |
| **Socket.IO (Java)** | Real-time WebSocket communication |

### Frontend
| Technology | Purpose |
|------------|---------|
| **React** | UI framework |
| **TypeScript** | Type-safe JavaScript |
| **Vite** | Build tool |
| **Tailwind CSS** | Styling |
| **Pinia** | State management |
| **Socket.IO (Client)** | Real-time WebSocket client |
| **Axios** | HTTP client |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                            │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌──────────────┐ │
│  │   Auth  │  │ Gallery │  │ Editor  │  │ Collaboration │ │
│  │ (Login/ │  │         │  │         │  │   (Socket.IO) │ │
│  │ Register│  │         │  │         │  │               │ │
│  └─────────┘  └─────────┘  └─────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                         Backend                            │
│  ┌─────────────┐  ┌─────────────┐  ┌────────────────────┐ │
│  │   REST API  │  │    JWT      │  │   WebSocket        │ │
│  │ (Spring Boot│  │  Security   │  │   (Socket.IO)      │ │
│  │  Controllers│  │             │  │                    │ │
│  └─────────────┘  └─────────────┘  └────────────────────┘ │
│                              │                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                  PostgreSQL                          │  │
│  │         (Users, Drawings, Collaborations)           │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 How Collaboration Works

1. User A opens a drawing → joins a Socket.IO room (`drawing:{id}`)
2. User B opens the same drawing → joins the same room
3. User A draws a line → event emitted to the room
4. All users in the room receive the update and re-render their canvas
5. Cursor positions are broadcast every 100ms for smooth tracking

---

## 🚀 Getting Started

### Prerequisites
- Java 21+
- Node.js 18+
- PostgreSQL 15+
- Maven

### Backend Setup
```bash
# Clone the repository
git clone https://github.com/szaric13/drawing-app

# Navigate to backend
cd backend

# Configure application.properties with your PostgreSQL credentials
# Run the application
mvn spring-boot:run
```

### Frontend Setup
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Environment Variables
Create a `.env` file in the frontend directory:
```
VITE_API_URL=http://localhost:8080/api
VITE_WS_URL=ws://localhost:8080
```

---

## 📚 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT |
| GET | `/api/drawings` | Get all drawings (paginated) |
| GET | `/api/drawings/{id}` | Get a single drawing |
| POST | `/api/drawings` | Create a new drawing |
| PATCH | `/api/drawings/{id}` | Update a drawing |
| DELETE | `/api/drawings/{id}` | Delete a drawing |

---

## 📂 Project Structure

```
backend/
├── src/main/java/com/drawing/
│   ├── config/           # Security & WebSocket configuration
│   ├── controller/       # REST endpoints
│   ├── model/            # Entities (User, Drawing)
│   ├── repository/       # JPA repositories
│   ├── service/          # Business logic
│   └── dto/              # Data transfer objects
└── src/main/resources/
    └── application.properties

frontend/
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/            # Login, Register, Gallery, Editor
│   ├── store/            # Pinia stores (auth, drawings)
│   ├── services/         # API & WebSocket clients
│   ├── types/            # TypeScript interfaces
│   └── utils/            # Utility functions
├── index.html
└── package.json
```

---

## 👨‍💻 Author

**Strahinja Zarić**
- 📧 Email: szaric7322rn@raf.rs
- 🔗 LinkedIn: [linkedin.com/in/szaric24/](https://www.linkedin.com/in/szaric24/)
- 🐙 GitHub: [github.com/szaric13](https://github.com/szaric13)

---

## 📄 License

This project is for educational purposes as part of my Computer Science studies at RAF Belgrade.

---

## 🙏 Acknowledgments

- Socket.IO for real-time communication
- Spring Boot team for the amazing framework
- React and TypeScript communities

---

<p align="center">
  <i>"Building software that matters, one commit at a time."</i>
</p>
