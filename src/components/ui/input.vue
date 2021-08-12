<template>
  <div class="c-input">
    
    <input 
    :type="type" 
    :placeholder="placeholder"
    v-model="innerValue"
    @focus="onFocus"
    @blur="onBlur"
    style="text-overflow: ellipsis;"
    :class="contentClass"
    spellcheck="false">

  </div>
</template>

<script>
export default {
  props: {
    value: null,
    label: null,
    placeholder: null,
    focussed: {
      default: false
    },
    type: {
      type: String,
      default: 'text'
    },
    contentClass: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      localFocussed: false
    }
  },
  computed: {
    innerValue: {
      get () {
        return this.value
      },
      set (nv) {
        this.$emit('update:value', nv)
        if (this.localFocussed) {
          this.$emit('updateWhileFocussed', nv)
        }
      }
    }
  },
  watch: {
    localFocussed (nv) {
      this.$emit('update:focussed', nv)
    }
  },
  methods: {
    onFocus (event) {
      event.target.select()
      this.localFocussed = true
    },
    onBlur (event) {
      this.$emit('blur', event)
      this.localFocussed = false
    }
  }
}
</script>
