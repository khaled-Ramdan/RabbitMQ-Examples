const amqplib = require("amqplib")

const queueName = "khaled"

const receiveMsg = async () => {
	const connection = await amqplib.connect("amqp://localhost")
	const channel = await connection.createChannel()
	await channel.assertQueue(queueName, { durable: false })
	console.log(`Waiting for messages in queue ${queueName}`)

	channel.consume(
		queueName,
		(msg) => {
			console.log(`[X] received ${msg.content.toString()}`)
		},
		{
			noAck: true,
		}
	)
}

receiveMsg()
