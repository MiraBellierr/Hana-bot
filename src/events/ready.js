module.exports = async (client) => {
	console.log(`${client.user.tag} is ready.`);

	client.user.setPresence({ activities: [{ name: `${process.env.PREFIX}help` }], status: "idle" });
};
