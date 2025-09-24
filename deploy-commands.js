/**
 * deploy-commands.js - Registers all slash commands for the community server bot
 */

const { REST, Routes } = require('discord.js');
const config = require('./config.json');

const commands = [
    // Moderation
    { name: 'ban', description: 'Ban a member', options: [{ name: 'user', description: 'User to ban', type: 6, required: true }, { name: 'reason', description: 'Reason for ban', type: 3 }] },
    { name: 'unban', description: 'Unban a user by ID', options: [{ name: 'userid', description: 'ID of the user to unban', type: 3, required: true }] },
    { name: 'kick', description: 'Kick a member', options: [{ name: 'user', description: 'User to kick', type: 6, required: true }, { name: 'reason', description: 'Reason', type: 3 }] },
    { name: 'purge', description: 'Delete messages', options: [{ name: 'amount', description: 'Number of messages (1-100)', type: 4, required: true }] },
    { name: 'warn', description: 'Warn a member', options: [{ name: 'user', description: 'User to warn', type: 6, required: true }, { name: 'reason', description: 'Reason for warning', type: 3 }] },
    { name: 'mute', description: 'Mute a member', options: [{ name: 'user', description: 'User to mute', type: 6, required: true }, { name: 'duration', description: 'Duration (e.g. 10m, 2h)', type: 3 }, { name: 'reason', description: 'Reason', type: 3 }] },
    { name: 'unmute', description: 'Unmute a member', options: [{ name: 'user', description: 'User to unmute', type: 6, required: true }] },
    { name: 'lockdown', description: 'Lock/unlock channel', options: [{ name: 'action', description: 'lock or unlock', type: 3, required: true, choices: [{ name: 'lock', value: 'lock' }, { name: 'unlock', value: 'unlock' }] }] },
    { name: 'slowmode', description: 'Set channel slowmode in seconds', options: [{ name: 'seconds', description: 'Seconds (0-21600)', type: 4, required: true }] },

    // Utility
    { name: 'ping', description: 'Check bot latency' },
    { name: 'help', description: 'List available commands' },
    { name: 'serverinfo', description: 'Get server information' },
    { name: 'userinfo', description: 'Get user information', options: [{ name: 'user', description: 'User to lookup', type: 6, required: true }] },

    // System / Announcements
    { name: 'announce', description: 'Send announcement', options: [{ name: 'channel', description: 'Channel to announce', type: 7, required: true }, { name: 'message', description: 'Message content', type: 3, required: true }, { name: 'embed', description: 'Send as embed?', type: 5 }] },
    { name: 'dm', description: 'Send DM to a user', options: [{ name: 'user', description: 'User to DM', type: 6, required: true }, { name: 'message', description: 'Message content', type: 3, required: true }] },
    { name: 'roleadd', description: 'Add role to user', options: [{ name: 'user', description: 'User', type: 6, required: true }, { name: 'role', description: 'Role name or ID', type: 3, required: true }] },
    { name: 'roleremove', description: 'Remove role from user', options: [{ name: 'user', description: 'User', type: 6, required: true }, { name: 'role', description: 'Role name or ID', type: 3, required: true }] },
    { name: 'nick', description: 'Change nickname', options: [{ name: 'user', description: 'User', type: 6, required: true }, { name: 'nickname', description: 'New nickname', type: 3, required: true }] }
];

const rest = new REST({ version: '10' }).setToken(config.bot.token);

(async () => {
    try {
        console.log('Started refreshing application (/) commands...');

        await rest.put(
            Routes.applicationGuildCommands(config.bot.clientId, config.bot.guildId),
            { body: commands }
        );

        console.log('Successfully reloaded all commands!');
    } catch (error) {
        console.error(error);
    }
})();
