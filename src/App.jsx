import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { collection, addDoc, query, onSnapshot, doc, deleteDoc, where } from "firebase/firestore";
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { db, auth } from "./components/firebase";
import './App.css';
import Todo from './components/Todo';
import Register from "./pages/Register";

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const q = query(collection(db, "todos"), where("userId", "==", currentUser.uid));
        const unsubscribeTodos = onSnapshot(q, (querySnapshot) => {
          const todosArray = [];
          querySnapshot.forEach((doc) => {
            todosArray.push({ ...doc.data(), id: doc.id });
          });
          setTodos(todosArray);
        });
        return () => unsubscribeTodos();
      } else {
        setTodos([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      setMessage("User logged in successfully");
    } catch (error) {
      console.error("Error logging in with Google:", error);
      setMessage(`Error logging in with Google: ${error.message}`);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setMessage("User logged out successfully");
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (input && user) {
      await addDoc(collection(db, "todos"), { text: input, userId: user.uid });
      setInput("");
      setMessage("To-do added successfully");
    }
  };

  const deleteTodo = async (id) => {
    await deleteDoc(doc(db, "todos", id));
    setMessage("To-do deleted successfully");
  };

  return (
    <Router>
      <div className="App">
        <h1>Real Time To-do App</h1>
        {message && <p>{message}</p>}
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/" element={
            user ? (
              <>
                <button onClick={handleLogout}>Logout</button>
                <form onSubmit={addTodo}>
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter a to-do"
                  />
                  <button type="submit">Add To-do</button>
                </form>
                <ul>
                  {todos.map((todo) => (
                    <Todo key={todo.id} todo={todo} onDelete={deleteTodo} />
                  ))}
                </ul>
              </>
            ) : (
              <>
                <div className="googleLogin">
                  <h2>Login with Google</h2>
                  <button onClick={handleGoogleLogin}>Login with Google</button>
                </div>
                <div className="userLogin">
                  <h2>Account Create</h2>
                  <Link to="/register">Register</Link>
                </div>
              </>
            )
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
