const { Client, Collection, GatewayIntentBits, Partials } = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.MessageContent,
  ],
  shards: "auto",
  partials: [Partials.Message, Partials.Channel, Partials.GuildMember, Partials.Reaction, Partials.GuildScheduledEvent, Partials.User, Partials.ThreadMember],
});
require("dotenv/config");
const fs = require("fs");
const token = process.env.TOKEN;

client.prefixCommands = new Collection();
client.aliases = new Collection();

const prefixCommands = [];
const prefixFolders = fs.readdirSync("./src/commands");
for (const folder of prefixFolders) {
  const commandFiles = fs.readdirSync(`./src/commands/${folder}`);

  for (const file of commandFiles) {
    const command = require(`./commands/${folder}/${file}`);
    client.prefixCommands.set(command.name, command);
    prefixCommands.push(command.name, command);
    if (command.aliases && Array.isArray(command.aliases)) {
      command.aliases.forEach((alias) => {
        client.aliases.set(alias, command.name);
      });
    }
  }
}

client.on("ready", async () => {
  console.log(`Logged in as ${client.user.tag}`);
});

fs.readdirSync("./src/handlers").forEach(async (file) => {
  const event = await require(`./handlers/${file}`);
  client.on(event.name, (...args) => event.execute(...args));
});

// nodejs events
process.on("unhandledRejection", (e) => {
  console.error(e);
});
process.on("uncaughtException", (e) => {
  console.error(e);
});
process.on("uncaughtExceptionMonitor", (e) => {
  console.error(e);
});

client.login(token);
