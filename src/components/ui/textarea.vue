<template>
  <div class="c-textarea">
    
    <textarea 
    :type="type" 
    :placeholder="placeholder"
    v-model="innerValue"
    @focus="onFocus"
    @blur="onBlur"
    :class="contentClass"
    spellcheck="false"
    :rows="rows">
    </textarea>

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
    rows: {
      type: String,
      default: "3"
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
