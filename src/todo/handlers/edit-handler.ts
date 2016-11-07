import { CONST, Action, ChangeFn, State, Item, WithLastAction, statusElem, patchOne$Fac } from '../_shared';
import { action$$ } from '../index';
import { defaultChangeFn, clearStatusElem } from './_shared';

export const EDIT_ITEM_SAVE_START_handler = (action: Action): ChangeFn => {
  const { id, form } = action.payload;
  statusElem.innerHTML = 'updating the item ...'
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
  return defaultChangeFn(action);
}

export const EDIT_ITEM_SAVE_COMPLETE_handler = (action: Action): ChangeFn => {
  statusElem.innerHTML = 'edited item saved.'
  clearStatusElem();
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

export const EDIT_ITEM_SAVE_FAIL_handler = (action: Action): ChangeFn => {
  statusElem.innerHTML = 'saving the edited item failed. please try again later.'
  clearStatusElem();
  return defaultChangeFn(action);
}