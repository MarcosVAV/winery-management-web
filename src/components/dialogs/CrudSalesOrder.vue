<template>
    <v-row justify="center">
        <v-dialog
            v-model="open"
            fullscreen
            hide-overlay
            transition="dialog-bottom-transition"
            @keydown.esc="exit"
        >
            <v-card>
                <v-toolbar dark color="primary">
                    <v-btn icon dark @click="exit">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                    <v-toolbar-title> {{ title }}</v-toolbar-title>
                    <v-spacer></v-spacer>
                </v-toolbar>
                <v-card-text>
                    <v-row style="padding: 10px">
                        <v-col xs="12" sm="6" md="8">
                            <v-text-field
                                v-model="form.description"
                                label="Descrição"
                            >
                            </v-text-field>
                        </v-col>
                        <v-col xs="12" sm="6" md="4">
                            <v-text-field
                                label="Data prevista:"
                                type="datetime-local"
                                v-model="form.expected_date"
                            />
                        </v-col>
                    </v-row>
                    <v-col md="12">
                        <v-data-table
                            :headers="headers"
                            :items="products"
                            :item-key="products.id"
                            class="elevation-1"
                            hide-default-footer
                        >
                            <template v-slot:top>
                                <v-toolbar flat>
                                    <v-toolbar-title>Produtos</v-toolbar-title>
                                    <v-spacer></v-spacer>
                                    <v-dialog
                                        v-model="dialog"
                                        max-width="500px"
                                    >
                                        <template
                                            v-slot:activator="{ on, attrs }"
                                        >
                                            <v-btn
                                                color="primary"
                                                dark
                                                class="mb-2"
                                                v-bind="attrs"
                                                v-on="on"
                                                x-small
                                            >
                                                <v-icon small>mdi-plus</v-icon>
                                            </v-btn>
                                        </template>
                                        <v-card>
                                            <v-card-title>
                                                <span class="text-h5">{{
                                                    formTitle
                                                }}</span>
                                            </v-card-title>

                                            <v-card-text>
                                                <v-container>
                                                    <v-row>
                                                        <v-col
                                                            cols="12"
                                                            sm="6"
                                                            md="6"
                                                        >
                                                            <v-autocomplete
                                                                v-model="
                                                                    editedItem.product_id
                                                                "
                                                                :items="
                                                                    productList
                                                                "
                                                                item-text="name"
                                                                item-value="id"
                                                                label="Nome"
                                                            ></v-autocomplete>
                                                        </v-col>
                                                        <v-col
                                                            cols="12"
                                                            sm="6"
                                                            md="6"
                                                        >
                                                            <v-text-field
                                                                v-model="
                                                                    editedItem.quantity
                                                                "
                                                                label="Quantidade"
                                                            ></v-text-field>
                                                        </v-col>
                                                    </v-row>
                                                </v-container>
                                            </v-card-text>

                                            <v-card-actions>
                                                <v-spacer></v-spacer>
                                                <v-btn
                                                    color="blue darken-1"
                                                    text
                                                    @click="close"
                                                >
                                                    Cancelar
                                                </v-btn>
                                                <v-btn
                                                    color="blue darken-1"
                                                    text
                                                    @click="save"
                                                >
                                                    Salvar
                                                </v-btn>
                                            </v-card-actions>
                                        </v-card>
                                    </v-dialog>
                                </v-toolbar>
                            </template>
                            <template v-slot:item.actions="{ item }">
                                <v-icon
                                    small
                                    class="mr-2"
                                    @click="editItem(item)"
                                >
                                    mdi-pencil
                                </v-icon>
                                <v-icon small @click="deleteItem(item)">
                                    mdi-delete
                                </v-icon>
                            </template>
                        </v-data-table>
                    </v-col>
                    <v-row style="padding: 20px 10px 0px 10px">
                        <v-col xs="12" sm="4" md="3" lg="3">
                            <v-text-field
                                v-model="form.delivery_distance_in_km"
                                type="number"
                                label="Distância da entrega (Km)"
                            >
                            </v-text-field>
                        </v-col>
                        <v-col xs="12" sm="4" md="3" lg="3">
                            <v-text-field
                                v-model="form.discount_percentage"
                                type="number"
                                label="Percentual de desconto (%)"
                            >
                            </v-text-field>
                        </v-col>
                        <v-col xs="12" sm="4" md="3" lg="2">
                            <v-text-field
                                type="number"
                                v-model="total_weight"
                                label="Peso (Kg)"
                                readonly
                            >
                            </v-text-field>
                        </v-col>
                        <v-col xs="12" sm="4" md="3" lg="2">
                            <v-text-field
                                type="number"
                                v-model="form.subtotal"
                                label="Subtotal (R$)"
                                readonly
                            >
                            </v-text-field>
                        </v-col>
                        <v-col
                            md="1"
                            class="hidden-lg-and-up hidden-sm-and-down"
                        ></v-col>
                        <v-spacer></v-spacer>
                        <v-col
                            xs="12"
                            sm="4"
                            md="3"
                            lg="2"
                            style="display: flex; justify-content: flex-end"
                        >
                            <div
                                style="
                                    display: inline-flex;
                                    align-items: center;
                                "
                            >
                                <v-text-field
                                    v-model="form.freight_value"
                                    type="number"
                                    label="Frete (R$)"
                                    readonly
                                    title="Calculado após adição dos produtos e a distância de entrega"
                                >
                                </v-text-field>
                                <v-btn
                                    x-small
                                    color="green"
                                    icon
                                    dark
                                    @click="calculeFreight"
                                >
                                    <v-icon> mdi-refresh</v-icon>
                                </v-btn>
                            </div>
                        </v-col>
                    </v-row>
                    <v-row style="padding: 0px 10px 0px 10px">
                        <v-spacer></v-spacer>
                        <v-col
                            xs="12"
                            sm="4"
                            md="4"
                            lg="2"
                            style="display: flex; justify-content: flex-end"
                        >
                            <div
                                style="
                                    display: inline-flex;
                                    align-items: center;
                                "
                            >
                                <v-text-field
                                    v-model="form.total_price"
                                    type="number"
                                    label="Preço total (R$)"
                                >
                                </v-text-field>
                                <v-btn
                                    x-small
                                    color="green"
                                    icon
                                    dark
                                    @click="calculeTotalPrice"
                                >
                                    <v-icon> mdi-refresh</v-icon>
                                </v-btn>
                            </div>
                        </v-col>
                    </v-row>
                    <v-row style="padding: 20px">
                        <v-spacer></v-spacer>
                        <v-btn
                            color="primary"
                            depressed
                            @click="
                                hasEdit == true
                                    ? editSalesOrder()
                                    : createSalesOrder()
                            "
                        >
                            Salvar
                        </v-btn>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script>
