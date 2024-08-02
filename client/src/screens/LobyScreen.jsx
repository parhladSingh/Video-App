// import React, {useState , useCallback,useEffect} from 'react'
// import { useSocket } from "../Context/SocketProvider"
// import {useNavigate} from "react-router-dom"

// const LobyScreen = () => {
//   const [email, setEmail] = useState("");
//   const [room, setRoom] = useState("");

//   const socket = useSocket();
//   const navigate = useNavigate()
 
//   const handleSubmitForm = useCallback((e)=>{
//     e.preventDefault();
//     socket.emit("room:join",{email,room});

//    },
//    [email,room,socket]
  
//   );
//   const handleJoinRoom = useCallback((data)=>{
//     const {email,room } = data;
//     navigate(`/room/${room}`);
//   },[navigate])

//   //this effect calls the data from the backend
//   useEffect(()=>{
//     socket.on('room:join',handleJoinRoom)
//       // console.log(`Data from Backend ${data}`)
//       return ()=>{
//         socket.off('room:join',handleJoinRoom)
//       }
//     },[socket,handleJoinRoom])

//   return (
//     <div>
//       <h1>Loby</h1>
//       <form action="" onSubmit={handleSubmitForm}>
//         <label htmlFor="email">Email ID</label>
//         <input type="email"  id='email' value={email} onChange={(e)=> setEmail(e.target.value)}/>
//         <br />
//         <label htmlFor="room no">Room no.</label>
//         <input type="text" id='room' value={room} onChange={(e)=> setRoom(e.target.value)} />
//         <br />
//         <button>Join</button>
//       </form>
//     </div>
//   )
// }

// export default LobyScreen



import React, { useState, useCallback, useEffect } from 'react';
import { useSocket } from '../Context/SocketProvider';
import { useNavigate } from 'react-router-dom';

const LobyScreen = () => {
  const [email, setEmail] = useState('');
  const [room, setRoom] = useState('');

  const socket = useSocket();
  const navigate = useNavigate();

  const handleSubmitForm = useCallback((e) => {
    e.preventDefault();
    socket.emit('room:join', { email, room });
  }, [email, room, socket]);

  const handleJoinRoom = useCallback((data) => {
    const { room } = data;
    navigate(`/room/${room}`);
  }, [navigate]);

  useEffect(() => {
    socket.on('room:join', handleJoinRoom);
    return () => {
      socket.off('room:join', handleJoinRoom);
    };
  }, [socket, handleJoinRoom]);

  return (
    <div>
      <h1>Lobby</h1>
      <form onSubmit={handleSubmitForm}>
        <label htmlFor="email">Email ID</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <label htmlFor="room">Room no.</label>
        <input
          type="text"
          id="room"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <br />
        <button type="submit">Join</button>
      </form>
    </div>
  );
};

export default LobyScreen;
