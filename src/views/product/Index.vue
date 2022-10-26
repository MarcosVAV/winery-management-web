<template>
    <v-card>
        <v-card-text>
            <v-data-table
                :headers="headers"
                :items="products"
                height="500px"
                class="elevation-1"
                :loading="loading"
                fixed-header
            >
                <template v-slot:top>
                    <v-toolbar flat>
                        <v-toolbar-title>Produtos</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-dialog
                            v-model="dialog"
                            max-width="500px"
                            @keydown.esc="closeDialog"
                        >
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn
                                    color="primary"
                                    dark
                                    class="mb-2"
                                    v-bind="attrs"
                                    v-on="on"
                                >
                                    Cadastrar
                                </v-btn>
                            </template>
                            <v-card>
                                <v-toolbar dark color="primary">
                                    <span class="text-h5">{{ formTitle }}</span>
                                </v-toolbar>

                                <v-card-text>
                                    <v-row style="padding-top: 20px">
                                        <v-col cols="12" sm="12" md="6">
                                            <v-text-field
                                                v-model="form.name"
                                                label="Nome"
                                            ></v-text-field>
                                        </v-col>
                                        <v-col
                                            cols="12"
                                            sm="6"
                                            md="6"
                                            style="display: flex"
                                        >
                                            <v-autocomplete
                                                v-model="form.product_type_id"
                                                :items="productTypes"
                                                item-text="name"
                                                item-value="id"
                                                label="Tipo do Produto"
                                            ></v-autocomplete>
                                            <v-btn
                                                color="primary"
                                                fab
                                                x-small
                                                dark
                                                style="
                                                    height: 20px;
                                                    width: 20px;
                                                "
                                                @click="
                                                    dialogProductType = true
                                                "
                                            >
                                                <v-icon small>mdi-plus</v-icon>
                                            </v-btn>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field
                                                v-model="form.weight"
                                                label="Peso (Kg)"
                                            ></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field
                                                v-model="form.price"
                                                label="Preço (R$)"
                                            ></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field
                                                v-model="form.brand"
                                                label="Marca"
                                            ></v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-card-text>

                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn
                                        color="blue darken-1"
                                        text
                                        @click="closeDialog"
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

                        <v-dialog v-model="dialogProductType" max-width="500px">
                            <v-card>
                                <v-toolbar dark color="primary" height="50px">
                                    <v-btn
                                        x-small
                                        icon
                                        dark
                                        @click="dialogProductType = false"
                                    >
                                        <v-icon>mdi-close</v-icon>
                                    </v-btn>
                                    <span
                                        class="text-h6"
                                        style="margin-left: 10px"
                                    >
                                        Novo Tipo de Produto
                                    </span>
                                </v-toolbar>
                                <v-card-text>
                                    <v-row
                                        style="
                                            align-items: center;
                                            padding-top: 5px;
                                        "
                                    >
                                        <v-col xs="12" sm="9">
                                            <v-text-field
                                                v-model="productTypeName"
                                                label="Nome"
                                            ></v-text-field>
                                        </v-col>
                                        <v-col
                                            xs="12"
                                            sm="3"
                                            class="text-center"
                                        >
                                            <v-btn
                                                small
                                                color="primary"
                                                @click="createProductType"
                                            >
                                                salvar
                                            </v-btn>
                                        </v-col>
                                    </v-row>
                                </v-card-text>
                            </v-card>
                        </v-dialog>

                        <v-dialog v-model="dialogDelete" max-width="500px">
                            <v-card>
                                <v-toolbar
                                    dark
                                    color="error"
                                    class="text-center"
                                >
                                    <v-toolbar-title>
                                        Excluir Registro
                                    </v-toolbar-title>
                                    <v-spacer></v-spacer>
                                </v-toolbar>
                                <v-card-title class="text-h5"
                                    >Voce tem certeza que deseja deletar este
                                    Registro?</v-card-title
                                >
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn
                                        color="blue darken-1"
                                        text
                                        @click="dialogDelete = false"
                                        >Cancel</v-btn
                                    >
                                    <v-btn
                                        color="blue darken-1"
                                        text
                                        @click="deleteProductConfirm"
                                        >OK</v-btn
                                    >
                                    <v-spacer></v-spacer>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </v-toolbar>
                </template>
                <template v-slot:item.actions="{ item }">
                    <v-icon small class="mr-2" @click="editProduct(item)">
                        mdi-pencil
                    </v-icon>
                    <v-icon small @click="deleteProduct(item)">
                        mdi-delete
                    </v-icon>
                </template>
            </v-data-table>
        </v-card-text>
    </v-card>
