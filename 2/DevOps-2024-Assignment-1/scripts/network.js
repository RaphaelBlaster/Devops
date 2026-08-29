const Docker = require('dockerode');
const docker = new Docker();
const networkName = process.env.NETWORK_NAME || 'devops-assignment-network';

async function main() {
  let network = (await docker.listNetworks({ filters: { name: [networkName] } }))[0];
  if (!network) {
    network = await docker.createNetwork({ Name: networkName, Driver: 'bridge', Labels: { project: 'devops-assignment-1' } });
    console.log(`Created bridge network: ${networkName}`);
  }
  const details = await docker.getNetwork(network.Id).inspect();
  console.log(JSON.stringify({ name: details.Name, driver: details.Driver, containers: Object.values(details.Containers || {}).map(({ Name, IPv4Address }) => ({ Name, IPv4Address })) }, null, 2));
}
main().catch((error) => { console.error(`Network management failed: ${error.message}`); process.exit(1); });
