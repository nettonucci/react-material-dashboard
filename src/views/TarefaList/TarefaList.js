import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button
} from '@material-ui/core';

import axios from 'axios';

import { TarefasToolbar, TarefasTable } from './components';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  }
}));

const TarefaList = () => {
  const classes = useStyles();

  const [tarefas, setTarefas] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [mensagem, setMensagem] = useState('');

  const API_URL = 'https://minhastarefas-api.herokuapp.com/tarefas';
  const headers = { 'x-tenant-id': 'fulano@email.com' };

  const salvar = tarefa => {
    axios
      .post(API_URL, tarefa, {
        headers: headers
      })
      .then(response => {
        setMensagem("Item adicionado com sucesso")
        setOpenDialog(true)
        const novaTarefa = response.data;
        setTarefas([...tarefas, novaTarefa]);
      })
      .catch(erro => {
        setMensagem("Ocorreu um erro")
        setOpenDialog(true)
      });
  };

  const listarTarefas = () => {
    axios
      .get(API_URL, {
        headers: headers
      })
      .then(response => {
        const listaDeTarefas = response.data;
        console.log(listaDeTarefas);
        setTarefas(listaDeTarefas);
      })
      .catch(erro => {
        setMensagem("Ocorreu um erro", erro)
        setOpenDialog(true)
      });
  };

  const alterarStatus = id => {
    axios
      .patch(`${API_URL}/${id}`, null, { headers: headers })
      .then(response => {
        const lista = [...tarefas];
        lista.forEach(tarefa => {
          if (tarefa.id === id) {
            tarefa.done = true;
          }
        });
        setTarefas(lista);
        setMensagem("Item atualizado com sucesso")
        setOpenDialog(true)
      })
      .catch(erro => {
        setMensagem("Ocorreu um erro", erro)
        setOpenDialog(true)
      });
  };

  const deletar = id => {
    axios
      .delete(`${API_URL}/${id}`, { headers: headers })
      .then(response => {
        const lista = tarefas.filter(tarefa => tarefa.id !== id);
        setTarefas(lista);
        setMensagem("Item deletado com sucesso")
        setOpenDialog(true)
      })
      .catch(erro => {
        setMensagem("Ocorreu um erro", erro)
        setOpenDialog(true)
      });
  };

  useEffect(() => {
    listarTarefas();
  }, []);

  return (
    <div className={classes.root}>
      <TarefasToolbar salvar={salvar} />
      <div className={classes.content}>
        <TarefasTable
          alterarStatus={alterarStatus}
          deleteAction={deletar}
          tarefas={tarefas}
        />
      </div>
      <Dialog
        onClose={e => setOpenDialog(false)}
        open={openDialog}
      >
        <DialogTitle>Atenção</DialogTitle>
        <DialogContent>{mensagem}</DialogContent>
        <DialogActions>
          <Button onClick={e => setOpenDialog(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TarefaList;
