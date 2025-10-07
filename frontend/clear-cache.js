#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Clearing build cache...');

// Remove dist directory
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  fs.rmSync(distPath, { recursive: true, force: true });
  console.log('Removed dist directory');
}

// Remove node_modules/.vite cache
const viteCachePath = path.join(__dirname, 'node_modules', '.vite');
if (fs.existsSync(viteCachePath)) {
  fs.rmSync(viteCachePath, { recursive: true, force: true });
  console.log('Removed Vite cache');
}

// Remove .vite cache in project root
const rootViteCache = path.join(__dirname, '.vite');
if (fs.existsSync(rootViteCache)) {
  fs.rmSync(rootViteCache, { recursive: true, force: true });
  console.log('Removed root Vite cache');
}

console.log('Cache cleared successfully!');
console.log('Run "npm run dev" to start fresh development server');
