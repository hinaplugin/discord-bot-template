const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('ヘルプ表示')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {
        const embed = new EmbedBuilder()
        .setTitle('テンプレートBotのヘルプ')
        .setDescription('テンプレートBotのコマンド一覧')
        .addFields(
            {
                name: 'help',
                value: '`/help` - ヘルプを表示',
                inline: false
            }
        )
        .setFooter({
            text: `実行者: ${interaction.user.tag}`
        });

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
}