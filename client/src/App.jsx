import { useEffect, useState } from 'react';
import { io } from "socket.io-client";
import { Container, Typography, TextField, Button } from '@mui/material';

function App() {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([]);
  // const [username, setUsername] = useState("");
  // const [isUsernameSet, setIsUsernameSet] = useState(false);

  const socket = io('https://chat-applicaton-3.onrender.com/');


  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", message);
    setMessage("")
  }

  useEffect(() => {
    
     socket.on ("connect", () => {
      console.log("Connected to server with id:", socket.id);}) // Socket id for client

    socket.on("message", (msg) => {
      const p = document.createElement("p");  // to display message in the DOM
      p.innerText = msg;
      document.body.appendChild(p);
    })

    return () => {
      socket.disconnect();
    }
  }, [])

  return (
      <Container maxWidth="sm">
        <Typography variant="h1" component="div" gutterBottom>
          Chat Application
        </Typography>
         <form onSubmit={handleSubmit}> 
          <TextField value={message} onChange={(e) => setMessage(e.target.value)}></TextField>
          <Button type="submit" variant="contained" color="primary"> Send</Button>

        </form>
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
      </Container>
  )
  
}

export default App
