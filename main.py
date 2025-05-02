from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import fitz  # PyMuPDF
import io, json, base64

app = FastAPI()

# CORS for Netlify frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/process")
async def process_pdf(pdf: UploadFile = File(...), annotations: str = Form(...)):
    input_data = await pdf.read()
    doc = fitz.open(stream=input_data, filetype="pdf")
    annots = json.loads(annotations)

    for a in annots:
        page = doc[a['page'] - 1]
        if a["type"] == "text":
            page.insert_text((a["x"], a["y"]), a["content"], fontsize=a.get("size", 12), fontname=a.get("font", "helv"))
        elif a["type"] == "check":
            page.insert_text((a["x"], a["y"]), "✔", fontsize=18)
        elif a["type"] == "xmark":
            page.insert_text((a["x"], a["y"]), "✘", fontsize=18)
        elif a["type"] == "circle":
            radius = a.get("radius", 20)
            page.draw_circle((a["x"], a["y"]), radius, color=(0, 0, 0))
        elif a["type"] == "signature":
            img_data = base64.b64decode(a["image"].split(",")[1])
            img_rect = fitz.Rect(a["x"], a["y"], a["x"] + a["width"], a["y"] + a["height"])
            page.insert_image(img_rect, stream=img_data)

    output_stream = io.BytesIO()
    doc.save(output_stream)
    output_stream.seek(0)
    return StreamingResponse(output_stream, media_type="application/pdf", headers={"Content-Disposition": "attachment; filename=flattened.pdf"})
