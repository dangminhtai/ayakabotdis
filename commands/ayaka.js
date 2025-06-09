const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const historyPath = path.join(__dirname, '../data/ayaka_history.json');
let history = {};

if (fs.existsSync(historyPath)) {
  history = JSON.parse(fs.readFileSync(historyPath, 'utf8'));
}

function saveHistory() {
  fs.writeFileSync(historyPath, JSON.stringify(history, null, 2));
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ayaka')
    .setDescription('Hiển thị ảnh Ayaka (sfw)'),

  async execute(interaction) {
    const userId = interaction.user.id;
    const seenIds = history[userId] || [];

    try {
      await interaction.deferReply(); // ngăn timeout interaction

      const query = 'kamisato_ayaka rating:safe';
      const url = `https://danbooru.donmai.us/posts.json?limit=100&tags=${encodeURIComponent(query)}`;
      const res = await axios.get(url, {
        headers: {
          'User-Agent': 'AyakaBot/1.0'
        }
      });
      const data = res.data;

      if (!Array.isArray(data) || data.length === 0) {
        return interaction.editReply('❄️ Không tìm thấy ảnh Ayaka nào.');
      }

      const valid = data.filter(post => post.file_url && !post.file_url.endsWith('.webm'));
      const unseen = valid.filter(post => !seenIds.includes(post.id));

      let chosen;
      let replyContent = null;

      if (unseen.length > 0) {
        chosen = unseen[Math.floor(Math.random() * unseen.length)];
        history[userId] = [...seenIds, chosen.id];
        saveHistory();
      } else {
        chosen = valid[Math.floor(Math.random() * valid.length)];
        replyContent = '❄️ Bạn đã xem hết ảnh mới rồi~ Đây là ảnh cũ nè!';
      }

      const embed = new EmbedBuilder()
        .setTitle('❄️ Kamisato Ayaka')
        .setImage(chosen.file_url)
        .setURL('https://discord.gg/jtCrdcvbeR')
        .setFooter({ text: 'Nhấn vào link để xem chi tiết' });

      return interaction.editReply({
        content: replyContent,
        embeds: [embed]
      });

    } catch (err) {
      console.error('[LỖI API]:', err.message);

      // Tránh lỗi Unknown interaction
      if (interaction.deferred || interaction.replied) {
        return interaction.followUp({
          content: '❄️ Có lỗi khi lấy hình ảnh, vui lòng thử lại sau.',
          ephemeral: true
        });
      } else {
        return interaction.reply({
          content: '❄️ Có lỗi khi lấy hình ảnh, vui lòng thử lại sau.',
          ephemeral: true
        });
      }
    }
  }
};
