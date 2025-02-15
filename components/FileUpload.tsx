import { useState } from "react";
import axios from "axios";

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Velg en fil først!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage("Fil lastet opp!");
    } catch (err) {
      setMessage("Feil ved opplasting");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Last opp en fil</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Last opp</button>
      {message && <p>{message}</p>}
    </div>
  );
}