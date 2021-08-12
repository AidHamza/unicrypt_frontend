<template>
  <div class="pa-6">

    <v-btn icon v-if="tab > 0" text @click="tab > 0 ? tab-- : ''" class="mb-4 pa-0">
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>

    <div v-if="tab === 0" class="text-center">
      <logged-in-main @change-tab="changeTab"></logged-in-main>
    </div>

    <div v-else-if="tab === 1" class="text-center">
      <set-password></set-password>
    </div>

  </div>
</template>

<script>
import SetPassword from './set-password'
import LoggedInMain from './logged-in-main'

export default {
  components: {
    SetPassword,
    LoggedInMain
  },

  data: () => ({
    tab: 0 // 0 = Main, 1 = change password
  }),

  computed: {
  },

  methods: {
    changeTab (newTab) {
      this.tab = newTab
    }
  },

  created () {
  }
}
</script>