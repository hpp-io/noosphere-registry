# Noosphere Community Registry

[![Validate Registry](https://github.com/hpp-io/noosphere-registry/actions/workflows/validate.yml/badge.svg)](https://github.com/hpp-io/noosphere-registry/actions/workflows/validate.yml)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Public registry of verified compute containers and proof verifiers for the Noosphere decentralized compute network.

## Overview

This registry enables:

- **🔍 Discovery**: Find community-verified containers and verifiers
- **🤝 Sharing**: Contribute your own containers and verifiers
- **🔄 Auto-sync**: Automatic synchronization with Noosphere SDK
- **🌐 Decentralized**: No central authority required

## Registry Contents

### Containers

Currently registered compute containers:

- **noosphere-hello-world** - Simple Hello World testing container
- **noosphere-llm** - LLM inference with LLM Router and Gemini
- **noosphere-freqtrade** - Cryptocurrency trading bot

### Verifiers

Currently registered verifiers with proof generation:

- **Immediate Finalize Verifier** (`0x0165878A594ca255338adfa4d48449f69242Eb8F`)
  - On-chain verification contract
  - Integrated proof generation service (noosphere-proof-creator)
  - Instant finalization for testnet

## Usage with Noosphere SDK

```bash
npm install @noosphere/registry
```

```typescript
import { RegistryManager } from '@noosphere/registry';

// Initialize with community registry
const registry = new RegistryManager({
  remotePath: 'https://raw.githubusercontent.com/hpp-io/noosphere-registry/main/registry.json',
  autoSync: true,
  cacheTTL: 3600000, // 1 hour
});

// Load (automatically syncs from GitHub)
await registry.load();

// Search containers
const aiContainers = registry.searchContainers('ai');
console.log(`Found ${aiContainers.length} AI containers`);

// Get specific container
const container = registry.getContainer('0x000...002');
console.log('Container:', container.name);

// Get verifier by address
const verifier = registry.getVerifier('0x0165878A594ca255338adfa4d48449f69242Eb8F');
console.log('Verifier:', verifier.name);

// Check if proof generation is required
if (verifier.requiresProof && verifier.proofService) {
  console.log('Proof service image:', verifier.proofService.imageName);
}
```

## Contributing

We welcome contributions! To add a container or verifier:

1. **Fork this repository**
2. **Add your entry** to `registry.json`
3. **Validate locally**: `npm install && npm run validate`
4. **Submit a pull request** with:
   - Container/Verifier metadata
   - Docker image or contract verification
   - Test results
   - Documentation

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## Schema Validation

All entries are automatically validated against JSON schemas:

- [Container Schema](schemas/container-schema.json)
- [Verifier Schema](schemas/verifier-schema.json)

### Container Schema

```json
{
  "id": "0x...",              // keccak256 hash (required)
  "name": "container-name",    // Human-readable name (required)
  "imageName": "docker/image", // Docker image (required)
  "port": 8000,                // Exposed port
  "command": "python app.py",  // Startup command
  "env": { "KEY": "value" },   // Environment variables
  "requirements": {            // Resource requirements
    "gpu": true,
    "memory": "16GB",
    "cpu": 4
  },
  "payments": {                // Pricing info
    "basePrice": "0.01",
    "token": "ETH",
    "per": "inference"
  },
  "statusCode": "ACTIVE",      // ACTIVE | INACTIVE | DEPRECATED
  "verified": true,            // Community verified
  "description": "...",        // Description
  "tags": ["ai", "ml"]        // Tags for search
}
```

### Verifier Schema

```json
{
  "id": "uuid",                        // UUID (required)
  "name": "verifier-name",             // Name (required)
  "verifierAddress": "0x...",          // Contract address (required)
  "imageName": "docker/verifier",      // Docker image (required)
  "port": 8080,                        // Port
  "command": "npm start",              // Startup command
  "statusCode": "ACTIVE",              // Status
  "verified": true,                    // Verified
  "description": "..."                 // Description
}
```

## Local Validation

```bash
# Install dependencies
npm install

# Validate registry
npm run validate
```

Expected output:
```
🔍 Validating Noosphere Registry
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📦 Validating Containers...

✅ noosphere-hello-world (0x8a35acfb...)
✅ noosphere-llm (0x7c9fa136...)
✅ noosphere-freqtrade (0x5d8aa3c4...)

🔐 Validating Verifiers...

✅ Immediate Finalize Verifier (0x0165878A...)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ All entries are valid!
   Containers: 3
   Verifiers: 1
   Registry version: 1.0.0
```

## Registry Structure

```
noosphere-registry/
├── registry.json              # Main registry file
├── schemas/
│   ├── container-schema.json  # Container validation schema
│   └── verifier-schema.json   # Verifier validation schema
├── scripts/
│   └── validate-registry.js   # Validation script
├── .github/
│   └── workflows/
│       └── validate.yml       # CI/CD validation
├── README.md
├── CONTRIBUTING.md
└── package.json
```

## Versioning

The registry follows semantic versioning in the `version` field:

- **Major**: Breaking changes to schema
- **Minor**: New containers/verifiers added
- **Patch**: Updates to existing entries

Current version: **1.0.0**

## Security

### Reporting Issues

If you discover a security vulnerability in a registered container or verifier:

1. **Do NOT** open a public issue
2. Email security@noosphere.io with details
3. We will respond within 24 hours
4. The entry will be marked as `INACTIVE` until resolved

### Review Process

All pull requests are reviewed for:

- ✅ Schema compliance
- ✅ Docker image accessibility
- ✅ Security considerations
- ✅ Documentation quality
- ✅ Test coverage

## License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Built with ❤️ for the decentralized compute revolution**
