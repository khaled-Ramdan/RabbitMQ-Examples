const amqplib = require("amqplib")

const args = process.argv.slice(2)
if (args.length == 0) {
	console.log("Error: Wrong arguments")
	console.log(
		"Usage:  node direct_exchange/receive_logs_direct.js [info] [warning] [error] "
	)
	process.exit(1)
}

const exchangeName = "direct_logs"

const receiveMsg = async () => {
	const connection = await amqplib.connect("amqp://localhost")
	const channel = await connection.createChannel()
	await channel.assertExchange(exchangeName, "direct", {
		durable: false,
	})
	const q = await channel.assertQueue("", {
		exclusive: true, // once this connection closes, the queue will be deleted.
	})

	console.log("Wating for messages in queue " + q.queue)

	args.forEach((bindKey) => channel.bindQueue(q.queue, exchangeName, bindKey)) // It binds the queue with the exchange with more than one bind key.

	channel.consume(
		q.queue,
		(msg) => {
			if (msg.content)
				console.log(
					"routing key: ",
					msg.fields.routingKey,
					"The message is: ",
					msg.content.toString()
				)
		},
		{
			noAck: true,
		}
	)
}

receiveMsg()
