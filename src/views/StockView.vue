<script setup>
import { ref, onMounted } from "vue";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";

import stockService from '../service/stock';

const confirm = useConfirm();
const toast = useToast();

const stockMoves = ref([]);
const addStockMoveDialogvisible = ref(false);
const selectedItem = ref(null);

const productId = ref('');
const productName = ref('');
const quantity = ref('');
const type = ref('');

const loadStockMoves = (event) => {
    if (event) {
        console.log(event);
        const rowsPerPage = event.rows;
        const currentPage = event.page;
        console.log(rowsPerPage, currentPage);
        stockService.getStocks(currentPage, rowsPerPage).then(data => stockMoves.value = data);
    } else {
        stockService.getStocks().then(data => stockMoves.value = data);
    }
};

const addStockMove = () => {
    const stockMove = {
        productId: productId.value,
        quantity: quantity.value,
        type: type.value
    };

    console.log('Dados enviados:', stockMove);

    stockService.saveStock(stockMove).then((response) => {
        console.log('Resposta do backend:', response);
        loadStockMoves();
        addStockMoveDialogvisible.value = false;
        clearForm();
        toast.add({ severity: 'success', summary: 'Success', detail: 'Stock move saved successfully', life: 3000 });
    }).catch(error => {
        console.error(error);
        toast.add({ severity: 'error', summary: 'Error', detail: ('An error occurred while saving the stock move', error.response.data.message), life: 3000 });
    });
};

const deleteStock = () => {
    stockService.deleteStock(selectedItem.value.id)
    .then(() => {
        loadStockMoves();
        selectedItem.value = null;
    }).catch(error => {
        console.error(error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'An error occurred while deleting the stock move', life: 3000 });
    });
};

const clearForm = () => {
    productId.value = '';
    productName.value = '';
    quantity.value = '';
    type.value = '';
};

onMounted(() => {
    loadStockMoves();
});

const confirmDelete = (event) => {
    confirm.require({
        target: event.currentTarget,
        message: 'Do you want to delete this stock move?',
        icon: 'pi pi-info-circle',
        rejectProps: {
            label: 'Cancel',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: 'Delete',
            severity: 'danger'
        },
        accept: () => {
            deleteStock();
            toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Stock move deleted', life: 3000 });
        }
    });
};
</script>

<template>
    <main>
        <h2>Stock</h2>
        <p>Stock data will be showed here.</p>
        <Toast />
    <ConfirmDialog></ConfirmDialog>
    <div class="toolbar">
        <Toolbar>
            <template #start>
                <Button icon="pi pi-plus" class="mr-2" severity="secondary" @click="addStockMoveDialogvisible = true" text />
                <Button icon="pi pi-trash" class="mr-2" severity="secondary" :disabled="!selectedItem" @click="confirmDelete($event)" text />
                <Button icon="pi pi-upload" severity="secondary" text />
            </template>
        </Toolbar>
        <DataTable v-model:selection="selectedItem" :value="stockMoves" tableStyle="min-width: 50rem">
            <Column selectionMode="single" headerStyle="width: 3rem"></Column>
            <Column field="id" header="ID"></Column>
            <Column field="productId" header="Product Id"></Column>
            <Column field="productName" header="Name"></Column>
            <Column field="quantity" header="Quantity"></Column>
            <Column field="type" header="Type"></Column>
            <Column field="createdAt" header="Created At"></Column>
        </DataTable>
        <Paginator :rows="5" :totalRecords="120" :rowsPerPageOptions="[5, 10, 20, 30]" @page="loadStockMoves"></Paginator>
        <Dialog v-model:visible="addStockMoveDialogvisible" modal header="New Stock Move" :style="{ width: '35rem' }">
            <span class="form-description">Insert Stock Move Information</span>
            <div class="form-group">
                <label for="productId" class="font-semibold w-32">Product ID</label>
                <InputText id="productId" v-model="productId" class="flex-auto" autocomplete="off" />
            </div>
            <div class="form-group">
                <label for="quantity" class="font-semibold w-32">Quantity</label>
                <InputText id="quantity" v-model="quantity" class="flex-auto" autocomplete="off" />
            </div>
            <div class="form-group">
                <label for="type" class="font-semibold w-32">Type</label>
                <InputText id="type" v-model="type" class="flex-auto" autocomplete="off" />
            </div>
            <div class="form-options">
                <Button type="button" label="Cancel" severity="secondary" @click="addStockMoveDialogvisible = false"></Button>
                <Button type="button" label="Save" @click="addStockMove"></Button>
            </div>
        </Dialog>
    </div>
    </main>
</template>

<style scoped>
main {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
    }
    .toolbar {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .form-description {
        font-size: 1.25rem;
        font-weight: 500;
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 0.5rem 0;
    }
    .form-options {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        padding: 1rem 0;
    }
</style>