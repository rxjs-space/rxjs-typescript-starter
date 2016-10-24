import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/scan';

/*
in essence:
state$$.subscribe(console.log)
actions$$.map(action=>newState).subscribe(state$$)
*/

interface Action {
  type: 'INCREASE' | 'DECREASE'
}
interface State {
  value: number
}

const actions$$: Subject<Action> = new Subject()
const state$$: BehaviorSubject<State> = new BehaviorSubject({value: 0})
const ultimate_: Subscription = state$$.subscribe(console.log);    // {value: 0}

const state$: Observable<State> = actions$$
  .map((action: Action) => {
    const state: State = Object.assign({}, state$$.getValue())
    switch (action.type) {
      case 'INCREASE':
        Object.assign(state, {value: state.value + 1});
        break;
      case 'DECREASE':
        Object.assign(state, {value: state.value - 1});
        break;
      // default:
    }
    return state
  })

const intermediate_ = state$.subscribe(state$$) // subscribe() launches state$ execution, state$ starts to push values to state$$

actions$$.next({type: 'INCREASE'}) // {value: 1}
actions$$.next({type: 'INCREASE'}) // {value: 2}
actions$$.next({type: 'DECREASE'}) // {value: 1}

console.log(state$$.getValue())    // current state is {value: 1}

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