import { useEffect, useState } from 'react';
import { io } from "socket.io-client";
import { Container, Typography, TextField, Button } from '@mui/material';

function App() {
  const [message, setMessage] = useState("")
  const socket = io('http://localhost:3000');

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
      </Container>
  )
  
}

export default App
