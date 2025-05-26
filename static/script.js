const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const message = input.value.trim();
  if (!message) return;

  appendMessage('user', message);
  input.value = '';

  appendMessage('bot', '⏳ Thinking...');

  try {
    const res = await fetch('/devops', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });

    const data = await res.json();
    replaceLastBotMessage(data.response || '⚠️ No response received.');
  } catch (err) {
    replaceLastBotMessage("⚠️ Error contacting backend.");
  }
});

function appendMessage(sender, message) {
  const div = document.createElement('div');
  div.className = `message ${sender}`;
  div.textContent = `${sender === 'user' ? 'You' : 'Copilot'}: ${message}`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function replaceLastBotMessage(newMessage) {
  const botMessages = document.querySelectorAll('.message.bot');
  const lastBot = botMessages[botMessages.length - 1];
  if (lastBot) lastBot.textContent = `Copilot: ${newMessage}`;
}

