import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar } from '@mui/material';
import Alert from '@mui/material/Alert';
import ProductForm from './ProductForm';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [success, setSuccess] = useState(false);
  const [confirmEditProduct, setConfirmEditProduct] = useState(null);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/products`);
      setProducts(response.data);
    } catch (error) {
      setError('Erro ao buscar produtos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/products/${id}`);
      fetchProducts();
      setSuccess(true);
    } catch (error) {
      setError('Erro ao deletar produto');
    }
  };

  const handleConfirmEdit = (product) => {
    setEditProduct(product);
    setConfirmEditProduct(null);
  };

  const handleEdit = (product) => {
    setConfirmEditProduct(product);
  };

  return (
    <div>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      <ProductForm onSave={fetchProducts} editProduct={editProduct} setEditProduct={setEditProduct} />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell>Preço</TableCell>
              <TableCell>Data de Criação</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.nome}</TableCell>
                <TableCell>{product.descricao}</TableCell>
                <TableCell>{product.preco}</TableCell>
                <TableCell>{new Date(product.data_criacao).toLocaleString()}</TableCell>
                <TableCell>
                  <Button variant="contained" color="warning" onClick={() => handleEdit(product)}>Editar</Button>
                  {' '}
                  <Button variant="contained" color="error" onClick={() => setDeleteProduct(product)}>Deletar</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {deleteProduct && (
        <Dialog open={Boolean(deleteProduct)} onClose={() => setDeleteProduct(null)}>
          <DialogTitle>Tem certeza que deseja deletar?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Você realmente deseja deletar o produto {deleteProduct.nome}?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteProduct(null)} color="primary">Cancelar</Button>
            <Button onClick={() => { handleDelete(deleteProduct.id); setDeleteProduct(null); }} color="primary" autoFocus>Deletar</Button>
          </DialogActions>
        </Dialog>
      )}
      {confirmEditProduct && (
        <Dialog open={Boolean(confirmEditProduct)} onClose={() => setConfirmEditProduct(null)}>
          <DialogTitle>Tem certeza que deseja editar?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Você realmente deseja editar o produto {confirmEditProduct.nome}?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmEditProduct(null)} color="primary">Cancelar</Button>
            <Button onClick={() => handleConfirmEdit(confirmEditProduct)} color="primary" autoFocus>Editar</Button>
          </DialogActions>
        </Dialog>
      )}
      <Snackbar open={success} autoHideDuration={6000} onClose={() => setSuccess(false)}>
        <Alert onClose={() => setSuccess(false)} severity="success">Operação realizada com sucesso!</Alert>
      </Snackbar>
      <Snackbar open={error} autoHideDuration={6000} onClose={() => setError(false)}>
        <Alert onClose={() => setError(false)} severity="error">Erro ao realizar operação!</Alert>
      </Snackbar>
    </div>
  );
};

export default ProductList;
