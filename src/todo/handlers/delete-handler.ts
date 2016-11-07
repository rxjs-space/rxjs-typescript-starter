import { CONST, Action, ChangeFn, State, WithLastAction, statusElem, deletetOne$Fac } from '../_shared';
import { action$$ } from '../index';
import { defaultChangeFn, clearStatusElem } from './_shared';


export const DELETE_ITEM_START_handler = (action: Action): ChangeFn => {
  const itemIdtoDelete = action.payload.itemIdToDelete;
  statusElem.innerHTML = 'deleting item ...';
  deletetOne$Fac(itemIdtoDelete).subscribe((response: any) => {
    if(response.status === 200) {
      action$$.next({
        type: CONST.DELETE_ITEM_COMPLETE,
        payload: {
          itemIdDeleted: itemIdtoDelete
        }
      })
    }
  }, (error: any) => {
    action$$.next({
      type: CONST.DELETE_ITEM_FAIL,
      payload: {
        data: itemIdtoDelete,
        error: error
      }
    })
  })
  return defaultChangeFn(action);
}


export const DELETE_ITEM_COMPLETE_handler = (action: Action): ChangeFn => {
  const itemIdDeleted = action.payload.itemIdDeleted;
  statusElem.innerHTML = 'item deleted.';
  clearStatusElem();
  return (state: State): State => {
    return Object.assign({}, state, <WithLastAction>{
      items: state.items.filter((i) => i.id !== itemIdDeleted),
      lastActionType: action.type,
      lastActionDetail: action
    })
  }
}

export const DELETE_ITEM_FAIL_handler = (action: Action): ChangeFn => {
  statusElem.innerHTML = 'item deletion failed. please try again later.';
  clearStatusElem();
  return defaultChangeFn(action);
}
