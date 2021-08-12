<template>
  <div>

    <div v-if="!loggedIn" class="pa-4">
      <div class="textFaint--text">
        <router-link to="/account" class="deadlink primary--text">
          Log in
        </router-link>
        to submit an audit
      </div>
    </div>

    <div v-else-if="!userIsAuditor" class="pa-4">
      <div class="textFaint--text">
        Your account is not approved to submit an audit.
      </div>
    </div>

    <v-card v-else class="pa-4 br-20">
      <div v-if="editMode" class="text-center textFaint--text">
        Update your audit as
      </div>
      <div v-else class="text-center textFaint--text">
        Submit an audit as
      </div>
      <div class="text-center title">
        {{ username }}
      </div>

      <div v-if="editMode" class="text-end">
        <v-btn outlined rounded @click="deleteAudit">
          Delete your audit
        </v-btn>
      </div>

      <div v-if="false">
        {{ address }}
      </div>

      <div class="text-center mt-10">
        <v-btn icon height="100px" width="100px" @click="rating = 0">
          <img 
          src="@/assets/img/flags/verified.svg" 
          height="80px"
          :class="{'greyscale': rating !== 0}"
          width="95px">
        </v-btn>
        
        <v-btn icon height="100px" width="100px" @click="rating = 1">
          <img 
          src="@/assets/img/flags/exclamation.svg" 
          height="80px"
          :class="{'greyscale': rating !== 1}"
          width="80px">
        </v-btn>

        <v-btn icon height="100px" width="100px" @click="rating = 2">
          <img 
          src="@/assets/img/flags/close.svg" 
          height="80px"
          :class="{'greyscale': rating !== 2}"
          width="80px">
        </v-btn>
      </div>

      <div class="title text-center mb-4">
        <div v-if="rating === 0" class="green--text">
          Verified
        </div>
        <div v-if="rating === 1" class="orange--text">
          Slight warning
        </div>
        <div v-if="rating === 2" class="red--text">
          Major Flags found
        </div>
      </div>

      <div class="mt-6">
        Audit info
      </div>
      <div class="caption textFaint--text">
        Short text on audit findings
      </div>

      <div class="d-flex align-center inputcolor pa-2 pb-0 r-outlined">
        <c-textarea :value.sync="audit_text" placeholder="Token contract contains minting / proxies..." rows="5"></c-textarea>
      </div>

      <div class="mt-6">
        Link to audit / twitter thread
      </div>
      <div class="caption textFaint--text">
        e.g. https://twitter.com/certik/sometweet
      </div>
      <div class="mt-2 d-flex align-center pa-3 br-20 inputcolor">
        <c-input :value.sync="audit_link" placeholder="https://">
        </c-input>
      </div>
      <div v-if="!linkIsValid" class="pink--text">
        * url must begin with http:// or https://
      </div>

      <v-btn x-large block rounded color="primary" @click="submitFlag" class="mt-4">
        {{ editMode ? 'Update' : 'Submit' }}
      </v-btn>

    </v-card>

  </div>
</template>

<script>
export default {
  props: {
    address: {
      type: String
    }
  },

  data: () => ({
    rating: 0,
    audit_text: '',
    audit_link: '',
    editMode: false
  }),

  computed: {
    loggedIn () {
      return this.$store.state.user.username
    },
    userIsAuditor () {
      return this.$store.state.user.permissions.auditor
    },
    username () {
      return this.$store.state.user.username
    },
    user () {
      return this.$store.state.user
    },
    linkIsValid () {
      if (!this.audit_link) {
        return true
      }
      return this.audit_link.includes('https://') || this.audit_link.includes('http://')
    },
  },

  methods: {
    async loadInfo () {
      this.$axios.get(`/audits/${this.address}/user/${this.user.jwtObject.user_id}`)
        .then(response => {
          if (response.data.id >= 0) {
            this.editMode = true
            this.rating = response.data.rating
            this.audit_text = response.data.audit_text
            this.audit_link = response.data.audit_link
          } else {
            // defaults
            this.editMode = false
            this.rating = 1
            this.audit_text = ''
            this.audit_link = ''
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    submitFlag () {
      var data = {
        token: this.address,
        rating: this.rating,
        audit_text: this.audit_text,
        audit_link: this.audit_link
      }
      this.$axios.post(`/audits/submit-rating`, data)
        .then(response => {
          this.loadInfo()
          this.$emit('on-update')
          this.$root.$dialog.globalSuccess.open('Audit successfully submitted')
        })
        .catch(error => {
          this.$root.$dialog.web3Error.open(error.response.data.errors[0])
        })
    },
    deleteAudit () {
      this.$axios.post(`/audits/delete/${this.address}`)
        .then(response => {
          this.loadInfo()
          this.$emit('on-update')
          this.$root.$dialog.globalSuccess.open('Audit successfully deleted')
        })
        .catch(error => {
          this.$root.$dialog.web3Error.open(error.response.data.errors[0])
        })
    },
  },

  created () {
    this.loadInfo()
  }
}
</script>