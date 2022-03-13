const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'user', 'password', {
  host: 'localhost',
  logging: false,
  dialect: 'sqlite',
  storage: './database/database.sqlite',
});

module.exports = {
  Clan: () => {
    const Clan = sequelize.define('clan', {
      name: {
        type: Sequelize.STRING,
      },
      requiredDonation: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
    });

    Clan.sync();

    return Clan;
  },
  Member: () => {
    const Member = sequelize.define('member', {
      userId: {
        type: Sequelize.STRING,
        unique: true,
      },
      donation: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
    });

    Member.sync();

    return Member;
  },
};
