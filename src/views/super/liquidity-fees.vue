<template>

  <div>
    <v-card class="mb-2 br-20 pa-4">

      <v-btn @click="getBalances">
        balances
      </v-btn>
      <v-btn @click="normalLoad">
        fetch
      </v-btn>

      <row
      v-for="item of items" 
      :key="item.address"
      :item="item">
      </row>

      <!-- PAGINATION -->
      <v-btn v-if="nextPageExists" depressed block @click="nextPage" class="ma-2">
        <v-progress-circular
        v-if="loading"
        indeterminate
        size="20"
        width="2"
        color="primary">
        </v-progress-circular>
        <template v-else>
          Show More
        </template>
      </v-btn>
      <!-- PAGINATION -->

    </v-card>

  </div>

</template>

<script>
import _ from 'lodash'
import Row from './lfee-row'

export default {
  components: {
    Row
  },

  data: () => ({
    items: [],
    page: 0,
    filters: {
      rowsPerPage: 20,
      sort: 'value',
      sortAscending: false,
      search: ''
    },
    nextPageExists: false,
    loading: false,
  }),

  methods: {
    normalLoad: _.debounce(function () {
      this.page = 0
      this.APIFetch()
        .then(response => {
          var rows = response.data.rows
          this.items = rows
          this.nextPageExists = rows.length === 30
        })
    }, 300, {leading: true}),

    nextPage: _.debounce(function () {
      this.page++
      this.APIFetch()
        .then(response => {
          var rows = response.data.rows
          this.items.push(...rows)
          this.nextPageExists = rows.length === 30
        })
    }, 500, {trailing: true}),

    APIFetch () {
      return new Promise((resolve, reject) => {
        this.loading = true
        this.$axios.post(`/pol/get-fees`, {filters: this.filters, page: this.page})
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            console.log(error)
            reject(error)
          })
          .then(() => {
            this.loading = false
          })

        this.$axios.get(`/pol/total-locked-pairs`)
          .then(response => {
            this.totalLockerPairs = response.data.count
          })
          .catch(error => {
            console.log(error)
          })
      })
    },
    getBalances () {
      this.$axios.post(`/pol/get-balances`)
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
  },

  created () {

  }
}
</script>