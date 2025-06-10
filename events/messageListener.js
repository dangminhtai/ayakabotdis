const { Events } = require('discord.js');
const { generateResponse } = require('../config/aiConfig');
const ayakaHelpers = require('../utils/ayakaHelpers');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.bot) return;

        const client = message.client;
        const userId = message.author.id;
        const userLanguage = client.userLanguage?.get(userId) || 'vn';

        // Check for Ayaka mentions or references
        const isMentioned = message.mentions.users.has(client.user.id);
        const hasAyakaName = message.content.toLowerCase().includes('ayaka');
        let isReplyToAyaka = false;

        if (message.reference?.messageId) {
            try {
                const repliedMessage = await message.channel.messages.fetch(message.reference.messageId);
                isReplyToAyaka = repliedMessage.author.id === client.user.id;
            } catch (error) {
                console.warn('Could not fetch replied message:', error);
            }
        }

        // Process message if it mentions Ayaka or is a reply
        if (isMentioned || isReplyToAyaka || hasAyakaName) {
            try {
                // Show typing indicator
                await message.channel.sendTyping();

                const systemPrompt = ayakaHelpers.getPrompt(userLanguage);
                const chatContext = await ayakaHelpers.getChatContext(userId);

                // Add special context for mentions and replies
                let enhancedMessage = message.content;
                if (isMentioned) {
                    enhancedMessage = `[Direct mention] ${message.content}`;
                } else if (isReplyToAyaka) {
                    enhancedMessage = `[Reply to previous message] ${message.content}`;
                } else if (hasAyakaName) {
                    enhancedMessage = `[Mentioned by name] ${message.content}`;
                }

                const enhancedPrompt = ayakaHelpers.enhancePromptWithContext(
                    systemPrompt,
                    chatContext,
                    enhancedMessage,
                    userLanguage
                );

                const response = await generateResponse(enhancedMessage, enhancedPrompt, userLanguage);
                await message.reply(response);

                await ayakaHelpers.saveChatHistory(
                    userId,
                    message.author.username,
                    message.content,
                    response,
                    userLanguage
                );
            } catch (error) {
                console.error('Error in message listener:', error);
                const errorMessage = ayakaHelpers.getErrorMessage(userLanguage);
                await message.reply(errorMessage);
            }
        }
    },
};
