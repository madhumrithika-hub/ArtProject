# DrawVinci

> **Turn any artwork into a step-by-step drawing tutorial.**

DrawVinci is an AI-assisted drawing tutorial application that helps users recreate artwork by breaking a reference image into simple, structured, step-by-step drawing instructions.

Users can provide an artwork reference, analyze its visual structure, generate a guided tutorial, and then follow the tutorial inside an interactive drawing studio. The application is designed to make the process of recreating an artwork easier by gradually breaking it down into manageable stages.

The project is currently under active development, with additional features and improvements planned.

---

## ✨ Features

### 🎨 Reference Image Analysis

Upload an artwork reference and let DrawVinci analyze its visual characteristics.

The application currently provides:

* **Wireframe analysis** for understanding the basic structure and proportions
* **3-tone value study** for identifying major light, mid-tone, and dark regions
* **Colour palette extraction** for identifying important colours from the reference
* Basic local image analysis before tutorial generation

---

### 🤖 AI-Powered Tutorial Generation

DrawVinci uses **Google Gemini** to analyze the uploaded artwork and generate a structured drawing tutorial.

The generated tutorial can include:

* Artwork overview
* Recommended drawing approach
* Required supplies
* Step-by-step instructions
* Visual guidance for each stage
* Progressive development from initial construction to the finished artwork

When Gemini is unavailable, the application also has a **local fallback tutorial generation system** so that tutorial creation can still function without relying entirely on the external AI service.

---

### 📚 Tutorial Studio

Generated tutorials can be opened in the Tutorial Studio, where the user can work through the artwork progressively.

The current tutorial workflow is organized into multiple stages, allowing users to move from:

**Initial construction → proportions → values → details → refinement → final artwork**

Each stage provides the corresponding instructions and visual guidance needed for that part of the drawing process.

---

### ✏️ Interactive Drawing Canvas

DrawVinci includes an interactive drawing environment where users can practice directly alongside their tutorial.

Current drawing capabilities include:

* Pencil tool
* Brush/drawing controls
* Eraser
* Adjustable brush size
* Adjustable opacity
* Undo
* Redo
* Reference image support
* Wireframe/reference overlays
* Canvas-based drawing

This allows the tutorial and the actual drawing process to exist within the same workspace.

---

### 💾 Save & Continue Your Work

Users can save their drawing work and tutorials for later access.

The application currently supports:

* Saving artwork
* Persisting tutorials
* Accessing previously saved works
* Continuing work from the saved workspace

Saved content is managed through the application's MongoDB database.

---

### 🔐 Authentication

DrawVinci includes user authentication using:

* User registration
* User login
* Password hashing with `bcrypt`
* JWT-based authentication
* Protected application functionality

---

## 🧠 How DrawVinci Works

The current workflow can be summarized as:

```text
                    ┌──────────────────┐
                    │  Reference Art   │
                    │      Upload      │
                    └────────┬─────────┘
                             │
                             ▼
                  ┌─────────────────────┐
                  │  Image Processing   │
                  │   & Local Analysis  │
                  └─────────┬───────────┘
                            │
              ┌─────────────┼─────────────┐
              ▼             ▼             ▼
         ┌─────────┐   ┌──────────┐   ┌─────────┐
         │Wireframe│   │ 3-Tone   │   │ Colour  │
         │Analysis │   │  Values  │   │ Palette │
         └────┬────┘   └────┬─────┘   └────┬────┘
              │             │              │
              └─────────────┼──────────────┘
                            ▼
                  ┌─────────────────────┐
                  │   Gemini AI /       │
                  │  Local Fallback     │
                  └─────────┬───────────┘
                            │
                            ▼
                  ┌─────────────────────┐
                  │ Drawing Tutorial    │
                  │     Generation      │
                  └─────────┬───────────┘
                            │
                            ▼
                  ┌─────────────────────┐
                  │   Tutorial Studio   │
                  └─────────┬───────────┘
                            │
                            ▼
                  ┌─────────────────────┐
                  │ Interactive Drawing │
                  │       Canvas        │
                  └─────────┬───────────┘
                            │
                            ▼
                  ┌─────────────────────┐
                  │     Save Work       │
                  │     & Gallery       │
                  └─────────────────────┘
```

---

## 🏗️ Project Architecture

DrawVinci follows a full-stack architecture with a React frontend, Express backend, MongoDB database, and AI integration.

