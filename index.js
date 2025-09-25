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

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName, options, guild, member } = interaction;

  // /ping
  if (commandName === 'ping') {
    await interaction.reply(`🏓 Pong! Latency is ${Date.now() - interaction.createdTimestamp}ms.`);
  }

  // /hello
  else if (commandName === 'hello') {
    await interaction.reply(`Hello ${interaction.user.username} 💕`);
  }

  // /announce
  else if (commandName === 'announce') {
    const channel = options.getChannel('channel');
    const message = options.getString('message');
    if (!channel || !message) return interaction.reply('❌ Missing channel or message.');
    await channel.send(`📢 **Announcement:** ${message}`);
    await interaction.reply({ content: '✅ Announcement sent!', ephemeral: true });
  }

  // /clear
  else if (commandName === 'clear') {
    const amount = options.getInteger('amount');
    if (!member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      return interaction.reply('❌ You don’t have permission to clear messages.');
    }
    if (amount < 1 || amount > 100) {
      return interaction.reply('❌ Please provide a number between 1 and 100.');
    }
    await interaction.channel.bulkDelete(amount, true);
    await interaction.reply(`🧹 Deleted ${amount} messages!`);
  }

  // /userinfo
  else if (commandName === 'userinfo') {
    const user = options.getUser('target');
    const memberInfo = await guild.members.fetch(user.id);
    await interaction.reply(
      `👤 **User Info:**\n- Username: ${user.tag}\n- ID: ${user.id}\n- Joined: ${memberInfo.joinedAt}`
    );
  }

  // /serverinfo
  else if (commandName === 'serverinfo') {
    await interaction.reply(
      `🏰 **Server Info:**\n- Name: ${guild.name}\n- Members: ${guild.memberCount}\n- ID: ${guild.id}`
    );
  }

  // /dm
  else if (commandName === 'dm') {
    const user = options.getUser('user');
    const message = options.getString('message');
    try {
      await user.send(`💌 Message from ${interaction.user.username}: ${message}`);
      await interaction.reply({ content: `✅ Sent DM to ${user.tag}`, ephemeral: true });
    } catch {
      await interaction.reply({ content: `❌ Couldn’t send DM to ${user.tag}`, ephemeral: true });
    }
  }

  // /kick
  else if (commandName === 'kick') {
    const target = options.getUser('target');
    const reason = options.getString('reason') || 'No reason provided';
    if (!member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      return interaction.reply('❌ You don’t have permission to kick members.');
    }
    const targetMember = guild.members.cache.get(target.id);
    if (!targetMember) return interaction.reply('❌ User not found in this server.');
    await targetMember.kick(reason);
    await interaction.reply(`👢 Kicked ${target.tag} | Reason: ${reason}`);
  }

  // /ban
  else if (commandName === 'ban') {
    const target = options.getUser('target');
    const reason = options.getString('reason') || 'No reason provided';
    if (!member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return interaction.reply('❌ You don’t have permission to ban members.');
    }
    await guild.members.ban(target.id, { reason });
    await interaction.reply(`🔨 Banned ${target.tag} | Reason: ${reason}`);
  }
});

client.login(MTM2NTYyNzYyODY5Mzg4NDk1MA.Gy8dm1.Q3UcZi_cNvnxObXa8k-8il2kaRpa_y5YP-HTPc);
