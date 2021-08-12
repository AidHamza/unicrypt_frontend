<template>

  <div>

    <v-card class="pa-2 mb-2 br-20">
      <div>
        {{ $store.state.exchange }} || {{ $store.state.requiredNetwork }}
      </div>
    </v-card>

    <div class="pa-3 v-card mb-4">
      Email: 
      <v-btn @click="testEmail">
        Test email
      </v-btn>
    </div>

    <v-card class="mb-2 br-20 pa-4">
      {{ cron_row }}
      {{ cron_jobs_active }}

      <v-btn @click="getUNCXDayData">
        Get UNCX day data
      </v-btn>
      <v-btn @click="doLongCron">
        long cron
      </v-btn>
      <v-btn @click="forceTwoMinCron">
        two min cron
      </v-btn>
      <v-btn @click="syncERC20">
        sync 1000 erc20 total supply
      </v-btn>
      <v-btn @click="tpGetTokens">
        Third party get tokens
      </v-btn>
    </v-card>

    <v-card class="pa-2 br-20 mb-4">
      <div class="mt-5 mb-5 d-flex align-center white pa-3 r-outlined ml-2 br-20 mr-2 background">
        <c-input :value.sync="testAddress" placeholder="address" class="heading--text">
        </c-input>
      </div>
      <div>
        {{ logMissingAddress }}
      </div>
      <v-btn @click="testFunction">
        Admin Test Function
      </v-btn>
      <v-btn @click="missingIndex">
        Get Missing Uniswap index
      </v-btn>
    </v-card>

    <v-card class="pa-2 br-20 mb-4">
      <v-btn @click="lastPairIndex">
        Uniswap latest pair index
      </v-btn>
      <v-btn @click="migrateWatchlists">
        Migrate watchlists
      </v-btn>
    </v-card>

    <v-card class="my-2 pa-2 br-20">
      0xA7577F841D95B1331954C936D71fe45BA2F62Fe5
    </v-card>

  </div>

</template>

<script>
import UniswapFactory from '@/smart-contracts/uniswap/uniswap-factory-contract'

export default {
  components: {
  },

  props: {
    apiKey: {
      type: String,
      default: ''
    }
  },

  data: () => ({
    cron_row: null,
    cron_jobs_active: null,
    testAddress: '',
    logMissingAddress: ''
  }),

  methods: {
    testEmail () {
      this.$axios.post(`/cron/test-mail`)
        .then(response => {
          var data = response.data
          console.log(data)
        })
        .catch(error => {
          console.log(error)
        })
    },
    async lastPairIndex () {
      var length = await UniswapFactory.allPairsLength()
      this.$root.$dialog.globalSuccess.open(`${length} pairs`)
    },
    loadAPI () {
      this.$axios.get(`/cron/status`)
        .then(response => {
          this.cron_row = response.data
          this.cron_jobs_active = Number(this.cron_row._value)
        })
        .catch(error => {
          console.log(error)
        })
    },
    getUNCXDayData () {
      this.$axios.get(`/uniswap/cron/latest-uncx-date`)
        .then(response => {
          alert(JSON.stringify(response.data))
        })
        .catch(error => {
          console.log(error)
        })
    },
    testFunction () {
      this.$axios.post(`/cron/test`, {index: this.testAddress})
        .then(response => {
          var data = response.data

          var keymap = {}
          data.forEach(item => {
            keymap[item.token.id] = true
          })
          console.log(data)
          console.log(Object.keys(keymap).length)
        })
        .catch(error => {
          console.log(error)
        })
    },
    migrateWatchlists () {
      this.$userAxios.post(`/cron/migrate-watchlists`)
        .then(response => {
          console.log(response.data)
        })
        .catch(error => {
          console.log(error)
        })
    },
    missingIndex () {
      this.$axios.post(`/cron/test-missing-index`, {})
        .then(response => {
          this.testAddress = response.data.index
          this.logMissingAddress = response.data.address
        })
        .catch(error => {
          console.log(error)
        })
    },
    tpGetTokens () {
      this.$axios.post(`/third-party/uniswap/tokens`, {page: 1})
        .then(response => {
          console.log(response)
        })
        .catch(error => {
          console.log(error)
        })
    },
    doLongCron () {
      this.$axios.post(`/cron/long-job`, {apiKey: this.apiKey})
        .then(response => {
          var data = response.data

          var keymap = {}
          data.forEach(item => {
            keymap[item.token.id] = true
          })
          console.log(data)
          console.log(Object.keys(keymap).length)
        })
        .catch(error => {
          console.log(error)
        })
    },
    forceTwoMinCron () {
      this.$axios.post(`/cron/admin-force-two-min`)
        .then(response => {
          var data = response.data

          var keymap = {}
          data.forEach(item => {
            keymap[item.token.id] = true
          })
          console.log(data)
          console.log(Object.keys(keymap).length)
        })
        .catch(error => {
          console.log(error)
        })
    },
    syncERC20 () {
      this.$axios.post(`/cron/update-erc20`)
        .then(response => {
          console.log('DONE')
        })
        .catch(error => {
          console.log(error)
        })
    },
  },

  created () {
    this.loadAPI()
  }
}
</script>