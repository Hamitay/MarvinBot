"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishMessage = exports.setUpConsumer = void 0;
const amqplib_1 = __importDefault(require("amqplib"));
const VideoDownloader_1 = require("../video/VideoDownloader");
const VideoService_1 = __importDefault(require("../video/VideoService"));
const QUEUE_HOST = 'amqp://localhost:5672';
const QUEUE_NAME = 'MarvinVideoEvents';
const connectToChannel = async () => {
    console.log("Attempting to connect to rabbitMq");
    const connection = await amqplib_1.default.connect(QUEUE_HOST);
    console.log("Connected to rabbitMq");
    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: false });
    return channel;
};
const setUpConsumer = async () => {
    const channel = await connectToChannel();
    await channel.consume(QUEUE_NAME, handleEvent(channel), { noAck: false });
};
exports.setUpConsumer = setUpConsumer;
const publishMessage = async (message) => {
    const channel = await connectToChannel();
    try {
        await channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(message)), { persistent: true });
        console.log("Published to queue");
    }
    catch (error) {
        console.error(error);
    }
};
exports.publishMessage = publishMessage;
const handleEvent = (channel) => async (msg) => {
    if (msg) {
        const rawMessage = msg.content.toString();
        const messageBody = JSON.parse(rawMessage);
        console.log('Received message: ');
        console.log(messageBody);
        //Download video
        try {
            const video = await VideoService_1.default.getVideoById(messageBody.videoId);
            (0, VideoDownloader_1.downloadVideo)(video.id, video.name, video.thirdPartyUrl);
            // ACK
            channel.ack(msg);
        }
        catch (error) {
            console.error(error);
        }
    }
};
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
//# sourceMappingURL=index.js.map