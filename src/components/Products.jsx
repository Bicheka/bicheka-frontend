import React, { useEffect, useState } from "react";
import Product from "./Product";
import axios from "axios";
import "../css/Products.scss";
import { API_URL } from "./global/GlobalConsts"

function Products() {

    const [productList, setProductList] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try{
                const response = await axios.get(API_URL+'/product/get_all_products');
                setProductList(response.data);
            } catch (error) {
                console.log(error);
            }
        }
        
        fetchProducts();

    }, []);

    return (
        <div>
            <h1>Products</h1>
            <div className="products">
                {productList.map(product => (
                    <Product 
                        key={product.id} 
                        id={product.id} 
                        name={product.name} 
                        price={product.price} 
                        description={product.description} 
                        imageIds = {product.imageIds}
                    />
                ))}
            </div>
        </div>
    );
}

export default Products;