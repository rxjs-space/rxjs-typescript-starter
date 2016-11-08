import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/do';

import { action$$ } from '../index';
import { CONST, listMap } from '../_shared';
import { domClick$$ } from './_shared';

export const delete$$ = domClick$$
  .filter((e: any) => e.target.innerHTML === CONST.DELETE_BUTTON_TEXT && e.target.tagName === 'BUTTON' && !!listMap.get(e.target.parentElement))
  .do((e: any) => {
    action$$.next({
      type: CONST.DELETE_ITEM_START,
      payload: {
        itemIdToDelete: listMap.get(e.target.parentElement)
      }
    })
  })