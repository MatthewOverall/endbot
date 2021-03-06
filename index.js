"use strict";

console = require("./src/misc/FancyConsole");
const EndBot = require("./src/EndBot");
const client = module.exports = new EndBot();

console.log("Logging in...");
client.login(client.token);

if (client.flags.debug) client.on("debug", console.log);

client.once("ready", () => {
	if (!client.flags.noservers) {
		client.initServers();
	}
	console.log("EndBot is on! 😎");
});

client.on("message", client.filterDiscord);
