/*
* Nuke command by CMNTS#8876
*
* Made for SuppotBot from Emerald Services
*
* */

const Discord = require("discord.js");
const fs = require("fs");



const yaml = require('js-yaml');

// location for the addons configuration, to keep it simple we generate a settings folder within the addons directory.
const settings = yaml.load(fs.readFileSync('./addons/settings/nuke.yml', 'utf8'));
const supportbot = yaml.load(fs.readFileSync('./supportbot-config.yml', 'utf8'));

module.exports = {
    name: settings.nukeCommand,
    description: settings.nukeCommandDesc,

    execute(message, args) {

        let Admins = message.guild.roles.cache.find(adminRole => adminRole.name === supportbot.Admin);
        let Staff = message.guild.roles.cache.find(staffRole => staffRole.name === supportbot.Staff);

        const NoPerms = new Discord.MessageEmbed()
            .setTitle("Invalid Permissions!")
            .setDescription(`${supportbot.IncorrectPerms}\n\nYou dont have any of these roles: \`\`${Admins.name}\`\` or \`\`${Staff.name}\`\``)
            .setColor(supportbot.WarningColour)

        if (!message.member.roles.cache.has(Staff.id || Admins.id))
            return message.channel.send({ embed: NoPerms }).then(r => r.delete({ timeout: 10000, reason : "Does not have required role." }));

        const cloned = new Discord.MessageEmbed()
            .setTitle("Channel Nuked.")
            .setColor(supportbot.EmbedColour)

        let parent = message.channel.parent

        message.channel.clone().then(r => {
            r.setParent(parent)
            r.send({ embed: cloned }).then(r => r.delete({ timeout: 10000 }));
        })

        message.channel.delete();
    }
};
