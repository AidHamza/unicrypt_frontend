<template>
  <v-container style="max-width: 600px;">

    <v-card :class="['br-20', {'pa-4': $vuetify.breakpoint.xs}, {'pa-6': !$vuetify.breakpoint.xs}]">
      
      <div class="d-flex align-center mb-6">
        <v-btn icon to="/" color="text">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>

        <v-spacer></v-spacer>
        <div class="display-1">
          Page not found
        </div>
        <v-spacer></v-spacer>
        <div style="width: 32px;">

        </div>
      </div>

      <div>
        Looks like this page cannot be found!
      </div>

    </v-card>
    
  </v-container>
</template>

<script>

export default {
}
</script>