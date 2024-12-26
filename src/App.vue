
<script setup>
import { ref } from "vue";
import { useRouter } from 'vue-router';

const router = useRouter();

const items = ref([
    {
        label: 'Home',
        icon: 'pi pi-home',
        route: '/'
    },
    {
        label: 'Products',
        icon: 'pi pi-box',
        route: '/products'
    },
    {
        label: 'Stock',
        icon: 'pi pi-chart-bar',
        route: '/stock'
    },
    {
        label: 'Sales',
        icon: 'pi pi-dollar',
        route: '/sales'
    },
    {
        label: 'Orders',
        icon: 'pi pi-shopping-cart',
        route: '/orders'
    }
]);
</script>

<template>
    <div class="container">
        <header>
            <Menubar :model="items">
            <template #start>
                <p>Prime Manager</p>
            </template>
            <template #item="{ item, props }">
                <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
                    <a v-ripple :href="href" v-bind="props.action" @click="navigate">
                        <span :class="item.icon" />
                        <span>{{ item.label }}</span>
                    </a>
                </router-link>
            </template>
            <template #end>
                <div class="flex items-center gap-2">
                    <InputText placeholder="Search" type="text" class="w-32 sm:w-auto" />
                    <Avatar image="./assets/logo.svg" shape="circle" />
                </div>
            </template>
            </Menubar>
        </header>
        <router-view />
        <footer>
            <p>Prime Manager</p>
        </footer>
    </div>
</template>

<style scoped>
header {
    flex-shrink: 0;
}
.container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    min-height: 100vh;
}
main {
    flex: 1;
}
footer {
    flex-shrink: 0;
    background-color: #1976d2;
    color: #ffffff;
    text-align: center;
    padding: 1rem;
}
</style>