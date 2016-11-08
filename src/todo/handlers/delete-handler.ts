import { CONST, Action, ChangeFn, State, WithLastAction, statusElem, deletetOne$Fac } from '../_shared';
import { action$$ } from '../index';
import { defaultChangeFnFac, clearStatusElem } from './_shared';

/*
 * DELETE_ITEM_START_handler part
 */

const buttonXs = Array.prototype.slice.call(document.querySelectorAll('button'), 0)
  .filter((button: HTMLButtonElement) => button.innerHTML === 'X')

const DELETE_ITEM_START_handler_dom = () => {
  const buttonXs = Array.prototype.slice.call(document.querySelectorAll('button'), 0)
    .filter((button: HTMLButtonElement) => button.innerHTML === 'X')
  buttonXs.forEach((button: HTMLButtonElement) =>button.disabled = true);
  statusElem.innerHTML = 'deleting the item ...';
}

const DELETE_ITEM_START_handler_async = (itemIdtoDelete: any) => {
  deletetOne$Fac(itemIdtoDelete).subscribe((response: any) => {
    action$$.next({
      type: CONST.DELETE_ITEM_COMPLETE,
      payload: {
        itemIdDeleted: itemIdtoDelete
      }
    })
  }, (error: any) => {
    action$$.next({
      type: CONST.DELETE_ITEM_FAIL,
      payload: {
        data: itemIdtoDelete,
        error: error
      }
    })
  })
}
export const DELETE_ITEM_START_handler = (action: Action): ChangeFn => {
  DELETE_ITEM_START_handler_dom();
  DELETE_ITEM_START_handler_async(action.payload.itemIdToDelete);
  return defaultChangeFnFac(action);
}

/*
 * DELETE_ITEM_COMPLETE_handler part
 */

const DELETE_ITEM_COMPLETE_handler_dom = () => {
  statusElem.innerHTML = 'item deleted.';
  clearStatusElem();
  const buttonXs = Array.prototype.slice.call(document.querySelectorAll('button'), 0)
    .filter((button: HTMLButtonElement) => button.innerHTML === 'X')
  buttonXs.forEach((button: HTMLButtonElement) =>button.disabled = false);
}

const DELETE_ITEM_COMPLETE_handler_changeFnFac = (action: Action) => {
  return (state: State): State => {
    return Object.assign({}, state, <WithLastAction>{
      items: state.items.filter((i) => i.id !== action.payload.itemIdDeleted),
      lastActionType: action.type,
      lastActionDetail: action
    })
  }
}
export const DELETE_ITEM_COMPLETE_handler = (action: Action): ChangeFn => {
  DELETE_ITEM_COMPLETE_handler_dom();
  return DELETE_ITEM_COMPLETE_handler_changeFnFac(action);
}

/*
 * DELETE_ITEM_FAIL_handler part
 */

const DELETE_ITEM_FAIL_handler_dom = () => {
  statusElem.innerHTML = 'item deletion failed. please try again later.';
  clearStatusElem();
  const buttonXs = Array.prototype.slice.call(document.querySelectorAll('button'), 0)
    .filter((button: HTMLButtonElement) => button.innerHTML === 'X')
  buttonXs.forEach((button: HTMLButtonElement) =>button.disabled = false);
}

export const DELETE_ITEM_FAIL_handler = (action: Action): ChangeFn => {
  DELETE_ITEM_FAIL_handler_dom();
  return defaultChangeFnFac(action);
}
