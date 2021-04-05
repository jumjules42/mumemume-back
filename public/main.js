const socket = io.connect('http://localhost:9000', { forceNew: true });

socket.on('messages', function (data) {
    console.log(data);
    render(data);
});

function render(data) {
    const html = data
        .map(
            (el) =>
                `<div>
                    <strong>${el.author}</strong>
                    <em>${el.text}</em>
                </div>`
        )
        .join(' ');

    document.getElementById('messages').innerHTML = html;
}

function addMessage(event) {
    const payload = {
        id: Date.now(),
        text: document.getElementById('text').value,
        author: document.getElementById('username').value,
    };

    socket.emit('newMessage', payload);
    return false;
}

function removeAllMessages() {
    socket.emit('clearAllMessages', null);
    console.log('Executed');
    return true;
}
