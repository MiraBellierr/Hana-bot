const Models = require("../../database/schemas");

module.exports = {
	name: "xp",
	description: "Set a general amount of xp gained every min",
	category: "Leveling",
	example: `${process.env.PREFIX}xp <xp>`,
	run: async (client, message, args) => {
		if (!message.member.permissions.has("ADMINISTRATOR"))
			return message.reply(
				"This command can only be used by the server admin."
			);

		if (!args.length)
			return message.reply(`The usage is \`${process.env.PREFIX}xp <xp>\``);

		if (Number.isNaN(Number(args[0])))
			return message.reply("Please state the amount of xp in number.");

		const Clan = Models.Clan();

		Clan.update({ generalxp: args[0] }, { where: { id: 1 } });

		client.clan.generalxp = args[0];

		message.reply(
			`Successfully set general xp gained per min to **${args[0]} xp**`
		);
	},
};
