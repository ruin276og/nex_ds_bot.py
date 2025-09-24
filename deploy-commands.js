/**
 * Minecraft Server Status Bot - Command Deployment (Extended Moderation + Utility)
 * Using Guild Commands for instant updates.
 */

const { REST, Routes } = require('discord.js');
const config = require('./config.json');

const commands = [
  // Utility / Info
  {
    name: 'status',
    description: 'Get the current status of a Minecraft server',
    options: [
      {
        name: 'server',
        description: 'The name of the server to check',
        type: 3, // STRING
        required: true,
        choices: (config.minecraft && config.minecraft.servers) ? config.minecraft.servers.map(s => ({ name: s.name, value: s.name })) : []
      }
    ]
  },
  { name: 'ping', description: 'Check if the bot is alive and see its latency' },
  { name: 'help', description: 'Show all available commands and usage' },
  { name: 'serverinfo', description: 'Get information about this Discord server' },
  {
    name: 'userinfo',
    description: 'Get information about a user',
    options: [ { name: 'target', description: 'User to lookup', type: 6, required: false } ]
  },

  // Moderation
  {
    name: 'ban',
    description: 'Ban a user from the server',
    options: [
      { name: 'target', description: 'User to ban', type: 6, required: true },
      { name: 'reason', description: 'Reason for the ban', type: 3, required: false },
      { name: 'delete_days', description: 'Days of messages to delete (0-7)', type: 4, required: false }
    ]
  },
  {
    name: 'tempban',
    description: 'Temporarily ban a user (requires persistence to unban later)',
    options: [
      { name: 'target', description: 'User to tempban', type: 6, required: true },
      { name: 'duration', description: 'Duration (e.g. 1h, 2d, 30m)', type: 3, required: true },
      { name: 'reason', description: 'Reason for tempban', type: 3, required: false }
    ]
  },
  { name: 'unban', description: 'Unban a user by ID', options: [ { name: 'user_id', description: 'ID of the user to unban', type: 3, required: true } ] },
  {
    name: 'kick',
    description: 'Kick a user from the server',
    options: [ { name: 'target', description: 'User to kick', type: 6, required: true }, { name: 'reason', description: 'Reason', type: 3, required: false } ]
  },
  {
    name: 'softban',
    description: 'Softban (ban + unban) to prune messages and remove user quickly',
    options: [ { name: 'target', description: 'User', type: 6, required: true }, { name: 'reason', description: 'Reason', type: 3, required: false } ]
  },

  // Mute system
  {
    name: 'mute',
    description: 'Mute a user (requires a Muted role or the bot to create one)',
    options: [ { name: 'target', description: 'User to mute', type: 6, required: true }, { name: 'duration', description: 'Optional duration (e.g. 10m, 2h)', type: 3, required: false }, { name: 'reason', description: 'Reason', type: 3, required: false } ]
  },
  { name: 'unmute', description: 'Remove mute from a user', options: [ { name: 'target', description: 'User to unmute', type: 6, required: true } ] },

  // Warnings
  { name: 'warn', description: 'Add a warning to a user', options: [ { name: 'target', description: 'User', type: 6, required: true }, { name: 'reason', description: 'Reason', type: 3, required: true } ] },
  { name: 'warnings', description: 'View or manage warnings', options: [ { name: 'target', description: 'User to view', type: 6, required: false }, { name: 'action', description: 'view or clear', type: 3, required: false, choices: [ { name: 'view', value: 'view' }, { name: 'clear', value: 'clear' } ] } ] },

  // Channel moderation
  { name: 'purge', description: 'Bulk delete messages (max 100)', options: [ { name: 'amount', description: 'Number of messages to delete (2-100)', type: 4, required: true } ] },
  { name: 'slowmode', description: 'Set channel slowmode in seconds (0 to disable)', options: [ { name: 'seconds', description: 'Seconds for slowmode (0-21600)', type: 4, required: true } ] },
  { name: 'lockdown', description: 'Lock or unlock the current channel', options: [ { name: 'action', description: 'lock or unlock', type: 3, required: true, choices: [ { name: 'lock', value: 'lock' }, { name: 'unlock', value: 'unlock' } ] } ] },

  // Roles & nicknames
  { name: 'roleadd', description: 'Add a role to a user', options: [ { name: 'target', description: 'User', type: 6, required: true }, { name: 'role', description: 'Role to add (name or ID)', type: 3, required: true } ] },
  { name: 'roleremove', description: 'Remove a role from a user', options: [ { name: 'target', description: 'User', type: 6, required: true }, { name: 'role', description: 'Role to remove (name or ID)', type: 3, required: true } ] },
  { name: 'nick', description: 'Change a user nickname', options: [ { name: 'target', description: 'User', type: 6, required: true }, { name: 'nickname', description: 'New nickname', type: 3, required: true } ] },

  // Announcements and modlog
  { name: 'announce', description: 'Send an announcement to a channel', options: [ { name: 'channel', description: 'Channel to announce in', type: 7, required: true }, { name: 'message', description: 'Announcement message', type: 3, required: true }, { name: 'embed', description: 'Send as embed?', type: 5, required: false } ] },
  { name: 'setmodlog', description: 'Set the mod-log channel for moderation actions', options: [ { name: 'channel', description: 'Channel to use as modlog', type: 7, required: true } ] }
];

const rest = new REST({ version: '10' }).setToken(config.bot.token);

(async () => {
  try {
    console.log('Started refreshing GUILD application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands(config.bot.clientId, config.bot.guildId),
      { body: commands }
    );

    console.log('Successfully reloaded guild (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();

