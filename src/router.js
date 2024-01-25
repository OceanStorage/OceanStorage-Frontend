import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
import AboutView from './views/AboutView.vue'
import UserView from './views/UserViews/UserView.vue'
import IndexView from './views/UserViews/views/Index.vue'
import LoginView from './views/LoginView.vue'
import RegisterView from './views/RegisterView.vue'
import ForgetPasswordView from './views/ForgetPasswordView.vue'
import UserResourcesView from './views/UserViews/views/Resources.vue'
import UserResourcesContainerView from './views/UserViews/views/ResourcesViews/views/Containers.vue'
import UserResourcesResourcesView from './views/UserViews/views/ResourcesViews/views/Resources.vue'
import UserClientView from './views/UserViews/views/Client.vue'
import UserStoreView from './views/UserViews/views/StoreViews/Index.vue'
import UserClientIndexView from './views/UserViews/views/ClientViews/views/ClientIndex.vue'
import ServiceKeyManageView from './views/UserViews/views/ClientViews/views/ServiceKeyManage.vue'
import VisitLogManageView from './views/UserViews/views/ClientViews/views/VisitLogManage.vue'
import DeviceNotSupportedView from './DeviceNotSupported.vue'
import HelpView from './views/UserViews/views/HelpViews/Help.vue'

const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView
    },
    {
        path: '/about',
        name: 'about',
        component: AboutView
    },
    {
        path: '/login',
        name: 'login',
        component: LoginView
    },
    {
        path: '/register',
        name: 'register',
        component: RegisterView
    },
    {
        path: '/forgetPassword',
        name: 'forgetPassword',
        component: ForgetPasswordView
    },
    {
        path: '/deviceNotSupported',
        name: 'deviceNotSupported',
        component: DeviceNotSupportedView
    },
    {
        path: '/user',
        name: 'user',
        component: UserView,
        children:[
            {
                path: '/user',
                name: 'UserIndex',
                component: IndexView
            },
            {
                path: '/user/resource',
                name: 'UserResources',
                component: UserResourcesView,
                redirect: "/user/containers",
                children:[
                    {
                        path: '/user/containers',
                        name: 'UserResourcesContainer',
                        component: UserResourcesContainerView
                    },
                    {
                        path: '/user/containerResources',
                        name: 'UserResourcesContainerResources',
                        component: UserResourcesResourcesView
                    },
                ]
            },
            {
                path: '/user/client',
                name: 'UserClient',
                component: UserClientView,
                redirect: "/user/client/index",
                children:[
                    {
                        path: '/user/client/index',
                        name: 'UserClientIndex',
                        component: UserClientIndexView
                    },
                    {
                        path: '/user/client/serviceKeyManage',
                        name: 'ServiceKeyManage',
                        component: ServiceKeyManageView
                    },
                    {
                        path: '/user/client/visitLogManage',
                        name: 'visitLogManage',
                        component: VisitLogManageView
                    },
                ]
            },
            {
                path: '/user/store',
                name: 'UserStore',
                component: UserStoreView
            },
            {
                path: '/user/help',
                name: 'HelpView',
                component: HelpView
            },
        ]
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
