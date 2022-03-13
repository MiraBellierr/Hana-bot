const Models = require("../../database/schemas");
const { getMember, checkMemberExist, coinsEmoji } = require("../../functions");

module.exports = {
	name: "add",
	description: " adds a user donation amount in the system manually (incase the cl donation doesnt register the donation amount)",
	category: "Admin",
	example: `${process.env.PREFIX}add <user> <amount>`,
	run: async (client, message, args) => {
		if (!message.member.permissions.has("ADMINISTRATOR")) return message.reply("This command can only be used by the server admin.");
		if (!args.length) return message.reply(`The usage is \`${process.env.PREFIX}add <user> <amount>\``);

		const member = await getMember(message, args[0]);

		if (!member) return message.reply("There is no member with this id or name in this server.");
		if (!await checkMemberExist(member.user.id)) return message.reply(`${member.user.tag} is not registered.`);
		if (!args[1]) return message.reply("Please state the donation amount to add to the user.");
		if (Number.isNaN(Number(args[1]))) return message.reply("Please state the donation amount in number.");

		const amount = parseInt(args[1], 10);
		const Member = await Models.Member();
		const registeredMember = await Member.findOne({ where: { userId: member.user.id } });
		const currentDonation = registeredMember.get("donation");

		Member.update({ donation: currentDonation + amount }, { where: { userId: member.user.id } });

		message.reply(`Successfully add ${amount.toLocaleString()} ${coinsEmoji()} to ${member.user.tag} donation.`);
	},
};
