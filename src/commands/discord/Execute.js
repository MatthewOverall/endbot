"use strict";

const Command = require("../Command.js");

const invalidCommands = require("../../assets/invalid_commands.json");

class Execute extends Command {
	constructor(client) {
		super(client);
		this.info = {
			"name": "Execute",
			"usage": "execute",
			"description": "Execute a command on a server from a bridge channel"
		};
	}

	async run(message, args) {
		if (!message.member.roles.cache.has(this.client.config["op-role"])) {
			await message.channel.send("da fuck you tryin' to do");
			return;
		}

		let rcon = this.client.bridges.get(message.channel.id).rcon;
		let command = args.join(" ");

		if (rcon == undefined) {
			let embed = this.client.errorEmbed("bridge");
			await message.channel.send(embed);
			return;
		}

		let response = await rcon.sendCommand(command);
		let embedType = "result";
		console.log(response);
		for (let i = 0; i < invalidCommands.length; i++) {
			let error = invalidCommands[i];
			if (response.body.includes(error)) {
				embedType = "error";
				break;
			}
		}

		let endOfTitle = response.body.length - command.length - "<--[HERE]".length;
		let title = response.body.substring(0, endOfTitle);
		let description = response.body.substring(endOfTitle);
		let embed = this.client.createEmbed(embedType)
			.setTitle(title)
			.setDescription(description);
		await message.channel.send(embed);
	}

	toString() {
		return this.info;
	}
}

module.exports = Execute;
