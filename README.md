# Stegos Wallet

Electron-based Wallet application for [Stegos](https://github.com/stegos/stegos) blockchain.

![Stegos Wallet](screenshot.png)

## Installation

Download packages for Linux and Mac from [GitHub Releases](https://github.com/stegos/stegos-wallet/releases). All packages ship with bundled version of [Stegos Node](https://github.com/stegos/stegos/release).

## Development

0. Install requirements:

- [Yarn Package Manager](https://yarnpkg.com/en/docs/install), version 1.13.0 tested.
- [NodeJS](https://nodejs.org/en/download/), version v10.16.0 tested.

1. Clone this repository:

```
git clone https://github.com/stegos/stegos-wallet.git
cd stegos-wallet
```

2. Get the latest version of [Stegos Node]() for your platform:

```
mkdir node
curl -L https://github.com/stegos/stegos/releases/download/v0.11/stegosd-linux-x64 -o node/stegosd
chmod a+x node/stegosd
./node/stegosd --version
```

3. Build and run Wallet application:

```
yarn install
yarn dev
```

## Feedback

Please join us on [Telegram Chat](https://t.me/stegos4privacy) to get test tokens and let us know your thoughts.
Subscribe to official [Telegram Channel](https://t.me/stegos4privacy_official) for the latest news.
