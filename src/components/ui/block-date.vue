<template>
  <div class="d-flex align-center inputcolor pa-4 r-outlined">
    <div>
      <div>
        {{ dateHuman }}
      </div>
      <div class="">
        <span class="primary--text font-weight-medium">{{ dateFromNow }}</span> 
      </div>
      <div class="caption">
        <span class="textFaint--text">block {{ block }}</span>
      </div>
    </div>
    <v-spacer></v-spacer>
    <c-date @setDate="setDateFromPicker" ref="cdate"></c-date>

    <!-- SOMETHING -->
    <v-menu
      v-model="blockMenu"
      :close-on-content-click="false"
      offset-y
      >
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon outlined color="textFaint" class="ml-1" depressed v-bind="attrs" v-on="on">
          <slot name="header">
            <v-icon>mdi-cube-outline</v-icon>
          </slot>
        </v-btn>
      </template>

      <v-card class="pa-4" style="min-width: 300px;">
        <div>
          Block number
        </div>
        <div class="mt-2 d-flex align-center pa-3 r-outlined br-20 inputcolor">
          <c-input :value.sync="localBlock" placeholder="Token address...">
          </c-input>
        </div>
        <div class="caption text-center textFaint--text">
          Current block: {{ blockNumber }}
        </div>

        <div class="pa-2 mt-4">
          <v-btn @click="blockMenu = false" x-large rounded block color="primary">
            Accept
          </v-btn>
        </div>
      </v-card>
    </v-menu>

  </div>
</template>

<script>
import CDate from '@/components/ui/date-picker'
import moment from 'moment'

export default {
  components: {
    CDate
  },

  props: {
    block: {
      type: String
    }
  },

  data: () => ({
    date: null,
    blockMenu: false
  }),

  computed: {
    localBlock: {
      get () {
        return this.block
      },
      set (nv) {
        this.$emit('update:block', nv)
      }
    },
    blockNumber () {
      return this.$store.state.blockNumber
    },
    dateHuman () {
      return moment.unix(this.date).format('ddd D MMM YYYY HH:mm')
    },
    dateFromNow () {
      return moment.unix(this.date).fromNow()
    },
  },

  watch: {
    block (nv) {
      var numBlocks = nv - this.blockNumber
      var seconds = numBlocks * this.$store.state.blocksPerSecond
      var date = moment().add(seconds, 'seconds')
      this.$refs.cdate.setDateFromExternal(date)
      this.date = date.unix()
    }
  },

  methods: {
    setDateFromPicker (date) {
      this.date = date.unix()

      var duration = moment.duration(moment(date).diff(moment()))
      var secs = duration.asSeconds()
      this.localBlock = parseInt(this.blockNumber + (secs / this.$store.state.blocksPerSecond)).toString()
    },
  },

  created () {
  }
}
</script>