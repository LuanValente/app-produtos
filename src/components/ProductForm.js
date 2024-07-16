import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Box, CircularProgress, Snackbar } from '@mui/material';
import Alert from '@mui/material/Alert';

const ProductForm = ({ onSave, editProduct, setEditProduct }) => {
  // Estado para armazenar os dados do formulário
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    preco: ''
  });
  // Estado para indicar o carregamento
  const [loading, setLoading] = useState(false);
  // Estado para indicar sucesso na operação
  const [success, setSuccess] = useState(false);
  // Estado para indicar erro na operação
  const [error, setError] = useState(false);

  // Efeito para preencher o formulário com os dados do produto a ser editado
  useEffect(() => {
    if (editProduct) {
      setFormData(editProduct);
    }
  }, [editProduct]);

  // Função para lidar com mudanças nos campos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editProduct) {
        await axios.put(`http://localhost:3001/products/${editProduct.id}`, formData);
        setEditProduct(null);
      } else {
        await axios.post('http://localhost:3001/products', formData);
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
