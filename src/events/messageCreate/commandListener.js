module.exports = async (client, message) => {
	const prefix = process.env.PREFIX;

	if (!message.guild) return;
	if (message.author.bot) return;

	if (
		!message.guild.me.permissions.has("SEND_MESSAGES") ||
		!message.guild.me.permissionsIn(message.channel).has("SEND_MESSAGES")
	)
		return;

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
