import os
import cv2
import pandas as pd
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from ultralytics import YOLO

app = Flask(__name__)
CORS(app)

model = YOLO("best.pt")

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# --- NEW: Eco-Status Dictionary ---
# Maps your model's class names to their biodegradability status
BIODEGRADABLE_MAP = {
    "tire": "Non-Biodegradable ❌",
    "mask": "Non-Biodegradable ❌",
    "glove": "Non-Biodegradable ❌",
    "Mask": "Non-Biodegradable ❌",
    "pbottle": "Non-Biodegradable ❌",
    "gbottle" :"Non-Biodegradable ❌",
    "net": "Non-Biodegradable ❌",
    "plastic": "Non-Biodegradable ❌",
    "pbag": "Non-Biodegradable ❌",
    "can": "Non-Biodegradable ❌",
    "paper": "Biodegradable 🌿",
    "wood": "Biodegradable 🌿",
    "food": "Biodegradable 🌿"
}

@app.route("/detect", methods=["POST"])
def detect():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    filename = file.filename
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)

    ext = filename.rsplit('.', 1)[1].lower()
    is_video = ext in ['mp4', 'avi', 'mov', 'mkv', 'webm']
    
    detection_data = []
    base_name = filename.rsplit('.', 1)[0]
    excel_filename = f"report_{base_name}.xlsx"
    excel_path = os.path.join(UPLOAD_FOLDER, excel_filename)

    if is_video:
        result_filename = f"result_{base_name}.mp4"
        result_path = os.path.join(UPLOAD_FOLDER, result_filename)

        cap = cv2.VideoCapture(filepath)
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        fps = int(cap.get(cv2.CAP_PROP_FPS))
        
        fourcc = cv2.VideoWriter_fourcc(*'avc1')
        out = cv2.VideoWriter(result_path, fourcc, fps, (width, height))

        frame_number = 0
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret: break
            
            frame_number += 1
            results = model(frame)
            out.write(results[0].plot())

            for box in results[0].boxes:
                obj_name = model.names[int(box.cls[0])]
                detection_data.append({
                    "Frame": frame_number,
                    "Detected Object": obj_name,
                    "Eco-Status": BIODEGRADABLE_MAP.get(obj_name, "Unknown ❓"), # NEW COLUMN
                    "Confidence (%)": round(float(box.conf[0]) * 100, 2),
                    "Box X1": round(box.xyxy[0][0].item(), 2),
                    "Box Y1": round(box.xyxy[0][1].item(), 2),
                    "Box X2": round(box.xyxy[0][2].item(), 2),
                    "Box Y2": round(box.xyxy[0][3].item(), 2)
                })

        cap.release()
        out.release()
        
    else:
        results = model(filepath)
        result_img = results[0].plot()
        result_filename = f"result_{base_name}.jpg"
        result_path = os.path.join(UPLOAD_FOLDER, result_filename)
        cv2.imwrite(result_path, result_img)

        for box in results[0].boxes:
            obj_name = model.names[int(box.cls[0])]
            detection_data.append({
                "Frame": 1,
                "Detected Object": obj_name,
                "Eco-Status": BIODEGRADABLE_MAP.get(obj_name, "Unknown ❓"), # NEW COLUMN
                "Confidence (%)": round(float(box.conf[0]) * 100, 2),
                "Box X1": round(box.xyxy[0][0].item(), 2),
                "Box Y1": round(box.xyxy[0][1].item(), 2),
                "Box X2": round(box.xyxy[0][2].item(), 2),
                "Box Y2": round(box.xyxy[0][3].item(), 2)
            })

    # Save to Excel
    pd.DataFrame(detection_data).to_excel(excel_path, index=False)

    # --- NEW: Create a summary for the React Frontend ---
    unique_items = list(set([row["Detected Object"] for row in detection_data]))
    eco_summary = [{"name": item, "status": BIODEGRADABLE_MAP.get(item, "Unknown ❓")} for item in unique_items]

    return jsonify({
        "result_url": f"http://127.0.0.1:5000/uploads/{result_filename}", 
        "excel_url": f"http://127.0.0.1:5000/uploads/{excel_filename}", 
        "type": "video" if is_video else "image",
        "summary": eco_summary # Sending the summary to React
    })
# --- ADD THIS MISSING ROUTE BACK IN ---
@app.route("/uploads/<filename>")
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)
if __name__ == "__main__":
    app.run(debug=True)