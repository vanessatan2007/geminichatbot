export function appendMessage(sender, text) {
  const chatMessages = document.getElementById('chatMessages');
  const messageElement = document.createElement('div');
  messageElement.classList.add('message', sender.toLowerCase());
  messageElement.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chatMessages.appendChild(messageElement);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

document.addEventListener('DOMContentLoaded', () => {
  const userInput = document.getElementById('userInput');
  const sendButton = document.getElementById('sendButton');

  sendButton.addEventListener('click', async () => {
      const userText = userInput.value.trim();
      if (userText !== '') {
          appendMessage('User', userText);
          userInput.value = '';

          try {
              const response = await fetch('/generate-response', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ prompt: userText }),
              });

              const data = await response.json();
              appendMessage('Chatbot', data.response);
          } catch (error) {
              appendMessage('Chatbot', 'Failed to get a response. Please try again later.');
          }
      }
  });
});
