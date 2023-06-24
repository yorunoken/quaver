const { user } = require("quaver-api-wrapper");
const { getUsername } = require("../../utils/getUsername");
const { profileEmbed } = require("../../commands-embeds/userProfile");
const { EmbedBuilder } = require("discord.js");

async function run(message, args) {
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
  cooldown: 2000,
  run: async ({ message, args }) => {
    await run(message, args);
  },
};
