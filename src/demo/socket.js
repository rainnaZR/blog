// socket.js

const net = require('net');
const chatServer = net.createServer(); // 新建服务器
const clientList = [];  // 客户端列表

// 服务器连接后触发事件
chatServer.on('connection', client => {
	// 连接上服务器后，客户端窗口接收内容'hi'
	client.write('hi\n');
	// 将当前客户端窗口保存到数组中
	clientList.push(client);
	// 客户端窗口输入数据后触发事件
	client.on('data', data => {
		console.log('receive', data.toString());
		// 数组中的每个客户端窗口接收相同的内容
		clientList.forEach(i => {
			i.write(data);
		})
	})
});

chatServer.listen(9000);