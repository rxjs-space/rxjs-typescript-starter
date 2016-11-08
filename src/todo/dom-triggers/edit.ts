import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/pluck';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/take';

import { CONST, listMap } from '../_shared';
import { action$$ } from '../index';
import { domDblClick$$, domClick$$, domKeyup$$ } from './_shared';

// 在某个项目的input element上面双击，开始编辑
export const edit$$ = domDblClick$$
  .pluck('target')
  .filter((elem: HTMLInputElement) => elem.type === 'text' && !!listMap.get(elem.parentElement))
  .do((elem: HTMLInputElement) => {
    elem.disabled = false;
    elem.focus();
    elem.selectionStart = elem.value.length;
    elem.selectionEnd = elem.value.length;
  })
  .map((elem: HTMLInputElement) => {
    const confirmButton = document.createElement('button');
    confirmButton.innerHTML = CONST.CONFIRM_BUTTON_TEXT;
    elem.parentElement.insertBefore(confirmButton, elem.parentElement.lastChild);
    return {elem: elem, title: elem.value, confirmButton}
  })
  .switchMap((item) => {
    // 当elem是activeElement，且按下回车时，开始保存
    const elem = item.elem;
    const oldTitle = item.title;
    const enterPressOnEditingSubInput$ = domKeyup$$
      .filter((e: {keyCode: number}) => document.activeElement === elem && e.keyCode === 13);
    // 当在elem以外点击鼠标时，开始保存
    const editLeaveClick$ = domClick$$
      .filter((e: any) => (e.target.parentElement !== elem.parentElement) && (e.target !== elem.parentElement))
    // 当按下保存按钮时，开始保存
    const confirmButtonClick$ = Observable.fromEvent(item.confirmButton, 'click')
    return Observable.merge(enterPressOnEditingSubInput$, editLeaveClick$, confirmButtonClick$)
      .take(1)
      .do((e: any) => {
        const newTitle = elem.value;
        if(oldTitle !== newTitle) {
          const editedItemId = listMap.get(elem.parentElement);
          action$$.next({
            type: CONST.EDIT_ITEM_SAVE_START,
            payload: {
              id: editedItemId,
              form: {
                title: newTitle
              }
            }
          })
        } else {
          elem.disabled = true;
          elem.parentElement.removeChild(item.confirmButton);
        }
      })
  })
