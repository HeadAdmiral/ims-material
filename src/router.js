import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '',
      name: '',
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('./views/auth/Registration.vue')
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('./views/auth/Login.vue')
    },
    {
      path: '/store-selector',
      name: 'Select a Store',
      component: () => import('./views/SelectCurrentStore.vue')
    },
    {
      path: '/:storeId/management/user',
      name: 'User Management',
      component: () => import('./views/administration/UserManagement.vue')
    },
    {
      path: '/:storeId/management/store',
      name: 'Store Management',
      component: () => import('./views/administration/StoreManagement.vue')
    },
    {
      path: '/:storeId/dashboard',
      name: 'Dashboard',
      component: () => import('./views/Dashboard.vue')
    },
    {
      path: '/:storeId/storestock',
      name: 'Store Stock',
      component: () => import('./views/core/StoreStock.vue')
    },
    {
      path: '/:storeId/settings',
      name: 'Settings',
      component: () => import('./views/misc/Settings.vue')
    },
    {
      path: '/:storeId/changelog',
      name: 'Changelog',
      component: () => import('./views/misc/Changelog.vue')
    }
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    // }

    /* https://github.com/vuejs/vue-router/issues/914
        // SET THE DOCUMENT TITLE DEPENDING ON ROUTE
        router.beforeEach((to, from, next) => {
          document.title = to.meta.title
          next()
        })


     */
  ],
  mode: 'history'
})
