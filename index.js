require('dotenv').config();
const { Client, GatewayIntentBits, Collection, REST, Routes, Events } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Tạo client Discord
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Tải lệnh từ thư mục ./commands
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// Đăng ký slash commands toàn cục
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log('🚀 Bắt đầu làm mới các slash command toàn cục...');

        const commands = [];
        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command = require(filePath);
            if ('data' in command && 'execute' in command) {
                client.commands.set(command.data.name, command);
                commands.push(command.data.toJSON());
                console.log(`✅ Đã load lệnh: ${command.data.name}`);
            } else {
                console.log(`⚠️ [WARNING] Lệnh ở ${filePath} thiếu "data" hoặc "execute".`);
            }
        }

        const data = await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands }
        );

        console.log(`🎉 Đã đăng ký ${data.length} slash command toàn cục thành công.`);
        console.log('⏳ Lưu ý: Có thể mất vài phút để lệnh hiển thị trên các máy chủ.');
    } catch (error) {
        console.error('❌ Lỗi khi làm mới lệnh:', error);
    }
})();

// Xử lý khi có người dùng sử dụng slash command
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) {
        console.error(`❌ Không tìm thấy lệnh: ${interaction.commandName}`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(`❌ Lỗi khi thực thi lệnh ${interaction.commandName}:`, error);
        try {
            if (interaction.replied || interaction.deferred) {
                await interaction.editReply({
                    content: '⚠️ Có lỗi xảy ra khi thực hiện lệnh này!',
                    ephemeral: true
                });
            } else {
                await interaction.reply({
                    content: '⚠️ Có lỗi xảy ra khi thực hiện lệnh này!',
                    ephemeral: true
                });
            }
        } catch (err) {
            console.error('❌ Lỗi khi phản hồi lỗi lệnh:', err);
        }
    }
});

// Đăng nhập bot và thông báo khi sẵn sàng
client.once('ready', () => {
    console.log(`🤖 Bot đã đăng nhập với tên: ${client.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN);

// EXPRESS SERVER để giữ bot hoạt động (nếu dùng nền tảng như Replit, Render,...)
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('🤖 Bot is running!');
});

app.listen(PORT, () => {
    console.log(`🌐 Express server đang lắng nghe tại cổng ${PORT}`);
});

// Register message listener
client.on(Events.MessageCreate, require('./events/messageListener').execute);
