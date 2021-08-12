# dlt

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run start
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

Be careful when changing linking structure, links are done in a special way in certain areas to force the dapp to connect to the correct chain, and amm. Pages such as the 'select an AMM' or 'Select a chain' are best left as seperate pages so that when a user lands on a certain URL the correct chain and amm are connected to. Also these pages take care of disconnecting wallets if a user is connected to for example Binance Smart Chain and then browses the Uniswap AMM. (Switch to Mainnet required).

Farms Page and links will be hidden on release until contracts are ready

Locker page is under heavy renovation by me, dont worry changing things there yet

Focus only on 'Browser' and its related sup pages (Tokens, Pairs, ILO's)
