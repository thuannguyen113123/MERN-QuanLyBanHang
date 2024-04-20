import React, { useEffect, useState } from "react";
import axios from "axios";
import ItemProduct from "./ItemProduct";

const NewProduct = () => {
  const [recentProducts, setRecentProducts] = useState(null);
  useEffect(() => {
    try {
      const getRecentProdcuts = async () => {
        const res = await axios.get(`/api/product/get-product?limit=4`);
        const data = await res.data;
        if (data.success) {
          setRecentProducts(data.products);
        }
      };
      getRecentProdcuts();
    } catch (error) {
      console.log(error.message);
    }
  }, []);
  return (
    <div className="max-w-6xl mx-auto py-12 xl:py-28 xl:w-[88%]">
      <h3 className="text-center font-bold">Sản phẩm mới</h3>
      <hr className="h-[3px] md:w-1/2 mx-auto bg-gradient-to-l from-transparent via-black to-transparent mb-16" />
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {recentProducts &&
          recentProducts.map((product) => (
            <ItemProduct product={product} key={product._id} id={product._id} />
          ))}
      </div>
    </div>
  );
};

export default NewProduct;
