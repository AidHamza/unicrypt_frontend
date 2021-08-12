<template>
  <div class="border-b">
    <div class="c-list pa-2" @click="expandMenu = !expandMenu">
      <div class="d-flex align-center px-2">

        <div class="font-weight-medium d-flex align-center">
          {{ amountHumanWithCommas }} {{ tokenHydrated.symbol }}
          <v-icon v-if="errorMinimumLockAmount" small color="orange" class="ml-2">mdi-alert-outline</v-icon>
        </div>

        <v-spacer></v-spacer>

        <v-btn rounded text small @click.stop="expandMenu = !expandMenu" :color="expandMenu ? 'textFaint' : 'primary'">
          Edit
          <v-icon small :class="[{'rotate-180': expandMenu}]">mdi-chevron-down</v-icon>
        </v-btn>

        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              small
              v-bind="attrs"
              v-on="on"
              @click.stop="$emit('duplicate')"
            >
              <v-icon small>mdi-content-copy</v-icon>
            </v-btn>
          </template>
          <span>Duplicate</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              small
              v-bind="attrs"
              v-on="on"
              @click.stop="$emit('remove-lock')"
            >
              <v-icon small>mdi-close</v-icon>
            </v-btn>
          </template>
          <span>Delete</span>
        </v-tooltip>

      </div>

      <div class="d-flex align-center pb-1">
        <div v-if="!lockType1" :class="['caption ml-1 br-20 px-2 background']">
          <v-icon small color="blue">mdi-chart-line</v-icon>
          Linear lock
        </div>
        <!--
        <div v-else :class="['caption ml-1 br-20 px-2 background']">
          <v-icon small color="primary">mdi-lock-outline</v-icon>
        </div>
        -->
        
        <div v-if="!lockType1" class="px-2 textFaint--text caption">
          {{ startDateHuman }} - 
          <span class="textFaint--text caption">{{ endDateHuman }}</span>
        </div>
        <div v-else class="px-2 textFaint--text caption">
          Unlocks: <strong>{{ endDateFromNow }}</strong> | 
          <span class="textFaint--text caption">{{ endDateHuman }}</span>
        </div>
      </div>

      <div class="caption d-flex align-center">
        <div :class="['ml-1 br-20 px-2 background']">
          Unlocker: 
          <span v-if="unlockerIsMe" class="primary--text">
            Me
          </span>
          <template v-else>
            <template v-if="!ownerIsValid">
              <v-icon small color="orange">mdi-alert-outline</v-icon>
            </template>
            <template v-else>
              {{ unlockerAddressCondensed }}
            </template>
          </template>
        </div>

        <div v-if="customCondition" :class="['ml-1 br-20 px-2 background']">
          Condition:
          <v-icon v-if="!conditionStateObject.abi_implemented" small color="orange">mdi-alert-outline</v-icon>
          <v-icon v-else-if="conditionStateObject.state" small color="orange">mdi-alert-outline</v-icon>
          <template v-else>
            (UnlockTokens: <strong>{{ conditionStateObject.state }}</strong>)
          </template>
        </div>

      </div>
    </div>

    <v-expand-transition>
      <div v-show="expandMenu">
        <div class="background pa-2">
          <div class="v-card pa-4">
            <div class="mt-10 mb-2 font-weight-bold text-center">
              Who can withdraw the tokens?
            </div>

            <div class="text-center">
              <v-btn rounded depressed :color="unlockerIsMe ? 'primary--text' : 'textFaint--text'" @click="unlockerIsMe = true">
                Me
              </v-btn>
              <v-btn rounded depressed :color="!unlockerIsMe ? 'primary--text' : 'textFaint--text'" @click="unlockerIsMe = false">
                Someone else
              </v-btn>
            </div>

            <v-expand-transition>
              <div v-if="!unlockerIsMe">
                <div class="textFaint--text text-center caption py-2">
                  *Allow someone else to withdraw these tokens after the lock date.
                </div>
                <div class="mt-2 d-flex align-center pa-3 r-outlined br-8 inputcolor">
                  <c-input :value.sync="lock.owner" placeholder="Unlocker address">
                  </c-input>
                </div>
                <div v-if="ownerIsValid" class="justify-center caption primary--text d-flex align-center">
                  Valid address
                  <v-icon small color="primary" class="ml-2">mdi-check</v-icon>
                </div>
                <div v-else class="justify-center caption orange--text d-flex align-center">
                  Invalid address
                  <v-icon small color="orange" class="ml-2">mdi-alert-outline</v-icon>
                </div>
              </div>
            </v-expand-transition>
            
            <div class="mt-10 mb-2 font-weight-bold text-center">
              Lock how many tokens?
            </div>

            <div class="pa-4 align-center flex-nowrap inputcolor r-outlined">

              <div class="caption text-end pt-2">
                Balance: {{ tokenBalanceHuman }}
              </div>

              <div class="d-flex align-center">
                <c-input :value.sync="amountHuman" placeholder="0.0" @updateWhileFocussed="onHumanAmountChange" class="pa-2 font-weight-bold">

                </c-input>

                <div class="font-weight-bold">
                  {{ tokenHydrated.symbol }}
                </div>

                <v-btn small rounded depressed color="primary" @click="setMax" class="ml-2">
                  MAX
                </v-btn>
              </div>

              <div>
                <v-btn small outlined rounded color="" @click="setPercent(25)" class="mr-1">
                  25%
                </v-btn>
                <v-btn small outlined rounded color="" @click="setPercent(50)" class="mr-1">
                  50%
                </v-btn>
                <v-btn small outlined rounded color="" @click="setPercent(75)" class="mr-1">
                  75%
                </v-btn>
                <v-btn small outlined rounded color="" @click="setMax" class="mr-1">
                  100%
                </v-btn>
              </div>

            </div>

            <div v-if="errorMinimumLockAmount" class="justify-center caption orange--text d-flex align-center">
              Minimum lock amount {{ minimumLockAmount }} {{ tokenHydrated.symbol }}
              <v-icon small color="orange" class="ml-2">mdi-alert-outline</v-icon>
            </div>

            <div class="text-center mt-10">
              <v-btn rounded depressed :class="lockType1 ? 'primary--text' : 'textFaint--text'" @click="lockType1 = true">
                Unlock on date
              </v-btn>
              <v-btn rounded depressed :color="!lockType1 ? 'blue--text' : 'textFaint--text'" @click="lockType1 = false">
                Unlock over time
              </v-btn>
            </div>

            <div v-if="lockType1" class="mt-8 d-flex align-start inputcolor r-outlined pa-4">
              <div>
                <div class="font-weight-bold">
                  {{ endDateHuman }}
                </div>
                <div class="">
                  {{ endDateFromNow }} <!-- (unix {{ unlockDate }}) -->
                </div>
              </div>
              <v-spacer></v-spacer>
              <c-date @setDate="setEndEmission"></c-date>
            </div>

            <div v-if="!lockType1" class="v-card pa-2">
              <div class="mt-8 text-center textFaint--text caption">
                <div>
                <v-icon size='40' color="blue">mdi-chart-line</v-icon>
                </div>
                Allows you to withdraw tokens every block, scaled linearly over time
              </div>
              <div class="mt-8 text-center textFaint--text caption">
                Start date
              </div>
              <div class="mt-2 d-flex align-start inputcolor r-outlined pa-4">
                <div>
                  <div class="font-weight-bold">
                    {{ startDateHuman }}
                  </div>
                  <div class="">
                    {{ startDateFromNow }} <!-- (unix {{ unlockDate }}) -->
                  </div>
                </div>
                <v-spacer></v-spacer>
                <c-date @setDate="setStartEmission" color="blue"></c-date>
              </div>
              <div class="mt-8 text-center textFaint--text caption">
                End date
              </div>
              <div class="mt-2 d-flex align-start inputcolor r-outlined pa-4">
                <div>
                  <div class="font-weight-bold">
                    {{ endDateHuman }}
                  </div>
                  <div class="">
                    {{ endDateFromNow }} <!-- (unix {{ unlockDate }}) -->
                  </div>
                </div>
                <v-spacer></v-spacer>
                <c-date @setDate="setEndEmission" color="blue"></c-date>
              </div>

              <div v-if="lock.start_emission >= lock.end_emission" class="mt-2 justify-center caption orange--text d-flex align-center">
                End date must be after start date
                <v-icon small color="orange" class="ml-2">mdi-alert-outline</v-icon>
              </div>

              <template v-else>
                <linear-lock-chart :lock="lock" :tokenHydrated="tokenHydrated"></linear-lock-chart>
              </template>

            </div>

            <div class="mt-10 font-weight-bold text-center mb-3">
              Premature Unlock Condition

              <v-menu offset-y open-on-hover transition="scale-transition" max-width="400px">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    @click.stop
                    small
                    v-bind="attrs"
                    v-on="on"
                    color="textFaint"
                    class="ml-1"
                  >
                    mdi-help-circle-outline
                  </v-icon>
                </template>
                <div class="pa-3 foreground caption">
                  <p>
                    Allow tokens to be withdrawn <strong>before</strong> the Unlock Date if a condition is met (e.g. Presale complete)
                  </p>
                  <p>
                    <strong>Unlock Date</strong> will always be used as a fallback to this condition.
                  </p>
                  <p>
                    Read more HERE
                  </p>
                </div>
              </v-menu>
            </div>

            <div class="text-center">
              <v-btn depressed :color="!customCondition ? 'primary--text' : 'textFaint--text'" @click="customCondition = false">
                No
              </v-btn>
              <v-btn depressed :color="customCondition ? 'primary--text' : 'textFaint--text'" @click="customCondition = true">
                Yes
              </v-btn>
            </div>

            <v-expand-transition>
              <div v-if="customCondition">
                <div class="mt-4">
                  <div class="caption text-center textFaint--text mb-3">
                    Read about this feature
                  </div>
                  <div class="mt-2 d-flex align-center pa-3 r-outlined br-8 inputcolor">
                    <c-input :value.sync="lock.condition" placeholder="Condition contract address">
                    </c-input>
                  </div>
                  <div v-if="!conditionAddressIsValid" class="justify-center caption orange--text d-flex align-center">
                    Invalid Conditional Contract address
                    <v-icon small color="orange" class="ml-2">mdi-alert-outline</v-icon>
                  </div>
                  <template v-else>
                    <div class="textFaint--text text-center caption">
                      {{ conditionStateObject }}
                    </div>
                    <div v-if="!conditionStateObject.abi_implemented" class="caption orange--text text-center">
                      Invalid contract: This contract does not impement the unlockTokens() method
                      <div>
                        Read about it HERE
                      </div>
                    </div>
                    <div v-if="conditionStateObject.abi_implemented && !conditionStateObject.state" class="justify-center caption primary--text d-flex align-center">
                      Valid condition
                      <v-icon small color="primary" class="ml-2">mdi-check</v-icon>
                    </div>
                    <div v-if="conditionStateObject.abi_implemented && conditionStateObject.state" class="v-card pa-4 text-center textFaint--text">
                      <div class="text-center">
                        <v-icon size="60" color="orange" class="ml-2">mdi-alert-outline</v-icon>
                      </div>
                      <div class="text-center title orange--text mb-2">
                        Instant Unlock condition!
                      </div>
                        This conditions unlockTokens() method returns true. Tokens will be withdrawable immediately, rendering this lock pointless.
                      <div class="caption">
                        The unlockTokens() method should return <strong>false</strong> initially and only return true at some date after the lock.
                      </div>
                    </div>
                    <!--
                    <div>
                      unlockTokens() implemented:
                      <span v-if="conditionStateObject.abi_implemented" class="green--text">true</span>
                      <span v-else class="orange--text">false</span>
                    </div>
                    <div>
                      UnlockTokens() state: 
                      <span v-if="conditionStateObject.state" class="orange--text">true</span>
                      <span v-else class="green--text">false</span>
                    </div>
                    -->
                  </template>
                </div>
              </div>
            </v-expand-transition>

            <div class="py-2">

            </div>
          </div>
        </div>
      </div>
    </v-expand-transition>
  </div>
