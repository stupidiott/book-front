import Vue from 'vue'
import VueRouter from 'vue-router'

import Main from '../views/main/Main'
import Login from '../views/login/Login'

// 安装路由
Vue.use(VueRouter);

const routers = [
  {
    // 路由
    path: '/main',
    name: 'main',
    redirect: '/home',
    component: Main,
    children: [
      {
        path: '/home',
        name: 'Home',
        component: ()=>import('@/views/home/Home.vue')
      },
      {
        path: '/search',
        name: 'Search',
        component: ()=>import('@/views/search/Search.vue')
      },
      {
        path: '/accounts',
        name: 'Account',
        component: ()=>import('@/views/account/Account.vue')
      },
      {
        path: '/books',
        name: 'Book',
        component: ()=>import('@/views/book/Book.vue')
      },
      {
        path: '/borrowBook',
        name: 'BorrowBook',
        component: ()=>import('@/views/borrow/BorrowBook.vue')
      },
      {
        path: '/borrowBookList',
        name: 'BorrowBookList',
        component: ()=>import('@/views/borrow/BorrowBookList.vue')
      },
      {
        path: '/borrowBookHistory',
        name: 'borrowBookHistory',
        component: ()=>import('@/views/borrow/BorrowBookHistory.vue')
      },
      {
        path: '/notAuth',
        name: 'NotAuth',
        component: ()=>import('@/views/auth/NotAuth.vue')
      },
      {
        path: '/404',
        name: 'NotFound',
        component: ()=>import('@/views/notFound/NotFound.vue')
      },
      {
        path: '/expire',
        name: 'Expire',
        component: ()=>import('@/views/expire/Expire.vue')
      },
      {
        path:'/libraryDashboard',
        name:'Dashboard',
        component: ()=>import('@/views/dashboard/LibraryDashboard.vue')
      },
      {
        path:'/bookDashboard',
        name:'Dashborad',
        component: ()=>import('@/views/dashboard/BookDashboard.vue')
      }
    ]
  },
  {
    // 路由
    path: '/',
    redirect: '/home'
  },
  {
    // 路由
    path: '/login',
    component: Login
  },
  {
    // 路由
    path: '*',
    redirect: '/404'
  }
]

const router = new VueRouter({
  // mode: 'history',
  routes: routers
});

const authRouter = ['/clazz','/accounts']

// 全局拦截，只有有token才能放行
router.beforeEach((to,from,next)=>{
  if(to.path === '/login'){
    next();
  }else {
    let token = localStorage.getItem("token");
    let user = JSON.parse(localStorage.getItem('userInfo'));
    if(token){
      if(authRouter.includes(to.path)){
        if(user.accountType === 1 || user.accountType === 3){
          next();
        }else {
          next('/notAuth');
        }
      }else {
        next();
      }
    }else {
      next('/login')
    }
  }
})

// 解决路由重复问题：Avoided redundant navigation to current location
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

// 配置导出路由
export default router
