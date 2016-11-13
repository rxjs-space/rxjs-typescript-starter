import { CONST, Action, ChangeFn } from '../_shared';
import { defaultChangeFnFac } from './_shared';
import { GET_ALL_handlers } from './get-all-handler';
import { ADD_ITEM_handlers } from './add-handler';
import { DELETE_ITEM_handlers } from './delete-handler';
import { EDIT_ITEM_SAVE_handlers } from './edit-handler';
import { TOGGLE_VIEW_handler } from './toggle-view-handler';

const DEFAULT_handler = (action: Action): ChangeFn => {
  return defaultChangeFnFac(action);
}

export const handlers = (action: Action): ChangeFn => {
  switch (true) {
    case CONST.GET_ALL.indexOf(action.type) >= 0 : return GET_ALL_handlers(action);
    case CONST.ADD_ITEM.indexOf(action.type) >= 0 : return ADD_ITEM_handlers(action);
    case CONST.DELETE_ITEM.indexOf(action.type) >= 0 : return DELETE_ITEM_handlers(action);
    case CONST.EDIT_ITEM_SAVE.indexOf(action.type) >= 0 : return EDIT_ITEM_SAVE_handlers(action);

    case action.type === CONST.TOGGLE_VIEW: return TOGGLE_VIEW_handler(action);
    default: return DEFAULT_handler(action);
  }
}

