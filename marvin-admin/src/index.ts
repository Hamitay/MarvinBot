// Setup env variables
require('dotenv').config()

import express from 'express';
import cors from 'cors';

import playlistController from './playlist/PlaylistController';
import { setUpConsumer } from './publisher';

const PORT = process.env.API_PORT;
const app = express();

// Register middlewares
app.use(cors())

// Register routes
app.use('/api/playlist', playlistController);

app.listen(PORT, () => console.log("Api enabled and listening on port: " + PORT));
setUpConsumer();