import moment from "moment"
import axios from "axios"

export default {
    name: "CrudSalesOrder",
    props: {
        open: {
            type: Boolean,
            default: false,
        },
        propsData: {
            type: Object,
            default: [],
        },
        hasEdit: {
            type: Boolean,
            default: false,
        },
    },
    data: () => ({
        timer: null,
        dialog: false,
        total_weight: 0,
        products: [],
        editedIndex: -1,
        editedItem: {
            product_id: null,
            quantity: 0,
        },
        headers: [
            {
                text: "Nome",
                align: "start",
                value: "name",
            },
            { text: "Quantidade", value: "quantity" },
            { text: "Preço unitário", value: "unit_price" },
            { text: "Ações", value: "actions", sortable: false },
        ],
        form: {
            id: null,
            description: "",
            delivery_distance_in_km: 0,
            expected_date: moment().format("YYYY-MM-DDTHH:mm"),
            freight_value: 0,
            discount_percentage: 0,
            total_price: 0,
            products_id: [],
            quantities: [],
            subtotal: 0,
        },
        productList: {},
    }),
    computed: {
        title() {
            return this.hasEdit
                ? "Editar Pedido de Venda"
                : "Novo Pedido de Venda"
        },
        formTitle() {
            return this.editedIndex === -1
                ? "Adicionar Produto"
                : "Editar Produto"
        },
    },
    watch: {
        dialog(val) {
            val || this.close()
        },
        open(value) {
            if (value) {
                this.clearInputs()

                this.getProductList()
            }
        },
        "form.delivery_distance_in_km"(value) {
            if (value && this.form.products_id.length) {
                this.calculeFreight()
            }
        },
        "form.products_id"(value) {
            if (value && this.form.delivery_distance_in_km) {
                this.calculeFreight()
            }
        },
        "form.discount_percentage"(value) {
            if (this.form.products_id.length) {
                this.calculeTotalPrice()
            }
        },
        hasEdit(value) {
            if (value) {
                this.fillFormWhenEditing()
            }
        },
    },
    methods: {
        async getProductList() {
            await axios
                .get("products")
                .then((res) => {
                    this.productList = res.data.products
                })
                .catch(() => {
                    this.$toasted.show(e.response.data.message, {
                        type: "error",
                    })
                })
        },
        editItem(item) {
            this.editedIndex = this.products.indexOf(item)
            this.editedItem = Object.assign({}, item)

            this.dialog = true
        },
        deleteItem(item) {
            this.editedIndex = this.products.indexOf(item)

            this.form.products_id.splice(this.editedIndex, 1)
            this.form.quantities.splice(this.editedIndex, 1)
            this.products.splice(this.editedIndex, 1)

            this.$nextTick(() => {
                this.editedItem = Object.assign(
                    {},
                    { product_id: null, quantity: 0 }
                )
                this.editedIndex = -1
            })
        },
        close() {
            this.dialog = false

            this.$nextTick(() => {
                this.editedItem = Object.assign(
                    {},
                    { product_id: null, quantity: 0 }
                )
                this.editedIndex = -1
            })
        },
        exit() {
            this.$emit("afterClose", true)
        },
        calculeFreight() {
            let products_id = this.form.products_id
            let quantities = this.form.quantities
            let delivery_distance_in_km = this.form.delivery_distance_in_km

            let params = { products_id, quantities, delivery_distance_in_km }

            clearTimeout(this.timer)

            this.timer = setTimeout(() => {
                axios
                    .get("calculate-freight", { params })
                    .then((e) => {
                        this.form.freight_value = e.data.freightValue
                        this.total_weight = e.data.totalWeight

                        this.calculeTotalPrice()

                        if (!this.hasEdit || this.hasChange()) {
                            this.$toasted.show("Frete Atualizado!")
                        }
                    })
                    .catch((e) => {
                        this.form.freight_value = 0

                        this.$toasted.show(e.response.data.message, {
                            type: "error",
                        })
                    })
            }, 500)
        },
        calculeTotalPrice() {
            let products_id = this.form.products_id
            let quantities = this.form.quantities
            let freight_value = this.form.freight_value
            let discount_percentage = this.form.discount_percentage

            let params = {
                products_id,
                quantities,
                freight_value,
                discount_percentage,
            }

            clearTimeout(this.timer)

            this.timer = setTimeout(() => {
                axios
                    .get("calculate-price", { params })
                    .then((e) => {
                        this.form.total_price = e.data.totalPrice
                        this.form.subtotal = e.data.subtotal

                        if (!this.hasEdit || this.hasChange()) {
                            this.$toasted.show("Preço Total Atualizado!")
                        }
                    })
                    .catch((e) => {
                        this.form.total_price = 0

                        this.$toasted.show(e.response.data.message, {
                            type: "error",
                        })
                    })
            }, 500)
        },
        save() {
            let selectedProduct = this.productList.find(
                (e) => e.id == this.editedItem.product_id
            )

            let hasDuplicateProduct = this.products
                .map((e) => e.product_id)
                .includes(selectedProduct.id)

            this.editedItem.name = selectedProduct.name
            this.editedItem.unit_price = selectedProduct.price

            if (
                hasDuplicateProduct &&
                this.form.products_id[this.editedIndex] != selectedProduct.id
            ) {
                this.$toasted.show("Este produto já foi selecionado!", {
                    type: "error",
                })

                return
            }

            if (this.editedIndex > -1) {
                this.form.products_id[this.editedIndex] =
                    this.editedItem.product_id
                this.form.quantities[this.editedIndex] =
                    this.editedItem.quantity

                this.calculeFreight()

                Object.assign(this.products[this.editedIndex], this.editedItem)
            } else {
                this.form.products_id.push(this.editedItem.product_id)
                this.form.quantities.push(this.editedItem.quantity)

                this.products.push(this.editedItem)
            }

            this.close()
        },
        clearInputs() {
            this.form.id = null
            this.form.description = ""
            this.form.delivery_distance_in_km = 0
            this.form.expected_date = moment().format("YYYY-MM-DDTHH:mm")
            this.form.freight_value = 0
            this.form.discount_percentage = 0
            this.form.total_price = 0
            this.form.products_id = []
            this.form.quantities = []
            this.form.subtotal = 0
            this.total_weight = 0

            this.products = []
        },
        fillFormWhenEditing() {
            let data = this.propsData

            this.form.id = data.id
            this.form.delivery_distance_in_km = parseFloat(
                data.delivery_distance_in_km
            )
            this.form.description = data.description
            this.form.discount = data.discount
            this.form.expected_date = moment(data.expected_date).format(
                "YYYY-MM-DDTHH:mm"
            )
            this.form.freight_value = parseFloat(data.freight_value)
            this.form.total_price = parseFloat(data.total_price)
            this.form.subtotal = parseFloat(data.subtotal)

            data.products.forEach((e) => {
                this.form.products_id.push(e.id)
                this.form.quantities.push(e.pivot.quantity)

                this.products.push({
                    product_id: e.id,
                    name: e.name,
                    unit_price: e.price,
                    quantity: e.pivot.quantity,
                })
            })
        },
        hasChange() {
            let data = this.propsData

            let quantityList = this.propsData.products.map(
                (e) => e.pivot.quantity
            )

            return (
                data.delivery_distance_in_km !=
                    this.form.delivery_distance_in_km ||
                quantityList.toString() != this.form.quantities.toString() ||
                data.products.map((e) => e.id).toString() !=
                    this.form.products_id.toString()
            )
        },
        createSalesOrder() {
            axios
                .post("sales-orders", this.form)
                .then((res) => {
                    this.$toasted.show(res.data[0])

                    this.exit()
                })
                .catch((e) => {
                    this.$toasted.show(e.response.data.message, {
                        type: "error",
                    })
                })
        },
        editSalesOrder() {
            axios
                .put(`sales-orders/${this.form.id}`, this.form)
                .then((res) => {
                    this.$toasted.show(res.data[0])

                    this.exit()
                })
                .catch((e) => {
                    this.$toasted.show(e.response.data.message, {
                        type: "error",
                    })
                })
        },
    },
}
</script>
