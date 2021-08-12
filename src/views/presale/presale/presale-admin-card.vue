<template>
  <v-container style="max-width: 600px;">

    <v-card :class="['br-20 mb-16', {'pa-2': $vuetify.breakpoint.xs}, {'pa-4': !$vuetify.breakpoint.xs}]">

      <v-icon v-if="true" size="100" style="color: var(--v-background-base)!important; position: absolute; right: -0px; top: -0px;">mdi-settings</v-icon>
      
      <div class="d-flex align-center mb-4">
        <v-btn icon :to="`${$store.state.ammPrefix}/ilo/${this.address}`" color="text">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
      </div>
      <div style="position: relative;">

        <presale-settings :address="address"></presale-settings>

        <div v-if="false" class="caption">
          {{ presaleInfo }}
        </div>
      </div>
    </v-card>

  </v-container>
</template>

<script>
import PresaleContract from '@/smart-contracts/presales/presale-contract'
import PresaleSettings from '@/views/presale/presale-settings/Page'

export default {

  props: {
    address: {
      type: String
    }
  },

  components: {
    PresaleSettings
  },

  data: () => ({
    expand: false,
    presaleInfo: {
      presale_owner: '',
      token: {

      },
      eth_price: '0',
      token_price: '0',
      max_spend_per_buyer: '0',
      hardcap: '0',
      softcap: '0',
      total_eth_collected: '0'
    }
  }),

  computed: {
    sEthers () {
      return this.$store.state.ethers
    },
    sEthersWatcher () {
      return this.sEthers.watcher
    },
    userIsOwner () {
      return this.sEthers.coinbase === this.presaleInfo.presale_owner
    },
  },
  
  methods: {
    async getPresaleInfo () {
      var presaleInfo = await PresaleContract.presaleInfo(this.address)
      this.presaleInfo = presaleInfo
    },
    async refresh () {
      await this.getPresaleInfo()
    }
  },

  created () {
    this.refresh()
  }
}
</script>