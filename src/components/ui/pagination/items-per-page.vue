<template>
  <v-menu offset-y
  :close-on-content-click="false">
    <template v-slot:activator="{ on }">
      <v-btn
      v-on="on"
      text 
      small 
      color="text"
      class="caption">
        {{ rowsPerPage }}
        items
        <v-icon small>mdi-menu-down</v-icon>
      </v-btn>
    </template>
    <v-card>

      <v-layout justify-center class="pa-2 border-b--thin">
        <span class="caption text--text">Items per page</span>
      </v-layout>

      <v-layout align-center class="pa-2">

        <v-btn
        icon
        color="text"
        @click="localRowsPerPage--">
          <v-icon>mdi-minus</v-icon>
        </v-btn>

        <v-text-field
        v-model="localRowsPerPage"
        hide-details
        :class="['font-weight-bold mt-0 pt-0']"
        style="max-width: 70px;"
        >
        </v-text-field>

        <v-btn
        icon
        color="text"
        @click="localRowsPerPage++">
          <v-icon>mdi-plus</v-icon>
        </v-btn>

      </v-layout>

      <v-list class="background">

        <div v-if="error" class="pl-4 pr-4 caption overline pink--text">
          {{ error }}
        </div>

        <v-list-item
        @click="localRowsPerPage = 5">
          <v-list-item-title
          :class="[{'primary--text' : localRowsPerPage === 5}]">
            5
          </v-list-item-title>
        </v-list-item>

        <v-list-item
        @click="localRowsPerPage = 10">
          <v-list-item-title
          :class="[{'primary--text' : localRowsPerPage === 10}]">
            10
          </v-list-item-title>
        </v-list-item>

        <v-list-item
        @click="localRowsPerPage = 20">
          <v-list-item-title
          :class="[{'primary--text' : localRowsPerPage === 20}]">
            20
          </v-list-item-title>
        </v-list-item>

      </v-list>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  props: ['rowsPerPage'],
  data () {
    return {
      localRowsPerPage: this.rowsPerPage
    }
  },
  computed: {
    error () {
      if (isNaN(this.localRowsPerPage)) {
        return 'Please enter a number'
      } else if (this.localRowsPerPage < 2) {
        return 'Less than 2 is not allowed'
      } else if (this.localRowsPerPage > 50) {
        return 'Above 50 is not allowed as it will lead to slow pages'
      }
      return false
    }
  },
  watch: {
    localRowsPerPage (nv) {
      if (!this.error) {
        this.$emit('update:rowsPerPage', nv)
      }
    }
  }
}
</script>