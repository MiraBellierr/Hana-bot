/* eslint-disable no-console */
/* eslint-disable no-restricted-syntax */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
/* eslint-disable no-continue */
/* eslint-disable max-len */
const { readdirSync } = require("fs");

const Ascii = require("ascii-table");

const table = new Ascii("Commands");
table.setHeading("Command", "Load status");

module.exports = (client) => {
	readdirSync("./src/commands/").forEach((dir) => {
		const commands = readdirSync(`./src/commands/${dir}/`).filter((file) =>
			file.endsWith(".js")
		);

		for (const file of commands) {
			const pull = require(`../commands/${dir}/${file}`);

			if (pull.name) {
				client.commands.set(pull.name, pull);
				table.addRow(file, "✅");
			} else {
				table.addRow(
					file,
					"❎ -> missing a help.name, or help.name is not a string."
				);
				continue;
			}

			if (pull.aliases && Array.isArray(pull.aliases))
				pull.aliases.forEach((alias) => client.aliases.set(alias, pull.name));
		}
	});

	console.log(table.toString());
};
