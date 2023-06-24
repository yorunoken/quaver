const { user, modes } = require("quaver-api-wrapper");
const { getUsername } = require("../../utils/getUsername");
const { recentEmbed } = require("../../commands-embeds/recentEmbed");
const { EmbedBuilder } = require("discord.js");

async function run(message, args, index) {
  let username = await getUsername(message, args);
  if (!username) {
    const embed = new EmbedBuilder().setColor("Blue").setTitle("There was an Error.").setDescription(`Error: Either provide a username or link your account to the bot using \`link\``);
    return message.channel.send({ embeds: [embed] });
  }

  let profile = await user.details(username);
  const plays = await user.scores(profile.info.id, { mode: modes.Key4, type: "recent" });

  if (plays.status === 404) {
    const embed = new EmbedBuilder().setColor("Blue").setTitle("There was an Error.").setDescription(plays.error);
    return message.channel.send({ embeds: [embed] });
  }

  let keys = 4;
  const embed = recentEmbed(profile, plays, index, 4);
  message.channel.send({ embeds: [embed] });
}

module.exports = {
  name: "recent",
  aliases: ["recent", "rs", "r"],
  cooldown: 2000,
  run: async ({ message, args, index }) => {
    await run(message, args, index - 1 || 0);
  },
};
