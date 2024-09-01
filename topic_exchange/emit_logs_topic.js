const amqplib = require("amqplib")

const args = process.argv.slice(2)
const logType = args[0] || "Error"
const logMessage = args[1] || "Undefined"

const exchangeName = "topic_logs" // specify exchange name

const sendMsg = async () => {
	const connection = await amqplib.connect("amqp://localhost")
	const channel = await connection.createChannel()
	await channel.assertExchange(exchangeName, "topic", {
		durable: false,
	})

	channel.publish(exchangeName, logType, Buffer.from(logMessage)) // specifying routing key makes you send it to specific queue

	console.log("send: " + logMessage)

	setTimeout(() => {
		connection.close()
		process.exit(0)
	}, 500)
}

sendMsg()