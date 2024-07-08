const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const noblox = require('noblox.js');
const config = require('../config.json')
module.exports = {
    data: new SlashCommandBuilder()
        .setName('promote')
        .setDescription('Promote a user in the Roblox group')
        .addStringOption(option =>
            option.setName('username')
                .setDescription('The username of the Roblox user to promote')
                .setRequired(true)),
    async execute(interaction) {
        const username = interaction.options.getString('username');

        try {
            await interaction.deferReply();

            const userId = await noblox.getIdFromUsername(username);
            await noblox.promote(config.GROUP_ID, userId);

            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('Promotion Successful')
                .setDescription(`Successfully promoted ${username}.`);

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            const embedError = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('Error')
                .setDescription(`Failed to promote ${username}: ${error.message}`);

            await interaction.editReply({ embeds: [embedError] });
        }
    },
};
