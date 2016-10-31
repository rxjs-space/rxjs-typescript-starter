import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/map';

/*
主演：  
1. `action$$`：一个`Subject`，负责转推`action`（转推，就是外部推给它，它再推出去）。
2. `state$$`：一个`BehaviorSubject`，负责转推`state`，并存储最后一个`state`，即最近跟新的`state`。

故事梗概：  
1. 外部通过`action$$.next(action)`将`action`推送给`action$$`，这个“外部”可以是个定时器、DOM事件或是Http请求的返回；  
2. `action$$`在转推的时候，`action`被映射（“映射”指的就是`map`）成`changeFn`；   
3. `changeFn`被那啥（“那啥”指的就是`scan`）成`state`；  
4. `state`再被推给`state$$`；  
5. `state$$`再将`state`转推给`console.log`。   

比如，外部推`INCREASE`给`action$$`，`INCREASE`被`map`成一个`changeFn`，即`(state)=>state+1`，这个`changeFn`被`scan`成一个新的`state`，  
如果上一个`state`是`0`的话，根据`changeFn`，这个新的`state`就是`1`，这个`state`再被推给`state$$`，再转推给`console.log`。  

为什么不直接将`action`映射成`state`，而是将`action`映射成`changeFn`呢？  
如果要把`action`映射成`state`，每次映射操作都要通过`state$$.getValue()`来获取`currentState`，这就像在一个`function`里面使用一个全局变量。   
而将`action`映射成`changeFn`，映射过程没有外部变量，更容易测试。   

*/


/*
  定义interfaces, types。
  定义INCREASE, DECREASE两个常数，这样，后面可以用INCREASE变量来代替'INCREASE'字符串，避免typo。
*/
type ActionType = 'INCREASE' | 'DECREASE';
interface Action {
  type: ActionType;
}
const INCREASE: ActionType = 'INCREASE';
const DECREASE: ActionType = 'DECREASE';
type State = number;
type ChangeFn = (state: State) => State;

/*
 创建action$$，负责转推action。
 创建state$$，负责转推state，并留存最近的state，初始值为0。
 立即用console.log订阅到state$$，这样避免漏数据。
 在console.log订阅到state$$之后，state$$会立即将留存的state推给console.log，在console上看到0。
*/
const action$$: Subject<Action> = new Subject();
const state$$: BehaviorSubject<State> = new BehaviorSubject(0);
const ultimate_: Subscription = state$$.subscribe(console.log); // will log 0 immediately

/*
  changeFn$将action "map成" changeFn。
  changeFn$不会自动运行。
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
  state$将changeFn "scan成" state，state初始为state$$的当前数值，即state$$.getValue()。
  state$不会自动运行。
*/
const state$: Observable<State> = changeFn$
  .scan((state, changeFn) => changeFn(state), 0);

/*
  用state$$订阅state$，state$开始运行，并向state$$推送数据，state$$再转推给console.log
*/
const intermediate_: Subscription = state$.subscribe(state$$);

/*
  用action$$.next()来向action$$推送action；
  这个action会经过map，scan变成一个state，然后被推给state$$，然后推给console.log
*/
action$$.next({type: INCREASE}); // 1
action$$.next({type: INCREASE}); // 2
action$$.next({type: DECREASE}); // 1

/*
  获取最近的state，用BehaviorSubject.getValue()
*/
console.log(state$$.getValue());    // current state is 1

/*
  我们再用DOM事件来向action$$推送action。
  先创建两个按钮。
*/
const section = document.createElement('section');
document.body.appendChild(section);
const incButton = document.createElement('button');
incButton.innerText = INCREASE;
section.appendChild(incButton);
const decButton = document.createElement('button');
decButton.innerText = DECREASE;
section.appendChild(decButton);


/*
  创建click事件Observable，定义每次点按会推送一个action给action$$。
  而后合并所有的click$至一个observable，并用subscribe()启动运行。
*/
const incButtonClick$ = Observable.fromEvent(incButton, 'click')
  .map(() => action$$.next({type: INCREASE}));
const decButtonClick$ = Observable.fromEvent(decButton, 'click')
  .map(() => action$$.next({type: DECREASE}));

const clicks_ = Observable.merge(incButtonClick$, decButtonClick$)
  .subscribe(); // 这里不需要像subscribe()传递任何参数




/*
// redux code example
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