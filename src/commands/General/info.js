const { MessageEmbed } = require("discord.js");
const { getMember, checkMemberExist, checkClanExist, coinsEmoji } = require("../../functions");
const Models = require("../../database/schemas");

module.exports = {
	name: "info",
	description: "shows the user donation (if he/she has donated and how much donated)",
	category: "General",
	example: `${process.env.PREFIX}info [user]`,
	run: async (client, message, args) => {
		let member = await getMember(message, args.join(" "));

		if (!member) member = message.member;

		if (!await checkClanExist()) return message.reply(`A clan name is not registered. Please type \`${process.env.PREFIX}setclan <name>\` to register a clan name.`);
		if (!await checkMemberExist(member.user.id)) return message.reply(`${member.user.tag} is not registered.`);

		const Member = Models.Member();
		const Clan = Models.Clan();

		const registeredMember = await Member.findOne({ where: { userId: member.user.id } });
		const clan = await Clan.findOne({ where: { id: 1 } });

		const memberDonation = registeredMember.get("donation");
		const requiredDonation = clan.get("requiredDonation");

		const embed = new MessageEmbed()
			.setAuthor(`Total Weekly Donations of ${member.user.tag}`)
			.setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
			.setColor("AQUA")
			.addField("Weekly Donations", `${memberDonation.toLocaleString()} / ${requiredDonation.toLocaleString()} ${coinsEmoji()} | ${requiredDonation <= memberDonation ? "✅" : ""}`);

		message.reply({ embeds: [embed] });
	},
};
