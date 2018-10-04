const io = require('socket.io')()

io.on("connection", socket =>
{
	// User joined a room
	socket.on("join", data =>
	{
		console.log("%s joined room: %s", data.name, data.room)

		socket.join(data.room)
		socket.name = data.name
		socket.room = data.room

		// Send out to users
		io.sockets.in(socket.room).emit("enter", {
			name: socket.name
		})
	})

	// User left a room
	socket.on("disconnect", () => {
		console.log("%s left room: %s", socket.name, socket.room)

		// Send out to users
		io.sockets.in(socket.room).emit("leave", {
			name: socket.name
		})
	})

	// Someone sent a message
	socket.on("message", data => {
		console.log("%s (%s): %s", socket.name, socket.room, data)

		// Sent it out
		io.sockets.in(socket.room).emit("message", {
			name: socket.name,
			message: data
		})
	})

	// Someone modified the queue
	socket.on("video", data => {
		console.log("%s (%s): %s %s", socket.name, socket.room, data.type, data.id)

		// Send it out
		io.sockets.in(socket.room).emit("video", {
			name: socket.name,
			type: data.type,
			id: data.id,
			title: data.title
		})
	})
})
io.listen(3000)