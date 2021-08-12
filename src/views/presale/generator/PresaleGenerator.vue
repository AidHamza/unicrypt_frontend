<template>
  <v-container :style="`max-width: ${$vuetify.breakpoint.xs ? '600px': '1100px'};`" :class="[{'pa-0 foreground mobile-page pb-16': $vuetify.breakpoint.xs}]">
    <v-row dense class="ma-0">

      <v-col cols="12" md="6">
        <v-card :class="['br-20', {'pa-4': $vuetify.breakpoint.xs}, {'pa-8': !$vuetify.breakpoint.xs}]">

          <div class="d-flex align-center">
            <v-btn icon :to="`${$store.state.ammPrefix}/ilos`" color="textFaint">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>

            <v-spacer></v-spacer>

            <v-btn href="https://docs.unicrypt.network/ilo-platform/audit-dev-documentation/creating-your-ilo" target="_blank"
            rounded outlined color="primary">
              ILO Help
            </v-btn>
          </div>

          <div class="display-1 text-center font-weight-medium mb-1 mt-4">
            LAUNCHPAD
          </div>
          <div class="text-center textFaint--text">
            Run a decentralised Initial Liquidity Offering (ILO) to raise funds and liquidity for your project with our trusted decentalised launchpad.
          </div>

          <div class="mt-3 mb-3 d-flex v-card align-center font-weight-medium pa-6 br-20" style="position: relative; overflow: hidden;">
            <div>
              <div class="text-center">
                <img 
                src="@/assets/img/icons/rocket.svg" 
                height="60px"
                width="60px"
                class="primary-pulse br-c">
              </div>
              <div class="d-flex align-center justify-center title font-weight-bold mb-2">
                <div class="text-uppercase">
                  Unicrypt Incubator
                </div>
              </div>
              <div class="text-center textFaint--text">
                Is your project stellar!? Apply to be incubated by Unicrypt by sending us a mail at:
                <div class="text--text mb-2">support@unicrypt.network</div>
                <div class="caption">
                  If you would like to be incubated do not create a presale yet, we'll help with marketing, KYC, Audits, Hardcaps and presale parameters.
                </div>
              </div>
            </div>
          </div>

          <div class="font-weight-bold mb-2">
            Presale best practices
          </div>
          <ul class="textFaint--text">
            <li>
              Raise around $300k. <strong>The best presales raise less</strong>. Dont be greedy. Raise less so there is room for your market cap to grow.
              In this instance you have a growing community of happy investors who will use social media effectively to talk about your project positively, as opposed to a community of annoyed investors who are in the red.
              Which would you prefer?
            </li>
            <li>
              <router-link :to="`/services/lock-tokens`">Use token vesting</router-link> to lock as many of your team tokens as you can to increase trust in your project and your tokenomics score in the presale.
            </li>
            <li>
              <router-link :to="`/services/lock-tokens`">Use token vesting</router-link> to send tokens to marketers if you need to give tokens to anyone before a presale concludes. This ensures no one can 
              create a pair on an exchange with liquidity before a presale concludes and set the initial price (this will cause the presale to fail).
            </li>
            <li>
              Build trust by applying for 
              <a href="https://docs.unicrypt.network/auditors-and-kyc/auditors-and-kyc" target="_blank" class="deadlink primary--text">
                Audits and KYC
              </a>.
              Alternatively use our <router-link :to="`/services/minter`">ENMT safe-token minter</router-link> to mint a pre-audited token.
            </li>
          </ul>
        </v-card>
      </v-col>
      
      <v-col cols="12" md="6">

        <v-card :class="['br-20']">

          <div class="title mb-3 pa-4 border-b">
            Create your presale
          </div>

          <div :class="[{'pa-4': $vuetify.breakpoint.xs}, {'pa-8': !$vuetify.breakpoint.xs}]">

            <v-card v-if="!sEthers.coinbase" @click="connectWallet" class="pa-4 primary white--text align-center d-flex c-list br-20">
              <v-icon size="60" color="white">mdi-ethereum</v-icon>
              <div>
                <div class="title">
                  Connect your wallet to continue
                </div>
              </div>
            </v-card>

            <!-- WALLET CONNECTED -->
            <template v-else>

              <template v-if="true">

                <div class="mt-2 d-flex align-center pa-3 r-outlined br-20 inputcolor">
                  <c-input :value.sync="presaleTokenAddress" placeholder="Enter your token address...">
                  </c-input>

                  <v-progress-circular
                  v-if="loadingPresaleToken || checkingIfPairExists"
                  indeterminate
                  width="2"
                  class="mr-2"
                  size="24"
                  color="primary"
                  ></v-progress-circular>
                </div>
              </template>

              <v-slide-y-transition>
                <v-card v-if="presaleTokenHydrated.address && !uniswapPairExists && !checkingIfPairExists" outlined class="background pa-4 br-20 mt-4">
                  <div class="d-flex align-center textFaint--text">
                    <coin-icon :address="presaleTokenHydrated.address" class="mr-2"></coin-icon>
                    {{ presaleTokenHydrated.symbol }} / {{ presaleTokenHydrated.name }}
                    <v-spacer></v-spacer>
                    {{ presaleTokenAddressCondensed }}

                    <v-btn icon color="text" @click="presaleTokenHydrated = {}">
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </div>
                </v-card>
              </v-slide-y-transition>

              <v-slide-y-transition>
                <div v-if="presaleTokenHydrated.address && uniswapPairExists" class="v-card blue-button white--text pa-4 br-20 mt-4">
                  <div class="d-flex align-center">
                    <coin-icon :address="presaleTokenHydrated.address" class="mr-2"></coin-icon>
                    {{ presaleTokenHydrated.symbol }} / {{ presaleTokenHydrated.name }}
                    <v-spacer></v-spacer>
                    {{ presaleTokenAddressCondensed }}

                    <v-btn icon color="white" @click="presaleTokenHydrated = {}">
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </div>
                  <div class="text-center mt-4">
                    The {{ baseTokenHydrated.symbol }} / {{ presaleTokenHydrated.symbol }} pair already has liqudity on {{ $store.state.exchange }}.
                  </div>
                  <div class="text-center mt-1 caption">
                    You cannot create a presale for this pair as the price is already set.
                  </div>
                  <div class="text-center mt-4">
                    
                  </div>
                </div>
              </v-slide-y-transition>

              <div class="mt-10 mb-2 title d-flex align-center">
                <div>
                  Buyers participate with
                </div>
                <v-spacer></v-spacer>
                <v-btn @click="openSelectBaseTokenDialog" text class="title">
                  <coin-icon :address="baseTokenHydrated.address" class="mr-2" :size="26"></coin-icon>
                  {{ baseTokenHydrated.symbol }}
                  <v-icon>mdi-chevron-down</v-icon>
                </v-btn>
              </div>

              <div class="text-center mt-8">
                <div>
                  {{ $store.state.exchange }} pair to be created
                </div>
                <div class="primary--text font-weight-bold">
                  {{ baseTokenHydrated.symbol }} / {{ presaleTokenHydrated.symbol || '?' }}
                </div>
              </div>
              
              <template v-if="presaleTokenHydrated.address && !uniswapPairExists && !checkingIfPairExists">

                <div class="mt-10 mb-2 text-center">
                  Presale creator
                </div>

                <div class="mb-2 font-weight-bold primary--text text-center">
                  {{ sEthers.coinbase_condensed }}
                </div>

                <div class="mb-2 caption text-center textFaint--text">
                  This account will be the only account capable of adding presale information, editing presale contract paramaters and
                  unlocking liquidity.
                </div>

                <div class="my-3 d-flex align-center textFaint--text caption font-weight-medium exo-block pa-6 br-20" style="position: relative; overflow: hidden;">
                  <div>
                    <div class="">
                      We reccomend a minimum liquidity percentage of 60%, and a minimum lock of 1 year.
                    </div>
                  </div>
                </div>

                <div class="mt-10 mb-2 title font-weight-bold text-center">
                  How many {{ presaleTokenHydrated.symbol }} are up for presale?
                </div>

                <div class="pa-4 align-center flex-nowrap inputcolor r-outlined">

                  <div class="caption text-end pt-2">
                    Balance: {{ presaleTokenBalanceHuman }}
                  </div>

                  <div class="d-flex align-center">
                    <c-input :value.sync="amountHuman" placeholder="0.0" @updateWhileFocussed="onPresaleTokenAmountChange" class="pa-2 font-weight-bold">

                    </c-input>

                    <div class="font-weight-bold text-uppercase">
                      {{ presaleTokenHydrated.symbol }}
                    </div>

                    <v-btn v-if="false" small depressed color="primary" @click="setMax" class="ml-2">
                      MAX
                    </v-btn>
                  </div>

                  <div v-if="false">
                    <v-btn small outlined rounded color="" @click="setPercent(25)" class="mr-1">
                      25%
                    </v-btn>
                    <v-btn small outlined rounded color="" @click="setPercent(50)" class="mr-1">
                      50%
                    </v-btn>
                    <v-btn small outlined rounded color="" @click="setPercent(75)" class="mr-1">
                      75%
                    </v-btn>
                    <v-btn v-if="false" small outlined rounded color="" @click="setMax" class="mr-1">
                      100%
                    </v-btn>
                  </div>

                </div>

                <div v-if="eMinDivis" class="pink--text">
                  A minimum divisibility of 10,000 units (including decimals) is required for a presale.
                </div>

                <v-row>
                  <v-col cols="6">
                    <div class="mt-10 mb-2 title font-weight-bold text-center">
                      Softcap
                    </div>

                    <div class="d-flex align-center inputcolor pa-4 r-outlined">
                      <c-input :value.sync="softcapHuman" placeholder="0.0" @updateWhileFocussed="onSoftcapAmountChange" class="pa-2 font-weight-bold">
                      </c-input>

                      <div class="font-weight-bold">
                        {{ baseTokenHydrated.symbol }}
                      </div>
                    </div>
                  </v-col>
                  <v-col cols="6">
                    <div class="mt-10 mb-2 title font-weight-bold text-center">
                      Hardcap
                    </div>

                    <div class="d-flex align-center inputcolor pa-4 r-outlined">
                      <c-input :value.sync="hardcapHuman" placeholder="0.0" @updateWhileFocussed="onHardcapAmountChange" class="pa-2 font-weight-bold">
                      </c-input>

                      <div class="font-weight-bold">
                        {{ baseTokenHydrated.symbol }}
                      </div>
                    </div>
                    <div v-if="eHardcapLessThanSoftcap" class="pink--text">
                      Must be >= than softcap
                    </div>
                    <div v-if="eHardcapIsZero" class="pink--text">
                      Must be > 0
                    </div>
                  </v-col>
                </v-row>

                <div class="mt-10 text-center">
                  Presale rate
                </div>
                <div class="mb-2 title primary--text font-weight-bold text-center">
                  1 {{ baseTokenHydrated.symbol }} = {{ tokensPerEthHuman }} {{ presaleTokenHydrated.symbol }}
                </div>

                <div class="mt-10 text-center">
                  Uniswap listing rate
                </div>
                <div class="mb-2 title primary--text font-weight-bold text-center">
                  1 {{ baseTokenHydrated.symbol }} = {{ listingRateHuman }} {{ presaleTokenHydrated.symbol }}
                </div>
                <div class="text-center">
                  <v-btn small outlined rounded :color="listingRatePercent === 0 ? 'primary' : ''" @click="setListingRatePercent(0)" class="mr-1">
                    0%
                  </v-btn>
                  <v-btn small outlined rounded :color="listingRatePercent === 100 ? 'primary' : ''" @click="setListingRatePercent(100)" class="mr-1">
                    10%
                  </v-btn>
                  <v-btn small outlined rounded :color="listingRatePercent === 250 ? 'primary' : ''" @click="setListingRatePercent(250)" class="mr-1">
                    25%
                  </v-btn>
                  <v-btn small outlined rounded :color="listingRatePercent === 300 ? 'primary' : ''" @click="setListingRatePercent(300)" class="mr-1">
                    30%
                  </v-btn>
                  <v-btn small outlined rounded :color="listingRatePercent === 500 ? 'primary' : ''" @click="setListingRatePercent(500)" class="mr-1">
                    50%
                  </v-btn>
                </div>

                <div class="title text-center mt-8">
                  Percent of raised {{ baseTokenHydrated.symbol }} used for liquidity
                </div>
                <div class="display-1 text-center mt-8">
                  {{ liquidityPercent }}%
                </div>
                <div v-if="false" class="text-center textFaint--text">
                  Minus fee ({{ actualLiquidityPercent }} %)
                </div>
                <div class="d-flex align-center">
                  <v-btn x-large icon>
                    <v-icon
                      x-large
                      color="primary"
                      @click="liquidityPercent-=5"
                    >
                      mdi-minus
                    </v-icon>
                  </v-btn>
                  <v-slider
                    dense
                    hide-details
                    v-model="liquidityPercent"
                    color="primary"
                    track-color="grey"
                    always-dirty
                    min="30"
                    max="100"
                  >
                  </v-slider>
                  <v-btn x-large icon>
                    <v-icon
                      x-large
                      color="primary"
                      @click="liquidityPercent+=5"
                    >
                      mdi-plus
                    </v-icon>
                  </v-btn>
                </div>
                <div v-if="liquidityPercent === 100" class="text-center font-weight-bold pa-2 pink--text">
                  Please be aware you will not raise ANY {{ baseTokenHydrated.symbol }} dev funds with these settings
                </div>
                <div v-else-if="liquidityPercent > 90" class="pink--text text-center pa-2">
                  Please be aware you will not raise much {{ baseTokenHydrated.symbol }} dev funds with these settings
                </div>

                <v-card outlined class="background pa-4 br-20">
                  <div class="mb-2 textFaint--text text-center">
                    Additional tokens required for liquidity if hardcap is met
                  </div>

                  <div class="d-flex align-center">
                    <coin-icon :address="presaleTokenHydrated.address" class="mr-2"></coin-icon>
                    <div class="font-weight-bold">
                      {{ amountLiquidityHardcapHuman }}
                    </div>

                    <div class="font-weight-medium textFaint--text text-uppercase ml-2">
                      {{ presaleTokenHydrated.symbol }}
                    </div>
                  </div>
                </v-card>

                <v-card outlined class="mt-8 br-20 pa-4 background">
                  <!-- @click="showPredictionPanel = !showPredictionPanel" -->
                  <div class="title text-center mt-8">
                    Presale prediction
                  </div>

                  <div class="text-center textFaint--text">
                    Use the slider to predict fee and liquidity amounts depending on amounts raised in presale.
                  </div>

                  <v-slide-y-transition>
                    <div v-if="showPredictionPanel">

                      <div class="display-1 text-center mt-8">
                        {{ predictiveBaseRaisedHuman }} {{ baseTokenHydrated.symbol }}
                      </div>
                      <div class="d-flex align-center">
                        <v-btn x-large icon>
                          <v-icon
                            x-large
                            color="primary"
                            @click="presalePredictionPercent-=5"
                          >
                            mdi-minus
                          </v-icon>
                        </v-btn>
                        <v-slider
                          dense
                          hide-details
                          v-model="presalePredictionPercent"
                          color="primary"
                          track-color="grey"
                          always-dirty
                          min="0"
                          max="100"
                        >
                        </v-slider>
                        <v-btn x-large icon>
                          <v-icon
                            x-large
                            color="primary"
                            @click="presalePredictionPercent+=5"
                          >
                            mdi-plus
                          </v-icon>
                        </v-btn>
                      </div>
                      <div v-if="false" class="caption primary--text text-center">
                        {{ presalePredictionPercent }}%
                      </div>

                      <v-row dense>
                        <v-col cols="4">
                          <div class="mt-10 mb-2 textFaint--text pl-2">
                            Unicrypt fee
                          </div>

                          <div class="d-flex align-center pa-4 r-outlined">
                            {{ predictiveUnicryptBaseFeeHuman }} {{ baseTokenHydrated.symbol }}
                          </div>
                        </v-col>
                        <v-col cols="4">
                          <div class="mt-10 mb-2 textFaint--text pl-2">
                            {{ baseTokenHydrated.symbol }} liquidity
                          </div>

                          <div class="d-flex align-center pa-4 r-outlined">
                            {{ predictiveBaseLiquidityHuman }} {{ baseTokenHydrated.symbol }}
                          </div>
                        </v-col>
                        <v-col cols="4">
                          <div class="mt-10 mb-2 textFaint--text pl-2">
                            Your {{ baseTokenHydrated.symbol }}
                          </div>

                          <div class="d-flex align-center primary--text pa-4 r-outlined">
                            {{ predictiveOwnerBaseHuman }} {{ baseTokenHydrated.symbol }}
                          </div>
                        </v-col>
                      </v-row>

                      <v-row dense>
                        <v-col cols="4">
                          <div class="mb-2 textFaint--text pl-2">
                            Unicrypt fee
                          </div>

                          <div class="d-flex align-center pa-4 r-outlined">
                            {{ predictiveUnicryptTokenFeeHuman }} {{ presaleTokenHydrated.symbol }}
                          </div>
                        </v-col>
                        <v-col cols="4">
                          <div class="mb-2 textFaint--text pl-2">
                            {{ presaleTokenHydrated.symbol }} liquidity
                          </div>

                          <div class="d-flex align-center pa-4 r-outlined">
                            {{ predictiveTokenLiquidityHuman }} {{ presaleTokenHydrated.symbol }}
                          </div>
                        </v-col>
                        <v-col cols="4">
                          <div class="mb-2 textFaint--text pl-2">
                            {{ presaleTokenHydrated.symbol }} sold
                          </div>

                          <div class="d-flex align-center pa-4 r-outlined">
                            {{ predictiveTokensSoldHuman }} {{ presaleTokenHydrated.symbol }}
                          </div>
                        </v-col>
                      </v-row>
                    </div>
                  </v-slide-y-transition>
                </v-card>

                <v-row>
                  <v-col cols="6">
                    <div class="mt-10 mb-2 text-center">
                      {{ baseTokenHydrated.symbol }} limit per user
                    </div>

                    <div class="d-flex align-center inputcolor pa-2 pr-4 r-outlined">
                      <c-input :value.sync="maxSpendHuman" placeholder="0.0" @updateWhileFocussed="onMaxSpendAmountChange" class="pa-2">
                      </c-input>

                      <div class="font-weight-bold">
                        {{ baseTokenHydrated.symbol }}
                      </div>
                    </div>
                    <div v-if="eMaxSpendIsZero" class="pink--text">
                      Must be above 0
                    </div>
                  </v-col>
                  <v-col cols="6">
                    <div class="mt-10 mb-2 text-center">
                      Lock Liquidity for
                    </div>
                    <v-menu
                    offset-y
                    >
                      <template v-slot:activator="{ attrs, on }">
                        <div class="d-flex align-center inputcolor pa-4 r-outlined"
                          v-bind="attrs"
                          v-on="on"
                        >
                          {{ lockPeriod }}
                          <v-spacer></v-spacer>
                          <v-icon small>mdi-chevron-down</v-icon>
                        </div>
                      </template>

                      <v-list style="min-width: 200px;" class="background">
                        <v-list-item @click="lockPeriod = '1 month'">
                          <v-list-item-title>
                            1 month
                          </v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="lockPeriod = '2 months'">
                          <v-list-item-title>
                            2 months
                          </v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="lockPeriod = '3 months'">
                          <v-list-item-title>
                            3 months
                          </v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="lockPeriod = '6 months'">
                          <v-list-item-title>
                            6 months
                          </v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="lockPeriod = '1 year'">
                          <v-list-item-title>
                            1 year
                          </v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="lockPeriod = 'Max: 266 years'">
                          <v-list-item-title>
                            Max: 266 years
                          </v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </v-col>
                </v-row>

                <div class="mt-10 mb-2 title font-weight-bold text-center">
                  Start Date
                </div>

                <b-date :block.sync="startBlock"></b-date>

                <div v-if="startBlock < oneWeekFromNowAsBlockNumber" class="pink--text">
                  Presale should ideally start 1 week from today to give you time to raise awareness
                </div>

                <div class="mt-10 mb-2 title font-weight-bold text-center">
                  End Date
                </div>

                <b-date :block.sync="endBlock"></b-date>

                <div>
                  Presale duration: {{ presaleDurationHuman }} / {{ presaleBlockDuration }} blocks
                </div>

                <div v-if="Number(endBlock) < Number(startBlock)" class="pink--text">
                  Your end date must be after the start date
                </div>

                <div v-if="eStartEndExceedsMax" class="pink--text">
                  Presale duration too long. Maximum of {{ presaleMaxDurationHuman }} allowed
                </div>

                <div v-if="eEndBlockLessThanCurrent" class="pink--text">
                  Your endblock is before the current block. Presale will instantly fail.
                </div>
                
                <!-- REFERRALS -->
                <template>
                  <div class="mt-10 title font-weight-bold text-center">
                    Do you have a valid referral address?
                  </div>

                  <div class="text-center">
                    <v-btn depressed :color="!hasReferralAddress ? 'primary' : ''" @click="hasReferralAddress = false">
                      No
                    </v-btn>
                    <v-btn depressed :color="hasReferralAddress ? 'primary' : ''" @click="hasReferralAddress = true">
                      Yes
                    </v-btn>
                  </div>

                  <v-slide-y-transition>
                    <div v-if="hasReferralAddress">
                      <div class="textFaint--text mt-4 caption">
                        Enter the ethereum address of one of Unicrypts partners who referred you here.
                      </div>
                      <div class="mt-2 d-flex align-center pa-3 r-outlined br-8 inputcolor">
                        <c-input :value.sync="referralAddress" placeholder="Referral address">
                        </c-input>

                        <v-progress-circular
                        v-if="referralIsLoading"
                        indeterminate
                        width="2"
                        class="mr-2"
                        size="24"
                        color="primary"
                        ></v-progress-circular>
                      </div>

                      <div v-if="!referralAddressIsAddress && !referralIsLoading" class="text-center pink--text">
                        Referral address not valid
                      </div>
                      <div v-else-if="referralAddressIsAddress && !referralIsLoading && !referrerIsValid" class="text-center pink--text">
                        Invalid Referrer
                      </div>
                      <div v-else class="primary--text justify-center d-flex align-center">
                        <v-icon color="primary">mdi-checkbox-marked-circle-outline</v-icon>
                        Valid
                      </div>
                    </div>
                  </v-slide-y-transition>
                </template>
                <!-- REFERRALS -->

                <div class="mt-10 mb-2 title font-weight-bold text-center">
                  Fees
                </div>

                <div class="text-center">
                  {{ ethCreationFeeHuman }} {{ $store.state.nativeGasTokenSymbol }} - Presale & Locking fee
                </div>
                <div class="text-center">
                  {{ presaleFees.base_fee / 10 }}% - {{ baseTokenHydrated.symbol }} raised fee
                </div>
                <div class="text-center">
                  {{ presaleFees.token_fee / 10 }}% - {{ presaleTokenHydrated.symbol }} sold fee
                </div>
                <div class="text-center">
                  Unicrypt UNIv2 locking fee
                </div>

                <div class="mt-8">
                  <div class="title mb-4 text--text text-center">
                    Tokenomics
                  </div>
                  <div class="d-flex justify-center">
                    <div style="width: 80%;max-width: 250px;">
                      <donut-chart :chartdata="chartData" :options="chartOptions" ref="donutChart" />
                    </div>
                  </div>
                </div>

                <div class="mt-10 mb-2 title font-weight-bold text-center">
                  Total {{ presaleTokenHydrated.symbol }} required
                </div>
                <div class="text-center">
                  <div v-if="userHasSufficientTokens" class="title primary--text">
                    {{ totalTokensRequiredHuman }} {{ presaleTokenHydrated.symbol }}
                  </div>
                  <div v-else class="title pink--text">
                    {{ totalTokensRequiredHuman }} {{ presaleTokenHydrated.symbol }}
                    <div>
                      You do not have enough tokens in your wallet.
                    </div>
                  </div>
                  <div>
                    Amount for sale: {{ amountHuman }}
                  </div>
                  <div>
                    Amount for liquidity: {{ amountLiquidityHardcapHuman }}
                  </div>
                  <div>
                    Fees: {{ tokenFeeHuman }}
                  </div>
                </div>

                <div class="mt-4 caption textFaint--text text-center">
                  Please note: If the presale is a success, any unsold tokens are sent to the 0x00...dEaD burn address.
                </div>

                <div v-if="eInsufficientEth" class="d-flex align-center font-weight-medium midground pa-4 br-8 mt-2" style="position: relative; overflow: hidden;">
                  <div class="red" style="position: absolute; left: 0px; top: 0px; bottom: 0px; right: 0px;opacity: 0.2;">
                  </div>
                  <img 
                  src="@/assets/img/flags/close.svg" 
                  height="26px"
                  class="mr-2"
                  width="26px">
                  <div>
                    <div class="caption">
                      You do not have enough {{ $store.state.nativeGasTokenSymbol }} in your wallet to perform this transaction.
                      {{ ethCreationFeeHuman }}
                      {{ $store.state.nativeGasTokenSymbol }} required.
                    </div>
                  </div>
                </div>

                <v-row dense class="ma-0 mt-4">
                  <v-col cols="6">
                    <v-btn @click="approve" color="primary" x-large block depressed :disabled="!allowanceIncreaseRequired" :loading="approvalLoading">
                      Approve
                    </v-btn>
                  </v-col>
                  <v-col cols="6">
                    <v-btn @click="createPresale" color="primary" x-large block depressed :disabled="creationDisabled" :loading="createLoading">
                      Create presale
                    </v-btn>
                  </v-col>
                </v-row>

              </template>

            </template>
            <!-- WALLET CONNECTED -->

          </div>

        </v-card>
      </v-col>
    </v-row>

    <!-- DIALOGS -->
    <select-base-token-dialog ref="baseTokenDialog"></select-base-token-dialog>
    <!-- DIALOGS -->

  </v-container>
