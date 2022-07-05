const OSC = require('osc-js')
const maxApi = require('max-api');

// avvia un web socket su ws://192.168.1.121:9000
const config = { udpClient: { host:"192.168.1.121", port: 9000 }, wsServer: {host:"192.168.1.121", port: 9000} }
const osc = new OSC({ plugin: new OSC.BridgePlugin(config) })
osc.open() 

// riceve in ingresso e invia tramite OSC
maxApi.addHandler(
	"send", (...args)=>{
		var message = new OSC.Message(args[0], args[1]);
		osc.send(message);
	}
);