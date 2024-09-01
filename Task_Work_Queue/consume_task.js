const amqplib = require("amqplib")

const queueName = "task"

const receiveMsg = async () => {
	const connection = await amqplib.connect("amqp://localhost")
	const channel = await connection.createChannel()
	await channel.assertQueue(queueName, { durable: true })
	channel.prefetch(1)  //  limit the number of unacknowledged messages on a channel (or connection) when consuming 
	console.log(`Waiting for messages in queue ${queueName}`)

	channel.consume(
		queueName,
		(msg) => {
			const secs = Number(msg.content.toString()) || 1
			console.log(secs)
			console.log(`[X] received ${msg.content.toString()}`)
			setTimeout(() => {
				console.log("task is done with ", secs)
				channel.ack(msg)
			}, secs * 1000)
		},
		{
			noAck: false,
		}
	)
}

receiveMsg()
