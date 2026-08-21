import fs from 'fs';
import { execFileSync } from 'child_process';
const required = ['server.js', 'public/index.html', 'public/admin/index.html', 'public/admin/login.html', '.env.example', 'README.md'];
const missing = required.filter(file => !fs.existsSync(file));
if (missing.length) { console.error(`Faltan archivos: ${missing.join(', ')}`); process.exit(1); }
const jsDirectories = ['config', 'controllers', 'middleware', 'models', 'routes', 'services', 'utils', 'public/js'];
const jsFiles = [
  'server.js',
  ...jsDirectories.flatMap(directory => fs.readdirSync(directory).filter(file => file.endsWith('.js')).map(file => `${directory}/${file}`)),
  ...fs.readdirSync('scripts').filter(file => file.endsWith('.js') && file !== 'validate-build.js').map(file => `scripts/${file}`)
];
for (const file of jsFiles) execFileSync(process.execPath, ['--check', file], { stdio: 'inherit' });
console.log('Validación estructural y sintáctica completada.');
