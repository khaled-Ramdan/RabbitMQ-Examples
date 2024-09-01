const amqplib = require("amqplib")

const exchangeName = "logs"

const receiveMsg = async () => {
	const connection = await amqplib.connect("amqp://localhost")
	const channel = await connection.createChannel()
	await channel.assertExchange(exchangeName, "fanout", {
		durable: false,
	})
	const q = await channel.assertQueue("", {
		exclusive: true, // once this connection closes, the queue will be deleted. 
	})

	console.log("Wating for messages in queue " + q.queue)

	channel.bindQueue(q.queue, exchangeName, "") // fanout ignore routing key (pattern) = put it blank ""

	channel.consume(
		q.queue,
		(msg) => {
			if (msg.content) console.log("The message is: ", msg.content.toString())
		},
		{
			noAck: true,
		}
	)
}

receiveMsg()
