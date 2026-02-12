const chatHistory = document.getElementById('chat-history');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const loadingIndicator = document.getElementById('loading-indicator');

// Function to add message to UI
function addMessage(text, sender) {
    const div = document.createElement('div');
    div.classList.add('message', `${sender}-message`);
    
    // Simple markdown parsing for bold text (optional)
    const formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    div.innerHTML = `<div class="message-content">${formattedText}</div>`;
    chatHistory.appendChild(div);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = userInput.value.trim();
    if (!message) return;

    // 1. Show User Message
    addMessage(message, 'user');
    userInput.value = '';
    loadingIndicator.classList.remove('hidden');

    try {
        // 2. Send to our Vercel API
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });

        const data = await response.json();

        // 3. Show Bot Response
        loadingIndicator.classList.add('hidden');
        if (data.error) {
            addMessage("⚠️ Sorry, I'm having trouble connecting to the herbs library.", 'bot');
        } else {
            addMessage(data.reply, 'bot');
        }

    } catch (error) {
        console.error(error);
        loadingIndicator.classList.add('hidden');
        addMessage("⚠️ Network error. Please try again.", 'bot');
    }
});
