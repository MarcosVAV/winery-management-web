import Vue from "vue"
import App from "./App.vue"
import router from "./router"
import store from "./store"
import vuetify from "./plugins/vuetify"

import axios from "axios"
import VueAxios from "vue-axios"
import moment from "moment"

import Toasted from "vue-toasted"

Vue.use(Toasted, {
    theme: "bubble",
    position: "top-right",
    duration: 5000,
    type: "success",
})

Vue.use(VueAxios, axios)

axios.defaults.baseURL = "http://127.0.0.1:8000/api"

Vue.config.productionTip = false

new Vue({
    router,
    store,
    vuetify,
    moment,
    render: (h) => h(App),
}).$mount("#app")
