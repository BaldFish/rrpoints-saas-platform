import Vue from 'vue'
import Router from 'vue-router'
import myLogin from '@/components/login/login'
import myRegister from '@/components/register/register'
import myForgetPwd from '@/components/forgetPwd/forgetPwd'
import myHome from '@/components/home/home'
import myUserManagement from '@/components/home/userManagement/userManagement'
import myShopsQuery from '@/components/home/userManagement/shopsQuery'
import myShopDetails from '@/components/home/userManagement/shopDetails'
import myServiceQuery from '@/components/home/userManagement/serviceQuery'
import myAddShop from '@/components/home/userManagement/addShop'
import myChangePassword from '@/components/home/userManagement/changePassword'
import myPaymentVerification from '@/components/home/userManagement/paymentVerification'

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
      path: '/register',
      name: 'register',
      component: myRegister,
    },
    {
      path: '/forgetPwd',
      name: 'forgetPwd',
      component: myForgetPwd,
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
              redirect:"/home/userManagement/shopsQuery",
            },
            {
              path: '/home/userManagement/shopsQuery',
              name: 'shopsQuery',
              component: myShopsQuery,
            },
            {
              path: '/home/userManagement/shopDetails',
              name: 'shopDetails',
              component: myShopDetails,
            },
            {
              path: '/home/userManagement/serviceQuery',
              name: 'serviceQuery',
              component: myServiceQuery,
            },
            {
              path: '/home/userManagement/addShop',
              name: 'addShop',
              component: myAddShop,
            },
            {
              path: '/home/userManagement/changePassword',
              name: 'changePassword',
              component: myChangePassword,
            },
            {
              path: '/home/userManagement/paymentVerification',
              name: 'paymentVerification',
              component: myPaymentVerification,
            },
          ]
        },
      ]
    },
  ]
})
