import { Server } from "socket.io";

const io = new Server(3001, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const rooms = {};

io.on("connection", (socket) => {
  console.log("Collab User connected:", socket.id);

  socket.on("join-room", ({ roomId, user }) => {
    socket.join(roomId);
    if (!rooms[roomId]) {
      rooms[roomId] = {
        host: user.id || socket.id,
        users: [],
        config: {
          targetCar: "Maruti Suzuki Swift",
          color: "#ffffff",
          wheels: "standard",
          spoiler: "none",
          headlights: "halogen",
          windowTint: "light",
          interiorColor: "#000000"
        },
        chat: [],
        history: [] // For version undo tracking
      };
    }

    const room = rooms[roomId];
    
    // Add user if missing
    if (!room.users.find(u => u.name === user.name)) {
      room.users.push({ 
        name: user.name, 
        id: user.id || socket.id, 
        socketId: socket.id, 
        cursor: null,
        role: room.host === (user.id || socket.id) ? 'Host' : 'Collaborator'
      });
    } else {
      // Reconnect
      const u = room.users.find(u => u.name === user.name);
      u.socketId = socket.id;
    }

    socket.emit("room-state", room);
    io.to(roomId).emit("users-updated", room.users);

    const logMsg = { sender: 'System', text: `${user.name} joined the room.`, time: new Date() };
    room.chat.push(logMsg);
    io.to(roomId).emit("chat-updated", room.chat);

    socket.on("update-config", (newConfig) => {
      room.history.push(JSON.parse(JSON.stringify(room.config))); // Snapshot history
      room.config = newConfig;
      socket.to(roomId).emit("config-updated", newConfig);
    });

    socket.on("undo-history", () => {
       if (room.history.length > 0) {
         room.config = room.history.pop();
         io.to(roomId).emit("config-updated", room.config);
       }
    });

    socket.on("send-message", (msg) => {
      room.chat.push(msg);
      io.to(roomId).emit("chat-updated", room.chat);
    });

    socket.on("update-cursor", (part) => {
      const u = room.users.find(u => u.socketId === socket.id);
      if (u) {
        u.cursor = part;
        io.to(roomId).emit("cursors-updated", room.users);
      }
    });

    socket.on("disconnect", () => {
      console.log("Collab User disconnected:", socket.id);
      const u = room.users.find(u => u.socketId === socket.id);
      if (u) {
        room.users = room.users.filter(usr => usr.socketId !== socket.id);
        io.to(roomId).emit("users-updated", room.users);
        const logMsg = { sender: 'System', text: `${u.name} left the room.`, time: new Date() };
        room.chat.push(logMsg);
        io.to(roomId).emit("chat-updated", room.chat);
      }
    });
  });
});

console.log("Socket.IO Multiplayer Server successfully running on localhost:3001");
