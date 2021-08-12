<template>
  <div>

    <div v-if="!loggedIn" class="pa-4">
      <div class="textFaint--text">
        <router-link to="/account" class="deadlink primary--text">
          Log in
        </router-link>
        to submit KYC info
      </div>
    </div>

    <div v-else-if="!userIsKYCVerifier" class="pa-4">
      <div class="textFaint--text">
        Your account is not approved to submit KYC verification.
      </div>
    </div>

    <v-card v-else class="pa-4 br-20">
      <div v-if="editMode" class="text-center textFaint--text">
        Update KYC verification as
      </div>
      <div v-else class="text-center textFaint--text">
        Submit KYC verification as
      </div>
      <div class="text-center title">
        {{ username }}
      </div>

      <div v-if="editMode" class="text-end">
        <v-btn outlined rounded @click="deleteAudit">
          Delete your KYC audit
        </v-btn>
      </div>

      <div v-if="false">
        {{ address }}
      </div>

      <div class="text-center mt-10">
        <v-btn icon height="100px" width="100px" @click="rating = 0">
          <img 
          src="@/assets/img/flags/magnify.svg" 
          height="80px"
          :class="{'greyscale': rating !== 0}"
          width="95px">
        </v-btn>

        <v-btn icon height="100px" width="100px" @click="rating = 1">
          <img 
          src="@/assets/img/flags/close.svg" 
          height="80px"
          :class="{'greyscale': rating !== 1}"
          width="80px">
        </v-btn>
      </div>

      <div class="title text-center mb-4">
        <div v-if="rating === 0" class="blue--text">
          Team is KYC Verified
        </div>
        <div v-if="rating === 1" class="red--text">
          Team not KYC Verified
        </div>
      </div>

      <v-btn x-large block rounded color="blue" @click="submitFlag" class="mt-4">
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
    editMode: false
  }),

  computed: {
    loggedIn () {
      return this.$store.state.user.username
    },
    userIsKYCVerifier () {
      return this.$store.state.user.permissions.kyc_verifier
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
      this.$axios.get(`/kyc/${this.address}/user/${this.user.jwtObject.user_id}`)
        .then(response => {
          if (response.data.id >= 0) {
            this.editMode = true
            this.rating = response.data.rating
          } else {
            // defaults
            this.editMode = false
            this.rating = 1
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
      }
      this.$axios.post(`/kyc/submit-rating`, data)
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
      this.$axios.post(`/kyc/delete/${this.address}`)
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