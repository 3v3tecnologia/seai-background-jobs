import { RABBIT_MQ_URL } from "./rabbitmq/connection.js";
import { RabbitMqAdapter } from "./rabbitmq/rabbitmq.js";

async function test() {
    const x = new RabbitMqAdapter(RABBIT_MQ_URL)

    const z = await x.send("irrigant", "create", { email: "davispenha@gmail.com", irrigation: [] })

    console.log(z);

    await x.disconnect()

}

test()