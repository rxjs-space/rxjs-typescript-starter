import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { handlers } from './handlers';
import { stateInit, Action, State, ChangeFn, Item, WIP } from './_shared';
import { domEvents$ } from './_dom-events-observable';
import { inputElem, listElem, listMap } from './_dom-elements';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/scan';

import 'core-js/es6/map';


const renderer = (state: State) => {
  console.log(state);
  listElem.innerHTML = '';
  state.items.forEach((item) => {
    const itemElem = document.createElement('div');
    itemElem.innerHTML = '<input type="checkbox"><input type="text" disabled value="'+decodeURIComponent(item.title)+'"><button>X</button>';
    listMap.set(itemElem, item.id);
    listElem.appendChild(itemElem);
  })
}

/*
  外部推action给action$$（外部可以是dom event、http request等等，外部推送的过程在后面的异步事件处理里面）；
  action被map成changFn，changeFn被scan成state，state被推给state$$，再被推给console.log。
*/
export const action$$: Subject<Action> = new Subject()
const state$$: BehaviorSubject<State> = new BehaviorSubject(stateInit);
const ultimate_: Subscription = state$$.subscribe(renderer); // will log 0 immediately

const changeFn$: Observable<ChangeFn> = action$$
  .map(handlers)  // handlers will map the action into changeFn and do the other necessary operations

const state$: Observable<State> = changeFn$
  .scan((state, changeFn) => changeFn(state), state$$.getValue()) // 初始值是state$$.getValue()

const intermediate_: Subscription = state$.subscribe(state$$) // state$开始向state$$推送

const domEvents_ = domEvents$.subscribe(); // 启动domEvents$

inputElem.focus();




