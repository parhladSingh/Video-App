

const { Server } = require("socket.io");

const io = new Server(8000, {
    cors: true,
});

// Tracking the email ID
const emailToSocketIdMap = new Map();
const socketidToMap = new Map();

io.on("connection", (socket) => {
    console.log(`Socket connected`, socket.id);

    socket.on("room:join", (data) => {
        const { email, room } = data;
        emailToSocketIdMap.set(email, socket.id);
        socketidToMap.set(socket.id, email);

        // Sending a message if any user is present in the room
        io.to(room).emit("user:joined", { email, id: socket.id });
        socket.join(room);
        io.to(socket.id).emit("room:join", data);
    });

    socket.on('user:call', (data) => {
        if (!data) {
            console.error('Received null or undefined data for user:call');
            return;
        }
        const { to, offer } = data;
        console.log('Received user:call with:', data);
        io.to(to).emit('incoming:call', { from: socket.id, offer });
    });

    socket.on('call:accepted', ({ to, ans }) => {
        io.to(to).emit('call:accepted', { from: socket.id, ans });
    });
    socket.on('peer:nego:needed',({to,offer})=>{
        io.to(to).emit('peer:nego:needed', { from: socket.id, offer });

    })
    socket.on('peer:nego:done',({to , ans})=>{
        io.to(to).emit('peer:nego:needed', { from: socket.id, ans });
    })
});
