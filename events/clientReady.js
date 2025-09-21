const { Events, ActivityType } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client){
        client.user.setPresence({
            activities: [{
                name: 'テンプレートBot',
                type: ActivityType.Playing
            }],
            status: 'online'
        });
        console.log(`${client.user?.username ?? `Unknown`}が起動しました!`);
    }
}