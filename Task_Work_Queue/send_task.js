const amqplib = require("amqplib")

const queueName = "task"
const msg = process.argv.slice(2).join(" ") || "1"
console.log(msg)

const sendMsg = async () => {
	const connection = await amqplib.connect("amqp://localhost")
	const channel = await connection.createChannel()
	await channel.assertQueue(queueName, {
		durable: true, // if rest art => queue is created once again 
	})

	// by default, the extachange type is direct exchange
	channel.sendToQueue(queueName, Buffer.from(msg), {
        persistent: true, // if our instance of the queue restart it will still have the messsage
    })

	console.log(`sent : ${msg}`)

	setTimeout(() => {
		connection.close()
		process.exit(0)
	}, 500)
}

sendMsg()
