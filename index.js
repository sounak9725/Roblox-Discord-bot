const fs = require('fs');
const { Client, Collection, GatewayIntentBits, REST, Routes, EmbedBuilder } = require('discord.js');
const noblox = require('noblox.js');
const config = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Load commands
client.commands = new Collection();
const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
}

// Deploy commands to Discord
const rest = new REST({ version: '10' }).setToken(config.DISCORD_TOKEN);
(async () => {
    try {
        console.log('Started refreshing application (/) commands.');
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands }
        );
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();

// Log in to Roblox
noblox.setCookie(config.ROBLOX_COOKIE)
    .then(() => {
        console.log('Logged into Roblox');
    })
    .catch((error) => {
        console.error('Failed to log in to Roblox:', error);
    });

// When the client is ready, run this code
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

// Log in to Discord
client.login(config.DISCORD_TOKEN);
