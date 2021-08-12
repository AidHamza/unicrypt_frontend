<template>
  <div outlined
  :class="['c-list', 
  {'pa-4 border-b br-0 foreground': mode === 0 && $vuetify.breakpoint.xs}, 
  {'pa-4 foreground r-outlined br-0': mode === 1 && $vuetify.breakpoint.xs},
  {'pa-4 border-b': mode === 0 && !$vuetify.breakpoint.xs}, 
  {'border-b pa-4': mode === 1 && !$vuetify.breakpoint.xs}]" 
  @click="goToTokenPage" style="position: relative;">

    <v-icon v-if="item.tval_locked" size="80" class="watermark" style="position: absolute; left: -30px; top: 20px;">mdi-lock-outline</v-icon>
    
    <div style="position: relative;">

      <!-- BADGES -->
      <!-- <div v-if="mode === 1" class="d-flex align-center mb-1"> -->
      <div v-if="false" class="d-flex align-center mb-1">
        <v-progress-circular
        :value="Math.abs(item.change_30d)"
        :rotate="-90"
        size="18"
        width="1.5"
        class="ml-1"
        :color="item.change_30d >= 0 ? 'primary' : 'pink'">
          <v-icon v-if="item.change_30d == 0" x-small color="textFaint">mdi-minus</v-icon>
          <v-icon v-else-if="item.change_30d > 0" x-small color="primary">mdi-arrow-top-right</v-icon>
          <v-icon v-else x-small color="pink">mdi-arrow-bottom-right</v-icon>
        </v-progress-circular>
        <v-progress-circular
        :value="Math.abs(item.change_7d)"
        :rotate="-90"
        size="18"
        width="1.5"
        class="ml-1"
        :color="item.change_7d >= 0 ? 'primary' : 'pink'">
          <v-icon v-if="item.change_7d == 0" x-small color="textFaint">mdi-minus</v-icon>
          <v-icon v-else-if="item.change_7d > 0" x-small color="primary">mdi-arrow-top-right</v-icon>
          <v-icon v-else x-small color="pink">mdi-arrow-bottom-right</v-icon>
        </v-progress-circular>
        <v-progress-circular
        :value="Math.abs(item.change_24)"
        :rotate="-90"
        size="18"
        width="1.5"
        class="ml-1"
        :color="item.change_24 >= 0 ? 'primary' : 'pink'">
          <v-icon v-if="item.change_24 == 0" x-small color="textFaint">mdi-minus</v-icon>
          <v-icon v-else-if="item.change_24 > 0" x-small color="primary">mdi-arrow-top-right</v-icon>
          <v-icon v-else x-small color="pink">mdi-arrow-bottom-right</v-icon>
        </v-progress-circular>

        <v-spacer></v-spacer>

        <div v-if="item.tval_locked" class="">
          <div class="font-weight-bold d-flex align-center justify-end">
            <template v-if="item.fishy">
              ?
            </template>
            <span v-else :class="['font-weight-medium', {'primary--text': item.tval_locked > 100000}]">
              ${{ tvalLockedHuman }}
            </span>
            <v-progress-circular
            v-if="item.tval_locked"
            :value="item.tval_locked / 1000"
            :rotate="-90"
            size="18"
            width="1.5"
            class="ml-1"
            color="primary">
              <v-icon size="10" :color="item.tval_locked > 100000 ? 'primary' : ''">mdi-lock</v-icon>
            </v-progress-circular>
          </div>
        </div>
      </div>
      <!-- BADGES -->

      <div style="word-break: break-word;">

        <div class="d-flex align-center">
          <coin-icon :address="item.address" :url="item.icon_url" class="mr-2" :size="22"></coin-icon>
          <v-btn text @click.stop="openTokenPage" class="title pa-0 font-weight-bold" style="min-width: 10px;">
            <span class="text-truncate" :style="$vuetify.breakpoint.xs ? 'max-width: 10ch;' : 'max-width: 20ch;'">
              {{ item.symbol }}
            </span>
            <v-icon small color="textFaint">mdi-chevron-up</v-icon>
          </v-btn>

          <div v-if="mode === 1" class="body-1">
            <span :class="['font-weight-regular ml-3', item.change_24 >= 0 ? 'primary--text' : 'pink--text']">{{ change24hr }}%</span>
            <v-icon v-if="item.change_24 >= 0" x-small color="primary">mdi-arrow-top-right</v-icon>
            <v-icon v-else x-small color="pink">mdi-arrow-bottom-right</v-icon>
          </div>
          <v-spacer></v-spacer>
          <div :class="['font-weight-medium title']">
            ${{ priceHuman }}
          </div>
        </div>

        <div class="d-flex align-center">
          <div class="textFaint--text caption mr-2">
            #{{ index }}
          </div>
          <div class="caption font-weight-bold textFaint--text">
            {{ item.name }}
          </div>
          <v-spacer></v-spacer>
          <div class="caption textFaint--text">
            <span>vol:</span> <span class="font-weight-bold">${{ volume24hrHuman }}</span>
          </div>
        </div>

        <div v-if="mode === 0" class="d-flex align-center">
          <div class="caption textFaint--text">
            Pair index: {{ item.first_uniswap_index }}
          </div>
          <v-spacer></v-spacer>
          <div class="caption textFaint--text">
            <span class="textFaint--text">dmcap:</span> ${{ fullyDilutedMcap }}
          </div>
        </div>
      </div>

      <v-row v-if="mode === 0" dense class="caption">
        <v-col cols="3" class="d-flex align-center">
          <div v-if="item.tval_locked" class="d-flex">
            <v-progress-circular
            v-if="item.tval_locked"
            :value="item.tval_locked / 1000"
            :rotate="-90"
            size="18"
            width="1.5"
            class="mr-1"
            color="primary">
              <v-icon size="10" :color="item.tval_locked > 100000 ? 'primary' : ''">mdi-lock</v-icon>
            </v-progress-circular>
            <div class="font-weight-bold">
              <template v-if="item.fishy">
                ?
              </template>
              <span v-else :class="['font-weight-medium', {'primary--text': item.tval_locked / 2 > 100000}]">
                ${{ tvalLockedHuman }}
              </span>
            </div>
          </div>

          <div v-else class="d-flex pink--text font-weight-medium">
            <v-progress-circular
            :value="item.tval_locked / 1000"
            :rotate="-90"
            size="18"
            width="1.5"
            class="mr-1"
            color="primary">
              <v-icon size="10" color="pink">mdi-lock</v-icon>
            </v-progress-circular>
          </div>
        </v-col>
        <v-col cols="3">
          <div class="font-weight-regular textFaint--text">
            30d: 
            <span :class="['font-weight-bold', {'pink--text' : item.change_30d <= -0.5}, {'primary--text' : item.change_30d >= 0.5}]">{{ change30d }}%</span>
            <v-progress-linear rounded height="3" width="50" :value="Math.abs(item.change_30d)" :color="item.change_30d >= 0 ? 'primary' : 'pink'" background-color="outline"></v-progress-linear>
          </div>
        </v-col>
        <v-col cols="3" class="text-center">
          <div class="font-weight-regular textFaint--text">
            7d: 
            <span :class="['font-weight-bold', {'pink--text' : item.change_7d <= -0.5}, {'primary--text' : item.change_7d >= 0.5}]">{{ change7d }}%</span>
            <v-progress-linear rounded height="3" :value="Math.abs(item.change_7d)" :color="item.change_7d >= 0 ? 'primary' : 'pink'" background-color="outline"></v-progress-linear>
          </div>
        </v-col>
        <v-col cols="3" class="text-end">
          <div class="font-weight-regular textFaint--text">
            1d: <span :class="['font-weight-bold', {'pink--text' : item.change_24 <= -0.5}, {'primary--text' : item.change_24 >= 0.5}]">{{ change24hr }}%</span>
            <v-progress-linear rounded height="3" :value="Math.abs(item.change_24)" :color="item.change_24 >= 0 ? 'primary' : 'pink'" background-color="outline"></v-progress-linear>
          </div>
        </v-col>
      </v-row>

    </div>

  </div>
