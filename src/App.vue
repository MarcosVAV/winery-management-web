<template>
    <v-app id="inspire">
        <v-app-bar app color="white" flat>
            <v-container class="py-0 fill-height">
                <v-avatar
                    class="mr-10"
                    color="grey darken-1"
                    size="32"
                ></v-avatar>

                <v-btn
                    v-for="item in items"
                    :key="item.title"
                    text
                    :to="item.to"
                >
                    {{ item.title }}
                </v-btn>

                <v-spacer></v-spacer>

                <v-responsive max-width="260">
                    <v-text-field
                        dense
                        flat
                        hide-details
                        rounded
                        solo-inverted
                    ></v-text-field>
                </v-responsive>
            </v-container>
        </v-app-bar>

        <v-main class="grey lighten-3">
            <v-container>
                <v-sheet min-height="70vh" max-width="100%" rounded="lg">
                    <router-view></router-view>
                </v-sheet>
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
export default {
    data: () => ({
        items: [
            { title: "Dashboard", to: "/" },
            { title: "Produtos", to: "/products" },
            { title: "Pedidos de Venda", to: "/sales-orders" },
        ],
    }),
}
</script>
