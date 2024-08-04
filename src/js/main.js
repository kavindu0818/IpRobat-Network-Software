document.getElementById('subBtn').addEventListener('click', function() {
    const ipAddress = document.getElementById('ipAddress').value;
    if (ipAddress) {
        const networkDetails = getNetworkDetails(ipAddress);
        console.log(networkDetails); // Debugging log
        displayResults(networkDetails);
    } else {
        alert('Please enter a valid IP address.');
    }
});

function getNetworkDetails(ipAddress) {
    function getClass(ip) {
        const firstOctet = parseInt(ip.split('.')[0]);
        if (firstOctet >= 0 && firstOctet <= 127) {
            return 'A';
        } else if (firstOctet >= 128 && firstOctet <= 191) {
            return 'B';
        } else if (firstOctet >= 192 && firstOctet <= 223) {
            return 'C';
        } else if (firstOctet >= 224 && firstOctet <= 239) {
            return 'D';
        } else if (firstOctet >= 240 && firstOctet <= 255) {
            return 'E';
        } else {
            return 'Unknown';
        }
    }

    function getSubnetMask(ipClass) {
        switch (ipClass) {
            case 'A':
                return '255.0.0.0';
            case 'B':
                return '255.255.0.0';
            case 'C':
                return '255.255.255.0';
            default:
                return 'Unknown';
        }
    }

    function getDefaultGateway(ipAddress) {
        const ipParts = ipAddress.split('.');
        ipParts[ipParts.length - 1] = '1';
        return ipParts.join('.');
    }

    function getDNSServers() {
        return ['8.8.8.8', '8.8.4.4'];
    }

    function getBroadcastIP(ipAddress, subnetMask) {
        const ipParts = ipAddress.split('.').map(Number);
        const maskParts = subnetMask.split('.').map(Number);
        const broadcastParts = ipParts.map((part, index) => part | (~maskParts[index] & 255));
        return broadcastParts.join('.');
    }

    function getNetworkIP(ipAddress, subnetMask) {
        const ipParts = ipAddress.split('.').map(Number);
        const maskParts = subnetMask.split('.').map(Number);
        const networkParts = ipParts.map((part, index) => part & maskParts[index]);
        return networkParts.join('.');
    }

    function getIPRange(networkIP, broadcastIP) {
        return `${networkIP} - ${broadcastIP}`;
    }

    function getBinarySubnetMask(subnetMask) {
        return subnetMask.split('.').map(part => parseInt(part, 10).toString(2).padStart(8, '0')).join('.');
    }

    function getIPType(ipAddress) {
        const [firstOctet, secondOctet] = ipAddress.split('.').map(Number);

        if (firstOctet === 10) {
            return 'Private';
        } else if (firstOctet === 172 && secondOctet >= 16 && secondOctet <= 31) {
            return 'Private';
        } else if (firstOctet === 192 && secondOctet === 168) {
            return 'Private';
        } else if ((firstOctet === 127 && secondOctet >= 0 && secondOctet <= 255) || firstOctet === 0) {
            return 'Reserved';
        } else if (firstOctet >= 224 && firstOctet <= 239) {
            return 'Multicast';
        } else if (firstOctet >= 240 && firstOctet <= 255) {
            return 'Reserved';
        } else {
            return 'Public';
        }
    }

    const ipClass = getClass(ipAddress);
    const subnetMask = getSubnetMask(ipClass);
    const defaultGateway = getDefaultGateway(ipAddress);
    const dnsServers = getDNSServers();
    const broadcastIP = getBroadcastIP(ipAddress, subnetMask);
    const networkIP = getNetworkIP(ipAddress, subnetMask);
    const ipRange = getIPRange(networkIP, broadcastIP);
    const binarySubnetMask = getBinarySubnetMask(subnetMask);
    const ipType = getIPType(ipAddress);

    return {
        ipAddress,
        ipClass,
        subnetMask,
        binarySubnetMask,
        defaultGateway,
        dnsServers,
        broadcastIP,
        networkIP,
        ipRange,
        ipType
    };
}

function displayResults(details) {
    const resultDiv = document.getElementById('ip-result');
    console.log(details); // Debugging log
    resultDiv.innerHTML = `
<!--        <h2>Network Details:</h2>-->
        <p><strong>IP Address:</strong> ${details.ipAddress}</p>
        <p><strong>IP Class:</strong> ${details.ipClass}</p>
        <p><strong>Subnet Mask:</strong> ${details.subnetMask}</p>
        <p><strong>Binary Subnet Mask:</strong> ${details.binarySubnetMask}</p>
        <p><strong>Default Gateway:</strong> ${details.defaultGateway}</p>
        <p><strong>DNS Servers:</strong> ${details.dnsServers.join(', ')}</p>
        <p><strong>Broadcast IP:</strong> ${details.broadcastIP}</p>
        <p><strong>Network IP:</strong> ${details.networkIP}</p>
        <p><strong>IP Range:</strong> ${details.ipRange}</p>
        <p><strong>IP Type:</strong> ${details.ipType}</p>
    `;
    resultDiv.style.display = 'block';
    document.getElementById('downloadBtn').style.display = 'block';
}

document.getElementById('downloadBtn').addEventListener('click', function() {
    const resultDiv = document.getElementById('ip-result').innerHTML;
    if (resultDiv) {
        downloadReport(resultDiv);
    } else {
        alert('No results to download. Please perform an analysis first.');
    }
});

function downloadReport(content) {
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'network_details.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
