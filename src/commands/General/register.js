/* eslint-disable consistent-return */
const Models = require('../../database/schemas');

module.exports = {
  name: 'register',
  description: 'adds a user in the bot database',
  category: 'General',
  example: `${process.env.PREFIX}register`,
  run: async (client, message) => {
    const Member = Models.Member();

    try {
      Member.create({
        userId: message.author.id,
      });

      return message.reply(`User Added! Please type \`${process.env.PREFIX}info\` to view donation.`);
    } catch (e) {
      if (e.name === 'SequelizeUniqueConstraintError') return message.reply(`You have registered! Please type \`${process.env.PREFIX}info\` to view donation.`);
      return message.reply(`An error occured ${e.message}`);
    }
  },
};
