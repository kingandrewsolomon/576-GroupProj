const net = require('net');

const stdin = process.stdin;
stdin.setEncoding('utf-8');

const PORT = 1337;
require('dns').lookup(require('os').hostname(), function (err, add, fam) {
    runserver(add);
    runclient(add);
});

function runserver(address) {
    console.log("Server starting");
    console.log(address);
    let server = net.createServer(client => {
        console.log('Client connected');

        client.on('data', data => {
            console.log(data);
            // client.write('hello');
        });
        client.on('end', () => console.log('Client Disconnected'));
    });

    server.listen(PORT, address);

}

function runclient(address) {
    console.log("Client starting");
    let client = new net.Socket();
    let orig = address;
    let a = address.split('.');
    a[a.length - 1] = 0;
    address = a.join('.');
    connectToServer(orig, address, client);

}

function connectToServer(orig, address, client) {
    let a = address.split('.');
    a[a.length - 1] = (parseInt(a[a.length - 1]) + 1).toString();
    if (a[a.length - 1] > 255) {
        a[a.length - 2] = (parseInt(a[a.length - 2]) + 1).toString();
        a[a.length - 1] = 0;
    }

    address = a.join('.');
    if (orig == address)
        connectToServer(orig, address, client);
    let errorHandling = setTimeout(() => {
        // console.log("cannot connect to: " + address);
        connectToServer(orig, address, client);
    }, 500);
    client.connect(PORT, address, () => {
        console.log("Connected to the server");
        clearTimeout(errorHandling);
    });
    client.on('data', data => {
        console.log('data: ' + data);
    });
    client.on('error', e => {
        // console.log(e.toString());
    });

    stdin.on('data', (data) => {
        client.write(data);
    });
}