const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const noblox = require('noblox.js');
const config = require('../config.json');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('demote')
        .setDescription('Demote a member in the Roblox group')
        .addStringOption(option =>
            option.setName('username')
                .setDescription('The username of the member to demote')
                .setRequired(true)),
    async execute(interaction) {
        const requiredRoleName = 'Personnel'; // Replace with your role name
        const memberRoles = interaction.member.roles.cache;
        const hasRole = memberRoles.some(role => role.name === requiredRoleName);
        if (!hasRole) {
            return interaction.reply('You do not have the required role to use this command.');
        }

        const username = interaction.options.getString('username');

        try {
            await interaction.deferReply();

            const userId = await noblox.getIdFromUsername(username);
            await noblox.demote(config.GROUP_ID, userId);

            const embed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('Demotion Successful')
                .setDescription(`Successfully demoted ${username} in the Roblox group.`);
            
            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            const embedError = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('Error')
                .setDescription(`Failed to demote ${username}: ${error.message}`);
            
            await interaction.editReply({ embeds: [embedError] });
        }
    },
};
