<template>
    <div>
        <div v-if="false">
          {{ netIdentifier }}
        </div>
        <Disqus ref="disqus" :pageConfig="pageConfig" shortname='unicrypt-network' /> 
    </div>
</template>

<script>
import { Disqus } from 'vue-disqus'

export default {
  props: {
    identifier: {
      type: String,
      default: ''
    }
  },

  components: {
    Disqus
  },

  computed: {
    pageConfig () {
      return {
        identifier: this.netIdentifier
      }
    },
    theme () {
      return this.$store.state.theme
    },
    netIdentifier () {
      return `${this.$store.state.requiredNetwork}_${this.identifier}`
    }
  },

  watch: {
    theme (nv) {
      this.reset()
    }
  },

  methods: {
    reset () {
      this.$refs.disqus.reset()
    }
  },
}
</script>