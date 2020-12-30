/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable no-case-declarations */
import axios from 'axios';
import { mostrarMensagem } from './mensagensReducer';

const api = axios.create({
  baseURL: 'https://minhastarefas-api.herokuapp.com'
});

const ACTIONS = {
  LISTAR: 'TAREFAS_LISTAR',
  ADD: 'TAREFAS_ADD',
  REMOVER: 'TAREFAS_REMOVE',
  UPDATE_STATUS: 'TAREFAS_UPDATE_STATUS'
};

const ESTADO_INICIAL = {
  tarefas: [],
  quantidade: 0
};

export const tarefaReducer = (state = ESTADO_INICIAL, action) => {
  switch (action.type) {
    case ACTIONS.LISTAR:
      return {
        ...state,
        tarefas: action.tarefas,
        quantidade: action.tarefas.length
      };
    case ACTIONS.ADD:
      const lista = [...state.tarefas, action.tarefa];
      return { ...state, tarefas: lista, quantidade: lista.length };
    case ACTIONS.REMOVER:
      const id = action.id;
      const tarefas = state.tarefas.filter(tarefa => tarefa.id !== id);
      return { ...state, tarefas: tarefas, quantidade: tarefas.length };
    case ACTIONS.UPDATE_STATUS:
      const listaAtualizada = [...state.tarefas];
      listaAtualizada.forEach(tarefa => {
        if (tarefa.id === action.id) {
          tarefa.done = true;
        }
      });
      return { ...state, tarefas: listaAtualizada };
    default:
      return state;
  }
};

export function listar() {
  return dispatch => {
    api
      .get('/tarefas', {
        headers: { 'x-tenant-id': localStorage.getItem('email_usuario_logado') }
      })
      .then(response => {
        console.log(response.data);
        dispatch({
          type: ACTIONS.LISTAR,
          tarefas: response.data
        });
      });
  };
}

export function salvar(terafa) {
  return dispatch => {
    api
      .post('/tarefas', terafa, {
        headers: { 'x-tenant-id': localStorage.getItem('email_usuario_logado') }
      })
      .then(response => {
        dispatch([
          {
            type: ACTIONS.ADD,
            tarefa: response.data
          },
          mostrarMensagem('Tarefa salva com sucesso!')
        ]);
      });
  };
}

export function deletar(id) {
  return dispatch => {
    api
      .delete(`/tarefas/${id}`, {
        headers: { 'x-tenant-id': localStorage.getItem('email_usuario_logado') }
      })
      .then(response => {
        dispatch([
          {
            type: ACTIONS.REMOVER,
            id: id
          },
          mostrarMensagem('Tarefa deletada com sucesso!')
        ]);
      });
  };
}

export function alterarStatus(id) {
  return dispatch => {
    api
      .patch(`tarefas/${id}`, null, {
        headers: { 'x-tenant-id': localStorage.getItem('email_usuario_logado') }
      })
      .then(response => {
        dispatch([
          {
            type: ACTIONS.UPDATE_STATUS,
            id: id
          },
          mostrarMensagem('Tarefa atualizada com sucesso!')
        ]);
      });
  };
}
