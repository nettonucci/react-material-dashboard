import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { listar, salvar, deletar } from '../../store/tarefasReducer';
//comentario para teste git

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

const TarefaList = props => {
  const classes = useStyles();

  const [tarefas, setTarefas] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [mensagem, setMensagem] = useState('');

  const API_URL = 'https://minhastarefas-api.herokuapp.com/tarefas';

  useEffect(() => {
    props.listar();
  }, []);

  const alterarStatus = id => {
    axios
      .patch(`${API_URL}/${id}`, null, {
        headers: { 'x-tenant-id': localStorage.getItem('email_usuario_logado') }
      })
      .then(response => {
        const lista = [...tarefas];
        lista.forEach(tarefa => {
          if (tarefa.id === id) {
            tarefa.done = true;
          }
        });
        setTarefas(lista);
        setMensagem('Item atualizado com sucesso');
        setOpenDialog(true);
      })
      .catch(erro => {
        setMensagem('Ocorreu um erro', erro);
        setOpenDialog(true);
      });
  };

  return (
    <div className={classes.root}>
      <TarefasToolbar salvar={props.salvar} />
      <div className={classes.content}>
        <TarefasTable
          alterarStatus={alterarStatus}
          deleteAction={props.deletar}
          tarefas={props.tarefas}
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

const mapStateToProps = state => ({
  tarefas: state.tarefas.tarefas
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ listar, salvar, deletar }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TarefaList);
