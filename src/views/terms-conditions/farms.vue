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
          Unicrypt Farms TERMS AND CONDITIONS
        </p>

        <p>
          LAST UPDATED: [06.04.21]
        </p>

        <p>
          These terms and conditions (“Farming Terms”) govern the use of the Farming Platform (defined below) and the Services (defined below) and are to be read in consonance with the main terms and conditions of the Unicrypt Platform available at [unicrypt.network]. The Farming Terms are applicable to Users as well as Farming Projects (defined below). These Farming Terms also include any guidelines, additional terms, policies, and disclaimers made available or issued by Unicrypt from time to time.
        </p>

        <p>
          1.  SERVICES
        </p>

        <p>
          (a)	The Unicrypt Farm (“Farming Platform”) allows projects to offer farming of their respective LP tokens on the Unicrypt Platform.
        </p>

        <p>
          (b)	Projects that wish to offer yield farming solutions of their respective projects (“Farming Projects”) are required to deposit the reward token into a vault contract, set the start block, endblock, and bonus period.
        </p>

        <p>
          (c)	Farming Projects are required to pay a fixed fee as will be determined by the price of the native token of the mainnet of the Farming Project, and a percentage of the reward tokens deposited in the Farming Platform. Payment of such fees is automated by the smart contract.
        </p>

        <p>
          (d)	Users are able to deposit the LP tokens of any of the active farms on the Farming Platform.  
        </p>

        <p>
          2.	YOUR RESPONSIBILITIES
        </p>

        <p>
          (a)	The Unicrypt Farming Solution can be utilised by any projects, the access to which is not actively regulated by us. We take no responsibility for the Farming Projects, their code or their performance. 
        </p>

        <p>
          (b)	YOU AGREE TO DO THE REQUISTE DUE DILIGENCE BEFORE FARMING ANY TOKEN ON OUR PLATFORM. WE WILL NOT BE RESPONSIBLE FOR ANY FUNDS LOST IN THE FARM.
        </p>

        <p>
          3.	FARMING PROJECTS RESPONSIBILITIES
        </p>

        <p>
          (a)	Farming Projects are required to first test their token on their respective test networks. If the token does not adhere to the respective token standards of the mainnet on which the token is being launched (ex. ERC20, BEP-20, etc) specifications, and/or there exists a non-standard transfer function in the token contract, a farm may fail to transfer rewards to farmers. FARMING PROJECTS ARE REQUIRED TO TEST HARVESTING ON THE REQUISITE TEST NETWORK BEFORE LAUNCHING A FARM ON MAINNET.
        </p>

        <p>
          4.	DISCLAIMERS AND WARRANTIES
        </p>
        
        <p>
          (i)	Unicrypt does not endorse any Farming Project unless explicitly stated. We will not be liable for any loss of funds due to lack of user research in a Farming Project. 
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