import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/scan';

import 'core-js/es6/map';

import { handlers } from './handlers';
import { stateInit, GET_ALL_START, Action, State, ChangeFn } from './_shared';
import { domEvents$ } from './_dom-events-observable';
import { inputElem, listElem, listMap } from './_dom-elements';
import { renderer } from './_renderer';

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

action$$.next({type: GET_ALL_START}) // start to get data from db;

const domEvents_ = domEvents$.subscribe(); // 启动domEvents$

inputElem.focus();
