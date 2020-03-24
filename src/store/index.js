import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import step from './modules/step'
import createPersistedState from 'vuex-persistedstate'
const store = new Vuex.Store({
    state: {
        code: '',
        userInfo: {},
        courseKind: '',
        listObj: {},
        course: '',
        check: 'no',
        scrollLeft: 0,
        consumedKcal: 0,
        startTime: 0
    },
    mutations: {
        setCode(state, paylod) {
            state.code = paylod
            switch (paylod) {
                case "1":
                    state.courseKind = "37"
                    break;
                case "2":
                    state.courseKind = "38"
                    break;
                case "3":
                    state.courseKind = "39"
                    break;
                case "4":
                    state.courseKind = "40"
                    break;
                case "5":
                    state.courseKind = "41"
                    break;
                case "6":
                    state.courseKind = "42"
                    break;
                case "7":
                    state.courseKind = "43"
                    break;
                case "8":
                    state.courseKind = "44"
                    break;
                case "9":
                    state.courseKind = "45"
                    break;
                default:
                    break;
            }
        },
        setUserId(state, paylod) {
            state.userInfo.userId = paylod
        },
        setListObj(state, paylod) {
            state.listObj = paylod
        },
        setCourse(state, paylod) {
            state.course = paylod
        },
        setCheck(state, paylod) {
            state.check = paylod
        },
        setScrollLeft(state, paylod) {
            state.scrollLeft = paylod
        },
        setConsumedKcal(state, paylod) {
            state.consumedKcal = paylod
        },
        setStartTime(state, paylod) {
            state.startTime = paylod
        }
    },
    modules: {
        step
    },
    plugins: [createPersistedState({
        storage: window.sessionStorage
    })]
})
export default store
