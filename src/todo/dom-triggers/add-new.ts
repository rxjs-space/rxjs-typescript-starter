import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/do';

import { action$$ } from '../index';
import { CONST, Item, addNewButtonElem, inputElem } from '../_shared';
import { domClick$$, domKeyup$$ } from './_shared';

const addNewClick$ = domClick$$.filter((event: any) => event.target === addNewButtonElem);

const enterPressOnMainInput$ = domKeyup$$
  .filter((e: {keyCode: number}) => document.activeElement === inputElem && e.keyCode === 13);

export const addNew$ = Observable.merge(addNewClick$, enterPressOnMainInput$)
  .do(() => {
    const inputValue = encodeURIComponent(inputElem.value.trim())
    if (inputValue !== '') {
      const newItemWithoutId: Item = {
        title: inputValue,
        timeAdded: new Date(),
        done: false
      };
      action$$.next({type: CONST.ADD_ITEM_START, payload: {newItemWithoutId}})
    }
  });
