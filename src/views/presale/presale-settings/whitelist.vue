<template>
  <div>

    <div v-if="false">
      {{ presaleSettings }}
    </div>

    <div v-if="!presaleSettings.whitelist_only" class="text-center">
      <v-icon color="textFaint" size="100">mdi-account-group-outline</v-icon>
      <div class="title textFaint--text">
        Whitelist not enabled.
      </div>
      <div class="caption textFaint--text mb-8">
        Any account may participate in this presale.
      </div>
      <v-btn @click="setWhitelistFlag(true)" color="primary" x-large block depressed>
        Enable whitelist
      </v-btn>
    </div>

    <template v-else>
      
      <div class="text-center">
        <v-icon color="textFaint" size="100">mdi-account-check-outline</v-icon>
        <div class="title textFaint--text">
          Whitelist enabled.
        </div>
        <div class="caption textFaint--text mb-8">
          Only whitelisted accounts may participate in the presale.
        </div>
      </div>

      <v-btn @click="setWhitelistFlag(false)" color="primary" x-large block depressed>
        Disable whitelist
      </v-btn>

      <whitelist-pager :address="address" ref="whitelistPager" class="mt-8"></whitelist-pager>

      <div class="text-center my-2">
        <v-btn x-large depressed rounded @click="tab = 0" :class="{'primary--text': tab === 0}">
          Add
        </v-btn>
        <v-btn x-large depressed rounded @click="tab = 1" :class="{'primary--text': tab === 1}">
          Remove
        </v-btn>
      </div>

      <div v-if="tab === 0">
        <div class="title mt-8">
          Add to White list
        </div>
        <div>
          One address per line, no comma
        </div>
        <div class="pa-3 caption textFaint--text">
          Example format:
          <div>
            0x51d4041eeef08fca44635945da368bb36173855e
          </div>
          <div>
            0x5d7c806c24a92a0ba565970dc1eac0253d8288a4
          </div>
        </div>
        <div class="d-flex align-center inputcolor pa-2 pb-0 r-outlined">
          <c-textarea :value.sync="whitelist" placeholder="0x09120912" rows="5"></c-textarea>
        </div>
        <v-btn @click="whitelistAdd" color="primary" x-large block depressed>
          Add to whitelist
        </v-btn>
      </div>

      <div v-else-if="tab === 1">
        <div class="title mt-8">
          Remove from whitelist
        </div>
        <div>
          One address per line, no comma
        </div>
        <div class="pa-3 caption textFaint--text">
          Example format:
          <div>
            0x51d4041eeef08fca44635945da368bb36173855e
          </div>
          <div>
            0x5d7c806c24a92a0ba565970dc1eac0253d8288a4
          </div>
        </div>
        <div class="d-flex align-center inputcolor pa-2 pb-0 r-outlined">
          <c-textarea :value.sync="unwhitelist" placeholder="0x09120912" rows="5"></c-textarea>
        </div>

        <v-btn @click="whitelistRemove" color="primary" x-large block depressed>
          Remove from whitelist
        </v-btn>
      </div>

    </template>
  </div>
</template>

<script>
import WhitelistPager from './whitelist-pager'
import PresaleContract from '@/smart-contracts/presales/presale-contract'
import TxWrapper from '@/smart-contracts/tx-wrapper'

export default {
  props: {
    address: {
      type: String
    }
  },

  components: {
    WhitelistPager
  },

  data: () => ({
    tab: 0,
    whitelistOnly: true,
    whitelist: '',
    unwhitelist: '',
    whitelistLength: '0',
    presaleSettings: {
      whitelist_only: false
    }
  }),

  methods: {
    async getWhitelist () {
      var whitelistLength = await PresaleContract.whitelistLength(this.address)
      this.whitelistLength = whitelistLength
      var presaleSettings = await PresaleContract.presaleSettings(this.address)
      this.presaleSettings = presaleSettings
    },
    async whitelistAdd () {
      // this.createLoading = true
      var addresses = this.whitelist.split("\n").map(item => item.trim())
      console.log(addresses)
      TxWrapper.doTransaction(PresaleContract.editWhitelist(this.address, addresses, true), this.$root.$dialog.confirmTx)
        .then(() => { 
          // this.getPresaleInfo()
          this.$refs.whitelistPager.refresh()
        })
        .catch(e => { this.$root.$dialog.web3Error.open(e.message) })
        .then(() => {
          // this.createLoading = false
        })
    },
    async whitelistRemove () {
      // this.createLoading = true
      var addresses = this.unwhitelist.split("\n").map(item => item.trim())
      console.log(addresses)
      TxWrapper.doTransaction(PresaleContract.editWhitelist(this.address, addresses, false), this.$root.$dialog.confirmTx)
        .then(() => { 
          this.$refs.whitelistPager.refresh()
        })
        .catch(e => { this.$root.$dialog.web3Error.open(e.message) })
        .then(() => {
          // this.createLoading = false
        })
    },
    async setWhitelistFlag (value) {
      // this.createLoading = true
      TxWrapper.doTransaction(PresaleContract.setWhitelistFlag(this.address, value), this.$root.$dialog.confirmTx)
        .then(() => { 
          // this.$refs.whitelistPager.refresh()
          this.refresh()
        })
        .catch(e => { this.$root.$dialog.web3Error.open(e.message) })
        .then(() => {
          // this.createLoading = false
        })
    },
    refresh () {
      this.getWhitelist()
    }
  },

  created () {
    this.refresh()
  }
  
}
</script>