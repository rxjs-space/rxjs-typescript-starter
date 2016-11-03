import { Observable, Subject, BehaviorSubject, Subscription, Observer } from 'rxjs';
// 为书写简便，统一从rxjs库中引用Object
// 实际项目中要使用单独引用，即import { Observable } from 'rxjs/Observable'，等等。

/*
  创建dom elements
*/
const sectionE = document.createElement('section'); // container
document.body.appendChild(sectionE);
const uploadButtonE = document.createElement('button'); // button
uploadButtonE.innerText = 'Upload';
sectionE.appendChild(uploadButtonE);

const uploadingE = document.createElement('div'); // uploading... message
uploadingE.innerText = 'uploading...';
const previewE = document.createElement('div'); // upload completed, show preview
previewE.innerText = 'upload completed. this is the preview.'
const errorE = document.createElement('div'); // upload failed, show error, 2 sec later, hide error
errorE.innerText = 'upload failed. please try again later.'

/*
  定义interfaces, types
  定义字符串常量，如 const A = 'A'，可避免后面代码中使用字符'A'，不会写错  
*/
type ActionType = 'UPLOAD_START' | 'UPLOAD_COMPLETE' | 'UPLOAD_FAIL'
interface Action {
  type: ActionType
}
const UPLOAD_START: ActionType = 'UPLOAD_START';
const UPLOAD_COMPLETE: ActionType = 'UPLOAD_COMPLETE';
const UPLOAD_FAIL: ActionType = 'UPLOAD_FAIL';

type uploadState = null | 'STARTED' | 'COMPLETED' | 'FAILED';
interface State {
  upload: uploadState
} // 这个state在本文中没啥用，异步处理的依据是action，不是state

const STARTED: uploadState = 'STARTED';
const COMPLETED: uploadState = 'COMPLETED';
const FAILED: uploadState = 'FAILED';

type ChangeFn = (state: State) => State;

/*
  define a fake http observable and its observer
*/
const uploadHttp$: Observable<any> = Observable.create((observer: any) => {
  setTimeout(() => {
    observer.next('whatever') // 如果想看error，就用observer.error()
  }, 2000)
})

const uploadHttpObserver: Observer<any> = {
  next: () => action$$.next({type: UPLOAD_COMPLETE}), // 结果为成功时，调用nextFn，即推送UPLOAD_COMPLETE给action$$
  error: () => action$$.next({type: UPLOAD_FAIL}),
  complete: null
}

/*
  handlers according to action
*/
const handler_UPLOAD_START = (): ChangeFn => {
  uploadButtonE.disabled = true;       // 按钮不可按
  sectionE.appendChild(uploadingE)     // 显示uploading...
  uploadHttp$.subscribe(uploadHttpObserver);  // 启动异步事件
  return (state: State): State => Object.assign({}, state, {upload: STARTED});
}

const handler_UPLOAD_COMPLETE = (): ChangeFn => {
  sectionE.removeChild(uploadingE); // 隐藏uploading..., better with try_catch
  sectionE.appendChild(previewE); // 显示已经上传了的图片的缩略图
  uploadButtonE.disabled = false; // 按钮可按
  return (state: State) => Object.assign({}, state, {upload: COMPLETED});
}

const handler_UPLOAD_FAIL = (): ChangeFn => {
  sectionE.removeChild(uploadingE); // 隐藏uploading..., better with try_catch
  sectionE.appendChild(errorE) // 显示error
  setTimeout(() => {
    sectionE.removeChild(errorE); // 2秒后，隐藏error
  }, 2000)
  uploadButtonE.disabled = false; // 按钮可按
  return (state: State) => Object.assign({}, state, {upload: FAILED});
}

const handler_default = (): ChangeFn => {
  return (state: State) => state;
}

const handlers = (action: Action) => {
  switch (action.type) {
    case UPLOAD_START: return handler_UPLOAD_START();
    case UPLOAD_COMPLETE: return handler_UPLOAD_COMPLETE();
    case UPLOAD_FAIL: return handler_UPLOAD_FAIL();
    default: return handler_default();
  }
}

/*
  外部推action给action$$（外部可以是dom event、http request等等，外部推送的过程在后面的异步事件处理里面）；
  action被map成changFn，changeFn被scan成state，state被推给state$$，再被推给console.log。
*/
const action$$: Subject<Action> = new Subject()
const state$$: BehaviorSubject<State> = new BehaviorSubject({upload: null})
const ultimate_: Subscription = state$$.subscribe(console.log); // will log 0 immediately

const changeFn$: Observable<ChangeFn> = action$$
  .map(handlers)  // handlers will map the action into changeFn and do the other necessary operations

const state$: Observable<State> = changeFn$
  .scan((state, changeFn) => changeFn(state), state$$.getValue()) // 初始值是state$$.getValue()

const intermediate_: Subscription = state$.subscribe(state$$) 


/*
  定义按钮click触发的action
*/
const uploadButtonEClick$ = Observable.fromEvent(uploadButtonE, 'click')
  .do(() => {
    action$$.next({type: UPLOAD_START}); // 推送UPLOAD_START给action$$
  })

  
/*
  合并各个外部observable，并用subscribe()启动。
*/
const upload_ = Observable.merge(
  uploadButtonEClick$,
)
  .subscribe();