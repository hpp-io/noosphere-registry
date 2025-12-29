# Contributing to Noosphere Registry

Thank you for your interest in contributing to the Noosphere Community Registry! This document provides guidelines for adding containers and verifiers.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Adding a Container](#adding-a-container)
- [Adding a Verifier](#adding-a-verifier)
- [Submission Guidelines](#submission-guidelines)
- [Review Process](#review-process)

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Follow the guidelines

## How to Contribute

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Docker (for testing containers)
- Git and GitHub account

### Setup

1. **Fork the repository**
   ```bash
   gh repo fork hpp-io/noosphere-registry --clone
   cd noosphere-registry
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Validate the registry**
   ```bash
   npm run validate
   ```

## Adding a Container

### Step 1: Generate Container ID

The container ID is a keccak256 hash. Generate it using:

```bash
npm install ethers

node -e "
const { ethers } = require('ethers');
const name = 'my-awesome-container';
const imageName = 'myrepo/my-image';
const version = 'v1.0';
const id = ethers.keccak256(ethers.toUtf8Bytes(name + imageName + version));
console.log('Container ID:', id);
"
```

### Step 2: Test Your Container

Before submitting, test your container:

```bash
# Pull and run
docker pull myrepo/my-image
docker run -p 8000:8000 myrepo/my-image

# Test functionality
curl -X POST http://localhost:8000/api/test -d '{"test": "data"}'
```

### Step 3: Add to registry.json

Add your container to `registry.json` under `containers`:

```json
{
  "containers": {
    "0xYOUR_GENERATED_ID_HERE": {
      "id": "0xYOUR_GENERATED_ID_HERE",
      "name": "my-awesome-container",
      "imageName": "myrepo/my-image",
      "port": 8000,
      "command": "python app.py",
      "env": {
        "MODEL": "model-name",
        "PORT": "8000"
      },
      "volumes": [
        "/data:/app/data"
      ],
      "requirements": {
        "gpu": true,
        "memory": "16GB",
        "cpu": 4
      },
      "payments": {
        "basePrice": "0.01",
        "token": "ETH",
        "per": "request"
      },
      "statusCode": "ACTIVE",
      "verified": false,
      "description": "Detailed description of what your container does",
      "tags": ["ai", "ml", "your-tags"],
      "createdAt": "2025-01-15T00:00:00.000Z",
      "updatedAt": "2025-01-15T00:00:00.000Z"
    }
  }
}
```

### Step 4: Validate

```bash
npm run validate
```

### Step 5: Create Pull Request

```bash
git checkout -b add-my-awesome-container
git add registry.json
git commit -m "Add my-awesome-container"
git push origin add-my-awesome-container

gh pr create \
  --title "Add my-awesome-container" \
  --body "$(cat <<EOF
## Container Details

- **Name**: my-awesome-container
- **Image**: myrepo/my-image
- **Purpose**: Brief description

## Requirements

- GPU: Yes/No
- Memory: XGB
- CPU: X cores

## Verification

- [ ] Docker image is publicly accessible
- [ ] Container tested and working
- [ ] Schema validation passed
- [ ] Documentation complete

## Test Results

\`\`\`bash
# Commands you used to test
docker run myrepo/my-image
curl http://localhost:8000/health
# Output
\`\`\`

## Additional Notes

Any additional context or information
EOF
)"
```

## Adding a Verifier

### Step 1: Deploy Verifier Contract

Deploy your verifier smart contract and note the address.

```solidity
// Example: Groth16Verifier.sol
contract Groth16Verifier {
    function verify(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[] memory input
    ) public view returns (bool) {
        // Verification logic
    }
}
```

#### Contract Verification Checklist

Before submitting your verifier, ensure the following:

**Deployment Requirements:**
- [ ] Contract is deployed to the target blockchain
- [ ] Contract address is noted and accessible
- [ ] Deployment transaction hash is recorded
- [ ] Contract is verified on block explorer (Etherscan, etc.)

**Code Requirements:**
- [ ] Source code is publicly available in a Git repository
- [ ] Repository includes deployment scripts and tests
- [ ] Commit hash of deployed code is documented
- [ ] Contract implements required interface functions

**Security Requirements:**
- [ ] No hardcoded private keys or secrets
- [ ] Access control mechanisms are properly configured
- [ ] Contract ownership/admin settings are documented
- [ ] Security audit completed (if available)
- [ ] Known vulnerabilities are addressed

**Documentation Requirements:**
- [ ] Contract ABI is available
- [ ] Function signatures are documented
- [ ] Gas cost estimates are provided
- [ ] Integration examples are included

**Network Information:**
- [ ] Chain ID is specified (e.g., 1 for Ethereum mainnet)
- [ ] Network name is clear (mainnet, testnet, etc.)
- [ ] RPC endpoint information (for testing)
- [ ] Block explorer URL for verification

### Step 2: Create Verifier Image (Optional)

If your verifier needs off-chain proof generation:

```dockerfile
# Dockerfile for proof generator
FROM node:18
WORKDIR /app
COPY . .
RUN npm install
CMD ["npm", "start"]
```

### Step 3: Generate UUID

```bash
node -e "
const crypto = require('crypto');
const uuid = crypto.randomUUID();
console.log('Verifier ID:', uuid);
"
```

### Step 4: Add to registry.json

```json
{
  "verifiers": {
    "0xYOUR_CONTRACT_ADDRESS": {
      "id": "YOUR_UUID_HERE",
      "name": "My Verifier",
      "verifierAddress": "0xYOUR_CONTRACT_ADDRESS",
      "chainId": 11155111,
      "sourceRepository": "https://github.com/your-org/verifier-contracts",
      "commitHash": "abc123def456...",
      "contractInterface": {
        "requiredFunctions": [
          "verify(bytes calldata proof) returns (bool)",
          "verifyWithPublicInputs(bytes calldata proof, uint256[] calldata publicInputs) returns (bool)"
        ]
      },
      "blockExplorerUrl": "https://sepolia.etherscan.io/address/0xYOUR_CONTRACT_ADDRESS#code",
      "auditReport": "https://your-org.com/audit-report.pdf",
      "requiresProof": true,
      "proofService": {
        "imageName": "myrepo/my-verifier",
        "port": 8080,
        "command": "npm start",
        "env": {
          "CIRCUIT": "circuit.r1cs",
          "RPC_URL": "CONFIGURE_YOUR_RPC_URL"
        },
        "requirements": {
          "gpu": false,
          "memory": "2GB",
          "cpu": 2
        }
      },
      "payments": {
        "basePrice": "0.001",
        "token": "ETH",
        "per": "verification"
      },
      "statusCode": "ACTIVE",
      "verified": false,
      "description": "Description of verification method",
      "createdAt": "2025-01-15T00:00:00.000Z",
      "updatedAt": "2025-01-15T00:00:00.000Z"
    }
  }
}
```

### Step 5: Submit Pull Request

Include in your PR:

- Contract verification link (Etherscan, etc.)
- Proof generation example
- Verification example
- Gas cost analysis
- Security audit (if available)

## Submission Guidelines

### Required Information

#### For Containers

- ✅ Valid container ID (keccak256 hash)
- ✅ Publicly accessible Docker image
- ✅ Working test results
- ✅ Clear description
- ✅ Appropriate tags
- ✅ Resource requirements
- ✅ Pricing information (optional)

#### For Verifiers

- ✅ Valid UUID
- ✅ Deployed contract address
- ✅ Chain ID and network information
- ✅ Contract source code repository link
- ✅ Git commit hash of deployed code
- ✅ Contract verification on block explorer
- ✅ Block explorer URL with verified source
- ✅ Contract ABI and required function signatures
- ✅ Proof generation/verification examples
- ✅ Gas cost analysis
- ✅ Security audit report (if available)
- ✅ Clear description

### Best Practices

1. **Documentation**
   - Provide clear, concise descriptions
   - Include usage examples
   - Document all environment variables
   - List all requirements

2. **Testing**
   - Test thoroughly before submitting
   - Include test results in PR
   - Document expected behavior
   - Test edge cases

3. **Security**
   - No hardcoded secrets
   - Minimal attack surface
   - Follow Docker best practices
   - Document security considerations

4. **Pricing**
   - Be transparent about costs
   - Use standard token units
   - Explain pricing model


### Review Criteria

Reviewers will check:

1. **Technical Quality**
   - ✅ Schema compliance
   - ✅ Working Docker image / smart contract
   - ✅ No security vulnerabilities
   - ✅ Proper resource requirements

2. **Documentation**
   - ✅ Clear description
   - ✅ Usage examples
   - ✅ Complete metadata

3. **Testing**
   - ✅ Test results provided
   - ✅ Container/verifier works as described
   - ✅ Performance benchmarks (if applicable)

4. **Community Value**
   - ✅ Useful to the community
   - ✅ Not duplicate of existing entry
   - ✅ Properly categorized with tags


## After Submission

### If Approved

- Your entry will be merged
- You'll be listed as a contributor
- The registry will be updated

### If Changes Requested

- Address feedback in your PR
- Update and re-validate
- Push changes to your branch
- Request re-review

### If Rejected

- You'll receive detailed feedback
- You can revise and resubmit
- Or open a discussion for clarification

## Recognition

Contributors are recognized:

- Listed in contributors
- Mentioned in release notes
- Featured in community highlights (for significant contributions)

Thank you for contributing to the Noosphere ecosystem! 🚀
