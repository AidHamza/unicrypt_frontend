<template>
  <v-container style="max-width: 600px;" :class="[{'pa-0 foreground mobile-page': $vuetify.breakpoint.xs}]">

    <v-slide-x-transition appear>
      <v-card :class="['br-20', {'pa-4': $vuetify.breakpoint.xs}, {'pa-6': !$vuetify.breakpoint.xs}]">

        <div class="text-center">
          <img 
          src="@/assets/img/icons/token.svg" 
          height="60px"
          width="60px"
          class="greyscale">
        </div>

        <div class="title text-center textFaint--text mb-4">
          ENMT Token Minter
        </div>
        
        <div class="text-center py-2 mb-5">
          <div class="textFaint--text">
            Select network to mint your token on
          </div>
          <v-btn large block outlined @click="$root.$dialog.chainSwitcher.open()" class="title">
            <img 
            :src="$settings.CHAINS[$store.state.requiredNetwork].icon" 
            height="24px"
            width="24px"
            class="mr-3 br-20">
            {{ $settings.CHAIN_DISPLAY_NAME[$store.state.requiredNetwork] }}
            <v-icon small color="">mdi-chevron-down</v-icon>
          </v-btn>
        </div>

        <div>
          <div v-if="false" class="pb-4 text-center">
            <v-icon color="white" size="40" class="pa-2 primary primary-pulse br-c">mdi-leaf</v-icon>
          </div>
          <div class="caption mb-8">
            ENMT tokens are fully ERC20 compliant Non-Mintable Tokens.
            Use the Unicrypt Token factory to mint your very own token at the click of a button. Your ENMT token will be shown favourably in the Unicrypt 
            browser and bypass the need for an audit on the token contract itself, as well as when using our ILO dapp.
            Anyone can query our ENMT token mint factory with your token address to see your new token is a valid,
            safe, and ERC20 compliant token.
          </div>
          <div class="v-card br-20 pa-4 mb-10">
            <div class="font-weight-bold text-center mb-2">
              ENMT Token specs
            </div>
            <div class="d-flex align-start">
              <v-icon size="20" color="primary" class="mr-1">mdi-check-circle</v-icon>
              No mint function
            </div>
            <div class="d-flex align-start">
              <v-icon size="20" color="primary" class="mr-1">mdi-check-circle</v-icon>
              No owner / admin functions
            </div>
            <div class="d-flex align-start">
              <v-icon size="20" color="primary" class="mr-1">mdi-check-circle</v-icon>
              No unsafe code in the token contract itself
            </div>
            <div class="d-flex align-start">
              <v-icon size="20" color="primary" class="mr-1">mdi-check-circle</v-icon>
              Fully ERC20 compliant
            </div>
            <div class="d-flex align-start">
              <v-icon size="20" color="primary" class="mr-1">mdi-check-circle</v-icon>
              Fully decentralised
            </div>
          </div>
        </div>

        <v-btn v-if="!sEthers.coinbase" @click="connectWallet" 
        large block outlined class="title">
          <v-icon class="mr-3">mdi-wallet</v-icon>
          Connect your wallet
        </v-btn>

        <template v-else>

          <div class="title">

            <div class="text-center">
              Mint your own ENMT token!
            </div>
              
            <div class="mt-2 d-flex align-center pa-3 br-20 inputcolor">
              <c-input :value.sync="tokenName" placeholder="Token Name">
              </c-input>
            </div>

            <div class="mt-2 d-flex align-center pa-3 br-20 inputcolor">
              <c-input :value.sync="tokenSymbol" placeholder="Token Symbol">
              </c-input>
            </div>
            
            <div class="mt-4 caption textFaint--text">
              Total supply (excluding decimals e.g. 100 tokens)
            </div>
            <div class="mt-2 d-flex align-center pa-3 br-20 inputcolor">
              <c-input :value.sync="tokenTotalSuply" placeholder="Total Supply">
              </c-input>
            </div>

            <div class="mt-4 caption textFaint--text">
              Decimals (18 reccomended)
            </div>
            <div class="d-flex align-center pa-3 br-20 inputcolor">
              <c-input :value.sync="tokenDecimal" placeholder="Decimals">
              </c-input>
            </div>

            <div class="text-center">
              <div class="caption textFaint--text">
                Total supply (including decimals - raw amount)
              </div>
              <div class="caption textFaint--text">
                {{ totalSupplyNoDecimal }}
              </div>
              
              <div v-if="formError" class="orange--text">
                {{ formErrorMessage }}
              </div>
            </div>
          
            <!-- <div v-if="loginErrMsgMethodPassword" class="textFaint--text mt-4">
              Error: {{ loginErrMsgMethodPassword }}
            </div> -->

            <div class="textFaint--text mt-8 text-center" >
              Fee: {{ flatFeeHuman }} {{ $store.state.nativeGasTokenSymbol }}
            </div>
            <div class="caption textFaint--text mb-3 text-center" >
              + {{ this.fees.ts_fee / 10 }}% total supply
            </div>

            <v-btn x-large block rounded color="primary" :loading="createLoading" @click="createToken">
              Mint a new token
            </v-btn>
          </div>

          <generated-tokens ref="GeneratedTokens" class="mt-4"></generated-tokens>
        </template>

      </v-card>
    </v-slide-x-transition>
    
  </v-container>
