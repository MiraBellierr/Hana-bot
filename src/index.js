/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
/* eslint-disable no-new */
require("dotenv").config();
const { Client, Collection } = require("discord.js");
const Sequelize = require("sequelize");
const fs = require("fs");

const client = new Client({
	allowedMentions: { parse: ["users"] },
	intents: [
		"DIRECT_MESSAGES",
		"DIRECT_MESSAGE_REACTIONS",
		"DIRECT_MESSAGE_TYPING",
		"GUILDS",
		"GUILD_BANS",
		"GUILD_EMOJIS_AND_STICKERS",
		"GUILD_INTEGRATIONS",
		"GUILD_INVITES",
		"GUILD_MEMBERS",
		"GUILD_MESSAGES",
		"GUILD_MESSAGE_REACTIONS",
		"GUILD_MESSAGE_TYPING",
		"GUILD_PRESENCES",
		"GUILD_VOICE_STATES",
		"GUILD_WEBHOOKS",
	],
});

new Sequelize("database", "user", "password", {
	host: "localhost",
	logging: false,
	dialect: "sqlite",
	storage: "./database/database.sqlite",
});

const { Member, Clan, Channel } = require("./database/schemas");

Member();
Clan();
Channel();

client.commands = new Collection();
client.categories = fs.readdirSync("./src/commands");
client.timeout = new Collection();
client.cChannels = new Collection();
client.aliases = new Collection();

["command", "event"].forEach((handler) => {
	require(`./handlers/${handler}`)(client);
});

(async function () {
	const clan = await Clan().findOne({ where: { id: 1 } });
	let channels = await Channel().findAll();

	if (!clan) return;

	channels.forEach((channel) =>
		client.cChannels.set(channel.dataValues.channelId, channel.dataValues.xp)
	);

	client.clan = {
		generalxp: clan.get("generalxp"),
		role: clan.get("role"),
		rolexp: clan.get("rolexp"),
		roleTimeout: clan.get("roleTimeout"),
	};
})();

client.login(process.env.TOKEN);
