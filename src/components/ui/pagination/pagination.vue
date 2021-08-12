<template>
  <div>
    <v-row v-if="!compact" class="align-center justify-center pa-2">

      <v-btn
      v-if="pagination.pages > 1"
      text
      :disabled="page <= 0"
      @click="$emit('goToFirstPage')"
      class="mr-2"
      color="text"
      >
        1
      </v-btn>

      <v-btn
      text
      :disabled="page <= 0"
      @click="$emit('goToPreviousPage')"
      class="mr-2"
      color="text"
      >
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>

      <v-text-field
      class="mt-2"
      v-model="localPage"
      dense
      filled
      style="max-width: 3em;"
      hide-details
      ></v-text-field>
      <!-- <c-input :value.sync="localPage" style="max-width: 3em;">
      </c-input> -->

      <v-btn
      :disabled="page >= pagination.pages - 1"
      text
      @click="$emit('goToNextPage')"
      class="ml-2 mr-2"
      color="text"
      >
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>

      <v-btn
      v-if="pagination.pages > 1"
      text
      :disabled="!(page < (pagination.pages - 1))"
      @click="$emit('goToLastPage')"
      class="mr-2"
      color="text"
      >
        {{ pagination.pages || 1 }}
      </v-btn>

      <v-spacer></v-spacer>

      <template>
        <items-per-page :rowsPerPage.sync="filters.rowsPerPage" class="mr-2"></items-per-page>
      </template>

    </v-row>

    <!-- COMPACT -->
    <template v-else>
      <v-btn v-if="pagination.pages > 1" 
        @click="showMore" 
        text
        block
        color="secondary" 
        class="font-weight-regular"
        style="text-transform: none;">
        Show more...
      </v-btn>
    </template>
  </div>
</template>

<script>
import ItemsPerPage from './items-per-page'

export default {
  props: {
    page: null,
    pagination: {},
    filters: {},
    // Settings
    compact: {
      type: Boolean,
      default: false
    }
  },
  components: {
    ItemsPerPage
  },
  computed: {
    localPage: {
      get () {
        return this.page + 1
      },
      set (nv) {
        this.$emit('updatePageNumber', nv - 1)
      }
    }
  },
  methods: {
    showMore () {
      this.filters.rowsPerPage += 20
    }
  }
}
</script>