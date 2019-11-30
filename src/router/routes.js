
const routes = [
  // before login
  {
    path: '/login',
    component: () => import('pages/guest/Login.vue')
  },
  // main / core app
  {
    path: '/distributor/',
    component: () => import('layouts/distributor/MasterLayout.vue'),
    children: [
      { path: '', name: 'Dashboard Distributor', component: () => import('pages/distributor/Index.vue') },
      { path: 'databarang', name: 'databarang', component: () => import('pages/distributor/DataBarang.vue') },
      { path: 'form', name: 'formbarang', component: () => import('pages/distributor/FormDataBarang.vue') },
      { path: 'edit/:id', name: 'formEditBarang', component: () => import('pages/distributor/FormEditDataBarang.vue') }
    ],
    meta: {
      requiredDistributor: true
    }
  },
  {
    path: '/kios/',
    component: () => import('layouts/kios/MasterLayout.vue'),
    children: [
      { path: '', name: 'Dashboard Kios', component: () => import('pages/kios/Index.vue') }
    ],
    meta: {
      requiredKios: true
    }
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
