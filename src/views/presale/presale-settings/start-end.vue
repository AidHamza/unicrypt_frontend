<template>
  <div class="pt-4">

    <div v-if="startBlockHasBeenReached" class="title pink--text">
      These settings are no longer editable, the presale has begun.
    </div>

    <div class="mt-2">
      These parameters can only be changed while the start block has not been reached. Once the presale starts 
      it is no longer possible to edit / postpone / or bring forward a presale.
    </div>

    <div class="mt-10 mb-2 title font-weight-bold text-center">
      Start Date
    </div>

    <b-date :block.sync="startBlock"></b-date>

    <div class="mt-10 mb-2 title font-weight-bold text-center">
      End Date
    </div>

    <b-date :block.sync="endBlock"></b-date>

    <div>
      Presale duration: {{ presaleDurationHuman }} / {{ presaleBlockDuration }} blocks
    </div>

    <div v-if="Number(endBlock) < Number(startBlock)" class="pink--text">
      Your end date must be after the start date
    </div>

    <div v-if="eStartEndExceedsMax" class="pink--text">
      Presale duration too long. Maximum of 2 weeks allowed
    </div>

    <v-btn x-large rounded block @click="updateBlocks" color="primary" class="mt-4" :disabled="startBlockHasBeenReached">
      Update presale period
    </v-btn>
  </div>
</template>

<script>
import PresaleContract from '@/smart-contracts/presales/presale-contract'
import PresaleSettingsContract from '@/smart-contracts/presales/presale-settings'
import TxWrapper from '@/smart-contracts/tx-wrapper'
import ERC20 from '@/smart-contracts/erc20'
import BDate from '@/components/ui/block-date'
import moment from 'moment'

export default {
  props: {
    address: {
      type: String
    }
  },

  components: {
    BDate
  },

  data: () => ({
    startBlock: '0',
    endBlock: '0',
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
    presaleFees: {},
    contractTokenBalance: '0',
    contractETHBalance: '0'
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
    userIsOwner () {
      return this.sEthers.coinbase === this.presaleInfo.presale_owner
    },
    baseTokenSymbol () {
      return this.presaleInfo.presale_in_eth ? 'ETH' : this.presaleInfo.base_token.symbol.toUpperCase()
    },
    presaleBlockDuration () {
      var blockLength = Number(this.endBlock) - Number(this.startBlock)
      return blockLength
    },
    presaleDurationHuman () {
      var duration = this.presaleBlockDuration * this.$store.state.blocksPerSecond
      var mdur = moment.duration(duration * 1000)
      if (mdur.days() > 0) {
        return mdur.days() + ' days'
      }
      if (mdur.hours() > 0) {
        return mdur.hours() + ' hours'
      }
      if (mdur.minutes() > 0) {
        return mdur.minutes() + ' minutes'
      }
      return mdur.seconds() + ' seconds'
    },
    eStartEndExceedsMax () {
      var length = this.endBlock - this.startBlock
      return length > this.presaleFees.max_presale_length
    },
    startBlockHasBeenReached () {
      return Number(this.blockNumber) >= Number(this.presaleInfo.start_block)
      // return false
    }
  },

  methods: {
    async getContractEthBalance () {
      var balance = await this.sEthers.provider.getBalance(this.address)
      this.contractETHBalance = balance
    },
    async getContractTokenBalance () {
      var balance = await ERC20.getBalance(this.address, this.presaleInfo.token.address)
      this.contractTokenBalance = balance
    },
    async getPresaleInfo () {
      var presaleInfo = await PresaleContract.presaleInfo(this.address)
      this.presaleInfo = presaleInfo

      var presaleFees = await PresaleSettingsContract.getFees()
      this.presaleFees = presaleFees

      this.startBlock = presaleInfo.start_block
      this.endBlock = presaleInfo.end_block
    },
    async updateBlocks () {
      this.createLoading = true
      TxWrapper.doTransaction(PresaleContract.updateBlocks(this.address, this.startBlock, this.endBlock), this.$root.$dialog.confirmTx)
        .then(() => { 
          this.getPresaleInfo()
        })
        .catch(e => { this.$root.$dialog.web3Error.open(e.message) })
        .then(() => {
          this.createLoading = false
        })
    },
    async refresh () {
      await this.getPresaleInfo()
      this.getContractEthBalance()
      this.getContractTokenBalance()
    }
  },

  created () {
    this.refresh()
  }
}
</script>