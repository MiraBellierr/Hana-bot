/* eslint-disable no-plusplus */
/* eslint-disable consistent-return */
const Models = require('../../database/schemas');

module.exports = {
  name: 'reset',
  description: 'resets the amount donated of all users in the system',
  category: 'Admin',
  example: `${process.env.PREFIX}reset`,
  run: async (client, message) => {
    if (!message.member.permissions.has('ADMINISTRATOR')) return message.reply('This command can only be used by the server admin.');

    const Member = Models.Member();

    const AllMemberUserId = await Member.findAll({ attributes: ['userId'] });

    const userIds = AllMemberUserId.map((element) => element.dataValues.userId);

    Member.update({ donation: 0 }, { where: { userId: userIds } });

    message.react('✅');
  },
};
