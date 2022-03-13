const Models = require("../../database/schemas");

module.exports = {
	name: "setclan",
	description: "sets a clan name",
	category: "Admin",
	example: `${process.env.PREFIX}setclan <name>`,
	run: async (client, message, args) => {
		if (!message.member.permissions.has("ADMINISTRATOR")) return message.reply("This command can only be used by the server admin.");
		if (!args.length) return message.reply("Please state a clan name.");

		const Clan = Models.Clan();
		const clan = await Clan.findOne({ where: { id: 1 } });

		if (!clan) {
			try {
				Clan.create({
					name: args.join(" "),
				});
			} catch (e) {
				return message.reply(`An error occured ${e.message}`);
			}
		} else {
			Clan.update({ name: args.join(" ") }, { where: { id: 1 } });
		}

		message.reply("Successfully set a clan name.");
	},
};
