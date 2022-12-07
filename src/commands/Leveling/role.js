const Models = require("../../database/schemas");
const { getRole } = require("../../functions/index");
const ms = require("ms");

module.exports = {
	name: "role",
	description: "set a role reward to the user when the user reached certain xp",
	category: "Leveling",
	example: `${process.env.PREFIX}role <role> <xp> <duration>`,
	run: async (client, message, args) => {
		if (!message.member.permissions.has("ADMINISTRATOR"))
			return message.reply(
				"This command can only be used by the server admin."
			);

		if (!args.length)
			return message.reply(
				`The usage is \`${process.env.PREFIX}role <role> <xp> <duration>\``
			);

		if (!args[1])
			return message.reply(
				"Please state the amount of xp to gain for the role."
			);

		if (!args[2]) return message.reply("please specify the duration");
		const splitArgs = args[2].split("");

		if (Number.isNaN(Number(splitArgs[0])))
			return message.reply(
				"Please specify the correct duration. For example, 10m, 1h"
			);

		if (Number.isNaN(Number(args[1])))
			return message.reply("Please state the amount of xp in number.");

		const role = await getRole(message, args[0]);

		if (!role) return message.reply("Couldn't find the role.");

		const Clan = Models.Clan();

		Clan.update(
			{ role: role.id, rolexp: args[1], roleTimeout: ms(args[2]) },
			{ where: { id: 1 } }
		);

		client.clan.role = role.id;
		client.clan.rolexp = args[1];
		client.clan.roleTimeout = ms(args[2]);

		message.reply(
			`Successfully updated role reward: ${role.toString()} at **${
				args[1]
			} xp**`
		);
	},
};
