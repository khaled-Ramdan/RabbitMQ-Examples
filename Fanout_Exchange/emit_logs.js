const amqplib = require("amqplib")

const exchangeName = "logs" // specify exchange name

const msg = process.argv.slice(2).join(" ") || "1"

const sendMsg = async () => {
	const connection = await amqplib.connect("amqp://localhost")
	const channel = await connection.createChannel()
	await channel.assertExchange(exchangeName, "fanout", {
		durable: false,
	})

	channel.publish(exchangeName, "", Buffer.from(msg)) // specifying routing key makes you send it to specific queue

	console.log("send: " + msg)

	setTimeout(() => {
		connection.close()
		process.exit(0)
	}, 500)
}

sendMsg()