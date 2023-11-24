// WebSocketComponent.jsx
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const WebSocketComponent = () => {
  const [socket, setSocket] = useState(null);
  const [ltpData, setLtpData] = useState({});

  useEffect(() => {
    // Connect to the WebSocket server
    const newSocket = io('wss://functionup.fintarget.in/ws?id=fintarget-functionup');

    // Set up event listeners for receiving LTP messages
    newSocket.on('connect', () => {
      console.log('WebSocket connection opened');
      // Fetch LTP data immediately after connecting
      newSocket.emit('getLtp');
    });

    newSocket.on('disconnect', () => {
      console.log('WebSocket connection closed');
    });

    newSocket.on('ltp', (message) => {
      // Handle incoming LTP messages
      const parsedData = JSON.parse(message);
      setLtpData((prevData) => ({ ...prevData, ...parsedData }));
    });

    // Save the socket instance in state
    setSocket(newSocket);

    // Clean up the WebSocket connection when the component is unmounted
    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    // Set up an interval to fetch LTP data from the server every 1 second
    const intervalId = setInterval(() => {
      // Fetch LTP data from the server by emitting 'getLtp' event
      if (socket) {
        socket.emit('getLtp');
      }
    }, 1000);

    // Clean up the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, [socket]);

  return (
    <div>
      <h1>WebSocket Example using socket.io</h1>
      <Navbar ltpData={ltpData} />
    </div>
  );
};

const Navbar = ({ ltpData }) => {
  return (
    <nav>
      <h2>Last Traded Prices:</h2>
      <ul>
        <li>Nifty: {ltpData.Nifty}</li>
        <li>BankNifty: {ltpData.BankNifty}</li>
        <li>FinNifty: {ltpData.FinNifty}</li>
      </ul>
    </nav>
  );
};

export default WebSocketComponent;
