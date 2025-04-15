const net = require('net');

function findOpenPort(startPort, endPort) {
    let port = startPort;

    const checkPort = (port) => {
        return new Promise((resolve) => {
            const server = net.createServer();
            server.listen(port, () => {
                server.close(() => resolve(port));
            });
            server.on('error', () => resolve(null));
        });
    };

    const scanPorts = async () => {
        while (port <= endPort) {
            const openPort = await checkPort(port);
            if (openPort) {
                console.log(`Open port found: ${openPort}`);
                return openPort;
            }
            port++;
        }
        console.log('No open ports found in the range.');
        return null;
    };

    return scanPorts();
}

findOpenPort(4000, 5000);