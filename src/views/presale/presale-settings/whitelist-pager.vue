<template>
  <div>
    <div class="v-card">

      <div class="font-weight-bold mb-4 d-flex align-center pa-4">
        White list 
        <v-spacer></v-spacer>
        <span class="textFaint--text font-weight-regular">{{ whitelistLength }} accounts</span>
      </div>

      <div class="pa-4">
        <div>
          Check if an address is whitelisted
        </div>
        <div class="mt-2 d-flex align-center pa-3 br-20 inputcolor">
          <c-input :value.sync="checkUserAddress" placeholder="0x...">
          </c-input>
          <v-btn outlined rounded @click="checkAddress">
            Check
          </v-btn>
        </div>
        <div class="text-center">
          <div v-if="checkResponse === true" class="primary--text">
            This address is whitelisted
          </div>
          <div v-else-if="checkResponse === false" class="pink--text">
            This address is not whitelisted
          </div>
          <div v-else class="pink--text">
            {{ checkResponse }}
          </div>
        </div>
      </div>

      <div class="pa-4">
        <div v-for="whitelist_address of whitelist" :key="whitelist_address">
          {{ whitelist_address }}
        </div>
      </div>

      <div class="d-flex align-center justify-center background pa-2">
        <v-btn @click="goPrevious" text :disabled="page === 0">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        {{ page + 1 }} / {{ pageCount }}
        <v-btn @click="goNext" text :disabled="!nextPageExists">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import PresaleContract from '@/smart-contracts/presales/presale-contract'
import { ethers } from 'ethers'

export default {
  props: {
    address: {
      type: String
    }
  },

  data: () => ({
    whitelistLength: 0,
    whitelist: [],
    page: 0,
    rowsPerPage: 2,
    checkResponse: '',
    checkUserAddress: ''
  }),

  computed: {
    nextPageExists () {
      return (this.page + 1) * this.rowsPerPage < this.whitelistLength
    },
    pageCount () {
      return Math.ceil(this.whitelistLength / this.rowsPerPage)
    }
  },

  methods: {
    goNext () {
      this.page++
      this.getPage()
    },
    goPrevious () {
      this.page--
      this.getPage()
    },
    async getPage () {
      var whitelistLength = await PresaleContract.whitelistLength(this.address)
      whitelistLength = Number(whitelistLength)
      var whitelist = []
      var endItem = (this.page + 1) * this.rowsPerPage
      endItem = endItem > whitelistLength ? whitelistLength : endItem
      var startOffset = this.page * this.rowsPerPage
      for (var i = startOffset; i < endItem; i++) {
        var address = await PresaleContract.getWhitelistedUserAtIndex(this.address, i)
        whitelist.push(address)
      }
      this.whitelist = whitelist
      this.whitelistLength = whitelistLength
    },
    async checkAddress () {
      var address = this.checkUserAddress
      try {
        ethers.utils.getAddress(address)
      } catch (e) {
        this.checkResponse = 'Invalid address'
        return
      }
      // var condensed = address.slice(0, 6) + '...' + address.slice(address.length - 4)
      var status = await PresaleContract.getUserWhitelistStatus(this.address, this.checkUserAddress)
      this.checkResponse = status
    },
    async refresh () {
      this.getPage()
    },
  },

  created () {
    this.refresh()
  }
}
</script>