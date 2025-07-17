import { useEffect, useState, useRef } from 'react';
import { io } from "socket.io-client";
import { Container, Typography, TextField, Button } from '@mui/material';

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);  // UseRef to persist socket connection

  useEffect(() => {
    // Create socket connection once
    console.log("Attempting to connect to socket server at /api");
    socketRef.current = io('/api', {
      withCredentials: true
    });

    socketRef.current.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
      if (err.message) {
      console.error("Error message:", err.message);
      }
      if (err.description) {
      console.error("Error description:", err.description);
      }
      if (err.context) {
      console.error("Error context:", err.context);
      }
    });

    socketRef.current.on("disconnect", (reason) => {
      console.warn("Socket disconnected. Reason:", reason);
    });

    // Log connection
    socketRef.current.on("connect", () => {
      console.log("Connected to server with id:", socketRef.current.id);
    });

    // Handle incoming message
    socketRef.current.on("message", (msg) => {
      setMessages((prev) => [...prev, msg]);  // Use React state
    });

    // Cleanup
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() !== "") {
      socketRef.current.emit("message", message);
      setMessage("");
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="div" gutterBottom>
        Chat Application
      </Typography>

      <div style={{
        height: "300px",
        overflowY: "auto",
        border: "1px solid #ccc",
        padding: "10px",
        marginBottom: "20px",
        borderRadius: "5px",
        background: "white"
      }}>
        {messages.map((msg, index) => (
          <Typography key={index} variant="body1">{msg}</Typography>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          variant="outlined"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message"
        />
        <Button type="submit" variant="contained" color="primary" style={{ marginTop: "10px" }}>
          Send
        </Button>
      </form>
    </Container>
  );
}

export default App;
