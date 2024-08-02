import React, { useEffect, useCallback, useState } from 'react';
import ReactPlayer from 'react-player'
import { useSocket } from '../Context/SocketProvider';
import peer from '../service/peer';

const RoomPage = () => {
    const socket = useSocket();
    const [remoteSocketId, setRemoteSocketId] = useState(null)
    const [myStream, setMyStream] = useState();
    const [remoteStream, setRemoteStream] = useState();

    const handleUserJoined = useCallback(({ email, id }) => {
        console.log(`Email ${email} joined room`)
        setRemoteSocketId(id)
    }, [])

    //calling user 
    const handleCallUser = useCallback(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
        });
        const offer = await peer.getOffer();
        socket.emit("user:call", { to: remoteSocketId, offer });
        setMyStream(stream)
    }, [remoteSocketId, socket]);


    const handleIncomingCall = useCallback(async ({ from, offer }) => {
        setRemoteSocketId(from);
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
        });
        setMyStream(stream)
        console.log(`Incoming Call`, from, offer);
        const ans = await peer.getAnswer(offer)
        socket.emit("call:accepted", { to: from, ans })
    }, [socket])

    const sendStreams = useCallback(() => {
        for (const track of myStream.getTracks()) {
          peer.peer.addTrack(track, myStream);
        }
      }, [myStream]);


    const handleCallAccepted = useCallback(({ from, ans }) => {
        peer.setLocalDescription(ans)
        console.log("Call Accepted")
        sendStreams()
       
    }, [sendStreams])

    const handleNegoNeeded = useCallback(async () => {
        const offer = await peer.getOffer();
        socket.emit('peer:nego:needed', { offer, to: remoteSocketId })
    })

    useEffect(() => {
        peer.peer.addEventListener('negotiationneeded', handleNegoNeeded)
    }, [])

    const handleNegoNeedIncoming = useCallback(async(from,offer)=>{
        const ans = await peer.getAnswer(offer);
        socket.emit('peer:nego:done',{to:from , ans})

    },[socket])

    const handleNegoNeedFinal = useCallback(async({ans})=>{
       await peer.setLocalDescription(ans)
    },[])

    useEffect(() => {
        peer.peer.addEventListener('track', async ev => {
            const remoteStream = ev.streams;
            console.log('GOT TRACKS!!')
            setRemoteStream(remoteStream[0])

        });
    })

    useEffect(() => {
        socket.on("user:joined", handleUserJoined);
        socket.on('incoming:call', handleIncomingCall)
        socket.on('call:accepted', handleCallAccepted)
        socket.on('peer:nego:needed', handleNegoNeedIncoming)
        socket.on('peer:nego:final', handleNegoNeedFinal)

        return () => {
            socket.off('user:joined', handleUserJoined)
            socket.off('incoming:call', handleIncomingCall)
            socket.off('call:accepted', handleCallAccepted)
            socket.off('peer:nego:needed', handleNegoNeedIncoming)
            socket.off('peer:nego:final', handleNegoNeedFinal)

        }
    }, [socket, handleUserJoined]);

    return (
        <div>
            <h1>Room Page</h1>
            <h4>{remoteSocketId ? 'Connected' : 'No one in room'}</h4>
            {myStream && <button onClick={sendStreams}>Send Stream</button>}
            {remoteSocketId && <button onClick={handleCallUser}>CALL</button>}
            {
                myStream && (
                    <>
                        <h1>my Stream</h1>

                        <ReactPlayer playing muted height="200px" width="300px" url={myStream} /></>

                )}
            {
                remoteStream && (
                    <>
                        <h1>Remote Stream</h1>
                        <ReactPlayer playing muted height="200px" width="300px" url={remoteStream} /></>

                )}
        </div>
    );
};

export default RoomPage;


// import React, { useEffect, useCallback, useState } from 'react';
// import ReactPlayer from 'react-player';
// import { useSocket } from '../Context/SocketProvider';
// import peer from '../service/peer';

// const RoomPage = () => {
//     const socket = useSocket();
//     const [remoteSocketId, setRemoteSocketId] = useState(null);
//     const [myStream, setMyStream] = useState();
//     const [remoteStream, setRemoteStream] = useState();

//     const handleUserJoined = useCallback(({ email, id }) => {
//         console.log(`Email ${email} joined room`);
//         setRemoteSocketId(id);
//     }, []);

//     // Calling a user
//     const handleCallUser = useCallback(async () => {
//         const stream = await navigator.mediaDevices.getUserMedia({
//             audio: true,
//             video: true,
//         });
//         const offer = await peer.getOffer();
//         console.log('Emitting user:call with:', { to: remoteSocketId, offer });
//         socket.emit("user:call", { to: remoteSocketId, offer });  // Corrected here
//         setMyStream(stream);
//     }, [remoteSocketId, socket]);

//     const handleIncomingCall = useCallback(async ({ from, offer }) => {
//         setRemoteSocketId(from);
//         const stream = await navigator.mediaDevices.getUserMedia({
//             audio: true,
//             video: true,
//         });
//         setMyStream(stream);
//         console.log(`Incoming Call`, from, offer);
//         const ans = await peer.getAnswer(offer);
//         socket.emit("call:accepted", { to: from, ans });
//     }, [socket]);

//     const handleCallAccepted = useCallback(({ from, ans }) => {
//         peer.setLocalDescription(ans);
//         console.log("Call Accepted");
//         for (const track of myStream.getTracks()) {
//             peer.peer.addTrack(track, myStream);
//         }
//     }, [myStream]);

//     useEffect(() => {
//         peer.peer.addEventListener('track', async ev => {
//             const remoteStream = ev.streams;
//             setRemoteStream(remoteStream);
//         });
//     }, []);

//     useEffect(() => {
//         socket.on("user:joined", handleUserJoined);
//         socket.on('incoming:call', handleIncomingCall);
//         socket.on('call:accepted', handleCallAccepted);

//         return () => {
//             socket.off('user:joined', handleUserJoined);
//             socket.off('incoming:call', handleIncomingCall);
//             socket.off('call:accepted', handleCallAccepted);
//         };
//     }, [socket, handleUserJoined]);

//     return (
//         <div>
//             <h1>Room Page</h1>
//             <h4>{remoteSocketId ? 'Connected' : 'No one in room'}</h4>
//             {remoteSocketId && <button onClick={handleCallUser}>CALL</button>}
//             {
//                 remoteStream && (
//                     <>
//                         <h1>Remote Stream</h1>
//                         <ReactPlayer playing muted height="200px" width="300px" url={URL.createObjectURL(remoteStream)} />
//                     </>
//                 )
//             }
//         </div>
//     );
// };

// export default RoomPage;
