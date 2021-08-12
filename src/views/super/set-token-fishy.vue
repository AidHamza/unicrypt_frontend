<template>
  <v-card class="pa-4">
    <div class="caption">
      Is a uniswap token ranking high on the volume list?
    </div>
    <div class="mt-5 mb-5 d-flex align-center white pa-3 r-outlined ml-2 br-20 mr-2 background">
      <c-input :value.sync="pair_address" placeholder="token address" class="heading--text">
      </c-input>
    </div>

    <v-checkbox
    v-model="fishy"
    class="t-small"
    dense
    ></v-checkbox>

    {{ fishy }}

    <v-btn @click="setFishy">
      Set fishy
    </v-btn>

  </v-card>
</template>

<script>
export default {
  data: () => ({
    pair_address: '',
    fishy: false
  }),

  methods: {
    setFishy () {
      var fishy = this.fishy ? 1 : 0
      var data = {address: this.pair_address, fishy: fishy}
      this.$axios.post(`/uniswap/set-fishy`, data)
        .then(response => {
          console.log(response)
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
}
</script>