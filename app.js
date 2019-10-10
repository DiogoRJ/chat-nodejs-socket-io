/* importar as configurações do servidor */
var app = require('./config/server');

/* parametrizar porta de escuta */
var server = app.listen(3000, function(){
    console.log('Servidor online');
})

var io = require('socket.io').listen(server);

app.set('io', io);

/* criar a conexão por websocket */
io.on('connection', function(socket){
    console.log('Usuário conectou');

    socket.on('disconnect', function(){
        console.log('Usuário desconectou');
    })

    /* dialogo do chat */
    socket.on('msgParaServidor', function(data){
        
        /* verificar se mensagem não está vazia */
        if(data.mensagem.length != 0){
            socket.emit(
                'msgParaCliente',
                {apelido: data.apelido, mensagem: data.mensagem}
            );
    
        /* enviar mensagem para todos */
            socket.broadcast.emit(
                'msgParaCliente',
                {apelido: data.apelido, mensagem: data.mensagem}
            );

        } 

        /* participantes */
        if(parseInt(data.apelido_atualizado_nos_clientes) == 0){
            socket.emit(
                'participantesParaCliente',
                {apelido: data.apelido}
            );
            socket.broadcast.emit(
                'participantesParaCliente',
                {apelido: data.apelido}
            );
        }
    });
});