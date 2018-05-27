var socket = io();

socket.on('send_text', (text) => {
    sendMessage(text,'left');
});

function sendMessage(text, message_side) {
    if (text.trim() === '') {
        return;
    }
    $('.message_input').val('');
    var messages_box = $('.messages');
    var message = $($('.message_template').clone().html());
    message.addClass(message_side).find('.text').html(text);
    messages_box.append(message);
    setTimeout(() => message.addClass('appeared'), 0);
    messages_box.animate({ scrollTop: messages_box.prop('scrollHeight') }, 300);
};

$('.send_message').click((e) => {
    var s = $('.message_input').val();
    if(s == 'clear') {
        $('.messages').html('');
        sendMessage('Đã xoá!','left');
    } else {
        socket.emit('send_text',s)
        sendMessage(s,'right');
    }
});

$('.message_input').keyup((e) => {
    if (e.which === 13) {
        var s = $('.message_input').val();
        if(s == 'clear') {
            $('.messages').html('');
            sendMessage('Đã xoá!','left');
        } else {
            socket.emit('send_text',s)
            sendMessage(s,'right');
        }
    }
});

sendMessage('Xin chào, bạn hãy gửi link cho mình! :v<br>Để xoá khung chat, nhắn: "clear" nhé!','left');