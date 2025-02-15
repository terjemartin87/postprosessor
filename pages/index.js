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
} from "@mui/material";

export default function Home() {
  const [postprosessorer, setPostprosessorer] = useState([]);
  const [name, setName] = useState("");
  const [version, setVersion] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editVersion, setEditVersion] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/postprosessorer")
      .then((response) => response.json())
      .then((data) => setPostprosessorer(data))
      .catch((error) => console.error("Feil ved henting av data:", error));
  }, []);

  const handleAddPostprosessor = async () => {
    if (!name || !version) {
      alert("Vennligst fyll ut alle feltene");
      return;
    }

    const response = await fetch("http://localhost:5000/api/postprosessorer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, version }),
    });

    if (response.ok) {
      const newPostprosessor = await response.json();
      setPostprosessorer([...postprosessorer, newPostprosessor]);
      setName("");
      setVersion("");
    } else {
      alert("Feil ved lagring");
    }
  };

  const handleDeletePostprosessor = async (id) => {
    const response = await fetch(`http://localhost:5000/api/postprosessorer/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setPostprosessorer(postprosessorer.filter((post) => post.id !== id));
    } else {
      alert("Feil ved sletting");
    }
  };

  const handleEditPostprosessor = (post) => {
    setEditingId(post.id);
    setEditName(post.name);
    setEditVersion(post.version);
  };

  const handleSaveEdit = async (id) => {
    const response = await fetch(`http://localhost:5000/api/postprosessorer/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName, version: editVersion }),
    });

    if (response.ok) {
      const updatedPost = await response.json();
      setPostprosessorer(postprosessorer.map((post) => (post.id === id ? updatedPost : post)));
      setEditingId(null);
    } else {
      alert("Feil ved oppdatering");
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Card variant="outlined" sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Legg til ny postprosessor
          </Typography>
          <TextField
            label="Navn"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mr: 2, mb: 2 }}
          />
          <TextField
            label="Versjon"
            variant="outlined"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            sx={{ mr: 2, mb: 2 }}
          />
          <Button variant="contained" color="primary" onClick={handleAddPostprosessor}>
            Legg til
          </Button>
        </CardContent>
      </Card>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Navn</TableCell>
              <TableCell>Versjon</TableCell>
              <TableCell>Sist Oppdatert</TableCell>
              <TableCell>Handling</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {postprosessorer.map((post) => (
              <TableRow key={post.id}>
                <TableCell>{post.id}</TableCell>
                <TableCell>
                  {editingId === post.id ? (
                    <TextField
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      size="small"
                    />
                  ) : (
                    post.name
                  )}
                </TableCell>
                <TableCell>
                  {editingId === post.id ? (
                    <TextField
                      value={editVersion}
                      onChange={(e) => setEditVersion(e.target.value)}
                      size="small"
                    />
                  ) : (
                    post.version
                  )}
                </TableCell>
                <TableCell>{new Date(post.last_updated).toLocaleDateString()}</TableCell>
                <TableCell>
                  {editingId === post.id ? (
                    <Button size="small" variant="contained" color="success" onClick={() => handleSaveEdit(post.id)}>
                      Lagre
                    </Button>
                  ) : (
                    <Button size="small" variant="outlined" color="secondary" onClick={() => handleEditPostprosessor(post)}>
                      Rediger
                    </Button>
                  )}
                  <Button
                    size="small"
                    variant="contained"
                    color="error"
                    sx={{ ml: 1 }}
                    onClick={() => handleDeletePostprosessor(post.id)}
                  >
                    Slett
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}