import { user } from "quaver-api-wrapper";
import { getUsername } from "../../utils/getUsername";
import { profileEmbed } from "../../commands-embeds/userProfile";
import { EmbedBuilder, Message } from "discord.js";

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

  const embed = profileEmbed(profile);
  message.channel.send({ embeds: [embed] });
}

module.exports = {
  name: "profile",
  aliases: ["profile"],
  cooldown: 1000,
  run: async ({ message, args }: { message: Message; args: any[] }) => {
    await run(message, args);
  },
};
