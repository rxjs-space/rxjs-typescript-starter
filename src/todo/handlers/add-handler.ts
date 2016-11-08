import { CONST, Action, ChangeFn, State, Item, WithLastAction, inputElem, statusElem, addNewButtonElem, postForm$Fac } from '../_shared';
import { action$$ } from '../index';
import { defaultChangeFnFac, clearStatusElem } from './_shared';

/*
 * ADD_ITEM_START_handler part
 */

const ADD_ITEM_START_handler_dom = () => {
  addNewButtonElem.disabled = true;
  statusElem.innerHTML = 'adding a new item ...';
}

const ADD_ITEM_START_handler_async = (newItemWithoutId: Item) => {
  postForm$Fac(newItemWithoutId).subscribe((response: any) => {
    const newItemWithId = response.response;
    action$$.next({
      type: CONST.ADD_ITEM_COMPLETE,
      payload: {
        newItem: newItemWithId
      }
    })
  }, (error) => {
    action$$.next({
      type: CONST.ADD_ITEM_FAIL,
      payload: {
        data: newItemWithoutId,
        error
      }
    })
  })
}

export const ADD_ITEM_START_handler = (action: Action): ChangeFn => {
  ADD_ITEM_START_handler_dom();
  ADD_ITEM_START_handler_async(action.payload.newItemWithoutId)
  return defaultChangeFnFac(action)
}

/*
 * ADD_ITEM_COMPLETE_handler part
 */

const ADD_ITEM_COMPLETE_handler_dom = () => {
  inputElem.value = ''; // 清空inputElem
  statusElem.innerHTML = 'item added';
  clearStatusElem();
  addNewButtonElem.disabled = false;
}

const ADD_ITEM_COMPLETE_handler_changFnFac = (action: Action): ChangeFn => {
  const newItem = action.payload.newItem;
  return (state: State): State => {
    return Object.assign({}, state, <WithLastAction>{
      items: [...state.items, newItem], //将newItem加到items列表里
      lastActionType: action.type,
      lastActionDetail: action,
    })
  }
}

export const ADD_ITEM_COMPLETE_handler = (action: Action): ChangeFn => {
  ADD_ITEM_COMPLETE_handler_dom();
  return ADD_ITEM_COMPLETE_handler_changFnFac(action)
}


/*
 * ADD_ITEM_FAIL_handler part
 */

const ADD_ITEM_FAIL_handler_dom = () => {
  statusElem.innerHTML = 'adding item failed. please try again later.';
  clearStatusElem();
  addNewButtonElem.disabled = false;
}

export const ADD_ITEM_FAIL_handler = (action: Action): ChangeFn => {
  ADD_ITEM_FAIL_handler_dom();
  return defaultChangeFnFac(action);
}