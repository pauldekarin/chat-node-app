let WebSocket = require('ws');
let wss = new WebSocket.Server({port:8080});
wss.connected = [];

wss.on('connection',ws => {
	ws.on('message',message=>{
		var _msg = JSON.parse(message);

		if (_msg['event'] == 'login'){
			ws.username = _msg['username'];
			wss.connected.push(_msg['username']);
			_msg['connected'] = wss.connected;

			wss.clients.forEach(client =>{
				if (client.readyState == WebSocket.OPEN){
					client.send(JSON.stringify(_msg), {binary: WebSocket.binary});
				}
			});
			return;
		}

		
		if (_msg['event'] == 'heartBeat' && _msg['content'] == 'ping'){
			ws.send(JSON.stringify({
				event : 'heartBeat',
				content : 'pong',
			}));
			return;
		}

		wss.clients.forEach(client => {
			if (client.readyState == WebSocket.OPEN && !(ws == client)){
				client.send(message, {binary : WebSocket.binary});
			}
		})
	})

	ws.on('close', function (message) {
	  wss.connected.splice(connected.indexOf(ws.username),1);
	  wss.clients.forEach(function each (client) {
	    if (client !== ws && client.readyState === WebSocket.OPEN) {
			client.send(JSON.stringify({
				username : ws.username,
				event: 'logout',
				connected:wss.connected
	      }))
	    }
	  })
	})

})

