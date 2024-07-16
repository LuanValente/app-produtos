import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Box, CircularProgress, Snackbar } from '@mui/material';
import Alert from '@mui/material/Alert';

const ProductForm = ({ onSave, editProduct, setEditProduct }) => {
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    preco: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (editProduct) {
      setFormData(editProduct);
    }
  }, [editProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editProduct) {
        await axios.put(`${process.env.REACT_APP_BACKEND_URL}/products/${editProduct.id}`, formData);
        setEditProduct(null);
      } else {
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/products`, formData);
      }
      setFormData({ nome: '', descricao: '', preco: '' });
      onSave();
      setSuccess(true);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <TextField
        label="Nome do produto"
        name="nome"
        value={formData.nome}
        onChange={handleChange}
        required
        fullWidth
        margin="normal"
      />
      <TextField
        label="Descrição"
        name="descricao"
        value={formData.descricao}
        onChange={handleChange}
        fullWidth
        multiline
        rows={4}
        margin="normal"
      />
      <TextField
        label="Preço"
        name="preco"
        type="number"
        value={formData.preco}
        onChange={handleChange}
        required
        fullWidth
        margin="normal"
      />
      <Box sx={{ position: 'relative' }}>
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          {editProduct ? 'Atualizar' : 'Adicionar'} Produto
        </Button>
        {loading && <CircularProgress size={24} sx={{ position: 'absolute', top: '50%', left: '50%', marginTop: '-12px', marginLeft: '-12px' }} />}
      </Box>
      <Snackbar open={success} autoHideDuration={6000} onClose={() => setSuccess(false)}>
        <Alert onClose={() => setSuccess(false)} severity="success">Produto salvo com sucesso!</Alert>
      </Snackbar>
      <Snackbar open={error} autoHideDuration={6000} onClose={() => setError(false)}>
        <Alert onClose={() => setError(false)} severity="error">Erro ao salvar produto!</Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductForm;
