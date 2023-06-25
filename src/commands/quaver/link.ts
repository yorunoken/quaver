import { user } from "quaver-api-wrapper";
import { getUsername } from "../../utils/getUsername";
import { EmbedBuilder, Message } from "discord.js";
import { query } from "../../utils/getQuery.js";

async function run(message: Message, args: any[]) {
  let username = await getUsername(message, args);
  if (!username) {
    const embed = new EmbedBuilder().setColor("Blue").setTitle("There was an Error.").setDescription(`Error: Either provide a username or link your account to the bot using \`link\``);
    return message.channel.send({ embeds: [embed] });
  }

  const profile = await user.details(username);
  if (profile.status === 404) {
    const embed = new EmbedBuilder().setColor("Blue").setTitle("There was an Error.").setDescription(profile.error);
    return message.channel.send({ embeds: [embed] });
  }
  let id = profile.info.id.toString();

  const qUser = await query({ query: `SELECT * FROM users WHERE id = ?`, parameters: [message.author.id], type: "get" });
  if (!qUser) {
    await query({ query: `INSERT INTO users (id, value) VALUES (?, json_object('UserId', ?))`, parameters: [message.author.id, id], type: "run" });
  } else {
    const q = `UPDATE users
    SET value = json_set(value, '$.UserId', ?)
    WHERE id = ?`;
    await query({ query: q, parameters: [id, message.author.id], type: "run" });
  }

  const embed = new EmbedBuilder().setTitle("Account Linked").setColor("Blue").setDescription(`Successfully linked your account to \`${profile.info.username}\` with the ID of \`${profile.info.id}\``).setThumbnail(profile.info.avatar_url);
  return message.channel.send({ embeds: [embed] });
}

module.exports = {
  name: "link",
  aliases: ["link"],
  cooldown: 1000,
  run: async ({ message, args }: { message: Message; args: any[] }) => {
    await run(message, args);
  },
};
