import React, { useState } from "react";
import axios from "axios";
import "../styles/Upload.css";
import { HiOutlineSearchCircle, HiOutlineDocumentDownload } from "react-icons/hi"; 
import { RiDeleteBin6Line } from "react-icons/ri";

const Upload = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [fileType, setFileType] = useState(null); 
  
  const [resultUrl, setResultUrl] = useState(null);
  const [excelUrl, setExcelUrl] = useState(null); 
  const [resultType, setResultType] = useState(null); 
  const [ecoSummary, setEcoSummary] = useState([]); // NEW: State for Eco-Status
  const [loading, setLoading] = useState(false);

  const handleFileChange = (selectedFile) => {
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setFileType(selectedFile.type.startsWith("video/") ? "video" : "image");
    }
  };

  function handleDrop(e) {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    handleFileChange(droppedFile);
  }

  const handleDragOver = (e) => e.preventDefault();

  const handleDetect = async () => {
    if (!file) return alert("Please upload a file first!");
    
    const formData = new FormData();
    formData.append("file", file); 
    
    try {
      setLoading(true);
      const response = await axios.post("http://127.0.0.1:5000/detect", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      setResultUrl(`${response.data.result_url}?t=${new Date().getTime()}`);
      setExcelUrl(`${response.data.excel_url}?t=${new Date().getTime()}`);
      setResultType(response.data.type);
      setEcoSummary(response.data.summary || []); // Save Eco-Status summary
    } catch (error) {
      console.error(error);
      alert("Detection failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    setPreview(null);
    setFileType(null);
    setResultUrl(null);
    setExcelUrl(null);
    setResultType(null);
    setEcoSummary([]); // Clear summary
  };

  return (
    <div className="upload-container">
      <h2>📤 Upload Media</h2>
      <p>Analyze marine environments for plastic and debris.</p>

      <div
        className="drop-area"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => document.getElementById("fileInput").click()}
      >
        {preview ? (
          fileType === "video" ? (
            <video src={preview} controls className="preview-img" style={{ maxHeight: "400px" }} />
          ) : (
            <img src={preview} alt="Preview" className="preview-img" />
          )
        ) : (
          <p>Drag & Drop or Click to Upload Image/Video</p>
        )}
      </div>

      <input
        type="file"
        id="fileInput"
        hidden
        accept="image/*,video/*"
        onChange={(e) => handleFileChange(e.target.files[0])}
      />

      <div className="button-group">
        <button className="glass-btn detect-btn" onClick={handleDetect} disabled={loading}>
          {loading ? "Processing Media..." : <><HiOutlineSearchCircle className="btn-icon pulse" /> Detect Objects</>}
        </button>

        <button className="glass-btn clear-btn" onClick={handleClear}>
          <RiDeleteBin6Line className="btn-icon" /> Clear Workspace
        </button>
      </div>

      {resultUrl && (
        <div className="result-section">
          <h3>✅ Analysis Complete</h3>
          {resultType === "video" ? (
            <video src={resultUrl} controls autoPlay className="result-img" style={{ maxHeight: "500px" }} />
          ) : (
            <img src={resultUrl} alt="Result" className="result-img" />
          )}
          
          {/* --- NEW: Eco Analysis Display --- */}
          {ecoSummary.length > 0 && (
            <div style={{ marginTop: "20px", padding: "15px", background: "rgba(0,0,0,0.3)", borderRadius: "10px", display: "inline-block", textAlign: "left" }}>
              <h4 style={{ margin: "0 0 10px 0", color: "#00d2ff" }}>🌿 Eco-Analysis Report</h4>
              <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
                {ecoSummary.map((item, index) => (
                  <li key={index} style={{ marginBottom: "5px", fontSize: "16px" }}>
                    <strong>{item.name}:</strong> {item.status}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <br/>
          {/* Download Button */}
          {excelUrl && (
            <div style={{ marginTop: "20px" }}>
              <a href={excelUrl} download className="glass-btn" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', background: 'linear-gradient(135deg, #11998e, #38ef7d)' }}>
                <HiOutlineDocumentDownload className="btn-icon" /> Download Excel Data
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Upload;