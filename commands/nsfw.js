const { SlashCommandBuilder, ChannelType } = require('discord.js');
const ayakaNSFWVN = require('../language/ayaka_nsfw_vn');
const ayakaNSFWEN = require('../language/ayaka_nsfw_en');
const { generateResponse } = require('../config/aiConfig');

// Function to get NSFW prompt based on language
function getNSFWPrompt(language) {
    switch (language) {
        case 'en':
            return ayakaNSFWEN.AYAKA_NSFW_PROMPT;
        case 'vn':
        default:
            return ayakaNSFWVN.AYAKA_NSFW_PROMPT;
    }
}

// Function to get error message based on language
function getErrorMessage(language) {
    switch (language) {
        case 'en':
            return ayakaNSFWEN.ERROR_MESSAGE;
        case 'vn':
        default:
            return ayakaNSFWVN.ERROR_MESSAGE;
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nsfw')
        .setDescription('Chat with Ayaka in NSFW mode')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Your message to Ayaka')
                .setRequired(true)),

    async execute(interaction) {
        let deferred = false;
        try {
            // Defer reply trước để tránh timeout
            await interaction.deferReply();
            deferred = true;

            // Check if the channel is NSFW
            const channel = interaction.channel;
            console.log('Channel type:', channel.type);
            console.log('Is NSFW:', channel.nsfw);
            
            if (channel.type !== ChannelType.GuildText || !channel.nsfw) {
                return await interaction.editReply({
                    content: '❄️ This command can only be used in NSFW text channels!',
                    ephemeral: true
                });
            }

            const message = interaction.options.getString('message');
            const userLanguage = interaction.client.userLanguage?.get(interaction.user.id) || 'vn';
            const systemPrompt = getNSFWPrompt(userLanguage);

            try {
                const response = await generateResponse(message, systemPrompt, userLanguage);
                await interaction.editReply(response);
            } catch (error) {
                console.error('Error generating response:', error);
                const errorMessage = getErrorMessage(userLanguage);
                await interaction.editReply(errorMessage);
            }
        } catch (error) {
            console.error('Error in NSFW command:', error);
            
            // Nếu defer thất bại, thử reply trực tiếp
            try {
                if (!deferred && !interaction.replied) {
                    await interaction.reply({
                        content: '❄️ Có lỗi xảy ra khi thực hiện lệnh này!',
                        ephemeral: true
                    });
                } else if (!interaction.replied) {
                    await interaction.editReply('❄️ Có lỗi xảy ra khi thực hiện lệnh này!');
                }
            } catch (err) {
                console.error('Error sending fallback error message:', err);
            }
        }
    }
};
