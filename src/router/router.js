/**
 * @param {Boolean} cache 是否启用路由缓存
 * @param {String} title document.title字段
 */
const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('@/views/home/Home.vue'),
        meta: { cache: false, title: '中医心系证候运动计划' }
    },
    {
        path: '/risk',
        name: 'risk',
        component: () => import('@/views/risk/Risk.vue'),
        meta: { cache: false, title: '运动风险评估' }
    },
    {
        path: '/step1',
        name: 'step1',
        component: () => import('@/views/step/Step1.vue'),
        meta: { cache: false, title: '中医心系证候运动计划' }
    },
    {
        path: '/step2',
        name: 'step2',
        component: () => import('@/views/step/Step2.vue'),
        meta: { cache: false, title: '中医心系证候运动计划' }
    },
    {
        path: '/step3',
        name: 'step3',
        component: () => import('@/views/step/Step3.vue'),
        meta: { cache: false, title: '中医心系证候运动计划' }
    },
    {
        path: '/plan',
        name: 'plan',
        component: () => import('@/views/plan/Plan.vue'),
        meta: { cache: false, title: '我的运动计划' }
    },
    {
        path: '/timetable',
        name: 'timetable',
        component: () => import('@/views/timetable/Timetable.vue'),
        meta: { cache: false, title: '我的运动计划' }
    },
    {
        path: '/detail',
        name: 'detail',
        component: () => import('@/views/xwDetail/Detail.vue'),
        meta: { cache: false, title: '我的运动计划' }
    },
    {
        path: '/end',
        name: 'end',
        component: () => import('@/views/end/End.vue'),
        meta: { cache: false, title: '我的运动计划' }
    },
]
export default routes
