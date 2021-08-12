<template>
  <div class="">

    <div v-if="firstLoad" class="text-center">
      <v-progress-circular
      indeterminate
      size="50"
      color="#aaa">
        <img 
        src="@/assets/img/UNCX_fill.svg" 
        height="40px"
        width="40px"
        class="greyscale">
      </v-progress-circular>
    </div>

    <template v-else>

      <div v-if="items.length === 0" class="textFaint--text">
        There are no audits for this token on Unicrypt yet.
      </div>

      <v-card v-for="audit of items" :key="audit.id" class="pa-4 br-20 mb-2">

        <div class="d-flex align-center">
          <div v-if="audit.rating === 2" class="d-flex align-center font-weight-medium midground pr-2 br-8" style="position: relative; overflow: hidden;">
            <div class="red" style="position: absolute; left: 0px; top: 0px; bottom: 0px; right: 0px;opacity: 0.2;">
            </div>
            <img 
            src="@/assets/img/flags/close.svg" 
            height="26px"
            class="mr-2"
            width="26px">
            <span>
              Flagged
            </span>
          </div>

          <div v-if="audit.rating === 1" class="d-flex align-center font-weight-medium midground pr-2 br-8" style="position: relative; overflow: hidden;">
            <div class="orange" style="position: absolute; left: 0px; top: 0px; bottom: 0px; right: 0px;opacity: 0.2;">
            </div>
            <img 
            src="@/assets/img/flags/exclamation.svg" 
            height="26px"
            class="mr-2"
            width="26px">
            <span>
              Minor warning
            </span>
          </div>

          <div v-if="audit.rating === 0" class="d-flex align-center font-weight-medium midground pr-2 br-8" style="position: relative; overflow: hidden;">
            <div class="green" style="position: absolute; left: 0px; top: 0px; bottom: 0px; right: 0px;opacity: 0.2;">
            </div>
            <img 
            src="@/assets/img/flags/verified.svg" 
            height="26px"
            class="mr-2"
            width="26px">
            <span>
              Verified
            </span>
          </div>

          <div class="ml-1 font-weight-medium textFaint--text">
            by <span class="text--text">{{ audit.username }}</span>
          </div>

        </div>

        <div v-if="audit.audit_text" class="mt-4" style="white-space: pre-wrap;"
        >{{ audit.audit_text }}
        </div>

        <v-btn :href="audit.audit_link" target="_blank" rounded text v-if="audit.audit_link" class="mt-4" color="primary">
          View audit
          <v-icon x-small class="ml-1">mdi-arrow-top-right</v-icon>
        </v-btn>

      </v-card>

    </template>

  </div>
</template>

<script>
import _ from 'lodash'

export default {
  props: {
    address: {
      type: String
    }
  },

  data: () => ({
    firstLoad: true,
    items: []
  }),

  computed: {
  },

  methods: {
    normalLoad: _.debounce(function () {
      this.APIFetch()
        .then(audits => {
          this.items = audits
          // this.nextPageExists = rows.length === 2
          // var endOfPage = (this.page + 1) * this.rowsPerPage
          // this.nextPageExists = endOfPage < response.data.count
        })
        .catch(error => {
          console.log(error)
        })
        .then(() => {
          this.loading = false
          this.showSearchLoader = false
          this.firstLoad = false
        })
    }, 300, {leading: true}),

    async APIFetch () {
      this.loading = true
      var response = await this.$axios.post(`/audits/${this.address}`)
      var audits = response.data.rows
      var user_ids = audits.map(row => row.user_id)
      var usernames = await this.$userAxios.post(`/users/get-usernames`, {user_ids: user_ids})
      usernames = usernames.data
      audits.map(audit => {
        audit.username = usernames[audit.user_id]
      })
      return audits
    },
  },

  created () {
    this.normalLoad()
  }
}
</script>