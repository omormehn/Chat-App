import { useState, useEffect } from 'react'
import io from "socket.io-client";

console.log('som')
const socket = io("http://localhost:5000");
console.log("some", socket);
function App() {

   const [name, setName] = useState("");
   const [message, setMessage] = useState("");
   const [messages, setMessages] = useState([]);


   useEffect(() => {
    socket.on('message', (message) => {
      setMessages((messages) => [...messages, message]);
    })
   }, []);

   const handleSubmit = (event) => {
    event.preventDefault();
    if (name && message) {
      socket.emit('sendMessage', {name, message});
      setName('');
      setMessage('');
    }
   }


  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          placeholder="Your name"
          onChange={(event) => setName(event.target.value)}
        />
        <input
          type="text"
          value={message}
          placeholder="Your message"
          onChange={(event) => setMessage(event.target.value)}
        />
        <button type="submit">Send</button>
      </form>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>
            {message.name}: {message.message}
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;
