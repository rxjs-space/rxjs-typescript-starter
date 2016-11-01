import { Action, ChangeFn, DELETE_ITEM_START, DELETE_ITEM_COMPLETE, DELETE_ITEM_FAIL, State } from '../_shared';
import { statusElem } from '../_dom-elements';
import { action$$ } from '../index';
import { deletetOne$Fac } from '../_http'

const defaultChangeFn = (lastAction: Action) => {
  return (state: State) => Object.assign({}, state, {
    lastAction: lastAction
  })
}
const clearStatusElem = () => {
  setTimeout(() => {statusElem.innerHTML = ''}, 1000)
}

export const DELETE_ITEM_START_handler = (action: Action): ChangeFn => {
  const itemIdtoDelete = action.payload;
  statusElem.innerHTML = 'deleting item ...';
  deletetOne$Fac(itemIdtoDelete).subscribe((response: any) => {
    if(response.status === 200) {
      action$$.next({
        type: DELETE_ITEM_COMPLETE,
        payload: itemIdtoDelete
      })
    }
  }, (error: any) => {
    action$$.next({
      type: DELETE_ITEM_FAIL,
      payload: {
        data: itemIdtoDelete,
        error: error
      }
    })
  })
  return defaultChangeFn(action);
}


export const DELETE_ITEM_COMPLETE_handler = (action: Action): ChangeFn => {
  const itemIdtoDelete = action.payload;
  statusElem.innerHTML = 'item deleted.';
  clearStatusElem();
  return (state: State): State => {
    return Object.assign({}, state, {
      items: state.items.filter((i) => i.id !== itemIdtoDelete),
      lastAction: action
    })
  }
}

export const DELETE_ITEM_FAIL_handler = (action: Action): ChangeFn => {
  statusElem.innerHTML = 'item deletion failed. please try again later.';
  clearStatusElem();
  return defaultChangeFn(action);
}
