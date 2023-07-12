const WebSocket = require('ws');

const wss = new WebSocket.Server({port:8080});

wss.on('connection',ws => {
	var username = '';

	ws.on('message',message=>{
		if (username == '') username = JSON.parse(message)['username'];

		wss.clients.forEach(client => {
			if (client.readyState == WebSocket.OPEN && !(ws == client)){
				client.send(message, {binary : WebSocket.binary});
			}
		})
	})

	ws.on('close', function (message) {
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

