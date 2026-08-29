const Docker = require('dockerode');
const docker = new Docker();
const appName = process.env.APP_CONTAINER || 'devops-assignment-app';
const monitor = process.argv.includes('--monitor');

async function inspectApp() {
  const container = docker.getContainer(appName);
  const info = await container.inspect();
  const health = info.State.Health?.Status || (info.State.Running ? 'running' : 'stopped');
  console.log(`${info.Name.replace(/^\\//, '')}: ${info.State.Status} (${health})`);
  if (health === 'unhealthy') { console.log('App is unhealthy; restarting container.'); await container.restart(); }
}
async function main() {
  const containers = await docker.listContainers({ all: true });
  console.table(containers.map((item) => ({ name: item.Names[0].replace(/^\//, ''), image: item.Image, state: item.State, status: item.Status })));
  await inspectApp();
  if (monitor) { console.log('Health monitor active; checking every 30 seconds.'); setInterval(() => inspectApp().catch((error) => console.error(error.message)), 30000); }
}
main().catch((error) => { console.error(`Container management failed: ${error.message}`); process.exit(1); });