</template>

<script>
import { ethers } from 'ethers'
import PresaleGeneratorContract from '@/smart-contracts/presales/presale-generator01'
import PresaleSettingsContract from '@/smart-contracts/presales/presale-settings'
import UniswapFactoryContract from '@/smart-contracts/uniswap/uniswap-factory-contract'
import TxWrapper from '@/smart-contracts/tx-wrapper'
import ERC20 from '@/smart-contracts/erc20'
import PresaleABI from '@/smart-contracts/presales/presale-abis'
import BDate from '@/components/ui/block-date'
import SelectBaseTokenDialog from './select-base-token-dialog'
import UniswapABI from '@/smart-contracts/uniswap/uniswap-abis'
import moment from 'moment'
import DonutChart from '@/components/charts/donut'

export default {
  components: {
    BDate,
    SelectBaseTokenDialog,
    DonutChart
  },

  data: () => ({
    showPredictionPanel: true,
    ethBalance: '0',
    amount: '0',
    amountHuman: '0',
    liquidityPercent: '60',
    presalePredictionPercent: '50',
    allowance: '0',
    hardcap: '0',
    hardcapHuman: '0',
    softcap: '0',
    softcapHuman: '0',
    startBlock: '0',
    endBlock: '0',
    listingRate: '0',
    listingRateHuman: '0',
    listingRatePercent: 100,
    lockPeriod: '1 year',
    presaleTokenAddress: '',
    baseTokenHydrated: {},
    presaleTokenHydrated: {},
    presaleTokenBalance: '0',
    maxSpend: '0',
    maxSpendHuman: '0',
    presaleFees: {},
    uniswapPairExists: false,
    referralAddress: '',
    hasReferralAddress: false,
    referrerIsValid: false,

    referralIsLoading: false,
    approvalLoading: false,
    createLoading: false,
    checkingIfPairExists: false,
    loadingPresaleToken: false,

    chartData: {
      labels: ['For sale', 'Liquidity', 'Fees', 'Dev wallet / Other'],
      datasets: [{
        data: [],
        backgroundColor: [
          'rgb(20, 240, 132)',
          'rgb(54, 162, 235)',
          'rgba(0, 0, 0, 0.1)',
          'rgba(0, 0, 0, 0.1)'
        ],
        borderWidth: 1
        // borderColor: 'rgba(0,0,0,0.1)'
      }]

    },
    chartOptions: {
      tooltips: {
        callbacks: {
          label: function (tooltipItem, data) {
            return data.datasets[0].data[tooltipItem.index];
          },
        }
      },
      cutoutPercentage: 70,
      legend: {
        position: 'bottom'
      }
    }
  }),

  computed: {
    sEthers () {
      return this.$store.state.ethers
    },
    sEthersWatcher () {
      return this.sEthers.watcher
    },
    blockNumber () {
      return this.$store.state.blockNumber
    },
    oneWeekFromNowAsBlockNumber () {
      var oneWeek = 60 * 60 * 24 * 6
      var asBlocks = parseInt(oneWeek / this.$store.state.blocksPerSecond)
      return this.blockNumber + asBlocks
    },
    ethCreationFeeHuman () {
      var amount = ethers.utils.formatUnits(this.presaleFees.eth_creation_fee, 18)
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 3})
    },
    combinedTokensAddress () {
      return this.baseTokenHydrated.address + this.presaleTokenHydrated.address
    },
    presaleTokenAddressCondensed () {
      var address = this.presaleTokenAddress
      if (!address) {
        return ''
      }
      return address.slice(0, 6) + '...' + address.slice(address.length - 4)
    },
    presaleTokenBalanceHuman () {
      var amount = ethers.utils.formatUnits(this.presaleTokenBalance, this.presaleTokenHydrated.decimals)
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 8})
    },
    tokensPerEth () {
      if (this.hardcap === '0' || !this.hardcap || !this.presaleTokenHydrated.address) {
        return '0'
      }
      return ethers.BigNumber.from(this.amount).mul((10 ** this.baseTokenHydrated.decimals).toString()).div(this.hardcap).toString()
    },
    tokensPerEthHuman () {
      var amount = ethers.utils.formatUnits(this.tokensPerEth, this.presaleTokenHydrated.decimals)
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: this.presaleTokenHydrated.decimals})
    },
    allowanceIncreaseRequired () {
      if (ethers.BigNumber.from(this.amount).gt(this.allowance)) {
        return true
      }
      return false
    },
    amountLiquidityHardcap () {
      // var amount = ethers.BigNumber.from(this.amount).mul(1000 - 20).div(1000).mul(this.liquidityPercent * 10).div(1000).toString()
      // return ethers.BigNumber.from(amount).toString()
      if (this.tokensPerEth === '0') {
        return '0'
      }
      var listingRate = ethers.BigNumber.from(this.listingRate).mul(1000).div(this.tokensPerEth).toString()
      var amount = ethers.BigNumber.from(this.amount).mul(1000 - this.presaleFees.token_fee).div(1000).mul(this.liquidityPercent * 10).div(1000).mul(listingRate).div(1000).toString()
      return ethers.BigNumber.from(amount).toString()
    },
    amountLiquidityHardcapHuman () {
      var amount = ethers.utils.formatUnits(this.amountLiquidityHardcap, this.presaleTokenHydrated.decimals)
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 8})
    },
    chartDataComputed () {
      try {
        return `${this.amount} + ${this.amountLiquidityHardcap} + ${this.tokenFee}`
      } catch (e) {
        return 1
      }
    },
    tokenFee () {
      var amount = ethers.BigNumber.from(this.amount).mul(this.presaleFees.token_fee).div(1000).toString()
      return ethers.BigNumber.from(amount).toString()
    },
    tokenFeeHuman () {
      var amount = ethers.utils.formatUnits(this.tokenFee, this.presaleTokenHydrated.decimals)
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 8})
    },
    totalTokensRequired () {
      return ethers.BigNumber.from(this.tokenFee).add(this.amountLiquidityHardcap).add(this.amount)
    },
    totalTokensRequiredHuman () {
      var amount = ethers.utils.formatUnits(this.totalTokensRequired, this.presaleTokenHydrated.decimals)
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 8})
    },
    userHasSufficientTokens () {
      return ethers.BigNumber.from(this.presaleTokenBalance).gte(this.totalTokensRequired)
    },
    predictiveBaseRaised () {
      var amount = ethers.BigNumber.from(this.hardcap).sub(this.softcap).mul(this.presalePredictionPercent).div(100).toString()
      return ethers.BigNumber.from(amount).add(this.softcap).toString()
    },
    predictiveBaseRaisedHuman () {
      var amount = ethers.utils.formatUnits(this.predictiveBaseRaised, this.baseTokenHydrated.decimals)
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 8})
    },
    predictiveUnicryptBaseFee () {
      return ethers.BigNumber.from(this.predictiveBaseRaised).mul(this.presaleFees.base_fee).div(1000).toString()
    },
    predictiveUnicryptBaseFeeHuman () {
      var amount = ethers.utils.formatUnits(this.predictiveUnicryptBaseFee, this.baseTokenHydrated.decimals)
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 8})
    },
    predictiveUnicryptTokenFee () {
      return ethers.BigNumber.from(this.predictiveTokensSold).mul(this.presaleFees.token_fee).div(1000).toString()
    },
    predictiveUnicryptTokenFeeHuman () {
      var amount = ethers.utils.formatUnits(this.predictiveUnicryptTokenFee, this.presaleTokenHydrated.decimals)
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 8})
    },
    predictiveBaseLiquidity () {
      return ethers.BigNumber.from(this.predictiveBaseRaised).sub(this.predictiveUnicryptBaseFee).mul(this.liquidityPercent * 10).div(1000).toString()
    },
    predictiveBaseLiquidityHuman () {
      var amount = ethers.utils.formatUnits(this.predictiveBaseLiquidity, this.baseTokenHydrated.decimals)
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 8})
    },
    predictiveTokenLiquidity () {
      // return ethers.BigNumber.from(this.predictiveBaseRaised).mul(this.tokensPerEth).mul(this.liquidityPercent * 10).div(1000).toString()
      if (this.tokensPerEth === '0') {
        return '0'
      }
      // var listingRate = ethers.BigNumber.from(this.listingRate).mul(1000).div(this.tokensPerEth).toString()
      // var ethRaised = ethers.BigNumber.from(this.predictiveBaseRaised).sub(this.predictiveUnicryptBaseFee).mul(this.liquidityPercent * 10).div(1000).mul(listingRate).div(1000).toString()
      var decimalDenominator = ethers.BigNumber.from(10).pow(this.baseTokenHydrated.decimals)
      return ethers.BigNumber.from(this.predictiveBaseLiquidity).mul(this.listingRate).div(decimalDenominator).toString()
      // return ethers.BigNumber.from(ethRaised).mul(this.tokensPerEth).div((10 ** this.presaleTokenHydrated.decimals).toString()).toString()
    },
    predictiveTokenLiquidityHuman () {
      if (!this.presaleTokenHydrated.address) {
        return '0'
      }
      var amount = ethers.utils.formatUnits(this.predictiveTokenLiquidity, this.presaleTokenHydrated.decimals)
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 8})
    },
    predictiveOwnerBaseHuman () {
      var amount = ethers.BigNumber.from(this.predictiveBaseRaised).sub(this.predictiveUnicryptBaseFee).sub(this.predictiveBaseLiquidity).toString()
      amount = ethers.utils.formatUnits(amount, this.baseTokenHydrated.decimals)
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 8})
    },
    predictiveTokensSold () {
      if (this.hardcap === '0') {
        return '0'
      }
      var amount = ethers.BigNumber.from(this.hardcap).sub(this.softcap).mul(this.presalePredictionPercent).div(100).toString()
      amount = ethers.BigNumber.from(amount).add(this.softcap).toString()
      return ethers.BigNumber.from(amount).mul(this.amount).div(this.hardcap).toString()
    },
    predictiveTokensSoldHuman () {
      var amount = ethers.utils.formatUnits(this.predictiveTokensSold, this.presaleTokenHydrated.decimals)
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 8})
    },
    referralAddressIsAddress () {
      try {
        ethers.utils.getAddress(this.referralAddress)
        return true
      } catch (e) {
        return false
      }
    },
    actualLiquidityPercent () {
      return this.liquidityPercent - (Number(this.presaleFees.base_fee) / 10)
    },
    presaleBlockDuration () {
      var blockLength = Number(this.endBlock) - Number(this.startBlock)
      return blockLength
    },
    presaleDurationHuman () {
      var duration = this.presaleBlockDuration * this.$store.state.blocksPerSecond
      var mdur = moment.duration(duration * 1000)
      if (mdur.days() > 0) {
        return mdur.days() + ' days'
      }
      if (mdur.hours() > 0) {
        return mdur.hours() + ' hours'
      }
      if (mdur.minutes() > 0) {
        return mdur.minutes() + ' minutes'
      }
      return mdur.seconds() + ' seconds'
    },
    presaleMaxDurationHuman () {
      var duration = this.presaleFees.max_presale_length * this.$store.state.blocksPerSecond
      var mdur = moment.duration(duration * 1000)
      if (mdur.days() > 0) {
        return mdur.days() + ' days'
      }
      if (mdur.hours() > 0) {
        return mdur.hours() + ' hours'
      }
      if (mdur.minutes() > 0) {
        return mdur.minutes() + ' minutes'
      }
      return mdur.seconds() + ' seconds'
    },
    // Errors
    eHardcapLessThanSoftcap () {
      return ethers.BigNumber.from(this.hardcap).lt(this.softcap)
    },
    eHardcapIsZero () {
      return !ethers.BigNumber.from(this.hardcap || 0).gt(0)
    },
    eMaxSpendIsZero () {
      if (!this.maxSpend) {
        return true
      }
      return ethers.BigNumber.from(this.maxSpend).lte('0')
    },
    eStartEndExceedsMax () {
      var length = this.endBlock - this.startBlock
      return length > this.presaleFees.max_presale_length
    },
    eEndBlockLessThanCurrent () {
      return Number(this.blockNumber) >= Number(this.endBlock)
    },
    eMinDivis () {
      return ethers.BigNumber.from(this.amount).lt('10000');
    },
    creationDisabled () {
      if (this.eMinDivis || this.eStartEndExceedsMax || this.eMaxSpendIsZero || this.eHardcapLessThanSoftcap || !this.userHasSufficientTokens || this.allowanceIncreaseRequired || this.eInsufficientEth) {
        return true
      }
      return false
    },
    eInsufficientEth () {
      // var feePlusGas = ethers.BigNumber.from(this.presaleFees.eth_creation_fee).add('200000000000000000')
      return ethers.BigNumber.from(this.ethBalance).lt(this.presaleFees.eth_creation_fee)
    }
  },

  watch: {
    sEthersWatcher () {
      this.refresh()
    },
    presaleTokenAddress (nv) {
      this.loadTokenInfo()
    },
    referralAddress (nv) {
      if (this.referralAddressIsAddress) {
        this.checkReferralAddress(nv)
      } else {
      }
    },
    tokensPerEth (nv) {
      this.setListingRatePercent(this.listingRatePercent)
    },
    combinedTokensAddress () {
      this.checkIfPairExists()
    },
    chartDataComputed (nv) {
      var remain = ethers.BigNumber.from(this.presaleTokenHydrated.totalSupply).sub(this.amount).sub(this.amountLiquidityHardcap).sub(this.tokenFee)
      var data = [this.amount, this.amountLiquidityHardcap, this.tokenFee, remain]
      this.chartData.datasets[0].data = data
      this.chartOptions.tooltips.callbacks.label = (tooltipItem, data) => {
        var amount = data.datasets[0].data[tooltipItem.index]
        amount = ethers.utils.formatUnits(amount, this.presaleTokenHydrated.decimals)
        return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 4})
      }
      // this.$refs.donutChart.update()
      this.$refs.donutChart.reRender()
    }
  },

  methods: {
    connectWallet () {
      this.$root.$dialog.connectWalletDialog.open()
        .then(() => {
        })
        .catch(e => {})
    },
    async checkReferralAddress (address) {
      this.referralIsLoading = true
      PresaleSettingsContract.referrerIsValid(address)
        .then(isValid => {
          this.referrerIsValid = isValid
        })
        .catch(e => {})
        .then(() => {
          this.referralIsLoading = false
        })
    },
    openSelectBaseTokenDialog () {
      this.$refs.baseTokenDialog.open()
        .then(token => {
          this.baseTokenHydrated = token
        })
    },
    async loadTokenInfo () {
      try {
        ethers.utils.getAddress(this.presaleTokenAddress)
      } catch (e) {
        this.presaleTokenHydrated = {}
        return
      }
      this.loadingPresaleToken = true
      ERC20.getERC20(this.presaleTokenAddress)
        .then(token => {
          this.presaleTokenHydrated = token
          this.getPresaleTokenBalance()
          this.getAllowance()
        })
        .catch(e => {})
        .then(() => {
          this.loadingPresaleToken = false
        })
    },
    async checkIfPairExists () {
      if (this.presaleTokenHydrated.address && this.baseTokenHydrated.address) {
        this.checkingIfPairExists = true
        UniswapFactoryContract.uniPairHasLiquidity(this.presaleTokenHydrated.address, this.baseTokenHydrated.address)
          .then(pairExists => {
            this.uniswapPairExists = pairExists
            // this.uniswapPairExists = false
          })
          .catch(e => {})
          .then(() => {
            this.checkingIfPairExists = false
          })
      }
    },
    async getPresaleTokenBalance () {
      var balance = await ERC20.getBalance(this.sEthers.coinbase, this.presaleTokenHydrated.address)
      this.presaleTokenBalance = balance
    },
    async getAllowance () {
      var allowance = await ERC20.getAllowance(this.presaleTokenHydrated.address, this.sEthers.coinbase, PresaleABI.presale_generator01_address())
      this.allowance = allowance
    },
    onPresaleTokenAmountChange (val) {
      this.amount = ethers.utils.parseUnits(val, this.presaleTokenHydrated.decimals).toString()
    },
    onHardcapAmountChange (val) {
      if (!val) {
        this.hardcap = '0'
        return
      }
      this.hardcap = ethers.utils.parseUnits(val, this.baseTokenHydrated.decimals).toString()
    },
    onSoftcapAmountChange (val) {
      this.softcap = ethers.utils.parseUnits(val, this.baseTokenHydrated.decimals)
    },
    onLiquidityAmountChange (val) {
      this.amountLiquidityHardcap = ethers.utils.parseUnits(val, this.presaleTokenHydrated.decimals)
    },
    onMaxSpendAmountChange (val) {
      this.maxSpend = ethers.utils.parseUnits(val || '0', this.baseTokenHydrated.decimals)
    },
    setMax () {
      this.amount = this.presaleTokenBalance
      this.amountHuman = ethers.utils.formatUnits(this.presaleTokenBalance, this.presaleTokenHydrated.decimals)
    },
    setPercent (percent) {
      this.amount = ethers.BigNumber.from(this.presaleTokenBalance).mul(percent).div(100).toString()
      this.amountHuman = ethers.utils.formatUnits(this.amount, this.presaleTokenHydrated.decimals)
    },
    setListingRatePercent (percent) {
      this.listingRatePercent = percent
      var discount = ethers.BigNumber.from(this.tokensPerEth).mul(percent).div(1000).toString()
      this.listingRate = ethers.BigNumber.from(this.tokensPerEth).sub(discount).toString()
      this.listingRateHuman = ethers.utils.formatUnits(this.listingRate, this.presaleTokenHydrated.decimals)
    },
    setLiquidityPercent (percent) {
      this.amountLiquidityHardcap = ethers.BigNumber.from(this.presaleTokenBalance).mul(percent).div(100).toString()
      this.amountLiquidityHardcapHuman = ethers.utils.formatUnits(this.amountLiquidityHardcap, this.presaleTokenHydrated.decimals)
    },
    approve () {
      var amount = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
      this.approvalLoading = true
      TxWrapper.doTransaction(ERC20.setAllowance(this.presaleTokenHydrated.address, amount, PresaleABI.presale_generator01_address()), this.$root.$dialog.confirmTx, 2)
        .then(() => { 
          this.getAllowance()
        })
        .catch(e => { this.$root.$dialog.web3Error.open(e.message) })
        .then(() => {
          this.approvalLoading = false
        })
    },
    async createPresale () {
      this.createLoading = true
      var amount = this.amount
      var lockPeriod = 60 * 60 * 24 * 31
      if (this.lockPeriod === '2 months') {
        lockPeriod = 60 * 60 * 24 * 62
      } else if (this.lockPeriod === '3 months') {
        lockPeriod = 60 * 60 * 24 * 93
      } else if (this.lockPeriod === '6 months') {
        lockPeriod = 60 * 60 * 24 * 184
      } else if (this.lockPeriod === '1 year') {
        lockPeriod = 60 * 60 * 24 * 365
      } else if (this.lockPeriod === 'Max: 266 years') {
        lockPeriod = 9999999999
      }
      
      var referral = this.hasReferralAddress ? this.referralAddress : ethers.constants.AddressZero
      TxWrapper.doTransaction(PresaleGeneratorContract.createPresale(this.sEthers.coinbase, this.presaleTokenHydrated.address, this.baseTokenHydrated.address, referral, amount, this.tokensPerEth, this.maxSpend, this.hardcap, this.softcap, this.liquidityPercent * 10, this.listingRate, this.startBlock, this.endBlock, lockPeriod, this.presaleFees.eth_creation_fee), this.$root.$dialog.confirmTx, 2)
        .then(response => {
          var eventIndex = this.$store.state.requiredNetwork === 'Matic' ? response.receipt.events.length - 2 : response.receipt.events.length - 1
          var creationEvent = response.receipt.events[eventIndex]
          var decodedArray = ethers.utils.defaultAbiCoder.decode(["address"], creationEvent.data)
          // console.log(creationEvent.data)
          // console.log(decodedArray[0])

          this.$axios.post(`/presales/sync-latest`)
            .then(() => {})
            .catch(e => {})
          // this.getUniBalance()
          // this.$emit('on-lock', amount)
          this.$root.ammLink(`/ilo/${decodedArray[0]}/edit`)
        })
        .catch(e => { this.$root.$dialog.web3Error.open(e.message) })
        .then(() => {
          this.createLoading = false
        })
    },

    async getPresaleFees () {
      var presaleFees = await PresaleSettingsContract.getFees()
      this.presaleFees = presaleFees
    },

    async getUserEthBalance () {
      var ethBalance = await this.sEthers.provider.getBalance(this.sEthers.coinbase)
      this.ethBalance = ethBalance
    },

    async refresh () {
      this.getPresaleFees()
      this.loadTokenInfo()
      this.getUserEthBalance()
    }
  },

  created () {
    var baseTokens = {
      'Mainnet': {
        name: 'Ethereum',
        symbol: 'ETH',
        address: UniswapABI.weth9_address(),
        decimals: 18
      },
      'Kovan': {
        name: 'Ethereum',
        symbol: 'ETH',
        address: UniswapABI.weth9_address(),
        decimals: 18
      },
      'xDai': {
        name: 'xDai',
        symbol: 'xDai',
        address: '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d',
        decimals: 18
      },
      'BSC_MAINNET': {
        name: 'Wrapped BNB',
        symbol: 'WBNB',
        address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
        decimals: 18
      },
      'Matic': {
        name: 'Wrapped Matic',
        symbol: 'WMATIC',
        address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
        decimals: 18
      },
    }
    this.baseTokenHydrated = baseTokens[this.$store.state.requiredNetwork]
    this.refresh()
  }
}
</script>