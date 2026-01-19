

const NGROK_BASE_URL = 'https://unpersonifying-proappropriation-jackie.ngrok-free.dev';

let lastProcessedId = "";
const ENDPOINT = '/process_youtube';

async function initiateAIScript() {
    const urlParams = new URLSearchParams(window.location.search);
    const currentVideoId = urlParams.get('v');

    if (!currentVideoId || currentVideoId === lastProcessedId) return;

    let titleElement = null;
    for (let i = 0; i < 20; i++) {
        titleElement = document.querySelector('h1.ytd-watch-metadata yt-formatted-string');
        if (titleElement && titleElement.innerText.trim().length > 0) {
            break;
        }
        await new Promise(r => setTimeout(r, 500));
    }

    if (titleElement) {
        lastProcessedId = currentVideoId;
        const videoTitle = titleElement.innerText;
        const thumbnailUrl = `https://img.youtube.com/vi/${currentVideoId}/maxresdefault.jpg`;

        console.log("Starting analysis for video: " + videoTitle);
        renderPopup("AI analyzing...", "Sending data to remote Python server...", "loading");

        try {
            const response = await fetch(`${NGROK_BASE_URL}${ENDPOINT}`, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                },
                body: JSON.stringify({
                    title: videoTitle,
                    thumbnail_url: thumbnailUrl
                })
            });

            if (!response.ok) {
                throw new Error(`Server returned ${response.status}`);
            }

            const data = await response.json();
            renderPopup("AI Result", data.summary, "success");
        } catch (error) {
            renderPopup("Connection Error", "Could not reach the Python server via ngrok.", "error");
            console.error("Failed to connect to server: " + error);
        }
    }
}

// Listen for navigation events
window.addEventListener('yt-navigate-finish', initiateAIScript);

function renderPopup(title, message, status) {
    let popup = document.getElementById('py-ai-popup');
    if (!popup) {
        popup = document.createElement('div');
        popup.id = 'py-ai-popup';
        document.body.appendChild(popup);
    }

    const statusColors = {
        loading: "#3ea6ff",
        success: "#2ecc71",
        error: "#e74c3c"
    };

    Object.assign(popup.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '400px',
        backgroundColor: '#1f1f1f',
        color: 'white',
        padding: '15px',
        borderRadius: '10px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        zIndex: '10000',
        fontFamily: 'Roboto, Arial, sans-serif',
        borderLeft: `5px solid ${statusColors[status] || "#fff"}`
    });

    popup.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
            <b style="color:${statusColors[status]}">${title}</b>
            <span onclick="this.parentElement.parentElement.remove()" style="cursor:pointer; opacity:0.6;">✕</span>
        </div>
        <div style="font-size:14px; margin-top:8px; line-height:1.4;">${message}</div>
    `;
}