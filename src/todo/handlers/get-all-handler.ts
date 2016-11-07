import { CONST, Action, ChangeFn, State, Item, WithLastAction, statusElem, getAll$Fac } from '../_shared';
import { action$$ } from '../index';
import { defaultChangeFn, clearStatusElem } from './_shared';

export const GET_ALL_START_handler = (action: Action): ChangeFn => {
  statusElem.innerHTML = 'fetching data from server ...';
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
  return defaultChangeFn(action)
}

export const GET_ALL_COMPLETE_handler = (action: Action): ChangeFn => {
  statusElem.innerHTML = 'data received successfully.';
  clearStatusElem();
  const list = action.payload.list;
  return (state: State): State => Object.assign({}, state, <WithLastAction>{
    items: list,
    lastActionType: action.type,
    lastActionDetail: action
  })
}

export const GET_ALL_FAIL_handler = (action: Action): ChangeFn => {
  const error = action.payload.error;
  statusElem.innerHTML = 
    `<p>adding item failed due to ${error}.</p>
    <p>please try again later.</p>`;
  clearStatusElem();
  return defaultChangeFn(action);
}