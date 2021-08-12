<template>
  <div>
    <v-slide-y-transition appear>
      <div>
        <div class="justify-center mx-auto" style="max-width: 580px;">

          <div class="text-center pt-1">
            <div class="pa-1">
              <div @click="$router.push('/amm')" class="br-8 pa-1 border c-list">
                <div class="caption textFaint--text font-italic">
                  Selected exchange
                </div>
                <div class="font-weight-bold title d-flex align-center justify-center">
                  <img 
                  :src="$settings.AMMS[this.$store.state.exchange].icon" 
                  height="24px"
                  width="24px"
                  class="mr-3 br-20">
                  {{ $store.state.exchange }}
                  <v-icon small color="">mdi-chevron-down</v-icon>
                </div>
              </div>
            </div>
          </div>

          <div v-if="$store.state.exchange === 'Pancakeswap V1' || $store.state.exchange === 'Pancakeswap V2222'" class="d-flex align-center justify-center font-weight-medium px-4 py-2" style="position: relative; overflow: hidden;">
            <div class="orange" style="position: absolute; left: 0px; top: 0px; bottom: 0px; right: 0px;opacity: 0.2;">
            </div>
            <div class="text-center caption">
              <div class="d-flex align-center">
                <v-icon small class="mr-1" color="text">mdi-alert-outline</v-icon>
                The Pancakeswap explorer is out of sync
              </div>
              <div v-if="false" class="caption">
                Data such as prices will be inaccurate.
              </div>
            </div>
          </div>

          <div class="d-flex border-b foreground border br-8" style="overflow: hidden;">
            <router-link 
            :to="`${$store.state.ammPrefix}/tokens`"
            v-slot="{ isActive, navigate }">
              <div :class="['top-tab', {'active': isActive}]" @click="navigate">
                <v-icon size="20" class="mr-1">mdi-checkbox-blank-circle-outline</v-icon>
                <span>Tokens</span>
              </div>
            </router-link>

            <router-link 
            :to="`${$store.state.ammPrefix}/pairs`"
            v-slot="{ isActive, navigate }">
              <div :class="['top-tab', {'active': isActive}]" @click="navigate">
                <v-icon size="20" class="mr-1">mdi-checkbox-multiple-blank-circle-outline</v-icon>
                <span>Pairs</span>
              </div>
            </router-link>

            <router-link 
            :to="`${$store.state.ammPrefix}/ilos`"
            v-slot="{ isActive, navigate }">
              <div :class="['top-tab', {'active': isActive}]" @click="navigate">
                <v-icon size="20" class="mr-1">mdi-rocket</v-icon>
                <span>ILO's</span>
              </div>
            </router-link>

            <router-link
            v-if="$store.state.superUserMode"
            :to="`${$store.state.ammPrefix}/sajfkhflkjasdlisdulansdlakds`"
            v-slot="{ isActive, navigate }">
              <div :class="['top-tab', {'active': isActive}]" @click="navigate">
                <v-icon size="20" class="mr-1">mdi-atom</v-icon>
                <span>Super</span>
              </div>
            </router-link>
          </div>

        </div>

        <keep-alive include="CronTab,TokensPage,PairsComponent,Presales">
          <router-view :key="$route.fullPath"></router-view>
        </keep-alive>
      </div>
    </v-slide-y-transition>
  </div>
</template>

<script>
import SETTINGS from '@/store/settings'
export default {
  props: {
    amm: {
      type: String
    }
  },

  data: () => ({
  }),

  created () {
    var nameMap = Object.keys(SETTINGS.AMMS).reduce((a, key) => {
      a[key] = SETTINGS.AMMS[key].shortname
      return a
    }, {})
    var shortnames = Object.values(nameMap)
    if (!shortnames.includes(this.amm)) {
      this.$router.replace(`/`)
    } else if (this.$store.state.exchange === null || SETTINGS.AMMS[this.$store.state.exchange].shortname !== this.amm) {
      var requiredExchange = Object.keys(nameMap).find(key => nameMap[key] === this.amm)
      this.$store.commit('switchExchange', requiredExchange)
    }
    // this.$store.commit('switchExchange', 'Uniswap')
    // this.$root.ammLink(`/tokens`)
  }
}
</script>