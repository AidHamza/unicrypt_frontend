<template>
  <div>

    <keep-alive include="CronTab,TokensPage,PairsComponent,Presales">
      <router-view :key="$route.fullPath"></router-view>
    </keep-alive>
  </div>
</template>

<script>
import SETTINGS from '@/store/settings'
export default {
  props: {
    chain: {
      type: String
    }
  },

  data: () => ({
  }),

  created () {
    var shortnames = Object.values(SETTINGS.CHAIN_URL_NAME)
    if (!shortnames.includes(this.chain)) {
      this.$router.replace(`/`)
    } else if (SETTINGS.CHAIN_URL_NAME[this.$store.state.requiredNetwork] !== this.chain) {
      var requiredChain = Object.keys(SETTINGS.CHAIN_URL_NAME).find(key => SETTINGS.CHAIN_URL_NAME[key] === this.chain)
      this.$store.commit('switchChain', requiredChain)
    }
  }
}
</script>