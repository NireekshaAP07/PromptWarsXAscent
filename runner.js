/**
 * LexGuard Multi-Service Runner
 * 
 * Concurrently spawns the Express Backend (Port 5000) and the Next.js Frontend (Port 8080 / 3000)
 * coordinates unified console logging outputs, and ensures graceful termination of child processes.
 */

const { spawn } = require('child_process');
const path = require('path');

// Identify running context parameters
const isDev = process.argv.includes('--dev');

console.log(`\n======================================================`);
console.log(`🛡️  LEXGUARD UNIFIED SERVICES RUNNER (Dev Context: ${isDev})`);
console.log(`======================================================\n`);

// 1. Spawning Backend Server (Port 5000)
const backendDir = path.join(__dirname, 'backend');
const backendCmd = 'npm';
const backendArgs = isDev ? ['run', 'dev'] : ['run', 'start'];

console.log(`[LexGuard Runner] Spawning Express API Backend (npm run)...`);
const backendProcess = spawn(backendCmd, backendArgs, {
  cwd: backendDir,
  stdio: 'inherit',
  shell: true
});

// 2. Spawning Frontend Next.js Client (Port 8080 / 3000)
const frontendDir = path.join(__dirname, 'frontend');
const frontendCmd = 'npm';
const frontendArgs = isDev ? ['run', 'dev'] : ['run', 'start'];

// Forward Cloud Run configuration ports (defaults to 8080 in production)
const env = { ...process.env };
if (!isDev) {
  env.PORT = env.PORT || '8080';
  console.log(`[LexGuard Runner] Spawning Next.js Frontend on Port ${env.PORT}...`);
} else {
  console.log(`[LexGuard Runner] Spawning Next.js Frontend on Port 3000...`);
}

const frontendProcess = spawn(frontendCmd, frontendArgs, {
  cwd: frontendDir,
  stdio: 'inherit',
  shell: true,
  env
});

// Coordinate clean shutdown bindings
const shutdownHandler = () => {
  console.log('\n[LexGuard Runner] Interruption signal received. Terminating all microservices...');
  try {
    backendProcess.kill('SIGTERM');
  } catch (err) {}
  try {
    frontendProcess.kill('SIGTERM');
  } catch (err) {}
  process.exit();
};

process.on('SIGINT', shutdownHandler);
process.on('SIGTERM', shutdownHandler);

// Keep runner alive and monitor crash signals
backendProcess.on('exit', (code) => {
  if (code !== 0 && code !== null) {
    console.error(`[LexGuard Runner] Express backend crashed with exit code: ${code}`);
    shutdownHandler();
  }
});

frontendProcess.on('exit', (code) => {
  if (code !== 0 && code !== null) {
    console.error(`[LexGuard Runner] Next.js frontend crashed with exit code: ${code}`);
    shutdownHandler();
  }
});
