<template>
    
  <div class="d-flex align-center pa-4 c-list border-b">
    <coin-icon :address="item.address" class="mr-3"></coin-icon>
      <div>
        <div class="">
            {{ item.symbol }}
        </div>
        <div class="caption textFaint--text">
            {{ item.name }}
        </div>
      </div>
      <v-spacer></v-spacer>
      <div class="text-end">
        <div class="">
            {{ $root.formatAmount(item.totalSupply, item.decimals) }}
        </div>
        <div class="caption textFaint--text font-italic">
            your balance: {{ $root.formatAmount(balance, item.decimals) }}
        </div>
        <div class="caption textFaint--text font-italic">
            {{ item.decimals }} decimals
        </div>
        <enmt-badge></enmt-badge>
      </div>
  </div>
   
</template>

<script>
import ERC20 from '@/smart-contracts/erc20';

export default {
  props: {
    item: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },

  data: () => ({
    balance: '0'
  }),

  computed: {
    sEthers () {
      return this.$store.state.ethers
    },
    sEthersWatcher () {
      return this.sEthers.watcher
    }
  },

  watch: {
    sEthersWatcher () {
      this.getBalance()
    }
  },

  methods: {
    async getBalance () {
      var balance = await ERC20.getBalance(this.sEthers.coinbase, this.item.address)
      this.balance = balance
    }
  },

  created () {
    this.getBalance()
  }
}
</script>
