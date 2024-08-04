const express = require('express');
const axios = require('axios');
const dns = require('dns');
const { Netmask } = require('netmask');
const ping = require('ping');

const app = express();
const port = 3000;

app.use(express.json());

app.post('/analyze', async (req, res) => {
    const { ip } = req.body;

    if (!ip) {
        return res.status(400).send({ error: 'IP address is required' });
    }

    try {
        const result = { ip };

        // Fetch IP geolocation data
        const geoData = await axios.get(`https://ipapi.co/${ip}/json/`);
        result.subnetMask = geoData.data.network_mask;
        result.defaultGateway = '192.168.1.1'; // Example default gateway
        result.dnsServers = ['8.8.8.8', '8.8.4.4']; // Example DNS servers

        // Reverse DNS lookup
        result.hostname = await reverseDnsLookup(ip);

        // Open ports and services
        result.openPorts = await scanOpenPorts(ip);

        // Device type and network topology
        result.deviceType = 'Router'; // Example device type
        result.networkTopology = 'Star'; // Example network topology

        // Latency and packet loss
        const pingResult = await ping.promise.probe(ip);
        result.latency = pingResult.time;
        result.packetLoss = pingResult.packetLoss;

        // Calculate network range
        const block = new Netmask(`${ip}/${result.subnetMask}`);
        result.networkRange = block.first + ' - ' + block.last;

        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'An error occurred while processing the IP address' });
    }
});

function reverseDnsLookup(ip) {
    return new Promise((resolve, reject) => {
        dns.reverse(ip, (err, hostnames) => {
            if (err) {
                return resolve('Unknown');
            }
            resolve(hostnames[0]);
        });
    });
}

async function scanOpenPorts(ip) {
    // Placeholder function - implement your own port scanning logic here
    return ['22 (SSH)', '80 (HTTP)', '443 (HTTPS)'];
}

app.listen(port, () => {
    console.log(`IP analyzer app listening at http://localhost:${port}`);
});
