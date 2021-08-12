<template>
  <v-dialog v-model="dialog" scrollable persistent max-width="450" content-class="br-20">
    <v-card class="foreground br-20">
      <div class="d-flex align-center title px-4 py-3 border-b background" style="font-size: 1rem;">
        <div style="width: 24px;">

        </div>
        <v-spacer></v-spacer>
        Switch Network
        <v-spacer></v-spacer>
        <v-btn icon color="text" @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>

      <v-card-text class="pa-0">

        <div class="d-flex align-center c-list pa-4 border-b" @click="selectChain('Mainnet')">
          <svg width="50px" style="stroke:#74ec67;" class="mr-3 draw-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 332.5 332.3" stroke-miterlimit="10"><path d="M166.2 217.7l83-49.1-83-137.6"/><path d="M166.2 31L83.3 168.6l82.9 49.1V131zm0 270.2l83-116.8-83 49"/><path d="M166.2 301.2v-67.8l-82.9-49zm83-132.6l-83-37.6m0 0l-82.9 37.6"/></svg>
          <div>
            <div class="title">
              Ethereum mainnet
            </div>
          </div>
        </div>

        <div class="d-flex align-center c-list pa-4 border-b" @click="selectChain('BSC_MAINNET')">
          <!--
          <img 
          :src="$settings.CHAINS['BSC_MAINNET'].icon" 
          height="40px"
          width="40px"
          class="mr-3">
          -->
          <svg width="50px" style="stroke:#F0B90B;" class="mr-3 draw-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 332.5 332.3"><path d="M114.3 144.8l52-52 52 52 30.3-30.3-82.3-82.3L84 114.5l30.3 30.3m-81.9 21.3l30.3-30.3L93 166.1l-30.3 30.3-30.3-30.3zm81.9 21.4l52 52 52-52 30.3 30.2h0L166.3 300 84 217.8h0l30.3-30.3m125.4-21.3l30.3-30.3 30.3 30.3-30.3 30.3-30.3-30.3z"/><path d="M197 166.1h0l-30.7-30.7-22.7 22.7h0l-2.6 2.6-5.4 5.4h0 0l30.7 30.7 30.7-30.7"/></svg>
          <div>
            <div class="title">
              Binance Smart Chain
            </div>
          </div>
        </div>

        <div class="d-flex align-center c-list pa-4 border-b" @click="selectChain('xDai')">
          <svg width="50px" style="stroke:#48A9A6;" class="mr-3 draw-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 332.5 332.3"><path d="M59.8 102.3H145V59.7H59.8zm127.7 0h85.2V59.7h-85.2zm85.2 85.1h-42.6V230h-42.6v42.6h85.2zM145 272.6V230h-42.6v-42.6H59.8v85.2z"/></svg>
          <div>
            <div class="title">
              xDai
            </div>
          </div>
        </div>

        <div class="d-flex align-center c-list pa-4 border-b" @click="selectChain('Matic')">
          <svg width="50px" style="stroke:#8247E5;" class="mr-3 draw-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 332.5 332.3" stroke-miterlimit="10"><path d="M289.7 152.7c-2.3-1.3-5.2-1.3-7.8 0l-18.1 10.7-12.3 6.8-17.8 10.7c-2.3 1.3-5.2 1.3-7.8 0l-13.9-8.4c-2.3-1.3-3.9-3.9-3.9-6.8v-16.2c0-2.6 1.3-5.2 3.9-6.8l13.9-8.1c2.3-1.3 5.2-1.3 7.8 0l13.9 8.4c2.3 1.3 3.9 3.9 3.9 6.8v10.7l12.3-7.1v-11c0-2.6-1.3-5.2-3.9-6.8L234 120.4c-2.3-1.3-5.2-1.3-7.8 0l-26.5 15.5c-2.6 1.3-3.9 3.9-3.9 6.5v30.4c0 2.6 1.3 5.2 3.9 6.8l26.2 15.2c2.3 1.3 5.2 1.3 7.8 0l17.8-10.3 12.3-7.1 17.8-10.3c2.3-1.3 5.2-1.3 7.8 0l13.9 8.1c2.3 1.3 3.9 3.9 3.9 6.8v16c0 2.6-1.3 5.2-3.9 6.8l-13.6 8.1c-2.3 1.3-5.2 1.3-7.8 0l-13.9-8.1c-2.3-1.3-3.9-3.9-3.9-6.8v-10.3l-12.3 7.1v10.7c0 2.6 1.3 5.2 3.9 6.8l26.2 15.2c2.3 1.3 5.2 1.3 7.8 0l26.2-15.2c2.3-1.3 3.9-3.9 3.9-6.8v-30.7c0-2.6-1.3-5.2-3.9-6.8l-26.2-15.3zM93.8 195.6l27-15.5V149"/><path d="M75.7 155.4h0m45.1-37.6v96.7l27 15.5m-.1-96.7v96.6l27-15.5v-96.6"/><path d="M147.7 102.3l-27 15.5 27 15.5 27-15.5-27-15.5zm-81 77.6l27 15.5.1-31m-81-46.6v96.6l27 15.5"/><path d="M39.8 102.3l-27 15.5 80.9 46.7 12.2-7.1 14.7-8.5-80.8-46.6zm0 62.2V230l27-15.5V180l-27-15.5z"/></svg>
          <div>
            <div class="title">
              Matic / Polygon
            </div>
          </div>
        </div>

        <div class="textFaint--text py-2 background text-center">
          Testnets
        </div>

        <div class="d-flex align-center c-list pa-4 border-b" @click="selectChain('Kovan')">
          <svg width="50px" style="stroke:#aaaaaa;" class="mr-3 draw-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 332.5 332.3" stroke-miterlimit="10"><path d="M166.2 217.7l83-49.1-83-137.6"/><path d="M166.2 31L83.3 168.6l82.9 49.1V131zm0 270.2l83-116.8-83 49"/><path d="M166.2 301.2v-67.8l-82.9-49zm83-132.6l-83-37.6m0 0l-82.9 37.6"/></svg>
          <div>
            <div class="title textFaint--text">
              Kovan
            </div>
          </div>
        </div>

        <!--
        <div class="d-flex align-center c-list pa-4" @click="selectChain('Hardhat')">
          <img 
          :src="$settings.CHAINS['Hardhat'].icon" 
          height="40px"
          width="40px"
          class="mr-3 br-20 greyscale">
          <div>
            <div class="title textFaint--text">
              Hardhat
            </div>
          </div>
        </div>
        -->

      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
  }),

  methods: {
    open () {
      this.dialog = true
    },
    close () {
      this.dialog = false
    },
    selectChain (requiredChain) {
      this.$store.commit('switchChain', requiredChain)
      this.close()
    }
  }
}
</script>

<style scoped lang="scss">
.draw-icon {
  fill:transparent;
  stroke-width:5px;

  path{
    stroke-dasharray: 1000;
    stroke-dashoffset: 1000;
    animation: dash 1.5s linear forwards;
    // animation: dash 5s cubic-bezier(.645,.045,.355,1);
  }
}

@keyframes dash {
  to {
    stroke-dashoffset: 0;
  }
}
</style>