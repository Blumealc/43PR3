var osc = new OSC();
osc.open({host:"192.168.1.121", port:9000}); // connect by default to ws://localhost:8080

document.getElementById('send').addEventListener('click', () => {
    var message = new OSC.Message('/test/random', Math.random());
    osc.send(message);
});
