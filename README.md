# DrawVinci

DrawVinci is an AI-powered step-by-step art tutorial application that helps users learn how to recreate an artwork from a reference image.

What DrawVinci Does

DrawVinci currently supports this workflow:

Create an artist account or sign in.

Upload an artwork reference image.

Choose the reference medium/style.

Choose the target medium you want to learn.

Select the subject/genre.

Describe your artistic goals and technique preferences.

Generate a step-by-step art masterclass.

Study the reference, wireframe, and value-study views.

Work through a six-stage tutorial.

Practice directly on the built-in drawing canvas.

Use Pencil, Brush, Ink Pen, and Eraser tools.

Adjust drawing size and opacity.

Use Undo/Redo, Grid, and Trace/Onion-Skin assistance.

Save practice work to the studio.

Download the drawing as PNG.

Reopen saved works through the gallery.

Main Features

Authentication

Artist registration and login

JWT-based authentication

bcrypt password hashing

Authenticated user sessions

User-specific saved work

Artwork Upload

The upload system accepts:

JPEG

PNG

WebP

GIF

MP4

MOV

WebM

The complete tutorial-generation workflow currently operates on images.
Full video processing is planned.

Artistic Configuration

Users can define:

Reference style/medium

Target medium

Subject/genre

Artistic vision

Technique goals

Style preferences

Example:

Reference: Pencil / Graphite Sketch
Target: Watercolor Painting
Goal: Soft wet-on-wet washes with preserved paper highlights

🤖 AI Tutorial Generation

DrawVinci integrates Google's Gemini multimodal AI for visual artistic
analysis.

Generated tutorial information can include:

Artwork interpretation

Medium translation

Recommended supplies

Drawing stages

Proportion guidance

Structural construction

Shadow/value guidance

Form development

Shading guidance

Highlights and details

Artist tips

Common mistakes/watch-outs

Time estimates

Medium-specific instructions

A fine-art fallback engine is also included so the tutorial workflow can
continue when Gemini is temporarily unavailable.

Local Image Analysis

The backend uses Jimp for local image processing, including:

Wireframe/edge representation

Three-tone value study

Extracted pigment/colour palette

These references are displayed inside the Tutorial Studio.

Tutorial Studio

The masterclass is presented as an interactive six-stage learning
experience:

Gesture & Structural Wireframe

Anatomical & Proportion Landmarks

Shadow Block-In & Chiaroscuro Mapping

Midtone Modeling & Form Development

Refinement / Detail Development

Final Accents / Finishing

The studio provides:

Stage navigation

Progress tracking

Stage-specific instructions

Reference image

Wireframe view

Three-tone value view

Extracted pigment palette

Recommended supplies

Estimated stage time

Master Artist Tips

Watch-Out warnings

✏️ Built-In Drawing Canvas

Current tools and controls:

Pencil

Brush

Ink Pen

Eraser

Undo

Redo

Clear/reset drawing

Drawing size

Opacity

Grid

Trace/Onion-Skin assistance

Colour/palette selection

Save & Export

Users can:

Save drawing work to the studio

Download the current drawing as PNG

Revisit saved works through the gallery

Saved Works Gallery

Authenticated users can:

View saved tutorials/works

Reopen saved work

Delete saved tutorial records

Technology Stack

Frontend

React 19

Vite

JavaScript / JSX

CSS

HTML Canvas

Backend

Node.js

Express.js

JavaScript

REST API

Database

MongoDB

Mongoose

Authentication

JSON Web Tokens (JWT)

bcrypt

AI

Google Gemini API

@google/genai

Image Processing

Jimp

File Uploads

Multer

Current API Functionality

Authentication

POST /api/auth/register
POST /api/auth/login

Tutorials

POST /api/tutorials/generate
GET  /api/tutorials
DELETE /api/tutorials/:id

The application also supports saving practice drawings associated with
tutorial work.

Tutorial Pipeline

Upload Artwork
      ↓
Artistic Configuration
      ↓
Local Image Analysis
(Wireframe / Values / Palette)
      ↓
Gemini Visual Analysis
      ↓
AI Tutorial / Fine-Art Fallback
      ↓
Six-Stage Tutorial Studio
      ↓
Interactive Drawing Canvas
      ↓
Save / Download / Saved Gallery