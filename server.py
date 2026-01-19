import requests
from fastapi import FastAPI, Request, Response
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import processing
import uvicorn

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def handle_tunnel_behavior(request: Request, call_next):
    if request.method == "OPTIONS":
        response = Response()
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, ngrok-skip-browser-warning"
        return response

    response = await call_next(request)
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["ngrok-skip-browser-warning"] = "true"
    return response

BASE_DIR = Path(__file__).resolve().parent
SAVE_FOLDER = BASE_DIR / "thumbnails"
SAVE_FOLDER.mkdir(exist_ok=True)

class YTData(BaseModel):
    title: str
    thumbnail_url: str

@app.post("/process_youtube")
async def handle_youtube_request(data: YTData):
    try:
        video_id = data.thumbnail_url.split('/vi/')[1].split('/')[0]
        filepath = SAVE_FOLDER / f"{video_id}.jpg"
        
        img_data = requests.get(data.thumbnail_url).content
        with open(filepath, "wb") as f:
            f.write(img_data)
        
        print(data.title, data.thumbnail_url)

        # AI Processing
        result_text, final_score = processing.clickbait_or_not(str(filepath), data.title)

        return {
            "status": "success",
            "summary": f"Result: {result_text}. Final Score: {final_score}"
        }
    except Exception as e:
        print(f"Error: {e}")
        return {"status": "error", "summary": str(e)}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=9870)