const amqplib = require("amqplib")

const args = process.argv.slice(2)
if (args.length == 0) {
	console.log("Error: Wrong arguments")
	console.log(
		"Usage:  node direct_exchange/receive_logs_direct.js [info] [warning] [error] "
	)
	process.exit(1)
}

const exchangeName = "headers_logs"

const receiveMsg = async () => {
	const connection = await amqplib.connect("amqp://localhost")
	const channel = await connection.createChannel()
	await channel.assertExchange(exchangeName, "headers", {
		durable: false,
	})
	const q = await channel.assertQueue("", {
		exclusive: true, // once this connection closes, the queue will be deleted.
	})

	console.log("Wating for messages in queue " + q.queue)

	channel.bindQueue(q.queue, exchangeName, "", {
		account: "new",
		method: "facebook",
		"x-match": "any", // this will match any property
	}) // bindkey is not important here

	channel.consume(
		q.queue,
		(msg) => {
			if (msg.content)
				console.log(
					"routing key: ",
					JSON.stringify(msg.properties.headers),
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
