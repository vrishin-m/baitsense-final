# BaitSense: AI Clickbait Detector for YouTube

BaitSense is a Chrome Extension that uses local AI processing to analyze YouTube video thumbnails and titles in real-time. It determines if a video is "Clickbait" or legitimate by sending data to a local Python server via a secure ngrok tunnel.

## Features
* **Real-time Analysis:** automatically detects when you navigate to a new video.
* **AI Processing:** Uses OpenCV and custom logic to score thumbnails.
* **Cross-Device Compatible:** Uses `ngrok` to work on any device, bypassing local network restrictions. (Currently supports only Chrome)
* **Visual Verdict:** Displays a floating popup on the video player with the result.

---

## Prerequisites

Before you begin, ensure you have the following installed:
* **Python 3.8+** ([Download](https://www.python.org/downloads/))
* **Google Chrome** (or Brave/Edge)
* **ngrok** (Free account required - [Download](https://ngrok.com/download))

---

## Installation & Setup

### 1. Backend Setup (Python)
1.  Clone or download this repository.
2.  Open a terminal in the project folder.
3.  Install the required libraries:
    ```bash
    pip install fastapi uvicorn requests opencv-python numpy pydantic
    ```
4.  Ensure you have your AI logic file named `processing.py` in the same folder.

### 2. Network Setup (ngrok)
To allow the Chrome extension to talk to your local Python server securely, we use ngrok.

1.  Open a **new** terminal window.
2.  Start the tunnel on port 8000: (Make sure you have set up ngrok, visit Ngrok Docs)
    ```bash
    ngrok http 9870
    ```
3.  **Copy the Forwarding URL** shown in the terminal.
    * *Example:* `https://a1b2-c3d4.ngrok-free.app`

### 3. Extension Setup
1.  Open `content.js` in a text editor.
2.  Find the `NGROK_BASE_URL` variable at the top and paste your ngrok URL:
    ```javascript
    const NGROK_BASE_URL = '[https://your-id.ngrok-free.app](https://your-id.ngrok-free.app)'; 
    // (Do not add a trailing slash)
    ```
3.  Open `manifest.json` and ensure your ngrok domain is allowed in permissions:
    ```json
    "host_permissions": [
      "https://*.ngrok-free.app/*",
      "https://*.ngrok-free.dev/*",
      "[https://www.youtube.com/](https://www.youtube.com/)*"
    ]
    ```

---

## How to Run

1.  **Start the Python Server:**
    ```bash
    python server.py
    ```
    *(You should see "Uvicorn running on http://127.0.0.1:9870")*

2.  **Ensure ngrok is running:**
    *(Keep the terminal with `ngrok http 9870` open)*

3.  **Load the Extension:**
    * Open Chrome and go to `chrome://extensions`.
    * Toggle **Developer Mode** (top right).
    * Click **Load Unpacked**.
    * Select your project folder.

4.  **Initialize the Connection (Important!):**
    * Open your ngrok URL (`https://....ngrok-free.app`) in a new browser tab.
    * If you see a blue "Visit Site" warning page, **click "Visit Site"**.
    * Once you see `{"detail":"Not Found"}`, the connection is ready.

5.  **Test:**
    * Go to YouTube and click any video.
    * Watch your Python terminal for logs (`📥 Received: Video Title...`).

---

## Authors
    Vrishin M (Complete Project)
    Mithun Kartick (Last minute fixes)
---


## 📂 Project Structure

```text
BaitSense/
├── server.py           # FastAPI Backend (Run this to start)
├── processing.py       # AI Logic (OpenCV/Numpy)
├── extension           # Extension Related Files (manifest.json, content.js, /images)
└── thumbnails/         # Folder where images are saved temporarily

