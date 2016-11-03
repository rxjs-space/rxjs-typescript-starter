import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/pluck';
import 'rxjs/add/operator/map';
import { Action, State, ChangeFn, ADD_ITEM_START, DELETE_ITEM_START, EDIT_ITEM_SAVE_START, Item, WIP } from './_shared';
import { addNewButtonElem, inputElem, listMap } from './_dom-elements'
import { action$$ } from './index';


const domClick$ = Observable.fromEvent(document, 'click')
const domClick$$ = new Subject();
domClick$.subscribe(domClick$$);

const domDblClick$ = Observable.fromEvent(document, 'dblclick')
const domDblClick$$ = new Subject();
domDblClick$.subscribe(domDblClick$$);

const addNewClick$ = domClick$$.filter((e: any) => e.target === addNewButtonElem);

const enterPressOnMainInput$ = Observable.fromEvent(document, 'keyup')
  .filter((e: {keyCode: number}) => document.activeElement === inputElem && e.keyCode === 13)

const addNew$ = Observable.merge(addNewClick$, enterPressOnMainInput$)
  .do(() => {
    const inputValue = encodeURIComponent(inputElem.value.trim())
    if (inputValue !== '') {
      const newItem: Item = {
        title: inputValue,
        timeAdded: new Date(),
        status: WIP
      };
      action$$.next({type: ADD_ITEM_START, payload: newItem})
    }
  });

const deleteClick$ = domClick$$
  .filter((e: any) => e.target.innerHTML === 'X' && e.target.tagName === 'BUTTON' && !!listMap.get(e.target.parentElement))
  .do((e: any) => {
    action$$.next({
      type: DELETE_ITEM_START,
      payload: {
        itemIdToDelete: listMap.get(e.target.parentElement)
      }
    })
  })

// 在某个项目的input element上面双击，开始编辑
const editDblClick$ = domDblClick$$
  .pluck('target')
  .filter((elem: HTMLInputElement) => elem.type === 'text' && !!listMap.get(elem.parentElement))
  .do((elem: HTMLInputElement) => {
    elem.disabled = false;
    elem.focus();
    elem.selectionStart = elem.value.length;
    elem.selectionEnd = elem.value.length;
    const confirmButton = document.createElement('button');
    confirmButton.innerHTML = '&#10003;'
    elem.parentElement.insertBefore(confirmButton, elem.parentElement.lastChild);
  })
  .map((elem: HTMLInputElement) => {
    return {elem: elem, title: elem.value}
  })
  .switchMap((item) => {
    // 当elem是activeElement，且按下回车时，开始保存
    const elem = item.elem;
    const oldTitle = item.title;
    const enterPressOnEditingSubInput$ = Observable.fromEvent(document, 'keyup')
      .filter((e: {keyCode: number}) => document.activeElement === elem && e.keyCode === 13).take(1);
    // 当在elem以外点击鼠标时，开始保存
    const editLeaveClick$ = domClick$$.filter((e: any) => (e.target.parentElement !== elem.parentElement) && (e.target !== elem.parentElement)).take(1)
    // 当按下保存按钮时，开始保存
    const confirmButtonClick$ = Observable.fromEvent(elem.nextSibling, 'click').take(1)
    return Observable.merge(enterPressOnEditingSubInput$, editLeaveClick$, confirmButtonClick$)
      .do((e: any) => {
        const newTitle = elem.value;
        if(oldTitle !== newTitle) {
          const editedItemId = listMap.get(elem.parentElement);
          action$$.next({
            type: EDIT_ITEM_SAVE_START,
            payload: {
              editedItemId,
              newTitle
            }
          })
        } else {
          elem.disabled = true;
          elem.parentElement.removeChild(elem.nextSibling);
        }
      })
  })


export const domEvents$ = Observable.merge(addNew$, deleteClick$, editDblClick$);

