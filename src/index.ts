import { Client, Collection } from "discord.js";
import { GatewayIntentBits, Partials } from "discord.js";
import dotenv from "dotenv";
dotenv.config();
import fs from "fs";
import path from "path";

export class MyClient extends Client {
  prefixCommands: Collection<any, any>;
  aliases: Collection<any, any>;

  constructor(options: any) {
    super(options);
    this.prefixCommands = new Collection();
    this.aliases = new Collection();
  }
}

const client = new MyClient({
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

const token = process.env.TOKEN;

const prefixCommands = [];
const prefixFolders = fs.readdirSync("./src/commands");
for (const folder of prefixFolders) {
  const commandFiles = fs.readdirSync(`./src/commands/${folder}`);

  for (const file of commandFiles) {
    const commandFilePath = `./src/commands/${folder}/${file}`;
    const commandFileName = path.parse(commandFilePath).name;

    const command = require(`./commands/${folder}/${commandFileName}`);

    client.prefixCommands.set(command.name, command);
    prefixCommands.push(command.name, command);
    if (command.aliases && Array.isArray(command.aliases)) {
      command.aliases.forEach((alias: any) => {
        client.aliases.set(alias, command.name);
      });
    }
  }
}

(async () => {
  await client.login(token);
})();

client.on("ready", async () => {
  console.log(`Logged in as ${client.user.tag}`);
});

fs.readdirSync("./src/handlers").forEach(async (file: any) => {
  const commandFilePath = `./handlers/${file}`;
  const commandFileName = path.parse(commandFilePath).name;

  const event = await require(`./handlers/${commandFileName}`);
  console.log(event);

  client.on(event.name, (...args: any) => event.execute(...args, client));
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
