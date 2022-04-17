/* eslint-disable no-use-before-define */
const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'help',
  description: 'shows all commands',
  category: 'General',
  example: `${process.env.PREFIX}help [commandName]`,
  run: async (client, message, args) => {
    if (!args.length) {
      getAll(client, message);
    } else {
      getCMD(client, message, args[0]);
    }
  },
};

function getAll(client, message) {
  const embed = new MessageEmbed()
    .setAuthor(client.user.username)
    .setColor('AQUA')
    .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
    .setDescription(`Use \`${process.env.PREFIX}help <commandName>\` without the \`<>\` to see more information about a specific command.`)
    .setFooter('Ara Ara');

  const commands = (category) => client.commands.filter((cmd) => cmd.category === category).map((cmd) => `| \`${cmd.name}\``);

  client.categories.forEach((c) => embed.addField(`${c}`, `${commands(c).join(' ')} |`));

  return message.reply({ embeds: [embed] });
}

function getCMD(client, message, input) {
  const cmd = client.commands.get(input.toLowerCase());

  const info = `No information found for command **${input.toLowerCase()}**`;

  if (!cmd) return message.reply(info);

  const embed = new MessageEmbed()
    .setAuthor(client.user.username)
    .setColor('AQUA')
    .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
    .setFooter('Syntax: <> = required, [] = optional');

  if (cmd.name) embed.addField('Command Name', cmd.name);
  if (cmd.description) embed.addField('Description', cmd.description);
  if (cmd.example) embed.addField('Example', cmd.example);

  return message.reply({ embeds: [embed] });
}
