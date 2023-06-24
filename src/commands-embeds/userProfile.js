const { EmbedBuilder } = require("discord.js");

const grades = {
  A: "<:A_Quaver:1122260495525752842>",
  S: "<:S_Quaver:1122260498285600768>",
  SS: "<:SS_Quaver:1122260500080754819>",
  X: "<:X_Quaver:1122260503163580536>",
};

const options = {
  hour: "2-digit",
  minute: "2-digit",
  year: "numeric",
  month: "numeric",
  day: "numeric",
  timeZone: "UTC",
};

function profileEmbed(profile) {
  const username = profile.info.username;
  const avatarUrl = profile.info.avatar_url;
  const country = profile.info.country;
  const clan = profile.clan ?? "NONE";
  const lastActive = `<t:${Math.floor(new Date(profile.info.latest_activity).getTime() / 1000)}:R>`;

  const date = new Date(profile.info.time_registered);
  const months = Math.floor((new Date() - date) / (1000 * 60 * 60 * 24 * 30));
  const userJoinedAgo = (months / 12).toFixed(1);
  const formattedDate = date.toLocaleDateString("en-US", options);

  const k4 = keys(profile, "keys4", "4 Keys");
  const k7 = keys(profile, "keys7", "7 Keys");

  const description = `**Last active ${lastActive}**\n**Clan:** \`${clan}\``;
  const flagImage = `https://osu.ppy.sh/images/flags/${country}.png`;
  const author = { name: `${username} (${country})`, iconURL: flagImage };
  const footer = {
    text: `Joined Quaver ${formattedDate} (${userJoinedAgo} years ago)`,
  };

  return new EmbedBuilder().setColor("Blue").setAuthor(author).setFields(k4, k7).setThumbnail(avatarUrl).setFooter(footer).setDescription(description);
}

function keys(profile, keyMethod, title) {
  let emote = keyMethod === "keys4" ? " :musical_keyboard:" : " :keyboard:";
  let keys = profile[keyMethod];
  let stats = keys.stats;
  const country = profile.info.country;

  let row1 = `**Rank:** \`#${keys.globalRank.toLocaleString()}(${country}#${keys.countryRank.toLocaleString()})\` • **PP:** \`${stats.overall_performance_rating.toFixed(2)}\`\n`;
  let row2 = `**Accuracy:** \`${stats.overall_accuracy.toFixed(2)}%\` • **Max Combo:** \`${stats.max_combo.toLocaleString()}x\`\n`;
  let row3 = `**Total Score:** \`${abbrevator(stats.total_score)} (${abbrevator(stats.ranked_score)} R)\`\n`;
  let row4 = `**Grades**\n${grades.X}\`${stats.count_grade_x}\` ${grades.SS}\`${stats.count_grade_ss}\` ${grades.S}\`${stats.count_grade_s}\` ${grades.A}\`${stats.count_grade_a}\``;

  return {
    name: title + emote,
    value: row1 + row2 + row3 + row4,
  };
}

function abbrevator(number) {
  const abbreviations = [
    [1e9, "B"],
    [1e6, "M"],
    [1e3, "K"],
  ];

  for (let i = 0; i < abbreviations.length; i++) {
    if (number >= abbreviations[i][0]) {
      const abbreviatedNumber = number / abbreviations[i][0];
      return abbreviatedNumber.toFixed(1) + abbreviations[i][1];
    }
  }

  return number.toString();
}

module.exports = { profileEmbed };
