<template>
  <div>
    <div>
      <pair-row
      v-for="item of pairs" 
      :key="item.address"
      :item="item"
      class="border-b">
      </pair-row>
    </div>

    <!-- PAGINATION -->
    <v-btn v-if="nextPageExists" v-scroll="onScroll" depressed block @click="nextPage" class="ma-2">
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
  </div>
</template>

<script>
import PairRow from '@/views/pairs/row'
import _ from 'lodash'

export default {
  props: {
    address: {
      type: String
    }
  },

  components: {
    PairRow
  },

  data: () => ({
    pairs: [],
    page: 0,
    filters: {
      rowsPerPage: 20,
      sort: 'lock_value',
      sortAscending: false,
    },
    nextPageExists: false,
    loading: false,
  }),

  methods: {
    onScroll (e) {
      if (typeof window === 'undefined') return
      if ((window.innerHeight + window.pageYOffset) >= document.body.scrollHeight - 10) {
        this.nextPage()
      }
    },

    nextPage: _.debounce(function () {
      this.page++
      this.APIFetchPairs()
        .then(response => {
          var rows = response.data.rows
          this.pairs.push(...rows)
          this.nextPageExists = rows.length === 30
        })
    }, 500, {trailing: true}),

    normalLoad: _.debounce(function () {
      this.APIFetchPairs()
        .then(response => {
          var rows = response.data.rows
          this.pairs = rows
          this.nextPageExists = rows.length === 30
        })
    }, 300, {leading: true}),

    APIFetchPairs () {
      return new Promise((resolve, reject) => {
        this.loading = true
        this.$axios.post(`/uniswap/token/${this.address}/pairs`, {filters: this.filters, page: this.page})
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            console.log(error)
            reject(error)
          })
          .then(() => {
            this.loading = false
            this.firstLoad = false
          })
      })
    },
  },

  created () {
    this.normalLoad()
  }
}
</script>