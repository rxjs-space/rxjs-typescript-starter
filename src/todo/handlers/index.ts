import { CONST, Action, ChangeFn } from '../_shared';
import { defaultChangeFnFac } from './_shared';
import { GET_ALL_START_handler, GET_ALL_COMPLETE_handler, GET_ALL_FAIL_handler } from './get-all-handler';
import { ADD_ITEM_START_handler, ADD_ITEM_COMPLETE_handler, ADD_ITEM_FAIL_handler } from './add-handler';
import { DELETE_ITEM_START_handler, DELETE_ITEM_COMPLETE_handler, DELETE_ITEM_FAIL_handler } from './delete-handler';
import { EDIT_ITEM_SAVE_START_handler, EDIT_ITEM_SAVE_COMPLETE_handler, EDIT_ITEM_SAVE_FAIL_handler } from './edit-handler';
import { TOGGLE_VIEW_handler } from './toggle-view-handler';

const DEFAULT_handler = (action: Action): ChangeFn => {
  return defaultChangeFnFac(action);
}

export const handlers = (action: Action): ChangeFn => {
  switch (action.type) {
    case CONST.GET_ALL_START: return GET_ALL_START_handler(action);
    case CONST.GET_ALL_COMPLETE: return GET_ALL_COMPLETE_handler(action);
    case CONST.GET_ALL_FAIL: return GET_ALL_FAIL_handler(action);
    case CONST.ADD_ITEM_START: return ADD_ITEM_START_handler(action);
    case CONST.ADD_ITEM_COMPLETE: return ADD_ITEM_COMPLETE_handler(action);
    case CONST.ADD_ITEM_FAIL: return ADD_ITEM_FAIL_handler(action);
    case CONST.DELETE_ITEM_START: return DELETE_ITEM_START_handler(action);
    case CONST.DELETE_ITEM_COMPLETE: return DELETE_ITEM_COMPLETE_handler(action);
    case CONST.DELETE_ITEM_FAIL: return DELETE_ITEM_FAIL_handler(action);
    case CONST.EDIT_ITEM_SAVE_START: return EDIT_ITEM_SAVE_START_handler(action);
    case CONST.EDIT_ITEM_SAVE_COMPLETE: return EDIT_ITEM_SAVE_COMPLETE_handler(action);
    case CONST.EDIT_ITEM_SAVE_FAIL: return EDIT_ITEM_SAVE_FAIL_handler(action);
    case CONST.TOGGLE_VIEW: return TOGGLE_VIEW_handler(action);
    default: return DEFAULT_handler(action);
  }
}