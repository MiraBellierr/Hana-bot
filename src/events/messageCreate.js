const Models = require("../database/schemas");
const Member = Models.Member();

module.exports = async (client, message) => {
	const prefix = process.env.PREFIX;

	if (message.guild.id !== "728252329081438329") return;
	if (message.author.bot) return;

	const timeout = client.timeout.get(message.author.id);
	const timer = 60000;

	if (!timeout || (timeout && timeout - (Date.now() - timer) < 1)) {
		let member;

		member = await Member.findOne({ where: { userId: message.author.id } });
		let xpGained = member.get("xpGained");

		if (!member) return;

		client.timeout.set(message.author.id, Date.now());

		if (!client.cChannels.get(message.channel.id)) {
			Member.update(
				{ xpGained: xpGained + client.clan.generalxp },
				{ where: { userId: message.author.id } }
			);
		} else {
			Member.update(
				{
					xpGained: xpGained + client.cChannels.get(message.channel.id),
				},
				{ where: { userId: message.author.id } }
			);
		}

		member = await Member.findOne({ where: { userId: message.author.id } });
		xpGained = member.get("xpGained");

		if (xpGained >= client.clan.rolexp) {
			if (!member.get("roleGained")) {
				message.member.roles.add(client.clan.role);

				Member.update(
					{ roleGained: true, xpGained: 0, activeRole: Date.now() },
					{ where: { userId: message.author.id } }
				);
			}
		}

		member = await Member.findOne({ where: { userId: message.author.id } });

		if (
			client.clan.roleTimeout !== null ||
			member.get("activeRole") - (Date.now() - client.clan.roleTimeout) < 1
		) {
			message.member.roles.remove(client.clan.role);

			Member.update(
				{ roleGained: false },
				{ where: { userId: message.author.id } }
			);
		}
	}

	if (
		!message.guild.me.permissions.has("SEND_MESSAGES") ||
		!message.guild.me.permissionsIn(message.channel).has("SEND_MESSAGES")
	)
		return;

	if (message.channel.id === "813262057331884032") {
		const string = ".cl donate";
		if (message.content.startsWith(string)) {
			const args = message.content.slice(string.length).trim().split(/ +/g);
			if (Number.isNaN(Number(args[0])) || args[0] < 1) return;

			const filter = (m) => m.author.id === "571027211407196161";

			const botMessage = await message.channel.awaitMessages({
				filter,
				max: 1,
			});

			if (botMessage.first().embeds[0].title === "Error ⛔") {
				message.channel.send(botMessage.first().embeds[0].description);
				return;
			}

			const amount = parseInt(args[0], 10);

			const Member = Models.Member();
			const member = await Member.findOne({
				where: { userId: message.author.id },
			});

			if (!member) return;

			const currentDonation = member.get("donation");

			Member.update(
				{ donation: currentDonation + amount },
				{
					where: { userId: message.author.id },
				}
			);

			message.channel.send(
				`Successfully update ${message.author.tag} donation.`
			);
		}
	}

	if (!message.content.startsWith(prefix)) return;
	if (!message.member)
		message.member = await message.guild.fetchMember(message);

	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	const cmd = args.shift().toLowerCase();

	if (cmd.length === 0) return;

	const command = client.commands.get(cmd);

	try {
		if (command) command.run(client, message, args);
	} catch (e) {
		console.log(e);
		message.reply(`An error occurred ${e.message}`);
	}
};
