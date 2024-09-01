const amqplib = require("amqplib")

const args = process.argv.slice(2)
const logType = args[0] || "Error"
const logMessage = args[1] || "Undefined"

const exchangeName = "headers_logs" // specify exchange name

const sendMsg = async () => {
	const connection = await amqplib.connect("amqp://localhost")
	const channel = await connection.createChannel()
	await channel.assertExchange(exchangeName, "headers", {
		durable: false,
	})

	channel.publish(exchangeName, "", Buffer.from(logMessage), {
		headers: { // put your object in the headers option
			account: "new",
			method: "google",
		},
	}) // Header exchange does not care about routing key

	console.log("send: " + logMessage)

	setTimeout(() => {
		connection.close()
		process.exit(0)
	}, 500)
}

sendMsg()
