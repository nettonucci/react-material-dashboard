import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';

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

  const API_URL = 'https://minhastarefas-api.herokuapp.com/tarefas';
  const headers = { 'x-tenant-id': 'fulano@email.com' };

  const salvar = tarefa => {
    axios
      .post(API_URL, tarefa, {
        headers: headers
      })
      .then(response => {
        console.log(response.data);
        const novaTarefa = response.data;
        setTarefas([...tarefas, novaTarefa]);
      })
      .catch(erro => {
        console.log(erro);
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
        console.log(erro);
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
      })
      .catch(erro => {
        console.log(erro);
      });
  };

  const deletar = id => {
    axios
      .delete(`${API_URL}/${id}`, { headers: headers })
      .then(response => {
        const lista = tarefas.filter(tarefa => tarefa.id !== id);
        setTarefas(lista);
      })
      .catch(erro => {
        console.log(erro);
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
    </div>
  );
};

export default TarefaList;
