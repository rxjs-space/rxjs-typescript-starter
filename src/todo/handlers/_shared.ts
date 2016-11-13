import { Action, State, WithLastAction, statusElem } from '../_shared';

export const defaultChangeFnFac = (action: Action) => {
  return (state: State) => Object.assign({}, state, <WithLastAction>{
    lastActionType: action.type, // show the lastActionType one the first level so we can see it easily on console
    lastActionDetail: action
  })
}

export const clearStatusElem = () => {
  setTimeout(() => {statusElem.innerHTML = ''}, 1000)
}
