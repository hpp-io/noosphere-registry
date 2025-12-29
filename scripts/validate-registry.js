#!/usr/bin/env node

const fs = require('fs');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const ajv = new Ajv();
addFormats(ajv);

// Load schemas
const containerSchema = JSON.parse(fs.readFileSync('./schemas/container-schema.json', 'utf-8'));
const verifierSchema = JSON.parse(fs.readFileSync('./schemas/verifier-schema.json', 'utf-8'));

// Load registry
const registry = JSON.parse(fs.readFileSync('./registry.json', 'utf-8'));

// Validate
let isValid = true;
let validContainers = 0;
let validVerifiers = 0;

console.log('🔍 Validating Noosphere Registry\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

console.log('\n📦 Validating Containers...\n');
for (const [id, container] of Object.entries(registry.containers)) {
  const validate = ajv.compile(containerSchema);
  if (!validate(container)) {
    console.error(`❌ Container ${id} is invalid:`);
    console.error(validate.errors);
    isValid = false;
  } else {
    console.log(`✅ ${container.name} (${id.substring(0, 10)}...)`);
    validContainers++;
  }
}

console.log('\n🔐 Validating Verifiers...\n');
for (const [address, verifier] of Object.entries(registry.verifiers)) {
  const validate = ajv.compile(verifierSchema);
  if (!validate(verifier)) {
    console.error(`❌ Verifier ${address} is invalid:`);
    console.error(validate.errors);
    isValid = false;
  } else {
    console.log(`✅ ${verifier.name} (${address.substring(0, 10)}...)`);
    validVerifiers++;
  }
}

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

if (!isValid) {
  console.log('\n❌ Validation failed!\n');
  process.exit(1);
}

console.log('\n✅ All entries are valid!');
console.log(`   Containers: ${validContainers}`);
console.log(`   Verifiers: ${validVerifiers}`);
console.log(`   Registry version: ${registry.version}\n`);
