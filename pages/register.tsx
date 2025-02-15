import { useState } from "react";
import axios from "axios";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/register", { username, password });
      localStorage.setItem("token", response.data.token);
      alert("Registrering vellykket!");
    } catch (err) {
      setError("Brukernavn er allerede tatt");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Registrer</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input type="text" placeholder="Brukernavn" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Passord" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleRegister}>Registrer</button>
    </div>
  );
}