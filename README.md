# Noosphere Community Registry

[![Validate Registry](https://github.com/hpp-io/noosphere-registry/actions/workflows/validate.yml/badge.svg)](https://github.com/hpp-io/noosphere-registry/actions/workflows/validate.yml)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Public registry of verified compute containers and proof verifiers for the Noosphere decentralized compute network.

## Overview

This registry enables:

- **Discovery**: Find community-verified containers and verifiers
- **Sharing**: Contribute your own containers and verifiers
- **Auto-sync**: Automatic synchronization with Noosphere SDK
- **Multi-network**: Separate registry per network (testnet, mainnet)

## Networks

| Network | Chain ID | Registry File | Status |
|---------|----------|---------------|--------|
| HPP Sepolia (Testnet) | 181228 | [`networks/181228.json`](networks/181228.json) | Active |
| HPP Mainnet | 190415 | [`networks/190415.json`](networks/190415.json) | Pending |

Each network file contains the complete registry (`containers`, `verifiers`, `deployments`) for that specific chain. This ensures network-level isolation — mainnet changes never affect testnet and vice versa.

> **Legacy**: `registry.json` at the root is maintained for backward compatibility with older SDK versions. New integrations should use the network-specific files.

## Usage with Noosphere SDK

```bash
npm install @noosphere/registry
```

```typescript
import { RegistryManager } from '@noosphere/registry';

// Testnet
const testnetRegistry = new RegistryManager({
  remotePath: 'https://raw.githubusercontent.com/hpp-io/noosphere-registry/main/networks/181228.json',
  autoSync: true,
  cacheTTL: 3600000, // 1 hour
});

// Mainnet
const mainnetRegistry = new RegistryManager({
  remotePath: 'https://raw.githubusercontent.com/hpp-io/noosphere-registry/main/networks/190415.json',
  autoSync: true,
  cacheTTL: 3600000,
});

// Load (automatically syncs from GitHub)
await mainnetRegistry.load();

// Search containers
const aiContainers = mainnetRegistry.searchContainers('ai');
console.log(`Found ${aiContainers.length} AI containers`);

// Get specific container
const container = mainnetRegistry.getContainer('0x2fe108c...');
console.log('Container:', container.name);

// Get verifier by address
const verifier = mainnetRegistry.getVerifier('0x672c32...');
console.log('Verifier:', verifier.name);

// Check if proof generation is required
if (verifier.requiresProof && verifier.proofService) {
  console.log('Proof service image:', verifier.proofService.imageName);
}
```

## Registry Contents

### Containers

Currently registered compute containers:

- **noosphere-hello-world** - Simple Hello World testing container
- **noosphere-llm** - LLM inference with LLM Router and Gemini
- **noosphere-freqtrade** - Cryptocurrency price prediction (15-min candles, 3-step forecasting)
- **noosphere-vrng** - Verifiable Random Number Generator for on-chain VRF

### Verifiers

Currently registered verifiers with proof generation:

- **Immediate Finalize Verifier**
  - On-chain verification contract
  - Integrated proof generation service (noosphere-proof-creator)
  - Instant finalization

## Contributing

We welcome contributions! To add a container or verifier:

1. **Fork this repository**
2. **Add your entry** to the appropriate network file in `networks/`
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
- [Deployment Schema](schemas/deployment-schema.json)

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
  "chainId": 181228,                   // Chain where deployed
  "requiresProof": true,              // Proof generation required
  "proofService": {                    // Proof service config
    "imageName": "docker/verifier",
    "port": 8080,
    "command": "npm start"
  },
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

## Registry Structure

```
noosphere-registry/
├── registry.json              # Legacy registry (backward compatibility)
├── networks/
│   ├── 181228.json            # HPP Sepolia testnet registry
│   └── 190415.json            # HPP Mainnet registry
├── schemas/
│   ├── container-schema.json  # Container validation schema
│   ├── verifier-schema.json   # Verifier validation schema
│   └── deployment-schema.json # Deployment validation schema
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

### Review Process

All pull requests are reviewed for:

- Schema compliance
- Docker image accessibility
- Security considerations
- Documentation quality
- Test coverage

## License

MIT License - see [LICENSE](LICENSE) file for details.
