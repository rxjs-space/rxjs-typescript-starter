import { CONST, Action, ChangeFn, State, Item, WithLastAction, inputElem, statusElem, postForm$Fac } from '../_shared';
import { action$$ } from '../index';
import { defaultChangeFn, clearStatusElem } from './_shared';

export const ADD_ITEM_START_handler = (action: Action): ChangeFn => {
  const newItemWithoutId = action.payload.newItemWithoutId;
  statusElem.innerHTML = 'adding a new item ...';
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
  return defaultChangeFn(action)
}

export const ADD_ITEM_COMPLETE_handler = (action: Action): ChangeFn => {
  const newItem = action.payload.newItem;
  inputElem.value = ''; // 清空inputElem
  statusElem.innerHTML = 'item added';
  clearStatusElem();
  return (state: State): State => {
    return Object.assign({}, state, <WithLastAction>{
      items: [...state.items, newItem], //将newItem加到items列表里
      lastActionType: action.type,
      lastActionDetail: action,
    })
  }
}

export const ADD_ITEM_FAIL_handler = (action: Action): ChangeFn => {
  statusElem.innerHTML = 'adding item failed. please try again later.';
  clearStatusElem();
  return defaultChangeFn(action);
}