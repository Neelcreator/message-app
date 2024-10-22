const socket = new WebSocket('ws://192.168.74.42:3000');

socket.onmessage = function(event) {
    const chatWindow = document.getElementById('chatWindow');
    const messageData = JSON.parse(event.data);

    if (messageData.type === 'text') {
        const message = document.createElement('div');
        message.classList.add('message');
        message.textContent = messageData.content;
        chatWindow.appendChild(message);
    } else if (messageData.type === 'image' || messageData.type === 'video') {
        const media = document.createElement(messageData.type === 'image' ? 'img' : 'video');
        media.src = messageData.content;
        if (messageData.type === 'video') {
            media.controls = true;
        }
        media.classList.add('media');
        chatWindow.appendChild(media);
    }

    chatWindow.scrollTop = chatWindow.scrollHeight; // Scroll to the bottom
};

function sendMessage() {
    const textInput = document.getElementById('textInput');
    const fileInput = document.getElementById('fileInput');

    if (textInput.value) {
        const messageData = {
            type: 'text',
            content: textInput.value
        };
        socket.send(JSON.stringify(messageData));
        textInput.value = ''; // Clear the input
    }

    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const fileURL = URL.createObjectURL(file);
        const messageData = {
            type: file.type.startsWith('image/') ? 'image' : 'video',
            content: fileURL
        };
        socket.send(JSON.stringify(messageData));
        fileInput.value = ''; // Clear the file input
    }
}
