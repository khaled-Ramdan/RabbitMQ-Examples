const amqplib = require("amqplib")
const { v4: uid } = require("uuid")

const args = process.argv.slice(2)
if (args.length == 0) {
	console.log("Usage rpc_client.js num")
	process.exit(1)
}

const num = parseInt(args[0]),
	id = uid()

const sendMsg = async () => {
	const connection = await amqplib.connect("amqp://localhost")
	const channel = await connection.createChannel()
	const q = await channel.assertQueue("", {
		exclusive: true,
	})
	console.log(`[X] Requesting fib(${num})`)

	channel.sendToQueue("rpc_queue", Buffer.from(num.toString()), {
		replyTo: q.queue,
		correlationId: id,
	}) // get all data client sends



	channel.consume(
		q.queue,
		(msg) => {
			if (msg.properties.correlationId == id) {
				console.log(`[.] requesting fib(${num}) result : ${msg.content}`)

				setTimeout(() => {
					connection.close()
					process.exit(0)
				}, 500)
			}
		},
		{ noAck: true }
	)
}

sendMsg()
