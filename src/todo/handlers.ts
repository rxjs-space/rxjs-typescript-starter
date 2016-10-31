import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take';

import { stateInit, Action, State, ChangeFn, 
  ADD_ITEM_START, ADD_ITEM_COMPLETE, ADD_ITEM_FAIL, 
  DELETE_ITEM_START, DELETE_ITEM_COMPLETE, DELETE_ITEM_FAIL,
  EDIT_ITEM_SAVE_START, EDIT_ITEM_SAVE_COMPLETE, EDIT_ITEM_SAVE_FAIL, 
  Item, WIP, ActionType } from './_shared';
import { listElem, inputElem, statusElem } from './_dom-elements';
import { action$$ } from './index';

const defaultChangeFn = (lastAction: Action) => {
  return (state: State) => Object.assign({}, state, {
    lastAction: lastAction
  })
}

const clearStatusElem = () => {
  setTimeout(() => {statusElem.innerHTML = ''}, 1000)
}

const default_handler = (action: Action): ChangeFn => {
  return defaultChangeFn(action);
}

const fakeHttp$Fac = (payload: any) => {
  return Observable.create((observer: any) => {
    setTimeout(() => {
      observer.next(1);
    }, 500)
  })
}

const ADD_ITEM_START_handler = (action: Action): ChangeFn => {
  const newItem: Item = Object.assign({}, action.payload, {
    id: Date.now()
  }); // 以Date.now()作为新项目的id
  statusElem.innerHTML = 'adding a new item ...';
  fakeHttp$Fac(newItem).take(1).subscribe((v: any) => {
    action$$.next({
      type: ADD_ITEM_COMPLETE,
      payload: newItem
    })
  }, (error: any) => {
    action$$.next({
      type: ADD_ITEM_FAIL,
      payload: {
        data: newItem,
        error: error
      }
    })
  })
  return defaultChangeFn(action)
}

const ADD_ITEM_COMPLETE_handler = (action: Action): ChangeFn => {
  const newItem = action.payload;
  inputElem.value = ''; // 清空inputElem
  statusElem.innerHTML = 'item added';
  clearStatusElem();
  return (state: State): State => {
    return Object.assign({}, state, {
      items: [...state.items, newItem], //将newItem加到items列表里
      lastAction: action,
    })
  }
}

const ADD_ITEM_FAIL_handler = (action: Action): ChangeFn => {
  statusElem.innerHTML = 'adding item failed. please try again later.';
  clearStatusElem();
  return defaultChangeFn(action);
}


const DELETE_ITEM_START_handler = (action: Action): ChangeFn => {
  const itemIdtoDelete = action.payload;
  statusElem.innerHTML = 'deleting item ...';
  fakeHttp$Fac(itemIdtoDelete).take(1).subscribe((v: any) => {
    action$$.next({
      type: DELETE_ITEM_COMPLETE,
      payload: action.payload
    })
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



const DELETE_ITEM_COMPLETE_handler = (action: Action): ChangeFn => {
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

const DELETE_ITEM_FAIL_handler = (action: Action): ChangeFn => {
  statusElem.innerHTML = 'item deletion failed. please try again later.';
  clearStatusElem();
  return defaultChangeFn(action);
}

const EDIT_ITEM_SAVE_START_handler = (action: Action): ChangeFn => {
  const itemIdandNewContent = action.payload
  statusElem.innerHTML = 'saving the edited item ...'
  fakeHttp$Fac(itemIdandNewContent).subscribe((v: any) => {
    action$$.next({
      type: EDIT_ITEM_SAVE_COMPLETE,
      payload: itemIdandNewContent
    })
  }, (error: any) => {
    action$$.next({
      type: EDIT_ITEM_SAVE_FAIL,
      payload: {
        data: itemIdandNewContent,
        error: error
      }
    })
  })
  return defaultChangeFn(action);
}

const EDIT_ITEM_SAVE_COMPLETE_handler = (action: Action): ChangeFn => {
  statusElem.innerHTML = 'edited item saved.'
  clearStatusElem();
  const {editedItemId, newTitle} = action.payload;
  // return defaultChangeFn(action);
  return (state: State) => {
    const oldVer = state.items.filter(item => item.id === editedItemId)[0]
    const newVer = Object.assign({}, oldVer, {
      title: newTitle
    })
    const itemIndex = state.items.indexOf(oldVer);
    const itemsBefore: Item[] = state.items.slice(0, itemIndex);
    const itemsAfter: Item[] = state.items.slice(itemIndex + 1, state.items.length);
    const newItems: Item[] = [...itemsBefore, newVer, ...itemsAfter]
    return Object.assign({}, state, {
      items: newItems,
      lastAction: action
    })
  }
}

const EDIT_ITEM_SAVE_FAIL_handler = (action: Action): ChangeFn => {
  statusElem.innerHTML = 'saving the edited item failed. please try again later.'
  clearStatusElem();
  return defaultChangeFn(action);
}

export const handlers = (action: Action): ChangeFn => {
  switch (action.type) {
    case ADD_ITEM_START: return ADD_ITEM_START_handler(action);
    case ADD_ITEM_COMPLETE: return ADD_ITEM_COMPLETE_handler(action);
    case ADD_ITEM_FAIL: return ADD_ITEM_FAIL_handler(action);
    case DELETE_ITEM_START: return DELETE_ITEM_START_handler(action);
    case DELETE_ITEM_COMPLETE: return DELETE_ITEM_COMPLETE_handler(action);
    case DELETE_ITEM_FAIL: return DELETE_ITEM_FAIL_handler(action);
    case EDIT_ITEM_SAVE_START: return EDIT_ITEM_SAVE_START_handler(action);
    case EDIT_ITEM_SAVE_COMPLETE: return EDIT_ITEM_SAVE_COMPLETE_handler(action);
    case EDIT_ITEM_SAVE_FAIL: return EDIT_ITEM_SAVE_FAIL_handler(action);
    default: return default_handler(action);
  }
}