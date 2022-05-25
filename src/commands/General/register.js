/* eslint-disable consistent-return */
const Models = require("../../database/schemas");

module.exports = {
	name: "register",
	description: "adds a user in the bot database",
	category: "General",
	example: `${process.env.PREFIX}register`,
	run: async (client, message) => {
		const Member = Models.Member();

		const member = await Member.findOne({
			where: { userId: message.author.id },
		});

		if (!member) {
			Member.create({
				userId: message.author.id,
			});

			return message.reply(
				`User Added! Please type \`${process.env.PREFIX}info\` to view donation.`
			);
		} else {
			return message.reply(
				`You have registered! Please type \`${process.env.PREFIX}info\` to view donation.`
			);
		}
	},
};
