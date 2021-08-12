<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    offset-y
    >
    <template v-slot:activator="{ on, attrs }">
      <v-btn depressed v-bind="attrs" v-on="on">
        <slot name="header">
          <v-icon :color="color">mdi-calendar</v-icon>
          <v-icon small :color="color">mdi-chevron-down</v-icon>
        </slot>
      </v-btn>
    </template>

    <v-card class="pa-0">
      <v-tabs
      v-model="tab"
      background-color="transparent"
      color="basil"
      grow
      >
        <v-tab>
          Date
        </v-tab>
        <v-tab>
          Time
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item>
          <v-date-picker
          v-model="date"
          class=""
          ></v-date-picker>
        </v-tab-item>

        <v-tab-item>
          <v-time-picker v-model="time" format="24hr"></v-time-picker>
        </v-tab-item>
      </v-tabs-items>

      <div class="text-center pt-2">
        {{ formattedDate }}
      </div>

      <div class="pa-2">
        <v-btn @click="setDate" x-large rounded block color="primary" :disabled="!dateValid">
          Accept
        </v-btn>
      </div>
    </v-card>
  </v-menu>
</template>

<script>
import moment from 'moment'

export default {
  props: {
    color: {
      type: String,
      default: 'primary'
    }
  },
  data: () => ({
    menu: false,
    resolve: null,
    reject: null,
    date: null,
    time: "12:00",
    tab: 0
  }),

  computed: {
    combinedDate () {
      return `${this.date} ${this.time}`
    },
    momentDate () {
      return moment(this.combinedDate, 'YYYY-MM-DD HH:mm')
    },
    dateValid () {
      return this.momentDate.isValid()
    },
    formattedDate () {
      return this.momentDate.format('ddd, MMM D, HH:mm')
    }

  },

  watch: {
    
  },

  methods: {
    open () {
      this.menu = true
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    acceptStake () {
      this.resolve()
      this.menu = false
    },
    cancel () {
      this.reject()
      this.menu = false
    },
    setDate () {
      this.$emit('setDate', this.momentDate)
      this.menu = false
    },
    setDateFromExternal (date) {
      this.date = date.format('YYYY-MM-DD')
      this.time = date.format('HH:mm')
    }
  }
}
</script>