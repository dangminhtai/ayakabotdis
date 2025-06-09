const { SlashCommandBuilder } = require('discord.js');
const ayakaVN = require('../language/ayaka_vn');
const ayakaEN = require('../language/ayaka_en');
const { generateResponse } = require('../config/aiConfig');

// Function to get prompt based on language
function getPrompt(language) {
    switch (language) {
        case 'en':
            return ayakaEN.AYAKA_PROMPT;
        case 'vn':
        default:
            return ayakaVN.AYAKA_PROMPT;
    }
}

// Function to get error message based on language
function getErrorMessage(language) {
    switch (language) {
        case 'en':
            return ayakaEN.ERROR_MESSAGE;
        case 'vn':
        default:
            return ayakaVN.ERROR_MESSAGE;
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('chat')
        .setDescription('Chat with Ayaka')
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

            const message = interaction.options.getString('message');
            const userLanguage = interaction.client.userLanguage?.get(interaction.user.id) || 'vn';
            const systemPrompt = getPrompt(userLanguage);

            try {
                const response = await generateResponse(message, systemPrompt, userLanguage);
                await interaction.editReply(response);
            } catch (error) {
                console.error('Error generating response:', error);
                const errorMessage = getErrorMessage(userLanguage);
                await interaction.editReply(errorMessage);
            }
        } catch (error) {
            console.error('Error in chat command:', error);
            
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