import axios from 'axios';

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
  tarefas: []
};

export const tarefaReducer = (state = ESTADO_INICIAL, action) => {
  switch (action.type) {
    case ACTIONS.LISTAR:
      return { ...state, tarefas: action.tarefas };
    case ACTIONS.ADD:
      return { ...state, tarefas: [...state.tarefas, action.tarefa] };
    case ACTIONS.REMOVER:
      const id = action.id;
      const tarefas = state.tarefas.filter(tarefa => tarefa.id !== id);
      return { ...state, tarefas: tarefas };
    case ACTIONS.UPDATE_STATUS:
      const lista = [...state.tarefas];
      lista.forEach(tarefa => {
        if (tarefa.id === action.id) {
          tarefa.done = true;
        }
      });
      return { ...state, tarefas: lista };
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
        dispatch({
          type: ACTIONS.ADD,
          tarefa: response.data
        });
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
        dispatch({
          type: ACTIONS.REMOVER,
          id: id
        });
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
        dispatch({
          type: ACTIONS.UPDATE_STATUS,
          id: id
        });
      });
  };
}
