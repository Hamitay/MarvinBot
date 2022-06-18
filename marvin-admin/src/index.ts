// Setup env variables
import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import playlistController from "./playlist/PlaylistController";
import { setUpConsumer } from "./publisher";
import videoController from "./video/VideoController";

dotenv.config()

const PORT = process.env.API_PORT;
const app = express();

// Register middlewares
app.use(cors())

// Register routes
app.use("/api/playlist", playlistController);
app.use("/api/video", videoController);

app.listen(PORT, () => console.log("Api enabled and listening on port: " + PORT));
setUpConsumer();
