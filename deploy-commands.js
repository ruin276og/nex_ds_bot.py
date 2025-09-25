// deploy-commands.js
const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');

// All the slash commands your bot will register
const commands = [
  {
    name: 'ping',
    description: 'Replies with Pong! (Check bot latency)',
  },
  {
    name: 'hello',
    description: 'Say hello to the bot!',
  },
  {
    name: 'announce',
    description: 'Send an announcement to a channel',
    options: [
      {
        type: 7, // CHANNEL
        name: 'channel',
        description: 'Channel to send the announcement in',
        required: true,
      },
      {
        type: 3, // STRING
        name: 'message',
        description: 'The announcement message',
        required: true,
      },
    ],
  },
  {
    name: 'clear',
    description: 'Clear a number of messages from a channel',
    options: [
      {
        type: 4, // INTEGER
        name: 'amount',
        description: 'Number of messages to delete (1–100)',
        required: true,
      },
    ],
  },
  {
    name: 'userinfo',
    description: 'Get information about a user',
    options: [
      {
        type: 6, // USER
        name: 'target',
        description: 'The user to get info about',
        required: true,
      },
    ],
  },
  {
    name: 'serverinfo',
    description: 'Get information about this server',
  },
  {
    name: 'dm',
    description: 'Send a DM to a user',
    options: [
      {
        type: 6, // USER
        name: 'user',
        description: 'The user to DM',
        required: true,
      },
      {
        type: 3, // STRING
        name: 'message',
        description: 'The message to send',
        required: true,
      },
    ],
  },
  {
    name: 'kick',
    description: 'Kick a member from the server',
    options: [
      {
        type: 6, // USER
        name: 'target',
        description: 'The user to kick',
        required: true,
      },
      {
        type: 3, // STRING
        name: 'reason',
        description: 'Reason for the kick',
        required: false,
      },
    ],
  },
  {
    name: 'ban',
    description: 'Ban a member from the server',
    options: [
      {
        type: 6, // USER
        name: 'target',
        description: 'The user to ban',
        required: true,
      },
      {
        type: 3, // STRING
        name: 'reason',
        description: 'Reason for the ban',
        required: false,
      },
    ],
  },
];

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();

