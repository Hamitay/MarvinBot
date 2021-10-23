import amqp, { ConsumeMessage } from "amqplib";
import { downloadVideo } from "../video/VideoDownloader";
import VideoService from "../video/VideoService";
import crypto from "crypto";

const QUEUE_HOST = process.env.QUEUE_HOST || "localhost";

const QUEUE_NAME = "MarvinVideoEvents";

const RETRY_AMOUNT_HEADERS = "x-retry"
const MAX_RETRIES_AMOUNT = 10;
interface MarvinNewVideoEvent {
    videoId: number,
    messageId: string,
}

const connectToChannel = async () => {
    console.log("Attempting to connect to rabbitMq in " + QUEUE_HOST)
    const connection = await amqp.connect({ hostname: QUEUE_HOST, port: 5672, heartbeat: 20})
    console.log("Connected to rabbitMq")
    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: false })

    return channel;
}

export const setUpConsumer = async () => {
    const channel = await connectToChannel();
    await channel.consume(QUEUE_NAME, handleEvent(channel), { noAck: false })
}

export const publishNewVideoMarvinEvent = (videoId: number) => {
    const message = buildMessage(videoId);
    publishMessage(message);
}

const buildMessage = (videoId: number): MarvinNewVideoEvent => {
    const messageId = crypto.randomBytes(20).toString("hex");
    return {
        videoId,
        messageId
    }
}

const publishMessage = async (message: MarvinNewVideoEvent, numberOfRetries = 0) => {
    const channel = await connectToChannel();
    try {
        await channel.sendToQueue(QUEUE_NAME,
            Buffer.from(JSON.stringify(message)),
            {
                persistent: true, 
                headers: {
                    [RETRY_AMOUNT_HEADERS]: numberOfRetries
                }
            });

        console.log(`Published ${message.messageId} to queue`);

    } catch (error) {
        console.log(`Error publishing ${message.messageId} to queue`);
        console.error(error);
    }
}

const handleEvent = (channel: amqp.Channel) => async (msg: ConsumeMessage | null) => {
    if (msg) {
        const rawMessage = msg.content.toString();
        const messageBody = JSON.parse(rawMessage) as MarvinNewVideoEvent;
        console.log(`Received message: ${messageBody.messageId}`);

        try {
            const video = await VideoService.getVideoById(messageBody.videoId)
            await downloadVideo(video.id, video.name, video.thirdPartyUrl, messageBody.messageId);
        } catch (error) {
            console.error(error)

            // TO DO improve dead lettering
            const retries = msg.properties.headers[RETRY_AMOUNT_HEADERS];

            if (retries === undefined) {
                channel.ack(msg)
            }

            if (retries && retries >= MAX_RETRIES_AMOUNT) {
                console.log(`Maximum amount of retries for ${messageBody.messageId}`);
            } else {
                console.log(`Retry ${retries} messageId ${messageBody.messageId}`);
                publishMessage(messageBody, retries + 1);
            }
            
        } finally {
            channel.ack(msg)
        }
    }
}