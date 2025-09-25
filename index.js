// index.js
const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMembers,
  ],
});

client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// Handle slash commands
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName, options, guild, member } = interaction;

  switch (commandName) {
    case 'ping':
      await interaction.reply(`🏓 Pong! Latency is ${Date.now() - interaction.createdTimestamp}ms`);
      break;

    case 'hello':
      await interaction.reply(`Hello ${interaction.user.username} 💕`);
      break;

    case 'announce': {
      const channel = options.getChannel('channel');
      const message = options.getString('message');
      if (!channel) return interaction.reply('❌ Channel not found.');
      await channel.send(`📢 **Announcement:** ${message}`);
      await interaction.reply({ content: '✅ Announcement sent!', ephemeral: true });
      break;
    }

    case 'clear': {
      const amount = options.getInteger('amount');
      if (!member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
        return interaction.reply('❌ You don’t have permission to clear messages.');
      }
      if (amount < 1 || amount > 100) {
        return interaction.reply('❌ Please pick a number between 1–100.');
      }
      await interaction.channel.bulkDelete(amount, true);
      await interaction.reply(`🧹 Deleted ${amount} messages!`);
      break;
    }

    case 'userinfo': {
      const user = options.getUser('target');
      const memberInfo = await guild.members.fetch(user.id);
      await interaction.reply(
        `👤 **User Info:**\n- Username: ${user.tag}\n- ID: ${user.id}\n- Joined: ${memberInfo.joinedAt}`
      );
      break;
    }

    case 'serverinfo':
      await interaction.reply(
        `🏰 **Server Info:**\n- Name: ${guild.name}\n- Members: ${guild.memberCount}\n- ID: ${guild.id}`
      );
      break;

    case 'dm': {
      const user = options.getUser('user');
      const message = options.getString('message');
      try {
        await user.send(`💌 Message from ${interaction.user.username}: ${message}`);
        await interaction.reply({ content: `✅ Sent DM to ${user.tag}`, ephemeral: true });
      } catch {
        await interaction.reply({ content: `❌ Couldn’t send DM to ${user.tag}`, ephemeral: true });
      }
      break;
    }

    case 'kick': {
      const target = options.getUser('target');
      const reason = options.getString('reason') || 'No reason provided';
      if (!member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
        return interaction.reply('❌ You don’t have permission to kick members.');
      }
      const targetMember = guild.members.cache.get(target.id);
      if (!targetMember) return interaction.reply('❌ User not found.');
      await targetMember.kick(reason);
      await interaction.reply(`👢 Kicked ${target.tag} | Reason: ${reason}`);
      break;
    }

    case 'ban': {
      const target = options.getUser('target');
      const reason = options.getString('reason') || 'No reason provided';
      if (!member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
        return interaction.reply('❌ You don’t have permission to ban members.');
      }
      await guild.members.ban(target.id, { reason });
      await interaction.reply(`🔨 Banned ${target.tag} | Reason: ${reason}`);
      break;
    }
  }
});

client.login(token);

