import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/scan';

import 'core-js/es6/map';

import { CONST, Action, State, ChangeFn, inputElem } from './_shared';
import { handlers } from './handlers';
import { triggers$ } from './triggers';
import { renderer } from './renderer';

const stateInit: State = {
  items: [],
  visibility: CONST.VISIBILITY_SHOW_ALL,
  lastActionType: CONST.INIT,
  lastActionDetail: {
    type: CONST.INIT
  }
}

/*
  外部推action给action$$（外部可以是dom event、http request等等，外部推送的过程在后面的异步事件处理里面）；
  action被map成changFn，changeFn被scan成state，state被推给state$$，再被推给console.log。
*/
export const action$$: Subject<Action> = new Subject()
const state$$: BehaviorSubject<State> = new BehaviorSubject(stateInit);
const ultimate_: Subscription = state$$.subscribe(renderer); // will log contents of stateIit immediately

const changeFn$: Observable<ChangeFn> = action$$
  .map(handlers)  // handlers will map the action into changeFn and do other necessary operations like showing messages

const state$: Observable<State> = changeFn$
  .scan((state, changeFn) => changeFn(state), state$$.getValue()) // 初始值是state$$.getValue()，即staetInit

const intermediate_: Subscription = state$.subscribe(state$$) // state$开始向state$$推送

const triggers_ = triggers$.subscribe(); // 启动triggers$, triggers$ will send action by action$$.next(action) at the designed time point

inputElem.focus();

action$$.next({type: CONST.GET_ALL_START}) // start to send actino to action$$;

