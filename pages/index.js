import { useEffect, useState } from "react";
import {
  Container,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
  Typography,
  Input,
} from "@mui/material";

export default function Home() {
  const [postprosessorer, setPostprosessorer] = useState([]);
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const token = localStorage.getItem("token"); // Brukerens token for autentisering

  // Hent postprosessorer og filer
  useEffect(() => {
    fetch("http://localhost:5000/api/postprosessorer")
      .then((response) => response.json())
      .then((data) => setPostprosessorer(data))
      .catch((error) => console.error("Feil ved henting av data:", error));

    fetchFiles();
  }, []);

  // Hent opplastede filer
  const fetchFiles = async () => {
    if (!token) return;
    try {
      const response = await fetch("http://localhost:5000/api/files", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setFiles(data);
    } catch (error) {
      console.error("Feil ved henting av filer:", error);
    }
  };

  // Håndter filvalg
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Last opp fil
  const handleFileUpload = async () => {
    if (!selectedFile) {
      alert("Vennligst velg en fil først");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (response.ok) {
        alert("Fil lastet opp!");
        fetchFiles(); // Oppdater fil-listen
      } else {
        alert("Feil ved opplasting");
      }
    } catch (error) {
      console.error("Feil ved filopplasting:", error);
    }
  };

  // Last ned fil
  const handleFileDownload = (filename) => {
    window.location.href = `http://localhost:5000/api/download/${filename}`;
  };

  // Slett fil
  const handleFileDelete = async (filename) => {
    const confirmDelete = window.confirm(`Er du sikker på at du vil slette ${filename}?`);
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/api/delete/${filename}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        alert("Fil slettet!");
        fetchFiles(); // Oppdater liste
      } else {
        alert("Feil ved sletting");
      }
    } catch (error) {
      console.error("Feil ved sletting av fil:", error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      {/* 📂 Filopplasting */}
      <Card variant="outlined" sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Last opp filer
          </Typography>
          <Input type="file" onChange={handleFileChange} sx={{ mr: 2 }} />
          <Button variant="contained" color="primary" onClick={handleFileUpload}>
            Last opp
          </Button>
        </CardContent>
      </Card>

      {/* 📄 Fil-liste */}
      <Card variant="outlined" sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Opplastede filer
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Filnavn</TableCell>
                  <TableCell>Opplastet dato</TableCell>
                  <TableCell>Handling</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {files.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell>{file.filename}</TableCell>
                    <TableCell>{new Date(file.uploaded_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleFileDownload(file.filename)}
                        sx={{ mr: 1 }}
                      >
                        Last ned
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleFileDelete(file.filename)}
                      >
                        Slett
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Container>
  );
}