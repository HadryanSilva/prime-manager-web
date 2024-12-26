<script setup>
import { ref, onMounted } from "vue";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";

import productService from '../service/product';

const confirm = useConfirm();
const toast = useToast();

const products = ref([]);
const addProductDialogvisible = ref(false);
const editProductDialogvisible = ref(false);
const selectedItem = ref(null);

const id = ref('');
const barcode = ref('');
const name = ref('');
const description = ref('');
const brand = ref('');
const stockQuantity = ref(0);
const buyPrice = ref('');
const sellPrice = ref('');
const createdAt = ref('');

const loadProducts = (event) => {
    if (event) {
        console.log(event);
        const rowsPerPage = event.rows;
        const currentPage = event.page;
        console.log(rowsPerPage, currentPage);
        productService.getProducts(currentPage, rowsPerPage).then(data => products.value = data);
    } else {
        productService.getProducts().then(data => products.value = data);
    }
};

const addProduct = () => {
    const product = {
        barcode: barcode.value,
        name: name.value,
        description: description.value,
        brand: brand.value,
        stockQuantity: parseInt(stockQuantity.value),
        buyPrice: parseFloat(buyPrice.value),
        sellPrice: parseFloat(sellPrice.value)
    };

    productService.saveProduct(product).then(() => {
        loadProducts();
        addProductDialogvisible.value = false;
        clearForm();
        toast.add({ severity: 'success', summary: 'Success', detail: 'Product saved successfully', life: 3000 });
    }).catch(error => {
        console.error(error);
        toast.add({ severity: 'error', summary: 'Error', detail: ('An error occurred while saving the product: ', error.response.data.message), life: 3000 });
    });
};

const editProduct = (productData) => {
    console.log(productData);
    selectedItem.value = productData;
    barcode.value = productData.barCode;
    name.value = productData.name;
    description.value = productData.description;
    brand.value = productData.brand;
    buyPrice.value = productData.buyPrice;
    sellPrice.value = productData.sellPrice;
    editProductDialogvisible.value = true;
};

const updateProduct = () => {
    const productToUpdate = {
        ...selectedItem.value,
        name: name.value,
        description: description.value,
        brand: brand.value,
        buyPrice: parseFloat(buyPrice.value),
        sellPrice: parseFloat(sellPrice.value),
    };

    productService.updateProduct(productToUpdate)
    .then(() => {
        loadProducts();
        toast.add({ severity: 'success', summary: 'Success', detail: 'Product updated successfully', life: 3000 });
        editProductDialogvisible.value = false;
    }).catch(error => {
        console.error(error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'An error occurred while updating the product', life: 3000 });
    });
}

const deleteProduct = () => {
    productService.deleteProduct(selectedItem.value.id)
    .then(() => {
        loadProducts();
        selectedItem.value = null;
    }).catch(error => {
        console.error(error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'An error occurred while deleting the product', life: 3000 });
    });
};

const clearForm = () => {
    barcode.value = '';
    name.value = '';
    description.value = '';
    brand.value = '';
    buyPrice.value = '';
    sellPrice.value = '';
};

onMounted(() => {
    loadProducts();
});

const confirmDelete = (event) => {
    confirm.require({
        target: event.currentTarget,
        message: 'Do you want to delete this product?',
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
            deleteProduct();
            toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Product deleted', life: 3000 });
        }
    });
};
</script>