</template>

<script>
import axios from "axios"

export default {
    data: () => ({
        dialog: false,
        dialogProductType: false,
        dialogDelete: false,
        loading: false,
        headers: [
            {
                text: "Nome",
                align: "start",
                value: "name",
            },
            { text: "Tipo", value: "product_type" },
            { text: "Peso (Kg)", value: "weight" },
            { text: "Preço (R$)", value: "price" },
            { text: "Marca", value: "brand" },
            { text: "Ações", value: "actions", sortable: false },
        ],
        products: [],
        defaultProduct: {
            id: null,
            name: "",
            product_type_id: null,
            weight: 0,
            price: 0,
            brand: "",
        },
        form: {
            id: null,
            name: "",
            product_type_id: null,
            weight: 0,
            price: 0,
            brand: "",
        },
        productTypes: [],
        productId: 0,
        hasEdit: false,
        productTypeName: "",
    }),

    computed: {
        formTitle() {
            return this.hasEdit ? "Editar Produto" : "Novo Produto"
        },
    },

    created() {
        this.getProducts()
        this.getProductTypes()
    },

    methods: {
        async getProducts() {
            this.loading = true

            await axios
                .get("products")
                .then((res) => {
                    this.products = res.data.products
                })
                .catch((e) => {
                    this.$toasted.show(e.response.data.message, {
                        type: "error",
                    })
                })
                .finally(() => (this.loading = false))
        },
        async getProductTypes() {
            this.loading = true

            await axios
                .get("product-types")
                .then((res) => {
                    this.productTypes = res.data.productTypes
                })
                .catch((e) => {
                    this.$toasted.show(e.response.data.message, {
                        type: "error",
                    })
                })
                .finally(() => (this.loading = false))
        },

        editProduct(item) {
            this.hasEdit = true

            this.form.id = item.id
            this.form.name = item.name
            this.form.product_type_id = item.product_type_id
            this.form.weight = item.weight
            this.form.price = item.price
            this.form.brand = item.brand

            this.dialog = true
        },

        deleteProduct(item) {
            this.productId = item.id

            this.dialogDelete = true
        },

        closeDialog() {
            this.dialog = false

            setTimeout(() => {
                this.form.name = this.defaultProduct.name
                this.form.product_type_id = this.defaultProduct.product_type_id
                this.form.weight = this.defaultProduct.weight
                this.form.price = this.defaultProduct.price
                this.form.brand = this.defaultProduct.brand

                this.hasEdit = false
            }, 100)
        },

        closeDeleteDialog() {
            this.dialogDelete = false
        },

        async deleteProductConfirm() {
            this.loading = true

            await axios
                .delete(`products/${this.productId}`)
                .then((res) => {
                    this.$toasted.show("Produto deletado com sucesso!")

                    this.getProducts()

                    this.closeDeleteDialog()
                })
                .catch((e) => {
                    this.$toasted.show(e.response.data.errors, {
                        type: "error",
                    })
                })
                .finally(() => (this.loading = false))
        },

        async save() {
            this.loading = true

            if (this.hasEdit) {
                await axios
                    .put(`products/${this.form.id}`, this.form)
                    .then((res) => {
                        this.$toasted.show(res.data[0])

                        this.getProducts()

                        this.closeDialog()
                    })
                    .catch((e) => {
                        this.$toasted.show(e.response.data.message, {
                            type: "error",
                        })
                    })
                    .finally(() => (this.loading = false))
            } else {
                await axios
                    .post("products", this.form)
                    .then((res) => {
                        this.$toasted.show(res.data[0])

                        this.getProducts()

                        this.closeDialog()
                    })
                    .catch((e) => {
                        this.$toasted.show(e.response.data.message, {
                            type: "error",
                        })
                    })
                    .finally(() => (this.loading = false))
            }
        },
        async createProductType() {
            this.loading = true

            let name = this.productTypeName

            await axios
                .post("product-types", { name })
                .then((res) => {
                    this.$toasted.show(res.data[0])

                    this.getProductTypes()

                    this.dialogProductType = false
                })
                .catch((e) => {
                    this.$toasted.show(e.response.data.message, {
                        type: "error",
                    })
                })
                .finally(() => (this.loading = false))
        },
    },
}
</script>
