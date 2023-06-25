import { Message, EmbedBuilder, PermissionFlagsBits } from "discord.js";
import { query } from "../../utils/getQuery.js";

/**
 *
 * @param {Message} message
 * @returns
 */

async function add(message: Message, args: any[]) {
  await message.channel.sendTyping();

  const serverId = message.guildId.toString();
  const serverCon = await query({ query: `SELECT * FROM servers WHERE id = ?`, parameters: [serverId], type: "get" });
  const newPrefix = args.join(" ");
  if (!serverCon) {
    const jsonArray = JSON.stringify([newPrefix]);
    await query({ query: "INSERT INTO servers (id, value) VALUES (?, ?)", parameters: [serverId, jsonArray], type: "run" });

    const embed = new EmbedBuilder().setTitle("Successful!").setColor("Green").setDescription(`Added \`${newPrefix}\` to this server's prefix list.`);
    return message.channel.send({ embeds: [embed] });
  }

  const prefixBoolean = serverCon.includes(newPrefix);
  if (prefixBoolean) {
    const embed = new EmbedBuilder().setTitle("Error!").setColor("Red").setDescription(`The prefix \`${newPrefix}\` already exists in the prefix list.`);
    return message.channel.send({ embeds: [embed] });
  }

  const jsonArray = JSON.stringify([...serverCon, newPrefix]);
  await query({
    query: "UPDATE servers SET value = ? WHERE id = ?",
    parameters: [jsonArray, serverId],
    type: "run",
  });
  const embed = new EmbedBuilder().setTitle("Successful!").setColor("Green").setDescription(`Added \`${newPrefix}\` to this server's prefix list.`);
  message.channel.send({ embeds: [embed] });
}

async function remove(message: Message, args: any[]) {
  await message.channel.sendTyping();

  const serverId = message.guildId.toString();
  const serverCon = await query({ query: `SELECT * FROM servers WHERE id = ?`, parameters: [serverId], type: "get" });
  const removePrefix = args.join(" ");

  const prefixBoolean = serverCon.includes(removePrefix);
  if (!prefixBoolean) {
    const embed = new EmbedBuilder().setTitle("Error!").setColor("Red").setDescription(`The prefix \`${removePrefix}\` doesn't exist in the prefix list.`);
    return message.channel.send({ embeds: [embed] });
  }

  const newArray = serverCon.filter((filter: any) => filter !== removePrefix);
  const jsonArray = JSON.stringify(newArray);

  await query({
    query: "UPDATE servers SET value = ? WHERE id = ?",
    parameters: [jsonArray, serverId],
    type: "run",
  });

  var embed = new EmbedBuilder().setTitle("Successful!").setColor("Green").setDescription(`Removed \`${removePrefix}\` from this server's prefix list.`);
  if (serverCon.length === 1) {
    var embed = new EmbedBuilder().setTitle("Successful!").setColor("Green").setDescription(`Removed \`${removePrefix}\` from this server's prefix list, leaving the default prefix \`!\``);
  }
  message.channel.send({ embeds: [embed] });
}

async function list(message: Message, args: any[]) {
  await message.channel.sendTyping();

  const serverId = message.guildId.toString();
  const serverCon = await query({ query: `SELECT * FROM servers WHERE id = ?`, parameters: [serverId], type: "get" });

  var prefixes = "! (default)";
  if (serverCon?.length > 0) {
    var prefixes: string = serverCon.join(", ");
  }
  var embed = new EmbedBuilder().setTitle("Prefixes").setColor("Green").setDescription(`Prefixes of this server:\n\`${prefixes}\``);
  message.channel.send({ embeds: [embed] });
}

module.exports = {
  name: "prefix",
  aliases: ["prefix"],
  cooldown: 1000,
  run: async ({ message, args }: { message: Message; args: any[] }) => {
    if (args.includes("-list")) {
      await list(message, args);
      return;
    }

    if (!message.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
      return message.channel.send('You don\'t have the appropriate permissions to use this command! (Need "Manage Guild")');
    }

    if (args.includes("-add")) {
      args = args.filter((arg) => arg.toLowerCase() !== "-add");
      await add(message, args);
      return;
    }
    if (args.includes("-remove")) {
      args = args.filter((arg) => arg.toLowerCase() !== "-remove");
      await remove(message, args);
      return;
    }
  },
};
