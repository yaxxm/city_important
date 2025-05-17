import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '../views/Layout.vue'
import Cookies from "js-cookie";
Vue.use(VueRouter)

const routes = [
    //=================登录===========================
  {path: '/login', name: 'Login', component: () => import('@/views/login/Login.vue'),},
    //===============主页============================
  {
    path: '/',
    name: 'Layout',
    component: Layout,
    redirect: '/home',
    children: [  //子路由
      {path: 'home', name: 'Home', component: () => import('@/views/home/HomeView.vue')},
      //================User================
      {path: 'userList', name: 'UserList', component: () => import('@/views/user/User.vue')},
      {path: 'relationList', name: 'RelationList', component: () => import('@/views/user/Relation.vue')},
      {path: 'addUser', name: 'AddUser', component: () => import('@/views/user/AddUser.vue')},
      {path: 'editUser', name: 'EditUser', component: () => import('@/views/user/EditUser.vue')},
      {path: 'informUser', name: 'InformUser', component: () => import('@/views/user/InformUser.vue')},
      //================UserBi================
      {path: 'userBiList', name: 'UserBiList', component: () => import('@/views/userbi/User.vue')},
      {path: 'addBiUser', name: 'AddBiUser', component: () => import('@/views/userbi/AddUser.vue')},
      {path: 'editBiUser', name: 'EditBiUser', component: () => import('@/views/userbi/EditUser.vue')},
      {path: 'informBiUser', name: 'InformBiUser', component: () => import('@/views/userbi/InformUser.vue')},
      //================UserDou================
      {path: 'userDouList', name: 'UserDouList', component: () => import('@/views/userdou/User.vue')},
      {path: 'addDouUser', name: 'AddDouUser', component: () => import('@/views/userdou/AddUser.vue')},
      {path: 'editDouUser', name: 'EditDouUser', component: () => import('@/views/userdou/EditUser.vue')},
      {path: 'informDouUser', name: 'InformDouUser', component: () => import('@/views/userdou/InformUser.vue')},
      //================UserBi================
      {path: 'userTikList', name: 'UserTikList', component: () => import('@/views/usertik/User.vue')},
      {path: 'addTikUser', name: 'AddTikUser', component: () => import('@/views/usertik/AddUser.vue')},
      {path: 'editTikUser', name: 'EditTikUser', component: () => import('@/views/usertik/EditUser.vue')},
      {path: 'informTikUser', name: 'InformTikUser', component: () => import('@/views/usertik/InformUser.vue')},
      //===================Admin===================
      {path: 'adminList', name: 'AdminList', component: () => import('@/views/admin/List.vue')},
      {path: 'addAdmin', name: 'AddAdmin', component: () => import('@/views/admin/Add.vue')},
      {path: 'editAdmin', name: 'EditAdmin', component: () => import('@/views/admin/Edit.vue')},
      {path: 'informAdmin', name: 'InformAdmin', component: () => import('@/views/admin/InformAdmin.vue')},
      //===================Category===================
      {path: 'categoryList', name: 'CategoryList', component: () => import('@/views/category/List.vue')},
      {path: 'addCategory', name: 'AddCategory', component: () => import('@/views/category/Add.vue')},
      {path: 'editCategory', name: 'EditCategory', component: () => import('@/views/category/Edit.vue')},
      {path: 'informCategory', name: 'InformCategory', component: () => import('@/views/category/InformCategory.vue')},
      //===================Media===================
      {path: 'mediaList', name: 'MediaList', component: () => import('@/views/media/List.vue')},
      {path: 'addMedia', name: 'AddMedia', component: () => import('@/views/media/Add.vue')},
      {path: 'editMedia', name: 'MediaCategory', component: () => import('@/views/media/Edit.vue')},
    ]
  },
  {
    path: "*",
    component:() => import('@/views/404.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to,from, next) =>{
  if(to.path === '/login') next()
  const admin = Cookies.get("admin")
  if(!admin && to.path !== '/login') return next("/login") //强制退回到登录页面
  //访问 /home 的时候，并且cookie里面存在数据，这时候就直接放行
  next()
})
export default router
