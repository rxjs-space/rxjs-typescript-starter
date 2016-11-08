import { Action, ChangeFn, State, CONST, Item, WithLastAction } from '../_shared';

export const TOGGLE_VIEW_handler = (action: Action): ChangeFn => {
  return (state: State): State => {
    const newVisibility = state.visibility === CONST.VISIBILITY_SHOW_ALL ? CONST.VISIBILITY_SHOW_UNDONE : CONST.VISIBILITY_SHOW_ALL;
    return Object.assign({}, state, <WithLastAction>{
      visibility: newVisibility,
      lastActionType: action.type,
      lastActionDetail: action
    })
  }
}
