<template>
  <div>
    <div class="cursor-pointer">
      <slot name="header" :toggle="toggle" :expand="expand"></slot>
    </div>
    <v-expand-transition>
      <template v-if="vshow">
        <!-- The components in here are live and will trigger even when collapsed -->
        <div v-show="expand">
          <slot name="body" :expand="expand"></slot>
        </div>
      </template>
      <template v-else>
        <div v-if="expand">
          <!-- use padding and not margins else you get jerky animations -->
          <slot name="body" :expand="expand" :toggle="toggle"></slot>
        </div>
      </template>
    </v-expand-transition>
  </div>
</template>

<script>
export default {
  props: {
    expanded: {
      type: Boolean,
      default: false
    },
    vshow: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      expand: this.expanded
    }
  },
  methods: {
    toggle () {
      this.expand = !this.expand
    }
  }
}
</script>