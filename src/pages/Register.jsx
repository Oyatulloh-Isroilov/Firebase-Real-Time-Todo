import React, { useState } from "react";
import { auth } from "../components/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setMessage("Password should be at least 6 characters long");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setMessage("User registered successfully");
      navigate("/"); // Redirect to the main page after successful registration
    } catch (error) {
      console.error("Error registering:", error);
      setMessage(`Error registering: ${error.message}`);
    }
  };

  return (
    <div className="register">
      <h2>Register</h2>
      {message && <p>{message}</p>}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password"
      />
      <input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirm your password"
      />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}

export default Register;
