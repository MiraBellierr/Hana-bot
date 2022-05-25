/* eslint-disable max-len */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
/* eslint-disable consistent-return */
const { MessageEmbed } = require("discord.js");
const Models = require("../../database/schemas");
const { PaginateContent } = require("../../Pagination");
const {
	checkClanExist,
	coinsEmoji,
	splitArrayIntoChunksOfLen,
} = require("../../functions");

module.exports = {
	name: "lb",
	description:
		" shows the leaderboard of users weekly donation, sorted from the highest to lowest donation amount and enumerated in numbers",
	category: "General",
	example: `${process.env.PREFIX}lb [xp]`,
	run: async (client, message, args) => {
		if (!(await checkClanExist()))
			return message.reply(
				`The clan name is not registered. Please type \`${process.env.PREFIX}setclan <name>\` to register a clan name.`
			);

		const m = await message.channel.send("Please wait...");

		if (!args.length) {
			const Member = Models.Member();
			const Clan = Models.Clan();
			const clan = await Clan.findOne({ where: { id: 1 } });

			const getAllMembers = await Member.findAll({
				order: [["donation", "DESC"]],
			});
			const getAllMembersId = getAllMembers.map((p) => ({
				userId: p.userId,
				donation: p.donation,
			}));
			const memberCheck = [];

			for (let i = 0; i < getAllMembersId.length; i++) {
				const value = {
					user: await client.users.fetch(getAllMembersId[i].userId),
					donation: getAllMembersId[i].donation,
				};
				memberCheck.push(value);
			}

			const memberMapped = memberCheck.map(
				(m, i) =>
					`[${i + 1}] ${
						m.user.username
					} - ${coinsEmoji()} **${m.donation.toLocaleString()}**`
			);
			const leaderboard = [];
			const chunks = splitArrayIntoChunksOfLen(memberMapped, 25);

			chunks.forEach((e, i) => {
				const embed = new MessageEmbed()
					.setAuthor(`Weekly Leaderboards of ${clan.get("name")}`)
					.setColor("AQUA")
					.setThumbnail(client.user.displayAvatarURL())
					.setDescription(`**💰 | Weekly Leaderboard**\n\n${e.join("\n")}`)
					.setFooter(`Page ${i + 1}/${chunks.length}`);

				leaderboard.push(embed);
			});

			m.delete();

			const paginated = new PaginateContent(client, message, leaderboard);
			paginated.init();
		} else if (args[0] === "xp") {
			const Member = Models.Member();
			const Clan = Models.Clan();
			const clan = await Clan.findOne({ where: { id: 1 } });

			const getAllMembers = await Member.findAll({
				order: [["xpGained", "DESC"]],
			});
			const getAllMembersId = getAllMembers.map((p) => ({
				userId: p.userId,
				xpGained: p.xpGained,
			}));
			const memberCheck = [];

			for (let i = 0; i < getAllMembersId.length; i++) {
				const value = {
					user: await client.users.fetch(getAllMembersId[i].userId),
					xpGained: getAllMembersId[i].xpGained,
				};
				memberCheck.push(value);
			}

			const memberMapped = memberCheck.map(
				(m, i) =>
					`[${i + 1}] ${
						m.user.username
					} - **${m.xpGained.toLocaleString()}** XP`
			);
			const leaderboard = [];
			const chunks = splitArrayIntoChunksOfLen(memberMapped, 25);

			chunks.forEach((e, i) => {
				const embed = new MessageEmbed()
					.setAuthor(`XP Leaderboards of ${clan.get("name")}`)
					.setColor("AQUA")
					.setThumbnail(client.user.displayAvatarURL())
					.setDescription(`**💰 | XP Leaderboard**\n\n${e.join("\n")}`)
					.setFooter(`Page ${i + 1}/${chunks.length}`);

				leaderboard.push(embed);
			});

			m.delete();

			const paginated = new PaginateContent(client, message, leaderboard);
			paginated.init();
		}
	},
};
