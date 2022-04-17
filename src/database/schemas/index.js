const Sequelize = require("sequelize");

const sequelize = new Sequelize("database", "user", "password", {
	host: "localhost",
	logging: false,
	dialect: "sqlite",
	storage: "./database/database.sqlite",
});

module.exports = {
	Clan: () => {
		const Clan = sequelize.define("clan", {
			name: {
				type: Sequelize.STRING,
			},
			requiredDonation: {
				type: Sequelize.INTEGER,
				defaultValue: 0,
			},
			role: {
				type: Sequelize.STRING,
				unique: true,
			},
			rolexp: {
				type: Sequelize.BIGINT,
			},
			generalxp: {
				type: Sequelize.BIGINT,
			},
			roleTimeout: {
				type: Sequelize.BIGINT,
			},
		});

		Clan.sync();

		return Clan;
	},
	Member: () => {
		const Member = sequelize.define("member", {
			userId: {
				type: Sequelize.STRING,
				unique: true,
			},
			donation: {
				type: Sequelize.INTEGER,
				defaultValue: 0,
			},
			roleGained: {
				type: Sequelize.BOOLEAN,
				defaultValue: false,
			},
			xpGained: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
			},
			activeRole: {
				type: Sequelize.DATE,
			},
		});

		Member.sync();

		return Member;
	},
	Channel: () => {
		const Channel = sequelize.define("channel", {
			channelId: {
				type: Sequelize.STRING,
				unique: true,
			},
			xp: {
				type: Sequelize.BIGINT,
			},
		});

		Channel.sync();

		return Channel;
	},
};
