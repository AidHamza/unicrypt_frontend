import Vue from 'vue'
import VueRouter from 'vue-router'
import ErrorPage from '@/views/404/Page.vue'
import Tokens from '@/views/tokens/Page.vue'
import Token from '@/views/token/Page.vue'
import Pairs from '@/views/pairs/Page.vue'
import Pair from '@/views/pair/Page.vue'

import Lockerv1 from '@/views/lockerv1/Page.vue'

import Locker from '@/views/locker/Page.vue'
import LiqLockerSelectAMM from '@/views/locker/liquidity/SelectAMM.vue'
import LockERC20 from '@/views/locker/erc20/Page.vue'

import LaunchpadSelector from '@/views/services/ilo-select-amm'

import Minter from '@/views/minter/Page.vue'

import Super from '@/views/super/Page.vue'
import Account from '@/views/account/main/Page.vue'
import SocialProfile from '@/views/account/social-profile/Page.vue'

import Presale from '@/views/presale/presale/Page.vue'
import PresaleGenerator from '@/views/presale/generator/PresaleGenerator.vue'
import PresaleFactory from '@/views/presale/presales/PresaleFactory.vue'
import EditPresale from '@/views/presale/presale/presale-admin-card.vue'

import Swap from '@/views/swap/Page.vue'

import Farms from '@/views/farms/Page.vue'

import ExchangeSwitcher from '@/views/ExchangeSwitcher'
import ChainSwitcher from '@/views/ChainSwitcher'

import AMMSelect from '@/views/AMMSelect'
import ChainSelect from '@/views/ChainSelect'

import Dashboard from '@/views/trending/Trending'
import Services from '@/views/services/Page'
import TermsAndConditions from '@/views/terms-conditions/Page'
import TC_Farms from '@/views/terms-conditions/farms'
import TC_General from '@/views/terms-conditions/general'
import TC_ILO from '@/views/terms-conditions/ilos'
import PrivacyPolicy from '@/views/terms-conditions/privacy-policy'

Vue.use(VueRouter)

const routes = [
  {
    path: '/amm',
    name: 'AMMSelect',
    component: AMMSelect
  },
  {
    path: '/amm/:amm',
    component: ExchangeSwitcher,
    props: true,
    children: [
      // TOKENS
      {
        path: 'tokens',
        name: 'TokensPage',
        component: Tokens,
      },
      {
        path: 'token/:address',
        name: 'Token',
        props: true,
        component: Token
      },
      {
        path: 'pair/:address',
        name: 'Pair',
        props: true,
        component: Pair
      },
      // ILOs
      {
        path: 'ilo/create',
        name: 'PresaleGenerator',
        component: PresaleGenerator
      },
      {
        path: 'ilos',
        name: 'Presales',
        component: PresaleFactory
      },
      {
        path: 'ilo/:address',
        name: 'Presale',
        props: true,
        component: Presale
      },
      {
        path: 'ilo/:address/edit',
        name: 'Edit Presale',
        props: true,
        component: EditPresale
      },
      {
        path: 'locker',
        name: 'Lockerv1',
        component: Lockerv1
      },
      {
        path: 'pairs',
        name: 'PairsComponent',
        component: Pairs
      },
      // SUPERUSER
      {
        path: 'sajfkhflkjasdlisdulansdlakds',
        name: 'CronTab',
        component: Super
      },
    ]
  },
  {
    path: '/chain',
    name: 'Chain Select',
    component: ChainSelect
  },
  {
    path: '/chain/:chain',
    component: ChainSwitcher,
    props: true,
    children: [
      {
        path: 'farms',
        name: 'FarmsPage',
        component: Farms,
      },
      {
        path: 'locker',
        name: 'Locker',
        component: Locker,
      },
      {
        path: 'locker/amm',
        name: 'Liquidity Locker Select AMM',
        component: LiqLockerSelectAMM,
      },
      {
        path: 'locker/erc20',
        name: 'Lock ERC20',
        component: LockERC20,
      },
    ]
  },
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/services',
    name: 'Services',
    component: Services,
  },

  {
    path: '/terms',
    name: 'Terms and Conditions',
    component: TermsAndConditions,
  },
  {
    path: '/terms/farms',
    name: 'T&C Farms',
    component: TC_Farms,
  },
  {
    path: '/terms/general',
    name: 'T&C General',
    component: TC_General,
  },
  {
    path: '/terms/ilos',
    name: 'T&C Ilos',
    component: TC_ILO,
  },
  {
    path: '/terms/privacy-policy',
    name: 'Privacy Policy',
    component: PrivacyPolicy,
  },

  {
    path: '/services/lock-liquidity',
    name: 'Liquidity Locker',
    component: LiqLockerSelectAMM,
  },
  {
    path: '/services/launchpad',
    name: 'Launchpad',
    component: LaunchpadSelector,
  },
  {
    path: '/services/lock-tokens',
    name: 'Token Locker',
    component: LockERC20,
  },
  {
    path: '/services/minter',
    name: 'Minter',
    component: Minter,
  },
  {
    path: '/account',
    name: 'Account',
    component: Account
  },
  {
    path: '/account/social-profile',
    name: 'Social Profile',
    component: SocialProfile
  },
  // MISC
  {
    path: '/swap',
    name: 'Swap',
    component: Swap
  },
  {
    path: "*",
    component: ErrorPage
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

export default router
