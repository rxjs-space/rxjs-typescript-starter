import { CONST, Action, ChangeFn, State, Item, WithLastAction, statusElem, patchOne$Fac } from '../_shared';
import { action$$ } from '../index';
import { defaultChangeFnFac, clearStatusElem } from './_shared';

/*
 * EDIT_ITEM_SAVE_START_handler part
 */

const EDIT_ITEM_SAVE_START_handler_dom = () => {
  statusElem.innerHTML = 'updating the item ...';
}

const EDIT_ITEM_SAVE_START_handler_ajax = (id: any, form: any) => {
  patchOne$Fac(id, form)
    .subscribe((response: any) => {
      action$$.next({
        type: CONST.EDIT_ITEM_SAVE_COMPLETE,
        payload: {
          id,
          item: response.response
        }
      })
    }, (error: any) => {
      action$$.next({
        type: CONST.EDIT_ITEM_SAVE_FAIL,
        payload: {
          data: {
            id, form
          },
          error: error
        }
      })
    })
}

const EDIT_ITEM_SAVE_START_handler = (action: Action): ChangeFn => {
  EDIT_ITEM_SAVE_START_handler_dom();
  EDIT_ITEM_SAVE_START_handler_ajax(action.payload.id, action.payload.form);
  return defaultChangeFnFac(action);
}

/*
 * EDIT_ITEM_SAVE_COMPLETE_handler part
 */

const EDIT_ITEM_SAVE_COMPLETE_handler_dom = () => {
  statusElem.innerHTML = 'item updated.'
  clearStatusElem();
}

const EDIT_ITEM_SAVE_COMPLETE_handler_changeFnFac = (action: Action): ChangeFn => {
  const { id, item } = action.payload;
  return (state: State) => {
    const newVer = item;
    const oldVer = state.items.filter(item => item.id === id)[0]
    const itemIndex = state.items.indexOf(oldVer);
    const itemsBefore: Item[] = state.items.slice(0, itemIndex);
    const itemsAfter: Item[] = state.items.slice(itemIndex + 1, state.items.length);
    const newItems: Item[] = [...itemsBefore, newVer, ...itemsAfter]
    return Object.assign({}, state, <WithLastAction>{
      items: newItems,
      lastActionType: action.type,
      lastActionDetail: action
    })
  }
}

const EDIT_ITEM_SAVE_COMPLETE_handler = (action: Action): ChangeFn => {
  EDIT_ITEM_SAVE_COMPLETE_handler_dom();
  return EDIT_ITEM_SAVE_COMPLETE_handler_changeFnFac(action);
}

/*
 * EDIT_ITEM_SAVE_FAIL_handler part
 */

const EDIT_ITEM_SAVE_FAIL_handler_dom = () => {
  statusElem.innerHTML = 'saving the edited item failed. please try again later.'
  clearStatusElem();
}

const EDIT_ITEM_SAVE_FAIL_handler = (action: Action): ChangeFn => {
  EDIT_ITEM_SAVE_FAIL_handler_dom();
  return defaultChangeFnFac(action);
}


export const EDIT_ITEM_SAVE_handlers = (action: Action): ChangeFn => {
  switch (action.type) {
    case CONST.EDIT_ITEM_SAVE_START: return EDIT_ITEM_SAVE_START_handler(action);
    case CONST.EDIT_ITEM_SAVE_COMPLETE: return EDIT_ITEM_SAVE_COMPLETE_handler(action);
    case CONST.EDIT_ITEM_SAVE_FAIL: return EDIT_ITEM_SAVE_FAIL_handler(action);
  }
}