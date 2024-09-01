const amqplib = require("amqplib")

const queueName = "khaled"
const msg = "hello khaled hi how are you?"

const sendMsg = async () => {
	const connection = await amqplib.connect("amqp://localhost")
	const channel = await connection.createChannel()
	await channel.assertQueue(queueName, {
		durable: false, // when true, if restart => queue is created once again . it checks if there a queue or not
	})

	// by default, the extachange type is direct exchange
	channel.sendToQueue(queueName, Buffer.from(msg))

	console.log(`sent : ${msg}`)

	setTimeout(() => {
		connection.close()
		process.exit(0)
	}, 500)
}

sendMsg()
