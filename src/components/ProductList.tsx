import React, { useEffect, useState } from 'react';
import { Products } from '../types/Product';
import ProductCard from './ProductCard';
import { fetchProducts } from '../api';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { itemsState } from '../recoil/atoms';
import styled from 'styled-components';
import CheckBox from './CheckBox';
import { toggleAllSelector } from '../recoil/selectors';

const ProductListContainer = styled.div`
  margin-top: 3.6rem;
  margin-bottom: 5.2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const CheckBoxContainer = styled.div`
  display: flex;
  gap: 0.8rem;
  align-items: center;
  font-size: 1.2rem;
  font-weight: 500;
  line-height: 1.5rem;
`;

const CartItemListContainer = styled.ul`
  margin: 1rem 0;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

function ProductList() {
  const [items, setItems] = useRecoilState(itemsState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const isAllChecked = useRecoilValue(toggleAllSelector);
  const setAllChecked = useSetRecoilState(toggleAllSelector);

  const handleToggleAll = () => {
    setAllChecked(!isAllChecked);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchProducts();
        setItems(data);
      } catch (error) {
        setError(error as Error);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <ProductListContainer>
      <CheckBoxContainer>
        <CheckBox isChecked={isAllChecked} onClick={handleToggleAll} />
        전체선택
      </CheckBoxContainer>

      <CartItemListContainer>
        {items.map((product: Products) => {
          return <ProductCard key={product.id} product={product} />;
        })}
      </CartItemListContainer>
    </ProductListContainer>
  );
}

export default ProductList;
