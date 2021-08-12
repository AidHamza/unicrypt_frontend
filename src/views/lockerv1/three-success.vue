<template>

  <div>

    <div class="text-center pt-8">
      <v-icon size="60" color="primary">mdi-lock</v-icon>
    </div>

    <div class="text-center mt-3 mb-8">
      <div class="display-1 primary--text">
        Success!
      </div>
      <!--
      <div class="title font-weight-bold primary--text">
        {{ lockAmountHuman }}
      </div>
      -->
       LP tokens Locked
    </div>

    <div>
      This will be visible within our browser list within 15 mins.
      Thank you for using our locker. Best of luck with your project!
    </div>

    <div class="mt-3">
      Please stay tuned for new services we will offer ERC20 projects.
    </div>
    
    <v-btn block rounded x-large 
    @click="$root.ammLink(`/pair/${uniPair.address}`)" 
    class="mt-4 white--text grad-green">
      View lock page
    </v-btn>

  </div>
</template>

<script>
import { ethers } from 'ethers'

export default {
  props: {
    uniPair: {
      type: Object,
      default: () => {

      }
    },
    lockAmount: {
      type: String,
      default: '0'
    }
  },

  data: () => ({
  }),

  computed: {
    sEthers () {
      return this.$store.state.ethers
    },
    searchTextIsAddress () {
      try {
        ethers.utils.getAddress(this.searchPair)
        return true
      } catch (e) {
        return false
      }
    },
    lockAmountHuman () {
      var amount = ethers.utils.formatUnits(this.lockAmount, 18)
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 18})
    },
  },

  watch: {
    searchPair (nv) {
      if (this.searchTextIsAddress) {
        this.loadUniswapPair(nv)
      } else {
        this.uniswapPair = {}
      }
    }
  },

  methods: {
  },

  created () {
  }
}
</script>