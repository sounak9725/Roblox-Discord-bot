const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const noblox = require('noblox.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription('Get the Roblox profile of a user')
        .addStringOption(option =>
            option.setName('username')
                .setDescription('The username of the Roblox user')
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
            const userProfile = await noblox.getPlayerInfo(userId);

            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle(`${userProfile.username}'s Profile`)
                .setURL(`https://www.roblox.com/users/${userId}/profile`)
                .setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${userId}&width=420&height=420&format=png`)
                .addFields(
                    { name: 'Username', value: userProfile.username || 'N/A', inline: true },
                    { name: 'User ID', value: userId.toString(), inline: true },
                    { name: 'Display Name', value: userProfile.displayName || 'N/A', inline: true },
                    { name: 'Description', value: userProfile.blurb || 'No description', inline: false },
                    { name: 'Join Date', value: new Date(userProfile.joinDate).toDateString() || 'N/A', inline: true },
                    { name: 'Friends Count', value: String(userProfile.friendCount) || 'N/A', inline: true },
                    { name: 'Followers Count', value: String(userProfile.followerCount) || 'N/A', inline: true },
                    { name: 'Following Count', value: String(userProfile.followingCount) || 'N/A', inline: true }
                );

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            const embedError = new EmbedBuilder()
                .setColor('#23272A')
                .setTitle('Error')
                .setDescription(`Failed to fetch profile for ${username}: ${error.message}`);

            await interaction.editReply({ embeds: [embedError] });
        }
    },
};
