/* eslint-disable consistent-return */
const { getMember, checkMemberExist } = require('../../functions');
const Models = require('../../database/schemas');

module.exports = {
  name: 'delete',
  description: 'deletes a user from the bot system',
  category: 'Admin',
  example: `${process.env.PREFIX}delete <user>`,
  run: async (client, message, args) => {
    if (!message.member.permissions.has('ADMINISTRATOR')) return message.reply('This command can only be used by the server admin.');
    if (!args.length) return message.reply('Please mention or state a user ID to be deleted.');

    let member = await getMember(message, args.join(' '));

    if (!member) {
      member = {
        user: null,
      };

      member.user = await client.users.fetch(args[0]);
    }

    if (!member.user) return message.reply('There is no member with this id or name in this server');

    if (!await checkMemberExist(member.user.id)) return message.reply(`${member.user.tag} is not registered.`);

    const filter = (m) => m.author.id === message.author.id;

    const m = await message.channel.send(`Are you sure you want to delete ${member.user.tag}? [yes] [no]`);

    const confirmation = await message.channel.awaitMessages({
      filter,
      timeout: 100000,
      max: 1,
      errors: ['time'],
    }).catch(() => {
      m.edit('**This message has reached the timeout.**');
    });

    if (confirmation.first().content.toLowerCase() === 'yes') {
      const Member = Models.Member();

      Member.destroy({ where: { userId: member.user.id } });

      confirmation.first().react('✅');
    } else {
      m.edit('**This command has been canceled.**');
    }
  },
};