</template>

<script>
export default {
  props: {
    item: {},
    mode: {
      type: Number,
      default: 1 // 0 advanced
    },
    index: {
      type: Number,
      default: null
    }
  },

  computed: {
    change24hr () {
      var value = this.item.change_24
      var maxDigits = value > 20 ? 0 : 1
      return Number(value).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: maxDigits})
    },
    change7d () {
      var value = this.item.change_7d
      var maxDigits = value > 20 ? 0 : 1
      return Number(value).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: maxDigits})
    },
    change30d () {
      var value = this.item.change_30d
      var maxDigits = value > 20 ? 0 : 1
      return Number(value).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: maxDigits})
    },
    volume24hrHumannn () {
      var value = this.item.volume24hr
      return Number(value).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})
    },
    volume24hrHuman () {
      var amount = parseInt(this.item.volume24hr)
      // amount = '1230000000' // for testing
      if (amount >= 1000000000) {
        var bil = Number(amount / 1000000000).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 2})
        return bil + 'B'
      } else if (amount >= 1000000) {
        var mil = Number(amount / 1000000).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 2})
        return mil + 'M'
      } else if (amount > 1000) {
        return Math.floor(amount / 1000) + 'k'
      }
      return amount
      // return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 2})
    },
    priceHuman () {
      var value = Number(this.item.price_usd)
      var digits = 2
      if (value > 1000) {
        digits = 0
      } else if (value > 0.1) {
        digits = 2
      } else if (value > 0.001) {
        digits = 4
      } else if (value > 0.0001) {
        digits = 5
      } else if (value > 0.00001) {
        digits = 6
      } else {
        digits = 9
      }
      return Number(value).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: digits})
    },
    fullyDilutedMcappp () {
      var mcap = this.item.price_usd * (this.item.total_supply / Math.pow(10, this.item.decimals))
      return Number(mcap).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})
    },
    tvalLockedHuman () {
      var amount = parseInt(this.item.tval_locked) / 2
      // amount = '1230000' // for testing
      if (amount >= 1000000) {
        var deci = Number(amount / 1000000).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 2})
        return deci + 'M'
      } else if (amount > 1000) {
        return Math.floor(amount / 1000) + 'k'
      }
      return amount
    },
    fullyDilutedMcap () {
      var amount = this.item.price_usd * (this.item.total_supply / Math.pow(10, this.item.decimals))
      // amount = '1230000000' // for testing
      if (amount >= 1000000000) {
        var bil = Number(amount / 1000000000).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 2})
        return bil + 'B'
      } else if (amount >= 1000000) {
        var mil = Number(amount / 1000000).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 2})
        return mil + 'M'
      } else if (amount > 1000) {
        return Math.floor(amount / 1000) + 'k'
      }
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 2})
      // return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 2})
    },
  },

  methods: {
    openTokenPage () {
      this.$root.tokenPage.open(this.item.address)
    },
    goToTokenPage () {
      this.$root.ammLink(`/token/${this.item.address}`)
      // this.$router.push(`token/${this.item.address}`)
      this.$emit('on-close')
    }
  }
}
</script>