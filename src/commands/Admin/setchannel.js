/* eslint-disable consistent-return */
const Models = require("../../database/schemas");
const { checkClanExist, coinsEmoji, getChannel } = require("../../functions");

module.exports = {
	name: "setchannel",
	description: "sets a donation channel the bot will listen to",
	category: "Admin",
	example: `${process.env.PREFIX}setchannel <channel>`,
	run: async (client, message, args) => {
		if (!message.member.permissions.has("ADMINISTRATOR"))
			return message.reply(
				"This command can only be used by the server admin."
			);
		if (!(await checkClanExist()))
			return message.reply(
				`The clan name is not registered. Please type \`${process.env.PREFIX}setclan <name>\` to register a clan name.`
			);
		if (!args.length)
			return message.reply(
				"Please state the donation channel the bot will listen to."
			);

		const channel = await getChannel(message, args[0]);

		const Clan = Models.Clan();

		Clan.update({ channel: channel.id }, { where: { id: 1 } });

		message.reply(`Successfully set ${channel} as a donation channel.`);
	},
};
