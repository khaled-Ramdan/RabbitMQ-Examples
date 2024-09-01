const amqplib = require("amqplib")

function fib(n) {
	if (n <= 1) return n
	return fib(n - 1) + fib(n - 2)
}

const queueName = "rpc_queue"

const processTask = async () => {
	const connection = await amqplib.connect("amqp://localhost")
	const channel = await connection.createChannel()
	await channel.assertQueue(queueName, {
		durable: false,
	})
	channel.prefetch(1)
	console.log(`[X] Awaiting RPC request`)

	channel.consume(
		queueName,
		(msg) => {
			const n = parseInt(msg.content.toString())
			console.log(`[.] fib(${n})`)
			const fibNum = fib(n)
			channel.sendToQueue(
				msg.properties.replyTo,
				Buffer.from(fibNum.toString()),
				{
					correlationId: msg.properties.correlationId,
				}
			)

			channel.ack(msg)
		},
		{
			noAck: false,
		}
	)
}

processTask()
