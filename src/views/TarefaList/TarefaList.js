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
        listarTarefas();
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

  useEffect(() => {
    listarTarefas();
  }, []);

  return (
    <div className={classes.root}>
      <TarefasToolbar salvar={salvar} />
      <div className={classes.content}>
        <TarefasTable tarefas={tarefas} />
      </div>
    </div>
  );
};

export default TarefaList;
