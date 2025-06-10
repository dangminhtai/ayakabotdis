# Ayaka Discord Bot

A Discord bot that simulates Kamisato Ayaka from Genshin Impact, providing an interactive and engaging chat experience.

## Features

- **Natural Conversation**: Ayaka responds naturally and maintains her character traits while being approachable and friendly
- **Multi-language Support**: Supports both English and Vietnamese
- **Chat History**: Maintains conversation context and can reference previous interactions
- **Character-Accurate**: Stays true to Ayaka's personality from Genshin Impact
- **Proactive Suggestions**: Can suggest new topics and activities to keep conversations engaging
- **Language Switching**: Easy language switching with chat history management

## Commands

- `/chat [message]` - Start a conversation with Ayaka
- `/language [en/vn]` - Switch between English and Vietnamese
- `/reset-chat` - Reset your chat history with Ayaka

## Setup

1. Clone the repository:
```bash
git clone [repository-url]
cd ayaka-discord-bot
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
DISCORD_TOKEN=your_discord_bot_token
GEMINI_API_KEY=your_gemini_api_key
```

4. Start the bot:
```bash
npm start
```

## Project Structure

```
├── commands/           # Bot commands
├── config/            # Configuration files
├── data/             # Data storage
├── events/           # Event handlers
├── language/         # Language files
├── utils/            # Utility functions
├── index.js          # Main bot file
└── package.json      # Project dependencies
```

## Dependencies

- discord.js - Discord API wrapper
- @google/generative-ai - Google's Gemini AI
- dotenv - Environment variable management
- express - Web server framework
- axios & node-fetch - HTTP clients

## Features in Detail

### Natural Conversation
- Maintains Ayaka's elegant and refined personality
- Can be playful and humorous while staying in character
- Uses appropriate Japanese terms and emojis
- Responds naturally to user interactions

### Multi-language Support
- Seamless switching between English and Vietnamese
- Maintains character consistency across languages
- Automatic chat history management when switching languages

### Chat History
- Stores conversation history per user
- Can reference previous interactions
- Maintains context for more natural conversations
- Automatically manages history when switching languages

### Character Accuracy
- Stays true to Ayaka's personality from Genshin Impact
- Maintains her knowledge of Inazuma's culture and traditions
- Balances tradition with modern interests
- Respects her role as the Yashiro Commission's heir

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 💬 Slash Commands

**📌 Cơ bản**
- `/ayaka` — Hiển thị ảnh Ayaka (SFW)
- `/chat [tin nhắn]` — Trò chuyện với Ayaka
- `/language [ngôn ngữ]` — Chọn ngôn ngữ (Tiếng Việt/English)

**🔞 NSFW**
- `/ayaka-nsfw` — Hiển thị ảnh Ayaka (NSFW)
- `/nsfw [tin nhắn]` — Trò chuyện với Ayaka trong chế độ NSFW (chỉ hoạt động trong kênh NSFW)

---

## 📬 Liên hệ

- **Discord**: `1149477475001323540`  
- **Email**: Dmt826321@gmail.com  
- **GitHub**: [dangminhtai](https://github.com/dangminhtai)  
- **Facebook**: [tamidanopro](https://facebook.com/tamidanopro)  

---

*Created with ❤️ by dangminhtai*