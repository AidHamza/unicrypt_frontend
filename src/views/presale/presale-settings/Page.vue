<template>
  <div class="pa-1">

    <div v-if="firstLoad" class="text-center" style="height: 80vh;">
      <v-progress-circular
      indeterminate
      size="150"
      color="primary">
        <img 
        src="@/assets/img/UNCX_fill.svg" 
        height="120px"
        width="120px">
      </v-progress-circular>
    </div>

    <v-scroll-x-transition>
      <div v-if="!firstLoad">

        <div class="text-center">
          <coin-icon :url="dbInfo.icon_url" :size="100"></coin-icon>
          <div class="title">
            {{ presaleInfo.token.name }} presale info
          </div>
          <div class="pa-4 mb-2">
            Add your Imgur token logo, website and social media links.
          </div>
          <div class="primary--text mb-6">
            Only the presale owner account ({{ ownerAddressCondensed }}) can edit these settings.
          </div>
        </div>

        <template v-if="tab === 0">
          <v-card class="pa-4 mb-1 c-list" @click="tab = 1">
            Update icons and links
          </v-card>
          <v-card class="pa-4 mb-1 c-list" @click="tab = 2">
            Whitelist
          </v-card>
          <v-card class="pa-4 mb-1 c-list" @click="tab = 3">
            Start / End block
            <div class="textFaint--text">
              Only editable if the presale has not yet begun
            </div>
          </v-card>
          <v-card class="pa-4 mb-1 c-list" @click="tab = 4">
            User max limits
          </v-card>

          <v-btn class="mt-10" x-large @click="ownerWithdrawTokens" :disabled="presaleStatus !== '3'" block outlined>
            Withdraw tokens on fail
          </v-btn>
        </template>

        <template v-else>

          <div class="mb-2">
            <v-btn rounded @click="tab = 0" color="primary">
              <v-icon>mdi-arrow-left</v-icon>
              Menu
            </v-btn>
          </div>

          <v-card v-if="tab === 1" class="pa-2 br-20">
            <icons-and-links :address="address"></icons-and-links>
          </v-card>

          <v-card v-if="tab === 2" class="pa-2 br-20">
            <whitelist :address="address"></whitelist>
          </v-card>

          <v-card v-else-if="tab === 3" class="pa-2 br-20">
            <start-end :address="address"></start-end>
          </v-card>

          <v-card v-else-if="tab === 4" class="pa-2 br-20">
            <user-limits :address="address"></user-limits>
          </v-card>

        </template>

      </div>
    </v-scroll-x-transition>

  </div>
</template>

<script>
import IconsAndLinks from './icons-and-links'
import Whitelist from './whitelist'
import StartEnd from './start-end'
import UserLimits from './user-limits'
import PresaleContract from '@/smart-contracts/presales/presale-contract'
import TxWrapper from '@/smart-contracts/tx-wrapper'

export default {

  components: {
    IconsAndLinks,
    Whitelist,
    StartEnd,
    UserLimits
  },

  props: {
    address: {
      type: String
    }
  },

  data: () => ({
    tab: 0,
    presaleInfo: {
      token: {
        name: ''
      }
    },
    presaleStatus: '0',
    dbInfo: {},
    firstLoad: true
  }),

  computed: {
    sEthers () {
      return this.$store.state.ethers
    },
    sEthersWatcher () {
      return this.sEthers.watcher
    },
    ownerAddressCondensed () {
      var address = this.presaleInfo.presale_owner
      if (!address) {
        return ''
      }
      return address.slice(0, 6) + '...' + address.slice(address.length - 4)
    },
  },

  methods: {
    async ownerWithdrawTokens () {
      // this.createLoading = true
      TxWrapper.doTransaction(PresaleContract.ownerWithdrawTokens(this.address), this.$root.$dialog.confirmTx)
        .then(() => { 
          // this.getPresaleInfo()
        })
        .catch(e => { this.$root.$dialog.web3Error.open(e.message) })
        .then(() => {
          // this.createLoading = false
        })
    },
    async loadInfo () {
      var presaleInfo = await PresaleContract.presaleInfo(this.address)
      this.presaleInfo = presaleInfo
      var presaleStatus = await PresaleContract.presaleStatus(this.address)
      this.presaleStatus = presaleStatus
    },
    async loadDBInfo () {
      var response = await this.$axios.get(`/presales/info/${this.address}`)
      this.dbInfo = response.data
    }
  },

  created () {
    this.loadInfo()
      .then(() => {
        this.firstLoad = false
      })
      .catch(e => {
        console.log(e)
      })
    this.loadDBInfo()
  }
}
</script>