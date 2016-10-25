import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/scan';

/*

action$$.next() pushes action to action$$
this action will be mapped to a changeFn
this changeFn will be reduced to a state
this state will be pushed to state$$
and state$$ pushes the state to console.log

*/


/*
  定义interfaces, types；
  定义INCREASE, DECREASE两个常数，这样，后面可以用INCREASE变量来代替'INCREASE'字符串；
*/
type ActionType = 'INCREASE' | 'DECREASE'
interface Action {
  type: ActionType
}
const INCREASE: ActionType = 'INCREASE';
const DECREASE: ActionType = 'DECREASE';
type State = number;
type ChangeFn = (state: State) => State;

/*
 创建action$$，负责转发action。
 创建state$$，负责转发state，并留存最近的state，初始值为0。
 立即用console.log订阅到state$$，这样避免漏数据。
 在console.log订阅到state$$之后，state$$会立即将留存的state推给console.log，在console上看到0。
*/
const action$$: Subject<Action> = new Subject()
const state$$: BehaviorSubject<State> = new BehaviorSubject(0)
const ultimate_: Subscription = state$$.subscribe(console.log); // will log 0 immediately

/*
  changeFn$将action映射（map）成changeFn。
*/
const changeFn$: Observable<ChangeFn> = action$$
  .map((action: Action) => {
    switch (action.type) {
      case INCREASE:
        return (state: State) => state + 1;
      case DECREASE:
        return (state: State) => state - 1;
      default:
        return (state: State) => state;
    }
  })

/*
  state$将changFn递归（scan）成state，，state初始为0。
*/
const state$: Observable<State> = changeFn$
  .scan((state, changeFn) => changeFn(state), 0)

/*
  用state$$订阅state$，state$开始向state$$推送数据
*/
const intermediate_: Subscription = state$.subscribe(state$$) 

/*
  用action$$.next()来向action$$推送action；
  这个action会经过map，scan变成一个state，然后被推给state$$
*/
action$$.next({type: INCREASE}) // 1
action$$.next({type: INCREASE}) // 2
action$$.next({type: DECREASE}) // 1

/*
  获取最近的state，用BehaviorSubject.getValue()
*/
console.log(state$$.getValue())    // current state is 1

// 在页面上创建两个按钮
const section = document.createElement('section')
document.body.appendChild(section);
const incButton = document.createElement('button');
incButton.innerText = INCREASE;
section.appendChild(incButton);
const decButton = document.createElement('button');
decButton.innerText = DECREASE;
section.appendChild(decButton);


/*
  创建click事件Observable，每次点按会推送一个action给action$$。
  立即调用subscribe()，以启动Observable，这里不必制定任何observer。
*/
Observable.fromEvent(incButton, 'click')
  .map(() => action$$.next({type: INCREASE})).subscribe()
Observable.fromEvent(decButton, 'click')
  .map(() => action$$.next({type: DECREASE})).subscribe()


/*

// from https://github.com/reactjs/redux

import { createStore } from 'redux'

function counter(state = 0, action) {
  switch (action.type) {
  case 'INCREMENT':
    return state + 1
  case 'DECREMENT':
    return state - 1
  default:
    return state
  }
}

let store = createStore(counter)

store.subscribe(() =>
  console.log(store.getState())
)

store.dispatch({ type: 'INCREMENT' })
// 1
store.dispatch({ type: 'INCREMENT' })
// 2
store.dispatch({ type: 'DECREMENT' })
// 1

*/