</template>

<script>
import { ethers } from 'ethers'
import CDate from '@/components/ui/date-picker'
import VestingContract from '@/smart-contracts/token-locker/token-locker-contract'
import moment from 'moment'
import LinearLockChart from '@/views/locker/erc20/charts/linear-lock'

export default {
  props: {
    lock: {
      type: Object,
      default: () => {}
    },
    tokenHydrated: {
      type: Object,
      default: () => ({
        symbol: '',
        name: '',
        decimals: '0'
      })
    },
    balance: {
      type: String,
      default: '0'
    }
  },

  components: {
    CDate,
    LinearLockChart
  },

  data: () => ({
    expandMenu: false,
    amountHuman: '0',
    conditionStateObject: {
      abi_implemented: false,
      state: false
    }
  }),

  computed: {
    sEthers () {
      return this.$store.state.ethers
    },
    unlockerAddressCondensed () {
      var address = this.lock.owner
      if (!address) {
        return ''
      }
      return address.slice(0, 6) + '...' + address.slice(address.length - 4)
    },
    unlockerIsMe: {
      get () {
        return this.lock.owner === this.sEthers.coinbase
      },
      set (_bool) {
        if (_bool) {
          this.lock.owner = this.sEthers.coinbase
        } else {
          this.lock.owner = ''
        }
      }
    },
    lockType1: {
      get () {
        return this.lock.start_emission === 0
      },
      set (_bool) {
        if (_bool) {
          this.lock.start_emission = 0
        } else {
          this.lock.start_emission = moment().unix()
        }
      }
    },
    customCondition: {
      get () {
        return this.lock.condition !== ethers.constants.AddressZero
      },
      set (_bool) {
        if (_bool) {
          this.lock.condition = ''
        } else {
          this.lock.condition = ethers.constants.AddressZero
        }
      }
    },
    minimumLockAmount () {
      var amount = ethers.utils.formatUnits(100, this.tokenHydrated.decimals)
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: this.tokenHydrated.decimals})
    },
    tokenBalanceHuman () {
      var amount = ethers.utils.formatUnits(this.balance, this.tokenHydrated.decimals)
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 9})
    },
    amountHumanWithCommas () {
      return Number(this.amountHuman).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: this.tokenHydrated.decimals})
    },
    startDateHuman () {
      return moment.unix(this.lock.start_emission).format('DD MMM YYYY HH:mm')
    },
    startDateFromNow () {
      return moment.unix(this.lock.start_emission).fromNow()
    },
    endDateHuman () {
      return moment.unix(this.lock.end_emission).format('DD MMM YYYY HH:mm')
    },
    endDateFromNow () {
      return moment.unix(this.lock.end_emission).fromNow()
    },
    ownerIsValid () {
      return ethers.utils.isAddress(this.lock.owner)
    },
    conditionAddressIsValid () {
      return ethers.utils.isAddress(this.lock.condition)
    },
    errorMinimumLockAmount () {
      return ethers.BigNumber.from(this.lock.amount).lt(100)
    }
  },

  watch: {
    'lock.condition' () {
      this.testCondition()
    }
  },

  methods: {
    setMax () {
      this.lock.amount = this.balance
      this.amountHuman = ethers.utils.formatUnits(this.balance, this.tokenHydrated.decimals)
    },
    setPercent (percent) {
      this.lock.amount = ethers.BigNumber.from(this.balance).mul(percent).div(100).toString()
      this.amountHuman = ethers.utils.formatUnits(this.lock.amount, this.tokenHydrated.decimals)
    },
    setStartEmission (date) {
      this.lock.start_emission = date.unix()
    },
    setEndEmission (date) {
      if (this.lockType1) {
        this.lock.end_emission = date.unix()
      }
      this.lock.end_emission = date.unix()
    },
    onHumanAmountChange (val) {
      this.lock.amount = ethers.utils.parseUnits(val, this.tokenHydrated.decimals).toString()
    },
    async testCondition () {
      var stateObject = await VestingContract.testCondition(this.lock.condition)
      this.conditionStateObject = stateObject
    }
  },

  created () {
    this.amountHuman = ethers.utils.formatUnits(this.lock.amount, this.tokenHydrated.decimals)
    this.testCondition()
  }
}
</script>