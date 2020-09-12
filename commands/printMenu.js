const fs = require('fs');
const messages = require('../messages');

const printMenu = (message) => {
  fs.readdir('./playlists', async (err, files) => {
    if(err) {
      // Handle error
      return message.channel.send(messages.UNKNOWN_ERROR(err));
    };

    const menu = files.map((file) => `-> ${file}`);

    return message.channel.send([messages.MENU_HEADER, ...menu]);
  })
}

module.exports = printMenu;
