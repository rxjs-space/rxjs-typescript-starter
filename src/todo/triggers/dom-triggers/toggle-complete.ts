import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/do';

import { action$$ } from '../../index';
import { listMap, CONST } from '../../_shared';

import { domClick$$ } from './_shared';

export const toggleComplete$ = domClick$$
  .filter((event: any) => {
    return event.target.type === 'checkbox'  && !!listMap.get(event.target.parentElement)
  })
  .do((event: any) => {
    const elem = event.target;
    const newDone = elem.checked;
    const id = listMap.get(event.target.parentElement)
    action$$.next({
      type: CONST.EDIT_ITEM_SAVE_START,
      payload: {
        id: id,
        form: {
          done: newDone
        }
      }
    })
  })