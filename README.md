# MemeIndex Staking Platform

## Overview
The MemeIndex Staking Platform is a decentralized application (dApp) built on the TON blockchain that enables staking of $MIDAO tokens. This platform is part of the MemeIndex ecosystem, which serves as the S&P 500 for memecoins, providing analytics and tools for the cryptocurrency community.

## Features
- Secure staking of $MIDAO tokens
- Automated reward distribution
- Token burn mechanism (50% of fees until supply reaches 500M tokens)
- Integration with AMM DEXs (Ston.fi)
- Non-custodial wallet connectivity
- Real-time staking analytics

## Technology Stack
- **Blockchain**: TON Network
- **Smart Contracts**: TACT
- **Frontend**: React.js, TypeScript
- **Testing**: Jest
- **Development Tools**: Node.js, npm

## Project Structure
```
memeindex-staking/
├── assets/          # Project assets and resources
├── contracts/       # Smart contract source code
├── frontend/        # React.js frontend application
├── scripts/        # Deployment and utility scripts
├── tests/          # Test files
├── wrappers/       # Smart contract wrapper classes
└── config files    # Configuration files (.env, tsconfig.json, etc.)
```

## Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- TON wallet for development
- TON development environment

## Installation
1. Clone the repository:
```bash
git clone https://github.com/aniruddhsingh7901/memeindex-staking.git
cd memeindex-staking
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

## Development

### Smart Contracts
Deploy contracts to testnet:
```bash
npm run deploy:testnet
```

### Frontend
Start the development server:
```bash
cd frontend
npm run dev
```

### Testing
Run the test suite:
```bash
npm test
```

## Deployment
1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Deploy smart contracts to mainnet:
```bash
npm run deploy:mainnet
```

## Security
- Non-custodial design
- Automated security checks
- Thorough testing suite
- Regular security audits

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Contact
- Website: [memeindex.org](https://memeindex.org/)
- Twitter: [@memeindexdao](https://twitter.com/MemeIndexDAO)
- Telegram: [MemeIndexDAO](https://t.me/memeindexdao)

## Acknowledgments
- TON Foundation
- Ston.fi team
- MemeIndex DAO community