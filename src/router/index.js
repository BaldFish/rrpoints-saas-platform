import Vue from 'vue'
import Router from 'vue-router'
import myLogin from '@/components/login/login'
import myHome from '@/components/home/home'
import myUserManagement from '@/components/home/userManagement/userManagement'
import myUserQuery from '@/components/home/userManagement/userQuery'
import myUserDetails from '@/components/home/userManagement/userDetails'
import myMerchantQuery from '@/components/home/userManagement/merchantQuery'
import myAddShop from '@/components/home/userManagement/addShop'

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: "/",
      redirect: "/login"
    },
    {
      path: '/login',
      name: 'login',
      component: myLogin,
    },
    {
      path: '/home',
      component: myHome,
      children:[
        {
          path: '',
          redirect:"/home/userManagement",
        },
        {
          path: '/home/userManagement',
          component: myUserManagement,
          children:[
            {
              path: '',
              redirect:"/home/userManagement/userQuery",
            },
            {
              path: '/home/userManagement/userQuery',
              name: 'userQuery',
              component: myUserQuery,
            },
            {
              path: '/home/userManagement/userDetails',
              name: 'userDetails',
              component: myUserDetails,
            },
            {
              path: '/home/userManagement/merchantQuery',
              name: 'merchantQuery',
              component: myMerchantQuery,
            },
            {
              path: '/home/userManagement/addShop',
              name: 'addShop',
              component: myAddShop,
            },
          ]
        },
      ]
    },
  ]
})
