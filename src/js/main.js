document.getElementById('subBtn').addEventListener('click', async () => {
    const ipAddress = document.getElementById('ipAddress').value;
    if (!ipAddress) {
        alert('Please enter an IP address');
        return;
    }

    const response = await fetch('http://localhost:3000/analyze', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ip: ipAddress }),
    });

    const result = await response.json();
    displayResult(result);
});

function displayResult(result) {
    const resultDiv = document.getElementById('ip-result');
    resultDiv.innerHTML = `
    <h2>Network Details</h2>
    <p><strong>ISP:</strong> ${result.isp}</p>
    <p><strong>Country:</strong> ${result.country}</p>
    <p><strong>Region:</strong> ${result.region}</p>
    <p><strong>City:</strong> ${result.city}</p>
    <p><strong>Subnet Mask:</strong> ${result.subnet_mask}</p>
    <p><strong>Reverse DNS:</strong> ${result.reverse_dns}</p>
    <p><strong>IP Class:</strong> ${result.ip_class}</p>
    <p><strong>Network IP:</strong> ${result.network_ip}</p>
    <p><strong>Broadcast IP:</strong> ${result.broadcast_ip}</p>
    <p><strong>Latency:</strong> ${result.latency} ms</p>
    <p><strong>Packet Loss:</strong> ${result.packet_loss} %</p>
    <p><strong>Network Range:</strong> ${result.network_range}</p>
  `;
}
