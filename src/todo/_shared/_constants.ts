import { ActionType, State, VisibilityType } from './_types';

/*
  定义字符串常量，如 const A = 'A'，可避免后面代码中使用字符'A'，不会写错  
*/

export const INIT: ActionType = 'INIT';

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

export const TOGGLE_VIEW: ActionType = 'TOGGLE_VIEW';

export const VISIBILITY_SHOW_ALL: VisibilityType = 'SHOW_ALL';
export const VISIBILITY_SHOW_UNDONE: VisibilityType = 'SHOW_UNDONE';

export const NAME_OF_VISIBILITY_RADIO = 'VISIBILITY';

export const CONFIRM_BUTTON_TEXT = '&#10003;';
export const DELETE_BUTTON_TEXT = 'X';
