<template>
  <div class="grad-green white--text pa-2 text-center">
    <div class="title">
      Starting {{ timeToStartBlock }}
    </div>
    <div class="d-flex">
      <div class="caption">
        {{ dateStartBlockHuman }}
      </div>
      <v-spacer></v-spacer>
      <div class="caption">
        {{ startBlock - blockNumber }} blocks to go
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  props: {
    startBlock: {
      type: String,
      default: '0'
    }
  },

  data: () => ({
    intervalID: null,
    duration: {}
  }),

  computed: {
    blockNumber () {
      return this.$store.state.blockNumber
    },
    dateStartBlock () {
      var numBlocks = this.startBlock - this.blockNumber
      var seconds = numBlocks * this.$store.state.blocksPerSecond
      var date = moment().add(seconds, 'seconds')
      return date
    },
    dateStartBlockHuman () {
      return this.dateStartBlock.format('ddd D MMM HH:mm')
    },
    timeToStartBlock () {
      return this.dateStartBlock.fromNow()
    },
  },

  methods: {
    updateTicker () {
      console.log('updating')
      this.duration = moment.duration(this.dateStartBlock)
      console.log(this.duration.seconds())
    }
  },

  created () {
    // this.intervalID = setInterval(this.updateTicker, 1000)
  }

}
</script>