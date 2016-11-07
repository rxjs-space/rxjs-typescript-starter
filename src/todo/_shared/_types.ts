type ActionTypeInit = 'INIT';

type ActionTypeGetAll = 'GET_ALL_START' | 'GET_ALL_COMPLETE' | 'GET_ALL_FAIL';
type ActionTypeGetOne = 'GET_ONE_START' | 'GET_ONE_COMPLETE' | 'GET_ONE_FAIL';
type ActionTypeAdd = 'ADD_ITEM_START' | 'ADD_ITEM_COMPLETE'| 'ADD_ITEM_FAIL';
type ActionTypeDelete = 'DELETE_ITEM_START' | 'DELETE_ITEM_COMPLETE' | 'DELETE_ITEM_FAIL';
type ActionTypeEdit = 'EDIT_ITEM_SAVE_START' | 'EDIT_ITEM_SAVE_COMPLETE' | 'EDIT_ITEM_SAVE_FAIL';

type ActionTypeCrud = ActionTypeAdd | ActionTypeDelete | ActionTypeEdit | ActionTypeGetAll | ActionTypeGetOne;

type ActionTypeVisibility = 'TOGGLE_VIEW';

export type ActionType = ActionTypeCrud | ActionTypeVisibility | ActionTypeInit;

export interface Action {
  type: ActionType,
  payload?: any
}

export type VisibilityType = 'SHOW_ALL' | 'SHOW_UNDONE';

export interface Item {
  id?: number;
  title: string;
  timeAdded: Date;
  timeCompleted?: Date;
  done: boolean;
}

export interface State {
  items: Item[],
  visibility: VisibilityType,
  lastActionType: ActionType,
  lastActionDetail: Action,
}

export type ChangeFn = (state: State) => State;

export interface WithLastAction {
  lastActionType: ActionType,
  lastActionDetail: Action
}
