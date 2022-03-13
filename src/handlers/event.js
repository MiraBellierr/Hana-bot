/* eslint-disable no-restricted-syntax */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
const { readdirSync } = require('fs');

module.exports = (client) => {
  const events = readdirSync('./src/events/');
  for (const event of events) {
    const file = require(`../events/${event}`);
    client.on(event.split('.')[0], (...args) => file(client, ...args));
  }
};
