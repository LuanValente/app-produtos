import React from 'react';
import { Container } from 'react-bootstrap';
import ProductList from './components/ProductList';

const App = () => {
  return (
    <Container>
      <h1>Gerenciamento de Produtos</h1>
      <ProductList />
    </Container>
  );
};

export default App;