</template>

<script>
import { ethers } from 'ethers'
import MintGeneratorContract from '@/smart-contracts/minter/mint-generator01';
import TokenFeesContract from '@/smart-contracts/minter/token-fees';
import TxWrapper from '@/smart-contracts/tx-wrapper';
import GeneratedTokens from '@/views/minter/generated-tokens';

export default {
  components: {
    GeneratedTokens
  },

  data: () => ({
    tokenName: '',
    tokenSymbol: '',
    tokenDecimal: '18',
    tokenTotalSuply: '',
    createLoading: false,
    fees: {
      flat_fee: '0',
      ts_fee: '0'
    },
    formError: false,
    formErrorMessage: ''
  }),
  computed: {
    sEthers () {
      return this.$store.state.ethers
    },
    sEthersWatcher () {
      return this.sEthers.watcher
    },
    flatFeeHuman () {
      var amount = ethers.utils.formatUnits(this.fees.flat_fee, 18) // gas tokens have 18 decimal spaces
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 18})
    },
    totalSupplyNoDecimal () {
      if (!this.tokenTotalSuply || !this.tokenDecimal) {
        return 0
      }
      return ethers.utils.parseUnits(this.tokenTotalSuply, this.tokenDecimal)
    }
  },
  watch: {
    sEthersWatcher () {
      this.refresh()
    },
  },
  methods: {
    async createToken () {
      if (!this.formIsValid()) {
        return;
      }
      this.createLoading = true
      var totalSupply = ethers.utils.parseUnits(this.tokenTotalSuply, this.tokenDecimal)
      TxWrapper.doTransaction(MintGeneratorContract.createToken(this.tokenName, this.tokenSymbol, this.tokenDecimal, totalSupply, this.fees.flat_fee), this.$root.$dialog.confirmTx)
        .then((response) => {
          var creationEvent = response.receipt.events.pop()
          var decodedArray = ethers.utils.defaultAbiCoder.decode(["address"], creationEvent.data)
          console.log(response)
          console.log(decodedArray[0])
          // this.$root.ammLink(`/ilo/${decodedArray[0]}/edit`)
        })
        .catch(e => { this.$root.$dialog.web3Error.open(e.message) })
        .then(() => {
          this.createLoading = false
          this.$refs.GeneratedTokens.refresh()
        })
    },
    formIsValid () {
      // check Token Name Length
      if (this.tokenName.length < 1) {
        this.formError = true;
        this.formErrorMessage = "Name must have at least 1 character";
        return false;
      }

      // Check Token symbol length, force upercase
      this.tokenSymbol = this.tokenSymbol.toUpperCase();
      if (this.tokenSymbol.length < 1) {
        this.formError = true;
        this.formErrorMessage = "Symbol must have at least 1 character";
        return false;
      }
      // Total Supply
      if (this.tokenTotalSuply.length < 1 || parseInt(this.tokenTotalSuply) < 1 || parseInt(this.tokenTotalSuply) > 2 ** 256) {
        this.formError = true;
        this.formErrorMessage = "Supply out of range";
        return false;
      }

      // Decimals must be between 0 nd 36
      if (this.tokenDecimal.length < 1 || parseInt(this.tokenDecimal) < 0 || parseInt(this.tokenDecimal) > 18) {
        this.formError = true;
        this.formErrorMessage = "Decimals must be between or equal to 0 and 18";
        return false;
      }

      // else return true
      this.formError = false;
      return true;
    },
    connectWallet () {
      this.$root.$dialog.connectWalletDialog.open()
        .then(() => {
        })
        .catch(e => {})
    },
    async getFees () {
      const fees = await TokenFeesContract.getFees();     
      this.fees = fees;
    },
    async refresh () {
      this.getFees();
    },
  },
  created () {
    this.refresh();
  }
}
</script>