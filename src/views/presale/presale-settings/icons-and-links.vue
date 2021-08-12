<template>
  <div class="pt-4">

    <div>
      Token icon (200px x 200px)
      <a href="https://imgur.com/upload" target="_blank" class="deadlink primary--text">
        Imgur
        <v-icon x-small color="primary">mdi-arrow-top-right</v-icon>
      </a>
    </div>
    <div class="caption textFaint--text">
      Icon must have equal width and height. Use imgur, fast and easy. No account required.
    </div>
    <div class="caption textFaint--text">
      e.g. https://i.imgur.com/HTdrQ38.png
    </div>
    <div class="mt-2 d-flex align-center pa-3 br-20 inputcolor">
      <c-input :value.sync="iconURL" placeholder="https://">
      </c-input>
    </div>
    <div class="caption textFaint--text text-end">
      {{ (typeof iconURL === 'string' ? iconURL : '').length }} / 300
    </div>

    <div class="mt-6">
      Website
    </div>
    <div class="caption textFaint--text">
      e.g. https://www.unicrypt.network
    </div>
    <div class="mt-2 d-flex align-center pa-3 br-20 inputcolor">
      <c-input :value.sync="websiteURL" placeholder="https://">
      </c-input>
    </div>
    <div class="caption textFaint--text text-end">
      {{ (typeof websiteURL === 'string' ? websiteURL : '').length }} / 200
    </div>
    <div v-if="!websiteIsValid" class="pink--text">
      * url must begin with http:// or https://
    </div>

    <div class="mt-6">
      Telegram
    </div>
    <div class="caption textFaint--text">
      e.g. https://t.me/uncx_token
    </div>
    <div class="mt-2 d-flex align-center pa-3 br-20 inputcolor">
      <c-input :value.sync="telegramURL" placeholder="https://">
      </c-input>
    </div>
    <div class="caption textFaint--text text-end">
      {{ (typeof telegramURL === 'string' ? telegramURL : '').length }} / 200
    </div>
    <div v-if="!telegramIsValid" class="pink--text">
      * url must begin with http:// or https://
    </div>

    <div class="mt-6">
      Twitter
    </div>
    <div class="caption textFaint--text">
      e.g. https://twitter.com/UNCX_token
    </div>
    <div class="mt-2 d-flex align-center pa-3 br-20 inputcolor">
      <c-input :value.sync="twitterURL" placeholder="https://">
      </c-input>
    </div>
    <div class="caption textFaint--text text-end">
      {{ (typeof twitterURL === 'string' ? twitterURL : '').length }} / 200
    </div>
    <div v-if="!twitterIsValid" class="pink--text">
      * url must begin with http:// or https://
    </div>

    <v-btn x-large rounded block @click="saveSettings" color="primary" class="mt-4">
      Save
    </v-btn>
  </div>
</template>

<script>
import PresaleContract from '@/smart-contracts/presales/presale-contract'
// import PresaleSettingsContract from '@/smart-contracts/presales/presale-settings'
import { ethers } from 'ethers'

export default {
  props: {
    address: {
      type: String
    }
  },

  components: {
  },

  data: () => ({
    presaleInfo: {
      presale_owner: '',
      token: {

      },
      base_token: {
        symbol: ''
      },
      eth_price: '0',
      token_price: '0',
      max_spend_per_buyer: '0',
      hardcap: '0',
      softcap: '0',
      total_eth_collected: '0'
    },
    iconURL: '',
    websiteURL: '',
    telegramURL: '',
    twitterURL: '',
    signedMessage: null,
  }),

  computed: {
    sEthers () {
      return this.$store.state.ethers
    },
    sEthersWatcher () {
      return this.sEthers.watcher
    },
    blockNumber () {
      return this.$store.state.blockNumber
    },
    baseTokenSymbol () {
      return this.presaleInfo.presale_in_eth ? 'ETH' : this.presaleInfo.base_token.symbol.toUpperCase()
    },
    websiteIsValid () {
      if (!this.websiteURL) {
        return true
      }
      return this.websiteURL.includes('https://') || this.websiteURL.includes('http://')
    },
    telegramIsValid () {
      if (!this.telegramURL) {
        return true
      }
      return this.telegramURL.includes('https://') || this.telegramURL.includes('http://')
    },
    twitterIsValid () {
      if (!this.twitterURL) {
        return true
      }
      return this.twitterURL.includes('https://') || this.twitterURL.includes('http://')
    },
    verifiedMessage () {
      try {
        const domain = {
          name: 'Unicrypt'
        }
        const types = {
          Message: [
            { name: 'content', type: 'string' }
          ]
        }
        const message = {
          content: `Update presale ${this.presaleInfo.presale_contract}`
        }
        return ethers.utils.verifyTypedData(domain, types, message, this.signedMessage)
      } catch {
        return ''
      }
    },
    verifiedMessageMatchesAccount () {
      return this.verifiedMessage === this.presaleInfo.presale_owner
    },
  },

  methods: {
    async getPresaleInfo () {
      var presaleInfo = await PresaleContract.presaleInfo(this.address)
      this.presaleInfo = presaleInfo
    },
    async saveSettings () {
      await this.sign()
      this.updateInfo()
    },
    async sign () {
      const domain = {
        name: 'Unicrypt'
      }
      const types = {
        Message: [
          { name: 'content', type: 'string' }
        ]
      }
      const message = {
        content: `Update presale ${this.presaleInfo.presale_contract}`
      }

      this.signedMessage = await this.sEthers.signer._signTypedData(domain, types, message)
      console.log(this.signedMessage)
    },
    async updateInfo () {
      var data = {
        iconURL: this.iconURL,
        websiteURL: this.websiteURL,
        telegramURL: this.telegramURL,
        twitterURL: this.twitterURL, 
        signature: this.signedMessage,
        presaleContract: this.presaleInfo.presale_contract
      }
      this.$axios.post(`/presales/update-info`, data)
        .then(response => {
          console.log(response)
          this.$root.$dialog.globalSuccess.open('Information updated')
        })
        .catch(error => {
          this.$root.$dialog.web3Error.open(error.message)
        })
    },
    async loadInfo () {
      this.$axios.get(`/presales/info/${this.address}`)
        .then(response => {
          var dbInfo = response.data
          console.log(dbInfo)
          this.iconURL = dbInfo.icon_url
          this.websiteURL = dbInfo.website_url
          this.telegramURL = dbInfo.telegram_url
          this.twitterURL = dbInfo.twitter_url
        })
        .catch(error => {
          console.log(error)
        })
    },
    async refresh () {
      await this.getPresaleInfo()
    }
  },

  created () {
    this.loadInfo()
    this.refresh()
  }
}
</script>