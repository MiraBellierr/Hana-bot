const Models = require("../database/schemas");

module.exports = {
	async getMember(message, toFind = "") {
		toFind = toFind.toLowerCase();
		let target = false;
		const members = await message.guild.members.fetch();

		target = await members.get(toFind);

		if (!target) {
			target = message.guild.members.cache.get(toFind);
		} else if (!target.user) {
			target = message.guild.members.cache.get(toFind);
		}

		if (!target && message.mentions.members) {
			target = message.mentions.members.first();
		}
		if (!target && toFind) {
			target = members.find((member) => member.displayName.toLowerCase().includes(toFind) || member.user.tag.toLowerCase().includes(toFind));
		}

		return target;
	},
	async checkMemberExist(userId) {
		const Member = Models.Member();

		const member = await Member.findOne({ where: { userId } });

		if (!member) {
			return false;
		}

		return true;
	},
	async checkClanExist() {
		const Clan = Models.Clan();

		const clan = await Clan.findOne({ where: { id: 1 } });

		if (!clan) {
			return false;
		}

		return true;
	},
	coinsEmoji() {
		return "<:gold_coins:881053180333527071>";
	},
	splitArrayIntoChunksOfLen(arr, len) {
		const chunks = [];
		const n = arr.length;
		let i = 0;

		while (i < n) {
			chunks.push(arr.slice(i, i += len));
		}
		return chunks;
	},
};
