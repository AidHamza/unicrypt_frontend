<template>
  <div class="px-4 py-3 c-list d-flex align-center">
    <coin-icon :address="item.address" class="mr-4"></coin-icon>
    {{ item.name }}
    <v-spacer></v-spacer>
    {{ addressCondensed }}
    <div>
      
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => {

      }
    }
  },

  computed: {
    addressCondensed () {
      var address = this.item.address
      if (!address) {
        return ''
      }
      return address.slice(0, 6) + '...' + address.slice(address.length - 4)
    },
  }
}
</script>