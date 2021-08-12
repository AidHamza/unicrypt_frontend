<template>
  <v-container style="max-width: 800px;">
    
    <v-slide-y-transition appear>
    <div :class="['mb-16', {'foreground v-card br-20': $vuetify.breakpoint.xs}, {'v-card br-20 foreground': !$vuetify.breakpoint.xs}]">
      
      <div class="d-flex align-center pa-4 background">
        <v-btn icon to="/terms" color="text" class="mr-2">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <div class="title textFaint--text">
          Terms and Conditions
        </div>
      </div>

      <div class="pa-4">
        
        <p>
          UNC ILO TERMS AND CONDITIONS
        </p>

        <p>
          LAST UPDATED: [06.04.21]
        </p>

        <p>
          These terms and conditions (“ILO Terms”) govern the use of the ILO Platform (defined below) and the Services (defined below) and are to be read in consonance with the main terms and conditions of the Unicrypt Platform available at [app.unicrypt.network].The ILO Terms also include any guidelines, additional terms, policies, and disclaimers made available or issued by Unicrypt from time to time.
        </p>

        <p>
          1.	SERVICES
        </p>

        <p>
          (a)	The ILO Platform allows projects to offer a decentralized swap pool against Eth, BNB, XDAI or Matic on either Ethereum Mainnet or Binance Smart Chain respectively (“ILO Platform”). 
        </p>

        <p>
          (b)	There are projects which are offered in collaboration with Unicrypt which have conducted their KYC with an approved partner, as well as projects which are merely utilizing the ILO Platform. 
        </p>

        <p>
          (c)	Projects wishing to offer their ILO on the ILO Platform (“ILO Projects”) are required to pay a fixed fee as will be determined by the price of Eth/Bnb as the case may be, 1.8% of the currency collected by the pool, and 1.8% of all the tokens being auctioned off in the pool. Payment of such fees is automated by a smart contract. ILO Projects may also provide a list of whitelisted addresses which may participate in the ILO.
        </p>

        <p>
          (d)	Should the soft cap not be reached for the ILO, contributors are allowed to claim their participation through a withdrawing transaction. 
        </p>

        <p>
          (e)	Once the cap is reached, any participant of the ILO or the ILO Project may trigger the function to add liquidity and lock the same. 
        </p>

        <p class="mt-8">
          2.	YOUR RESPONSIBILITIES
        </p>

        <p>
          (a)	The Unicrypt ILO Platform can be utilised by any projects, the access to which is not actively regulated by us, unless strictly specified. We take no responsibility for the ILO Projects, their code or their performance. 
        </p>

        <p>
          (b)	YOU AGREE TO DO THE REQUISITE DUE DILIGENCE BEFORE TAKING PART IN AN ILO ON OUR PLATFORM. WE WILL NOT BE RESPONSIBLE FOR ANY FUNDS LOST. 
        </p>

        <p class="mt-8">
          3.	DISCLAIMERS AND WARRANTIES
        </p>
        
        <p>
          (i)	Unicrypt does not endorse any ILO Project unless explicitly stated. We will not be liable for any loss of funds due to lack of user research in any ILO. 
        </p>
      </div>
      
    </div>
    </v-slide-y-transition>
    
  </v-container>
</template>

<script>
export default {

  data: () => ({
  }),

  computed: {
  },

  methods: {
  },

  created () {
  }
}
</script>