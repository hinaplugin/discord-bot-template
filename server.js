/**
 * 環境変数を読み込む
 */
require('dotenv').config();

/**
 * モジュールを読み込む
 */
const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

/**
 * Botクライアントを作成
 * 必要に応じてintentsを追加
 */
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers
    ]
});

/**
 * コマンド保持
 */
client.commands = new Collection();

/**
 * コマンドファイル（/commands）を読み込んでデプロイ
 */
async function loadAndDeployCommands(){
    const commands = [];
    const commandsPath = path.join(__dirname, 'commands');

    if (fs.existsSync(commandsPath)) {
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

        for (const file of commandFiles){
            const filePath = path.join(commandsPath, file);
            const command = require(filePath);

            if ('data' in command && 'execute' in command) {
                client.commands.set(command.data.name, command);
                commands.push(command.data.toJSON());
                console.log(`コマンドを読み込みました: ${command.data.name}`);
            }else{
                console.log(`${filePath}のコマンドは必要なプロパティがないため登録できません．`);
            }
        }
    }

    if (commands.length > 0) {
        try {
            // グローバルコマンドの場合は上を使用
            const rest = new REST().setToken(process.env.DISCORD_TOKEN);
            const data = await rest.put(
                Routes.applicationCommands(process.env.APPLICATION_ID), // グローバルコマンドの場合
                // Routes.applicationGuildCommands(process.env.APPLICATION_ID, process.env.GUILD_ID), // サーバーコマンドの場合
                { body: commands }
            );

            console.log(`${data.length}個のコマンドを登録しました．`);
        } catch (error) {
            
        }
    }
}

/**
 * デプロイ実行
 */
loadAndDeployCommands();

/**
 * イベントファイル（/events）を読み込む
 */
const eventsPath = path.join(__dirname, 'events');
if (fs.existsSync(eventsPath)) {
    const eventsFiles = fs.readFileSync(eventsPath).filter(file => file.endsWith('.js'));

    for (const file of eventsFiles){
        const filePath = path.join(eventsPath, file);
        const event = require(filePath);

        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        }else{
            client.on(event.name, (...args) => event.execute(...args));
        }
        console.log(`イベントを読み込みました: ${event.name}`);
    }
}

/**
 * Discordにログイン
 */
client.login(process.env.DISCORD_TOKEN);