```text
DrawVinci
│
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   └── App.css
│   ├── package.json
│   └── vite.config.js
│
├── server/                  # Node.js / Express backend
│   ├── models/              # MongoDB / Mongoose models
│   ├── routes/              # API routes
│   ├── middleware/          # Authentication and middleware
│   ├── services/            # AI and image-processing logic
│   ├── uploads/             # Uploaded artwork files
│   ├── .env                 # Environment configuration
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## 🛠️ Tech Stack

### Frontend

* **React**
* **Vite**
* **JavaScript**
* **HTML**
* **CSS**
* **Lucide React** for interface icons
* **Canvas API** for interactive drawing
* **Canvas Confetti** for UI feedback

### Backend

* **Node.js**
* **Express.js**
* **JavaScript**
* **Multer** for file uploads
* **Jimp** for image processing

### Database

* **MongoDB**
* **Mongoose**

### Authentication & Security

* **JSON Web Tokens (JWT)**
* **bcrypt**

### Artificial Intelligence

* **Google Gemini API**
* **Google GenAI SDK**
* Local fallback tutorial-generation logic

---

## 🔌 API Structure

The backend currently exposes the following primary API areas:

| Endpoint         | Purpose                                         |
| ---------------- | ----------------------------------------------- |
| `/api/health`    | Check backend/server health                     |
| `/api/auth`      | User registration and authentication            |
| `/api/tutorials` | Tutorial generation, retrieval, and persistence |

The backend runs independently from the React frontend and communicates with MongoDB and the configured AI service.

---

## ⚙️ Environment Variables

The backend requires environment variables for its configuration.

Create a `.env` file inside the `server/` directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

### Environment Variables

| Variable         | Description                            |
| ---------------- | -------------------------------------- |
| `PORT`           | Port used by the Express server        |
| `MONGODB_URI`    | MongoDB connection string              |
| `JWT_SECRET`     | Secret used for JWT authentication     |
| `GEMINI_API_KEY` | API key used for Gemini AI integration |

> **Important:** Never commit your `.env` file or expose your API keys publicly.

---

## 🚀 Running the Project Locally

### Prerequisites

Make sure the following are installed:

* **Node.js**
* **npm**
* **MongoDB**
* A **Google Gemini API key**

---

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd ArtProject
```

---

### 2. Install frontend dependencies

```bash
cd client
npm install
```

---

### 3. Install backend dependencies

Open another terminal:

```bash
cd server
npm install
```

---

### 4. Configure environment variables

Create:

```text
server/.env
```

and add:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

---

### 5. Start the backend

From the `server/` directory:

```bash
node server.js
```

The backend will run on:

```text
http://localhost:5000
```

---

### 6. Start the frontend

From the `client/` directory:

```bash
npm run dev
```

Vite will provide the local development URL in the terminal, typically:

```text
http://localhost:5173
```

Open that address in your browser to use DrawVinci.

---

## 🔄 Application Flow

A typical DrawVinci session follows this flow:

```text
1. Register / Log in
        ↓
2. Upload an artwork reference
        ↓
3. Analyze the reference
        ↓
4. Generate wireframe, value study & palette
        ↓
5. Generate drawing tutorial
        ↓
6. Open Tutorial Studio
        ↓
7. Follow the tutorial stage by stage
        ↓
8. Draw using the interactive canvas
        ↓
9. Save the completed/in-progress artwork
        ↓
10. Access saved work later
```

---

## 📂 Main Project Structure

```text
ArtProject/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── ...
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── uploads/
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```

> The exact internal structure may evolve as development continues.

---

## 🧩 Current Capabilities

DrawVinci currently supports:

* User registration and login
* JWT authentication
* Artwork/image upload
* Local image analysis
* Wireframe generation
* 3-tone value study
* Colour palette extraction
* Gemini-based artwork analysis
* Local fallback tutorial generation
* Structured drawing tutorial generation
* Multi-stage tutorials
* Tutorial persistence
* Tutorial Studio
* Interactive drawing canvas
* Pencil/drawing tools
* Eraser
* Adjustable size
* Adjustable opacity
* Undo and redo
* Reference and wireframe assistance
* Saving artwork
* Saved works/gallery functionality

---

## 🔮 Future Development

DrawVinci is an ongoing project and is still under active development.

Future updates will expand the application's capabilities, improve the existing drawing and tutorial experience, and introduce additional features as development progresses.

The current implementation represents the foundation of the application, with more functionality planned for future versions.

---

## 📌 Project Status

**Status: In Progress 🚧**

The core functionality of DrawVinci is currently implemented and working locally.

The project will continue to evolve with additional features, improvements, refinements, and eventually a deployment for public access.

At present, DrawVinci is intended for **local development and testing**. A publicly accessible deployment and dedicated domain are planned for a future stage of the project.

---

## 👤 Author

**Madhumitha**

DrawVinci is currently developed as a solo project.

---

## 📄 License

A license has not been added yet.

Licensing will be considered as the project approaches its deployment and public-release stage.
