/*
  定义interfaces, types
  定义字符串常量，如 const A = 'A'，可避免后面代码中使用字符'A'，不会写错  
*/
type ActionTypeGetAll = 'GET_ALL_START' | 'GET_ALL_COMPLETE' | 'GET_ALL_FAIL';
type ActionTypeGetOne = 'GET_ONE_START' | 'GET_ONE_COMPLETE' | 'GET_ONE_FAIL';
type ActionTypeAdd = 'ADD_ITEM_START' | 'ADD_ITEM_COMPLETE'| 'ADD_ITEM_FAIL';
type ActionTypeDelete = 'DELETE_ITEM_START' | 'DELETE_ITEM_COMPLETE' | 'DELETE_ITEM_FAIL';
type ActionTypeEdit = 'EDIT_ITEM_SAVE_START' | 'EDIT_ITEM_SAVE_COMPLETE' | 'EDIT_ITEM_SAVE_FAIL';
export type ActionTypeCrud = ActionTypeAdd | ActionTypeDelete | ActionTypeEdit | ActionTypeGetAll | ActionTypeGetOne;
export type ActionTypeShow = 'SHOW_ALL' | 'SHOW_UNDONE';
export type ActionType = ActionTypeCrud | ActionTypeShow | 'INIT';

const INIT: ActionType = 'INIT';

export const GET_ALL_START: ActionType = 'GET_ALL_START';
export const GET_ALL_COMPLETE: ActionType = 'GET_ALL_COMPLETE';
export const GET_ALL_FAIL: ActionType = 'GET_ALL_FAIL';

export const GET_ONE_START: ActionType = 'GET_ONE_START';
export const GET_ONE_COMPLETE: ActionType = 'GET_ONE_COMPLETE';
export const GET_ONE_FAIL: ActionType = 'GET_ONE_FAIL';

export const ADD_ITEM_START: ActionType = 'ADD_ITEM_START';
export const ADD_ITEM_COMPLETE: ActionType = 'ADD_ITEM_COMPLETE';
export const ADD_ITEM_FAIL: ActionType = 'ADD_ITEM_FAIL';

export const DELETE_ITEM_START: ActionType = 'DELETE_ITEM_START';
export const DELETE_ITEM_COMPLETE: ActionType = 'DELETE_ITEM_COMPLETE';
export const DELETE_ITEM_FAIL: ActionType = 'DELETE_ITEM_FAIL';


export const EDIT_ITEM_SAVE_START: ActionType = 'EDIT_ITEM_SAVE_START';
export const EDIT_ITEM_SAVE_COMPLETE: ActionType = 'EDIT_ITEM_SAVE_COMPLETE';
export const EDIT_ITEM_SAVE_FAIL: ActionType = 'EDIT_ITEM_SAVE_FAIL';

export const SHOW_ALL: ActionType = 'SHOW_ALL';
export const SHOW_UNDONE: ActionType = 'SHOW_UNDONE';

export interface Action {
  type: ActionType,
  payload?: any
}

export type Status = 'WIP' | 'UNDONE';
export const WIP: Status = 'WIP';
export const UNDONE: Status = 'UNDONE';

export interface Item {
  id?: number;
  title: string;
  timeAdded: Date;
  timeCompleted?: Date;
  status: Status;
}

export interface State {
  items: Item[],
  visibility: ActionTypeShow,
  lastAction: Action,
}

export const stateInit: State = {
  items: [],
  visibility: SHOW_ALL,
  lastAction: {
    type: INIT
  }
}

export type ChangeFn = (state: State) => State;

