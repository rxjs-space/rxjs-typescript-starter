import 'rxjs/add/operator/do';

import { action$$ } from '../index';
import { CONST } from '../_shared';

import { visibilityChange$$ } from './_shared';

export const toggleView$$ = visibilityChange$$
  .do((event: any) => {
    action$$.next({type: CONST.TOGGLE_VIEW})
  })


