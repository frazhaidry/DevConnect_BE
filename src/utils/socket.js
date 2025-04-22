const socket = require("socket.io")
const crypto = require("crypto")
const { Chat } = require("../models/chat")
const ConnectionRequestModel = require("../models/connectionRequest")

const getSecretRoomId = (userId, targetUserId) => {
  return crypto.createHash("sha256").update([userId, targetUserId].sort().join("-")).digest("hex")
}


const initializeSocket = (server) => {
   
    const io = socket(server, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"],
            credentials: true,
        }
    })
    
    io.on("connection", (socket) => {
        // Handle events

        socket.on("joinChat", ({firstName, userId, targetUserId}) => {
            const roomId = getSecretRoomId(userId, targetUserId)
            // console.log(firstName + " Joining room: ", roomId)
            socket.join(roomId)
        })

        socket.on("sendMessage", async ({
            firstName,
            userId,
            targetUserId,
            text
        }) => {
           
            try{
                const roomId = getSecretRoomId(userId, targetUserId)
                // console.log(firstName + " Sending message: ", text, " to room: ", roomId)
                io.to(roomId).emit("messageReceived", {firstName, text})
                // TODO Q can i send req to the person who is not in my friend ? yes
                // Checks if userId & targetUserId is not friends

                // ConnectionRequestModel.findOne({ fromUserId: userId, toUserId: targetUserId, status:"accepted" })





               let chat = await Chat.findOne({
                participants: { $all: [userId, targetUserId]},
               })

               if(!chat){
                 chat = new Chat({
                    participants: [userId, targetUserId],
                    messages: [],
                 })
               }


               chat.messages.push({
                senderId: userId,
                text,
               });

               await chat.save();



            } catch(error){
              console.log(error.message);
            }
        })

        socket.on("disconnect", () => {})

    })
}

module.exports = initializeSocket;