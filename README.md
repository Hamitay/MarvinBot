![Marvin](https://vignette.wikia.nocookie.net/hitchhikers/images/a/a0/Marvinrobot.jpg/revision/latest/top-crop/width/360/height/450?cb=20181116220504)

> There's only one life-form as intelligent as me within thirty parsecs of here and that's me.

# Marvin Bot

Marvin is a simple music bot for Discord made with Discord.js.

It allows the users to play songs from both a third party service.

It alsos allows users to create and manage their playlists with a simple and friendly user interface.

## Current Architecture

Marvin is, as of today, running in three different containers:

- `marvin`: the bot itself
- `marvin_app`: a React application that allows users to create new playlists and add songs from a third party service

<!--
## Running Marvin

### Requirements
1. Discord Bot [Token](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot)
2. Nodejs v12.0.0

The Discord token should be exported as a environment variable or inside a `.env:

```
export DISCORD_TOKEN=<discord_token>
export API_ENABLED=<Wheter to expose the message api>
export API_PORT=<Port to serve the api, defaults to 3000>
```

Then it is as easy as running:
```
npm install
npm run start
```

Alternativately, the easiest way of running Marvin would be via Docker:

```
$ docker run -e DISCORD_TOKEN=<discord_token> -e SOUNDCLOUD_CLIENT_ID=<soundcloud_client_id> henriqueamitay/marvin:latest
```
