const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const noblox = require('noblox.js');
const config = require('../config.json')
module.exports = {
    data: new SlashCommandBuilder()
        .setName('payout')
        .setDescription('Payout Robux to a member in the Roblox group')
        .addStringOption(option =>
            option.setName('username')
                .setDescription('The username of the member to payout')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('The amount of Robux to payout')
                .setRequired(true)),
    async execute(interaction) {
        const requiredRoleName = 'Personnel'; 
        const memberRoles = interaction.member.roles.cache;
        const hasRole = memberRoles.some(role => role.name === requiredRoleName);
        if (!hasRole) {
            return interaction.reply('You do not have the required role to use this command.');
        }

        const username = interaction.options.getString('username');
        const amount = interaction.options.getInteger('amount');

        try {
            await interaction.deferReply();
        
            const userId = await noblox.getIdFromUsername(username);
            await noblox.groupPayout(config.GROUP_ID, userId, amount);
        
            const embed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('Payout Successful')
                .setDescription(`Successfully paid ${amount} Robux to ${username} in the Roblox group.`);
            
            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
        
            let errorDescription = `Failed to payout ${amount} Robux to ${username}: ${error.message}`;
        
            // Check for specific error codes or messages
            if (error.message.includes('403')) {
                errorDescription += '\nPlease verify your Roblox session or handle any challenges.';
            }
        
            const embedError = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('Error')
                .setDescription(errorDescription);
            
            await interaction.editReply({ embeds: [embedError] });
        }
    }        
};
