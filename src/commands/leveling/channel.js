const Models = require("../../database/schemas");
const { getChannel } = require("../../functions/index");

module.exports = {
	name: "channel",
	description: "set an amount of xp gained per min for certain the channel",
	category: "leveling",
	example: `${process.env.PREFIX}channel <channel> <xp>`,
	run: async (client, message, args) => {
		if (!message.member.permissions.has("ADMINISTRATOR"))
			return message.reply(
				"This command can only be used by the server admin."
			);

		if (!args.length)
			return message.reply(
				`The usage is \`${process.env.PREFIX}channel <channel> <xp>\``
			);

		if (!args[1])
			return message.reply("Please state the amount of xp for the channel.");

		if (Number.isNaN(Number(args[1])))
			return message.reply("Please state the amount of xp in number.");

		const channel = await getChannel(message, args[0]);

		if (!channel || channel.type !== "GUILD_TEXT")
			return message.reply("Please state the text channel.");

		const Channel = Models.Channel();

		const registeredChannel = await Channel.findOne({
			where: { channelId: channel.id },
		});

		if (!registeredChannel) {
			Channel.create({
				channelId: channel.id,
				xp: args[1],
			});
		} else {
			Channel.update({ xp: args[1] }, { where: { channelId: channel.id } });
		}

		client.cChannels.set(channel.id, args[1]);

		message.reply(
			`Successfully change the amount of xp gained per min at ${channel.toString()} to **${
				args[1]
			} xp**.`
		);
	},
};
