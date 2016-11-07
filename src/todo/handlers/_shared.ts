import { Action, State, WithLastAction, statusElem } from '../_shared';

export const defaultChangeFn = (action: Action) => {
  return (state: State) => Object.assign({}, state, <WithLastAction>{
    lastActionType: action.type,
    lastActionDetail: action
  })
}

export const clearStatusElem = () => {
  setTimeout(() => {statusElem.innerHTML = ''}, 1000)
}

export const listMap = new Map(); // maps listElem to the index of the item in the state.items
