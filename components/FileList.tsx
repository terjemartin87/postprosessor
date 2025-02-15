import { useEffect, useState } from "react";
import axios from "axios";

export default function FileList() {
  const [files, setFiles] = useState<string[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/files", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFiles(response.data.files);
      } catch (err) {
        setError("Kunne ikke hente filer");
      }
    };
    fetchFiles();
  }, []);

  const handleDownload = (filename: string) => {
    const token = localStorage.getItem("token");
    window.location.href = `http://localhost:5000/api/download/${filename}?token=${token}`;
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Opplastede filer</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {files.map((file) => (
          <li key={file}>
            {file} <button onClick={() => handleDownload(file)}>Last ned</button>
          </li>
        ))}
      </ul>
    </div>
  );
}