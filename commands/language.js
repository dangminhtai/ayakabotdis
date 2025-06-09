const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('language')
        .setDescription('Thay đổi ngôn ngữ của Ayaka')
        .addStringOption(option =>
            option.setName('lang')
                .setDescription('Ngôn ngữ bạn muốn sử dụng')
                .setRequired(true)
                .addChoices(
                    { name: 'Tiếng Việt', value: 'vn' },
                    { name: 'English', value: 'en' }
                )),

    async execute(interaction) {
        const lang = interaction.options.getString('lang');
        
        // Khởi tạo Map nếu chưa có
        if (!interaction.client.userLanguage) {
            interaction.client.userLanguage = new Map();
        }
        
        // Lưu lựa chọn ngôn ngữ của user
        interaction.client.userLanguage.set(interaction.user.id, lang);
        
        const response = lang === 'vn' 
            ? '❄️ Tôi sẽ nói tiếng Việt với bạn từ giờ.'
            : '❄️ I will speak English with you from now on.';
            
        await interaction.reply({
            content: response,
            ephemeral: true
        });
    },
};