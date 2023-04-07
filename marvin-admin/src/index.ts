// Setup env variables
import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import playlistController from "./playlist/PlaylistController";

dotenv.config();

const PORT = process.env.API_PORT || 3000;
const app = express();

// Register middlewares
app.use(cors());

// Register routes
app.use("/api/playlist", playlistController);

app.listen(PORT, () =>
  console.log("Api enabled and listening on port: " + PORT)
);
