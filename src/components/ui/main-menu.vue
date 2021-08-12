<template>
  <v-dialog v-model="dialog" scrollable persistent max-width="450" content-class="br-20">
    <v-card class="foreground br-20">
      <div class="d-flex align-center title px-4 py-2 border-b" style="font-size: 1rem;">
        <div style="width: 24px;">

        </div>
        <v-spacer></v-spacer>
        Menu
        <v-spacer></v-spacer>
        <v-btn icon color="text" @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>

      <v-card-text class="pa-4">

        <div class="py-2 text-end">
          <v-btn text @click="changeTheme" color="textFaint">
            Change theme
            <v-icon small class="ml-3">mdi-white-balance-sunny</v-icon>
          </v-btn>
        </div>

        <a href="https://docs.unicrypt.network" class="deadlink" target="_blank">
          <v-card class="pa-4 d-flex align-center c-list mb-1">
            <v-icon>mdi-file-document-outline</v-icon>
            <div class="ml-4">
              Documentation
            </div>
          </v-card>
        </a>

        <v-card to="/terms" @click="close" class="pa-4 d-flex align-center c-list mb-1">
          <v-icon>mdi-file-document-outline</v-icon>
          <div class="ml-4">
            <div>
              Terms and conditions
            </div>
          </div>
        </v-card>

        <v-card to="/terms/privacy-policy" @click="close" class="pa-4 d-flex align-center c-list mb-1">
          <v-icon>mdi-file-document-outline</v-icon>
          <div class="ml-4">
            <div>
              Privacy Policy
            </div>
          </div>
        </v-card>

        <v-card href="https://www.unicrypt.network" class="pa-4 d-flex align-center c-list mb-1">
          <v-icon>mdi-file-document-outline</v-icon>
          <div class="ml-4">
            <div>
              Unicrypt.network website
            </div>
          </div>
        </v-card>

        <!--
        <a href="https://farm.unicrypt.network/" class="deadlink">
          <v-card class="pa-4 d-flex align-center c-list mb-1">
            <v-icon>mdi-sprout-outline</v-icon>
            <div class="ml-4">
              <div>
                Yield Farming
              </div>
              <div class="caption textFaint--text">
                Mainnet
              </div>
            </div>
          </v-card>
        </a>
        -->

        <!--
        <a href="https://uncbot.com/" class="deadlink">
          <v-card class="pa-4 d-flex align-center c-list mb-1">
            <img 
            src="@/assets/img/UNCBOT.svg" 
            height="24px"
            width="24px">
            <div class="ml-4">
              <div>
                UNCBOT
              </div>
              <div class="caption textFaint--text">
                Request price action channels and advertisment
              </div>
            </div>
          </v-card>
        </a>
        -->

        <div v-if="!expandMenu" class="text-center">
          <v-btn text @click="expandMenu = true" color="textFaint">
            More
            <v-icon>mdi-chevron-down</v-icon>
          </v-btn>
        </div>

        <v-expand-transition>
          <div v-show="expandMenu" class="pa-0">

            <a href="https://kovan-farm.unicrypt.network/" class="deadlink">
              <v-card class="pa-4 d-flex align-center c-list mb-1">
                <v-icon>mdi-sprout-outline</v-icon>
                <div class="ml-4">
                  <div>
                    Yield Farming
                  </div>
                  <div class="caption textFaint--text">
                    Kovan Testnet
                  </div>
                </div>
              </v-card>
            </a>

            <a href="https://uncldrop.unicrypt.network/" class="deadlink">
              <v-card class="pa-4 d-flex align-center c-list mb-1">
                <v-icon>mdi-airplane</v-icon>
                <div class="ml-4">
                  <div>
                    UNCL Airdrop
                  </div>
                  <div class="caption textFaint--text">
                    Finished
                  </div>
                </div>
              </v-card>
            </a>

            <!--
            <v-card @click="goToSwap" class="pa-4 d-flex align-center c-list mb-1">
              <v-icon>mdi-autorenew</v-icon>
              <div class="ml-4">
                <div>
                  Swap
                </div>
                <div class="caption textFaint--text">
                  UNC
                  <v-icon x-small color="textFaint" class="ml-1 mr-1">mdi-arrow-right</v-icon>
                  UNCX
                </div>
              </div>
            </v-card>
            -->

            <div class="text-center">
              <v-btn text @click="expandMenu = false" color="textFaint">
                Less
                <v-icon>mdi-chevron-up</v-icon>
              </v-btn>
            </div>

          </div>
        </v-expand-transition>

        <div class="mt-4 mb-2 d-flex align-center justify-center">
          <v-btn icon color="textFaint" x-large href="https://twitter.com/UNCX_token" target="_blank">
            <v-icon>mdi-twitter</v-icon>
          </v-btn>
          <v-btn color="textFaint" x-large icon rounded href="https://t.me/uncx_token" target="_blank">
            <v-icon>mdi-telegram</v-icon>
          </v-btn>
        </div>

      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
    expandMenu: false
  }),

  methods: {
    changeTheme () {
      var themeName = "theme1"
      if (this.$store.state.theme === "theme1") {
        themeName = "theme2"
      }
      this.$store.commit('setTheme',{
        themeName: themeName,
        vuetify: this.$vuetify
      })
    },
    open () {
      this.dialog = true
    },
    close () {
      this.dialog = false
      this.expandMenu = false
    },
    goToSwap () {
      this.close()
      this.$router.push(`/swap`)
    }
  }
}
</script>

<style lang="scss">
.deadlink {
   text-decoration: none;
   color: unset!important;
}
</style>