<template>
  <main>
    <Toast />
    <ConfirmDialog></ConfirmDialog>
    <div class="toolbar">
        <Toolbar>
            <template #start>
                <Button icon="pi pi-plus" class="mr-2" severity="secondary" @click="addProductDialogvisible = true" text />
                <Button icon="pi pi-trash" class="mr-2" severity="secondary" :disabled="!selectedItem" @click="confirmDelete($event)" text />
                <Button icon="pi pi-upload" severity="secondary" text />
            </template>
        </Toolbar>
        <DataTable v-model:selection="selectedItem" :value="products" tableStyle="min-width: 50rem">
            <Column selectionMode="single" headerStyle="width: 3rem"></Column>
            <Column field="id" header="ID"></Column>
            <Column field="barcode" header="Barcode"></Column>
            <Column field="name" header="Name"></Column>
            <Column field="description" header="Description"></Column>
            <Column field="brand" header="Brand"></Column>
            <Column field="stockQuantity" header="Quantity"></Column>
            <Column field="buyPrice" header="Buy Price"></Column>
            <Column field="sellPrice" header="Sell Price"></Column>
            <Column field="createdAt" header="Created At"></Column>
            <Column headerStyle="width: 6rem" bodyStyle="text-align: center">
                <template #body="slotProps">
                    <Button icon="pi pi-pencil" class="mr-2" severity="secondary" @click="editProduct(slotProps.data)" />
                </template>
            </Column>
        </DataTable>
        <Paginator :rows="5" :totalRecords="120" :rowsPerPageOptions="[5, 10, 20, 30]" @page="loadProducts"></Paginator>
        <Dialog v-model:visible="addProductDialogvisible" modal header="New Product" :style="{ width: '35rem' }">
            <span class="form-description">Insert product information</span>
            <div class="form-group">
                <label for="barcode" class="font-semibold w-32">Barcode</label>
                <InputText id="barcode" v-model="barcode" class="flex-auto" autocomplete="off" />
            </div>
            <div class="form-group">
                <label for="name" class="font-semibold w-32">name</label>
                <InputText id="name" v-model="name" class="flex-auto" autocomplete="off" />
            </div>
            <div class="form-group">
                <label for="description" class="font-semibold w-32">Description</label>
                <InputText id="description" v-model="description" class="flex-auto" autocomplete="off" />
            </div>
            <div class="form-group">
                <label for="brand" class="font-semibold w-32">Brand</label>
                <InputText id="brand" v-model="brand" class="flex-auto" autocomplete="off" />
            </div>
            <div class="form-group">
                <label for="buyPrice" class="font-semibold w-32">Buy Price</label>
                <InputText id="buyPrice" v-model="buyPrice" class="flex-auto" autocomplete="off" />
            </div>
            <div class="form-group">
                <label for="sellPrice" class="font-semibold w-32">Sell Price</label>
                <InputText id="sellPrice" v-model="sellPrice" class="flex-auto" autocomplete="off" />
            </div>
            <div class="form-options">
                <Button type="button" label="Cancel" severity="secondary" @click="addProductDialogvisible = false"></Button>
                <Button type="button" label="Save" @click="addProduct"></Button>
            </div>
        </Dialog>

        <Dialog v-model:visible="editProductDialogvisible" modal header="New Product" :style="{ width: '35rem' }">
            <span class="form-description">Insert product information</span>
            <div class="form-group">
                <label for="barcode" class="font-semibold w-32">Barcode</label>
                <InputText id="barcode" v-model="barcode" class="flex-auto" autocomplete="off" />
            </div>
            <div class="form-group">
                <label for="name" class="font-semibold w-32">Name</label>
                <InputText id="name" v-model="name" class="flex-auto" autocomplete="off" />
            </div>
            <div class="form-group">
                <label for="description" class="font-semibold w-32">Description</label>
                <InputText id="description" v-model="description" class="flex-auto" autocomplete="off" />
            </div>
            <div class="form-group">
                <label for="brand" class="font-semibold w-32">Brand</label>
                <InputText id="brand" v-model="brand" class="flex-auto" autocomplete="off" />
            </div>
            <div class="form-group">
                <label for="buyPrice" class="font-semibold w-32">Buy Price</label>
                <InputText id="buyPrice" v-model="buyPrice" class="flex-auto" autocomplete="off" />
            </div>
            <div class="form-group">
                <label for="sellPrice" class="font-semibold w-32">Sell Price</label>
                <InputText id="sellPrice" v-model="sellPrice" class="flex-auto" autocomplete="off" />
            </div>
            <div class="form-options">
                <Button type="button" label="Cancel" severity="secondary" @click="editProductDialogvisible = false"></Button>
                <Button type="button" label="Save" @click="updateProduct"></Button>
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