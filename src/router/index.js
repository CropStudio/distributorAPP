import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './routes'
import { LocalStorage, Notify } from 'quasar'
Vue.use(VueRouter)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation
 */

export default function (/* { store, ssrContext } */) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,

    // Leave these as is and change from quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })

  Router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiredDistributor)) {
      if (LocalStorage.getItem('user') === null || LocalStorage.getItem('user') === undefined | LocalStorage.getItem('role') !== 'distributor') {
        next({
          path: '/login'
        })
        Notify.create({
          icon: 'ion-close',
          color: 'negative',
          message: 'Anda Belum Login Sebagai Distributor',
          actions: [{ icon: 'close', color: 'white' }]
        })
      } else {
        next()
      }
    } else if (to.matched.some(record => record.meta.requiredKios)) {
      if (LocalStorage.getItem('user') === null || LocalStorage.getItem('user') === undefined | LocalStorage.getItem('role') !== 'kios') {
        next({
          path: '/login'
        })
        Notify.create({
          icon: 'ion-close',
          color: 'negative',
          message: 'Anda Belum Login Sebagai Kios',
          actions: [{ icon: 'close', color: 'white' }]
        })
      } else {
        next()
      }
    } else {
      next()
    }
  })

  return Router
}
