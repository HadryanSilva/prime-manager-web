import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/v1/products';

const getProducts = async (page, size) => {
    const response = (await axios.get(BASE_URL, {
        params: {
            page: page,
            size: size
        }
    }))
    return response.data;
};

const saveProduct = async (product) => {
    const response = (await axios.post(BASE_URL, product));
    return response.data;
};

const updateProduct = async (product) => {
    const response = (await axios.put(BASE_URL + '/' + product.id, product));
    return response.data;
}

const deleteProduct = async (id) => {
    const response = (await axios.delete(BASE_URL + id));
    return response.data;
};

export default {
    getProducts,
    saveProduct,
    updateProduct,
    deleteProduct
};