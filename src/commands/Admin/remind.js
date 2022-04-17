/* eslint-disable no-plusplus */
/* eslint-disable consistent-return */
const Models = require('../../database/schemas');
const { checkClanExist, coinsEmoji } = require('../../functions');

module.exports = {
  name: 'remind',
  description: 'Dms a user to remind of the donation',
  category: 'Admin',
  example: `${process.env.PREFIX}remind`,
  run: async (client, message) => {
    if (!message.member.permissions.has('ADMINISTRATOR')) return message.reply('This command can only be used by the server admin.');
    if (!await checkClanExist()) return message.reply(`The clan name is not registered. Please type \`${process.env.PREFIX}setclan <name>\` to register a clan name.`);

    const Member = Models.Member();

    const allMembers = await Member.findAll();

    if (!allMembers.length) return message.reply('There is no registered user');

    const Clan = Models.Clan();
    const clan = await Clan.findOne({ where: { id: 1 } });

    const allMemberData = allMembers.filter((m) => m.dataValues.donation < clan.get('requiredDonation'));

    if (!allMemberData.length) return message.reply('All users has fulfilled their donation requirement.');

    for (let i = 0; i < allMemberData.length; i++) {
      const { userId } = allMemberData[i].dataValues;
      const member = message.guild.members.cache.get(userId);
      member.user.send(`Hi! A friendly reminder of your donation ${clan.get('requiredDonation').toLocaleString()} ${coinsEmoji()} for this week in ${clan.get('name')}`).catch(() => {
        message.channel.send(`Unable to send a dm to ${member.user.tag}`);
      });
    }
  },
};
