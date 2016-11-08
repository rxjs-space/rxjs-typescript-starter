import { CONST, Action, ChangeFn, State, Item, WithLastAction, statusElem, getAll$Fac } from '../_shared';
import { action$$ } from '../index';
import { defaultChangeFnFac, clearStatusElem } from './_shared';


/**
 * GET_ALL_START_handler
 */
const GET_ALL_START_handler_dom = () => {
  statusElem.innerHTML = 'fetching data from server ...';
}
const GET_ALL_START_handler_ajax = () => {
  getAll$Fac().subscribe((response: any) => {
    const list: Item[] = response.response
    action$$.next({
      type: CONST.GET_ALL_COMPLETE,
      payload: {list}
    })
  }, (error) => {
    action$$.next({
      type: CONST.GET_ALL_FAIL,
      payload: {error}
    })
  })
}

export const GET_ALL_START_handler = (action: Action): ChangeFn => {
  GET_ALL_START_handler_dom();
  GET_ALL_START_handler_ajax();
  return defaultChangeFnFac(action)
}

/*
 * GET_ALL_COMPLETE_handler part
 */

const GET_ALL_COMPLETE_handler_dom = () => {
  statusElem.innerHTML = 'data received successfully.';
  clearStatusElem();
}
const GET_ALL_COMPLETE_handler_changeFn = (action: Action): ChangeFn => {
  return (state: State): State => Object.assign({}, state, <WithLastAction>{
    items: action.payload.list,
    lastActionType: action.type,
    lastActionDetail: action
  })
}
export const GET_ALL_COMPLETE_handler = (action: Action): ChangeFn => {
  GET_ALL_COMPLETE_handler_dom();
  return GET_ALL_COMPLETE_handler_changeFn(action);
}

/*
 * GET_ALL_FAIL_handler part
 */

const GET_ALL_FAIL_handler_dom = (error: any) => {
  statusElem.innerHTML = 
    `<p>adding item failed due to ${error}.</p>
    <p>please try again later.</p>`;
  clearStatusElem();
}

export const GET_ALL_FAIL_handler = (action: Action): ChangeFn => {
  GET_ALL_FAIL_handler_dom(action.payload.error);
  return defaultChangeFnFac(action);
}
