const WebSocket = require('ws');
var connected = [];

const wss = new WebSocket.Server({port:8080});

wss.on('connection',ws => {
	var username = '';
	
	
	console.log('[server] connected client...');
	
	
	ws.on('message',message=>{
		var _msg = JSON.parse(message);
		if (_msg['event'] == 'login'){
			connected.push(_msg['username']);
			message['connected'] = connected;
			wss.clients.forEach(client =>{
				if (client.readyState == WebSocket.OPEN){
					client.send(message, {binary: WebSocket.binary});
				}
			});
			return;
		}
		if (username == '') {
			username = JSON.parse(message)['username'];
		}
		
		wss.clients.forEach(client => {
			if (client.readyState == WebSocket.OPEN && !(ws == client)){
				client.send(message, {binary : WebSocket.binary});
			}
		})
	})

	ws.on('close', function (message) {
	  console.log(`[server] disconnect ${username} ...`);
	  wss.clients.forEach(function each (client) {
	    if (client !== ws && client.readyState === WebSocket.OPEN) {
	      client.send(JSON.stringify({
		username : username,
		event: 'logout',
	      }))
	    }
	  })
	})

})

