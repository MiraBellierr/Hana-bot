const Models = require("../../database/schemas");

module.exports = async (client, message) => {
	if (message.guild.id !== "728252329081438329") return;
	if (message.author.bot) return;

	const Member = Models.Member();

	const timeout = client.timeout.get(message.author.id);
	const timer = 60000;

	if (!timeout || (timeout && timeout - (Date.now() - timer) < 1)) {
		let member;

		member = await Member.findOne({ where: { userId: message.author.id } });
		if (!member) return;
		let xpGained = member.get("xpGained");

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
				if (client.clan.role)
					message.member.roles
						.add(client.clan.role)
						.catch((e) => console.log(e));

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
			message.member.roles.remove(client.clan.role).catch((e) => {
				console.log(e);
			});

			Member.update(
				{ roleGained: false },
				{ where: { userId: message.author.id } }
			);
		}
	}
};
