import amqp, { ConsumeMessage } from 'amqplib';
import { downloadVideo } from '../video/VideoDownloader';
import VideoService from '../video/VideoService';

const QUEUE_HOST = 'amqp://localhost:5672';

const QUEUE_NAME = 'MarvinVideoEvents';


interface MarvinNewVideoEvent {
    videoId: number,
}

const connectToChannel = async () => {
    console.log("Attempting to connect to rabbitMq")
    const connection = await amqp.connect(QUEUE_HOST)
    console.log("Connected to rabbitMq")
    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: false })

    return channel;
}

export const setUpConsumer = async () => {
    const channel = await connectToChannel();

    await channel.consume(QUEUE_NAME, handleEvent(channel), { noAck: false })
}

export const publishMessage = async (message: MarvinNewVideoEvent) => {
    const channel = await connectToChannel();

    try {
        await channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(message)), { persistent: true});
        console.log("Published to queue")
    } catch(error) {
        console.error(error);
    }
}

const handleEvent = (channel: amqp.Channel) => async (msg: ConsumeMessage | null) => {
    if (msg) {
        const rawMessage = msg.content.toString();
        const messageBody = JSON.parse(rawMessage) as MarvinNewVideoEvent;
        console.log('Received message: ')
        console.log(messageBody);

        //Download video

        try {
            const video = await VideoService.getVideoById(messageBody.videoId)
            await downloadVideo(video.id, video.name, video.thirdPartyUrl);

            // ACK
            channel.ack(msg);
        } catch (error) {
            console.error(error)
        }
    }
}

// (
//     async () => {
//         console.log("attempting to connect")
//         const connection = await amqp.connect('amqp://localhost:5672')
//         console.log("Connected")
//         const channel = await connection.createChannel();
//         const queue = 'hello'
//         const msg = 'Hello banana'

//         channel.assertQueue(queue, { durable: false })
//         try {
//             channel.sendToQueue(queue, Buffer.from(msg))
//             console.log('Sent to queue')

//             await channel.consume(queue, (msg) => {
//                 console.log(msg?.content.toString())
//             })

//         } catch (error) {
//             console.error("ERROR")
//             console.error(error)
//         }
//     }
// )()