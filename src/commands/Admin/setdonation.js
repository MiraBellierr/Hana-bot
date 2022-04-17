/* eslint-disable consistent-return */
const Models = require('../../database/schemas');
const { checkClanExist, coinsEmoji } = require('../../functions');

module.exports = {
  name: 'setdonation',
  description: 'sets a required donation amount',
  category: 'Admin',
  example: `${process.env.PREFIX}setdonation <amount>`,
  run: async (client, message, args) => {
    if (!message.member.permissions.has('ADMINISTRATOR')) return message.reply('This command can only be used by the server admin.');
    if (!await checkClanExist()) return message.reply(`The clan name is not registered. Please type \`${process.env.PREFIX}setclan <name>\` to register a clan name.`);
    if (!args.length) return message.reply('Please state the amount of the required donation.');
    if (Number.isNaN(Number(args[0]))) return message.reply('Plase state an amount in number.');

    const amount = parseInt(args[0], 10);

    const Clan = Models.Clan();

    Clan.update({ requiredDonation: amount }, { where: { id: 1 } });

    message.reply(`Successfully set a required donation amount to ${amount.toLocaleString()} ${coinsEmoji()}`);
  },
};
