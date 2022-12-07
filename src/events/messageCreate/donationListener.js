const Models = require("../../database/schemas");

module.exports = async (client, message) => {
	const Clan = Models.Clan();
	const clan = await Clan.findOne({ where: { id: 1 } });
	let channel;

	if (clan) {
		channel = clan.get("channel");
	}

	if (message.channel.id === channel) {
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
			} else if (botMessage.first().embeds[0].title.includes("Success")) {
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
	}
};
