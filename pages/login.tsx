import { useState } from "react";
import axios from "axios";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/login", { username, password });
      localStorage.setItem("token", response.data.token);
      alert("Innlogging vellykket!");
    } catch (err) {
      setError("Feil brukernavn eller passord");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Logg inn</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input type="text" placeholder="Brukernavn" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Passord" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Logg inn</button>
    </div>
  );
}