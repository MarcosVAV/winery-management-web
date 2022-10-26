import Vue from "vue"
import VueRouter from "vue-router"
import Product from "../views/product/Index.vue"
import SalesOrder from "../views/salesOrder/Index.vue"

Vue.use(VueRouter)

const routes = [
    {
        path: "/products",
        name: "product",
        component: Product,
    },
    {
        path: "/sales-orders",
        name: "salesOrders",
        component: SalesOrder,
    },
]

const router = new VueRouter({
    routes,
})

export default router
