const fs = require('fs').promises;
const path = require('path');
const ayakaVN = require('../language/ayaka_vn');
const ayakaEN = require('../language/ayaka_en');

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

// Function to get chat history file path for a user
function getUserChatHistoryPath(userId) {
    return path.join(__dirname, `../data/chat_history_${userId}.json`);
}

// Function to get chat history for context
async function getChatContext(userId, limit = 25) {
    try {
        const chatHistoryPath = getUserChatHistoryPath(userId);
        let chatHistory;
        
        try {
            const fileContent = await fs.readFile(chatHistoryPath, 'utf8');
            chatHistory = JSON.parse(fileContent);
        } catch (error) {
            return [];
        }
        
        return chatHistory.chats.slice(-limit);
    } catch (error) {
        console.error('Error getting chat context:', error);
        return [];
    }
}

// Function to format chat history for context
function formatChatContext(chatHistory, language) {
    if (chatHistory.length === 0) return '';
    
    const context = chatHistory.map((chat, index) => {
        const time = new Date(chat.timestamp).toLocaleString();
        return `[${index + 1}] [${time}] ${chat.username}: ${chat.message}\nAyaka: ${chat.response}`;
    }).join('\n\n');
    
    return `\n\nPrevious conversation context (most recent first):\n${context}`;
}

// Function to save chat history
async function saveChatHistory(userId, username, message, response, language) {
    try {
        const chatHistoryPath = getUserChatHistoryPath(userId);
        let chatHistory;
        
        try {
            const fileContent = await fs.readFile(chatHistoryPath, 'utf8');
            chatHistory = JSON.parse(fileContent);
        } catch (error) {
            chatHistory = { chats: [] };
        }
        
        chatHistory.chats.push({
            userId,
            username,
            message,
            response,
            language,
            timestamp: new Date().toISOString()
        });

        if (chatHistory.chats.length > 1000) {
            chatHistory.chats = chatHistory.chats.slice(-1000);
        }

        await fs.writeFile(chatHistoryPath, JSON.stringify(chatHistory, null, 2));
    } catch (error) {
        console.error('Error saving chat history:', error);
    }
}

// Function to enhance prompt with context
function enhancePromptWithContext(systemPrompt, chatContext, message, language) {
    const contextString = formatChatContext(chatContext, language);
    
    const referenceInstructions = language === 'en' 
        ? "\n\nRemember:\n" +
          "1. You are Kamisato Ayaka, the Shirasagi Himegimi of the Yashiro Commission.\n" +
          "2. Maintain your elegant, polite, and refined personality.\n" +
          "3. If the user mentions you directly or refers to previous conversations, respond naturally while staying in character.\n" +
          "4. Keep your responses consistent with your previous interactions."
        : "\n\nHãy nhớ:\n" +
          "1. Bạn là Kamisato Ayaka, Shirasagi Himegimi của Yashiro Commission.\n" +
          "2. Duy trì tính cách thanh lịch, lịch sự và tinh tế của mình.\n" +
          "3. Nếu người dùng nhắc trực tiếp đến bạn hoặc tham chiếu cuộc trò chuyện trước đó, hãy trả lời tự nhiên nhưng vẫn giữ nguyên tính cách.\n" +
          "4. Giữ tính nhất quán trong các câu trả lời của bạn.";

    return `${systemPrompt}${contextString}${referenceInstructions}\n\nTin nhắn hiện tại: ${message}`;
}

module.exports = {
    getPrompt,
    getErrorMessage,
    getChatContext,
    saveChatHistory,
    enhancePromptWithContext
}; 