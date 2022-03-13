module.exports = {
	name: "prune",
	description: "clears bot commands",
	category: "Admin",
	example: `${process.env.PREFIX}prune`,
	run: async (client, message) => {
		if (!message.member.permissions.has("ADMINISTRATOR")) return message.reply("This command can only be used by the server admin.");

		const messages = await message.channel.messages.fetch();

		messages.filter((m) => m.author.id === client.user.id).each((m) => {
			m.delete();
		});
	},
};
