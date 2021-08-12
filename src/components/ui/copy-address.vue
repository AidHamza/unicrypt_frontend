<template>
  <div style="display: inline-block;position: relative;">
    <div class="d-flex align-center">
      <v-menu
      offset-y
      content-class="br-20"
      transition="fade-transition"
      >
        <template v-slot:activator="{ attrs, on }">
          <v-btn
            small
            text
            rounded :color="color" class="pa-0 pl-1 pr-1"
            v-bind="attrs"
            v-on="on"
          >
            {{ tokenAddressCondensed }}
            <v-icon x-small class="ml-2">mdi-content-copy</v-icon>
          </v-btn>
        </template>

        <v-list style="min-width: 200px;" class="background br-20 ma-0 pa-0">
          <v-list-item dense @click="copyTokenAddress">
            <v-list-item-title>
              Copy Address
            </v-list-item-title>
          </v-list-item>
          <v-list-item dense @click="copyTokenAddressLowercase">
            <v-list-item-title>
              Copy Address (in lowercase)
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-scroll-x-transition>
        <v-card v-if="textCopied" class="px-2 primary br-20" style="position: absolute;left: 0;top: 0px;z-index: 1;">
          <div class="white--text caption font-weight-bold">
            <v-icon small color="white">mdi-check-circle-outline</v-icon>
            Copied
          </div>
        </v-card>
      </v-scroll-x-transition>
      <div ref="copyContainer" class="t-small">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    address: {
      type: String,
      deafult: ''
    },
    color: {
      type: String,
      default: ''
    }
  },

  data: () => ({
    textCopied: false,
  }),

  computed: {
    tokenAddressCondensed () {
      var address = this.address
      if (!address) {
        return ''
      }
      return address.slice(0, 6) + '...' + address.slice(address.length - 4)
    }
  },
  
  methods: {
    copyTokenAddress: function () {
      var container = this.$refs.copyContainer
      this.$copyText(this.address, container).then(() => {
        this.textCopied = true
        setTimeout(() => {
          this.textCopied = false
        }, 1000)
      }, function (e) {
        alert('Can not copy')
      })
    },
    copyTokenAddressLowercase: function () {
      var container = this.$refs.copyContainer
      this.$copyText(this.address.toLowerCase(), container).then(() => {
        this.textCopied = true
        setTimeout(() => {
          this.textCopied = false
        }, 1000)
      }, function (e) {
        alert('Can not copy')
      })
    },
  }
}
</script>