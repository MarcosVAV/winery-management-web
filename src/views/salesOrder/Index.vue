<template>
    <v-container style="padding: 0px">
        <v-card>
            <v-card-text>
                <v-data-table
                    :headers="headers"
                    :items="salesOrders"
                    height="500px"
                    class="elevation-1"
                    :loading="loading"
                    fixed-header
                >
                    <template v-slot:top>
                        <v-toolbar flat>
                            <v-toolbar-title>Pedidos de Venda</v-toolbar-title>
                            <v-spacer></v-spacer>
                            <v-btn
                                color="primary"
                                dark
                                class="mb-2"
                                @click="dialog = true"
                            >
                                Cadastrar
                            </v-btn>
                            <v-dialog v-model="dialogDelete" max-width="500px">
                                <v-card>
                                    <v-toolbar
                                        dark
                                        color="error"
                                        class="text-center"
                                    >
                                        <v-toolbar-title>
                                            Excluir Pedido
                                        </v-toolbar-title>
                                        <v-spacer></v-spacer>
                                    </v-toolbar>
                                    <v-card-title class="text-h5"
                                        >Voce tem certeza que deseja deletar
                                        este Pedido?</v-card-title
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
                                            @click="deleteSalesOrderConfirm"
                                            >OK</v-btn
                                        >
                                        <v-spacer></v-spacer>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        </v-toolbar>
                    </template>
                    <template v-slot:item.actions="{ item }">
                        <v-icon
                            small
                            class="mr-2"
                            @click="editSalesOrder(item)"
                        >
                            mdi-pencil
                        </v-icon>
                        <v-icon small @click="deleteSalesOrder(item)">
                            mdi-delete
                        </v-icon>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>

        <crud-sales-order
            :open="dialog"
            :hasEdit="hasEdit"
            :propsData="propsData"
            @afterClose="closeDialog"
        >
        </crud-sales-order>
    </v-container>
</template>

<script>
import axios from "axios"

import CrudSalesOrder from "@/components/dialogs/CrudSalesOrder.vue"

export default {
    components: {
        CrudSalesOrder,
    },
    data: () => ({
        dialog: false,
        dialogDelete: false,
        loading: false,
        headers: [
            {
                text: "Código",
                align: "center",
                value: "id",
            },
            { text: "Descrição", value: "description" },
            {
                text: "Distância da entrega (Km)",
                value: "delivery_distance_in_km",
            },
            { text: "Frete (R$)", value: "freight_value" },
            { text: "Desconto (R$)", value: "discount" },
            { text: "Data prevista", value: "expected_date_br" },
            { text: "Preço total", value: "total_price" },
            { text: "Ações", value: "actions", sortable: false },
        ],
        salesOrders: [],
        salesOrderId: 0,
        hasEdit: false,
        propsData: { type: Object, default: [] },
    }),
    created() {
        this.getSalesOrders()
    },
    methods: {
        async getSalesOrders() {
            this.loading = true

            await axios
                .get("sales-orders")
                .then((res) => {
                    this.salesOrders = res.data.salesOrders
                })
                .catch((e) => {
                    this.$toasted.show(e.response.data.message, {
                        type: "error",
                    })
                })
                .finally(() => (this.loading = false))
        },
        editSalesOrder(item) {
            this.hasEdit = true

            this.propsData = item

            this.dialog = true
        },
        async closeDialog() {
            await this.getSalesOrders()

            this.dialog = false

            this.hasEdit = false
        },
        closeDeleteDialog() {
            this.dialogDelete = false
        },
        deleteSalesOrder(item) {
            this.salesOrderId = item.id

            this.dialogDelete = true
        },
        async deleteSalesOrderConfirm() {
            this.loading = true

            await axios
                .delete(`sales-orders/${this.salesOrderId}`)
                .then((res) => {
                    this.$toasted.show("Pedido de venda deletado com sucesso!")

                    this.getSalesOrders()

                    this.closeDeleteDialog()
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
