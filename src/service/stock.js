import axios from "axios";

const BASE_URL = "http://localhost:8080/api/v1/stock";

const getStocks = async (page, size) => {
  const response = await axios.get(BASE_URL, {
    params: {
      page: page,
      size: size,
    },
  });
  return response.data;
};

const saveStock = async (stock) => {
  const response = await axios.post(BASE_URL, stock);
  return response.data;
}

const deleteStock = async (id) => {
  const response = await axios.delete(BASE_URL + "/" + id);
  return response.data;
}

export default {
    getStocks,
    saveStock,
    deleteStock
 };