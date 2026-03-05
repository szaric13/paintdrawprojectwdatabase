# Project Description – Collaborative Drawing Application
This project is a full-stack web application that allows users to create, edit, and manage digital drawings with real-time collaboration.

Users can register and log in using JWT-based authentication. Credentials are validated (username 2–32 characters, password 8–128 characters), and tokens are stored using Pinia with localStorage for protected route access.

The drawing editor enables users to create new drawings, load existing ones, and modify them using tools such as an eraser and canvas resizing (limits [1,24], preserving content). Drawings are saved via POST and updated via PATCH requests. Only the author can permanently save or modify a drawing.

The gallery displays all saved drawings with pagination, filtering by author, thumbnails, and delete/edit options with confirmation for destructive actions.

The system also supports real-time collaborative drawing — multiple users can edit the same canvas simultaneously and see each other’s cursors in real time.
