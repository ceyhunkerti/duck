import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import AuthLayout, { ConnectionLayout } from '@/layouts'

import Home from '@/pages/Home.vue'
import Login from '@/pages/Login.vue'
import Connections, { CreateConnection, EditConnection } from '@/pages/settings/connections'
import Categories, { EditCategory, CreateCategory } from '@/pages/categories'
import Expressions, { CreateExpression, EditExpression } from '@/pages/expressions'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: MainLayout,
    children: [
      { name: 'home', path: '', component: Home },
      {
        name: 'createConnection',
        path: 'settings/connections/create',
        component: CreateConnection
      },
      {
        name: 'editConnection',
        path: 'settings/connections/:id/edit',
        component: EditConnection,
        props: true
      }, {
        name: 'editConnection',
        path: 'settings/connections',
        component: Connections
      }, {
        name: 'connectionsLayout',
        path: '/connections/:connectionId',
        props: true,
        component: ConnectionLayout,
        children: [
          {
            name: 'categories',
            path: '/connections/:connectionId/categories',
            props: true,
            component: Categories,
            meta: { group: 'categories' }
          }, {
            name: 'createCategory',
            path: '/connections/:connectionId/categories/create',
            props: true,
            component: CreateCategory,
            meta: { group: 'categories' }
          }, {
            name: 'editCategory',
            path: '/connections/:connectionId/categories/:id',
            props: true,
            component: EditCategory,
            meta: { group: 'categories' }
          }, {
            name: 'expressions',
            path: '/connections/:connectionId/expressions',
            props: true,
            component: Expressions,
            meta: { group: 'expressions' }
          }, {
            name: 'createExpression',
            path: '/connections/:connectionId/expressions/create',
            props: true,
            component: CreateExpression,
            meta: { group: 'expressions' }
          }, {
            name: 'editExpression',
            path: '/connections/:connectionId/expressions/:policy_expression_name',
            props: true,
            component: EditExpression,
            meta: { group: 'expressions' }
          }
        ]
      }
    ]
  }, {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../pages/About.vue')
  },
  {
    path: '/auth',
    name: 'Auth',
    component: AuthLayout,
    redirect: 'auth/login',
    children: [
      { name: 'login', path: 'login', component: Login }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
