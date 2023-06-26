import { EmbedBuilder } from "discord.js";
import { Details } from "quaver-api-wrapper/dist/types/user/details";
import { Scores } from "quaver-api-wrapper/dist/types/user/scores";

const gradesOptions = {
  X: "<:X_Quaver:1122260503163580536>",
  SS: "<:SS_Quaver:1122260500080754819>",
  S: "<:S_Quaver:1122260498285600768>",
  A: "<:A_Quaver:1122260495525752842>",
  B: "<:B_Quaver:1122274673007284336>",
  C: "<:C_Quaver:1122274676031365202>",
  D: "<:D_Quaver:1122274677709090886>",
  F: "<:F_Quaver:1122274681328771252>",
};

export function topEmbed(user: Details, plays: Scores[], index: number, keys: number, options: any) {
  let page = (options.page ?? 1) - 1;
  let pages = [];

  let startNumber = page * 5;
  for (let i = startNumber; i < startNumber + 5; i++) {
    pages.push(i);
  }

  let _plays = [];
  for (const i of pages) {
    _plays.push(getPlays(plays, i));
  }
  if (index) {
    _plays = [getPlays(plays, index)];
  }

  const avatarUrl = user.info.avatar_url;
  const author = getAuthor(user, keys);

  let totalPages = Math.ceil(plays.length / 5);
  const footer = { text: `Page ${page + 1}/${totalPages}` };

  return new EmbedBuilder().setColor("Blue").setAuthor(author).setThumbnail(avatarUrl).setDescription(_plays.join("\n")).setFooter(footer);
}

function getPlays(plays: Scores[], index: number) {
  let play = plays[index];
  if (!play) return "";

  const grade = gradesOptions[play.grade];
  const scoreTime = `<t:${Math.floor(new Date(play.time).getTime() / 1000)}:R>`;
  const accuracy = `${play.accuracy.toFixed(2)}%`;

  let hitJudgements = `[${play.count_marv}/${play.count_perf}/${play.count_great}/${play.count_good}/${play.count_okay}/${play.count_miss}]`;
  let space4 = "\u200B \u200B \u200B ";

  let name = `${grade} **+${play.mods_string} • ${abbrevator(play.total_score)} • ${accuracy}** ${scoreTime}\n`;
  let value = `**${play.performance_rating.toFixed(2)}pp**${space4}${play.max_combo}x / **${play.ratio.toFixed(2)}**${space4}${hitJudgements}`;

  const title = `${play.map.artist} - ${play.map.title} [${play.map.difficulty_name}]`;
  const mapUrl = `https://quavergame.com/mapset/map/${play.map.id}`;

  return `**#${index + 1}** [**${title}**](${mapUrl})\n${name}${value}`;
}

function getAuthor(user: Details, keys: number) {
  const flagImage = `https://osu.ppy.sh/images/flags/${user.info.country}.png`;

  if (keys == 4) {
    return {
      name: `${user.info.username}: ${user.keys4.stats.overall_performance_rating.toFixed(2)}pp (#${user.keys4.globalRank.toLocaleString()} ${user.info.country}#${user.keys4.countryRank.toLocaleString()})`,
      iconURL: flagImage,
      url: `https://quavergame.com/user/${user.info.id}`,
    };
  }
  return {
    name: `${user.info.username}: ${user.keys7.stats.overall_performance_rating.toFixed(2)}pp (#${user.keys7.globalRank.toLocaleString()} ${user.info.country}#${user.keys7.countryRank.toLocaleString()})`,
    iconURL: flagImage,
    url: `https://quavergame.com/user/${user.info.id}`,
  };
}

function abbrevator(number: number) {
  const abbreviations = [
    [1e9, "B"],
    [1e6, "M"],
    [1e3, "K"],
  ];

  for (let i = 0; i < abbreviations.length; i++) {
    if (number >= (abbreviations[i][0] as number)) {
      const abbreviatedNumber = number / (abbreviations[i][0] as number);
      return abbreviatedNumber.toFixed(1) + abbreviations[i][1];
    }
  }

  return number.toString();
}
