# API Documentation

The backend exposes a simple, high-speed RESTful JSON API to fetch and modify portfolio components.

---

## 1. Projects Endpoints

### `GET /api/projects`
Returns the active array of projects.
- **Response Format**: `JSON Array`
- **Sample Payload**:
  ```json
  [
    {
      "id": "proj_1",
      "title": "Documentary Campaign",
      "desc": "High-impact narrative compilation.",
      "client": "AmoNatural",
      "link": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "thumbnail": "/assets/case-thumb-01.webp",
      "aspectRatio": "16:9",
      "niche": "educational",
      "type": "video"
    }
  ]
  ```

### `POST /api/projects`
Overwrites the projects database.
- **Request Headers**: `Content-Type: application/json`
- **Request Body**: `JSON Array` (must match the projects schema)
- **Response Format**: `JSON Object`
- **Sample Response**:
  ```json
  { "success": true, "message": "Projects configuration synchronized successfully." }
  ```

---

## 2. Site Configuration Endpoints

### `GET /api/site`
Returns the global copy of site texts, sections, and video progressions.
- **Response Format**: `JSON Object`
- **Sample Payload**:
  ```json
  {
    "hero": {
      "statusText": "Available for Freelance",
      "titleNormal": "Cinematic",
      "titleGradient": "Storytelling"
    },
    "progressions": [
      {
        "id": "prog_1",
        "niche": "realestate",
        "label": "Real Estate",
        "rawVideo": "https://youtu.be/...",
        "editVideo": "https://youtu.be/...",
        "sfxColorVideo": "https://youtu.be/...",
        "finalVideo": "https://youtu.be/..."
      }
    ]
  }
  ```

### `POST /api/site`
Overwrites the site configuration.
- **Request Headers**: `Content-Type: application/json`
- **Request Body**: `JSON Object` (containing updated configuration parameters)
- **Response Format**: `JSON Object`
- **Sample Response**:
  ```json
  { "success": true, "message": "Site configuration saved and written to database." }
  ```

---

## 3. Media Upload Endpoint

### `POST /api/upload`
Uploads raw graphic thumbnails to local server files.
- **Request Content Type**: `multipart/form-data`
- **Form Field**: `file` (single visual file)
- **Response Format**: `JSON Object`
- **Sample Response**:
  ```json
  {
    "success": true,
    "filePath": "/uploads/171234567890-thumbnail.png"
  }
  ```
