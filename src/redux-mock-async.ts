import { Observable, Subject, BehaviorSubject, Subscription } from 'rxjs';
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
  外部推action给action$$（外部可以是dom event、http request等等，外部推送的过程在后面的异步事件处理里面）；
  action被map成changFn，changeFn被scan成state，state被推给state$$，再被推给console.log。
*/
const action$$: Subject<Action> = new Subject()
const state$$: BehaviorSubject<State> = new BehaviorSubject({upload: null})
const ultimate_: Subscription = state$$.subscribe(console.log); // will log 0 immediately

const changeFn$: Observable<ChangeFn> = action$$
  .map((action: Action) => {
    let newUploadState: uploadState;
    switch (action.type) {
      case UPLOAD_START:
        newUploadState = STARTED;
        return (state: State): State => Object.assign({}, state, {upload: newUploadState});
      case UPLOAD_COMPLETE:
        newUploadState = COMPLETED
        return (state: State) => Object.assign({}, state, {upload: newUploadState});
      case UPLOAD_FAIL:
        newUploadState = FAILED
        return (state: State) => Object.assign({}, state, {upload: newUploadState});
      default:
        return (state: State) => state;
    }
  })

const state$: Observable<State> = changeFn$
  .scan((state, changeFn) => changeFn(state), state$$.getValue()) // 初始值是state$$.getValue()

const intermediate_: Subscription = state$.subscribe(state$$) 

/*
  上面的代码，除了添加了dom elements意外，基本和上篇[用RxJS模拟Redux]里面的是一样的。
  下面开始模拟异步事件，并对其进行处理。

  对异步事件的处理，主要是
    1） 打包异步事件为Observable，比如下面代码中的uploadHttp$
    2） 创建一个observer，形如
        const observer = {
            next: action$$.next(success_action), 
            error: action$$.next(failure_action)
          }
    3） 用uploadHttp$.subscribe(observer)来启动异步事件
    4） 定义subX$ = action$$.filter().do()来处理不同的action
    5） 最后用Observable.merge(subA$, subB$...).subscribe()来合并以及启动各个subX$
*/

/*
  模拟异步事件，这个异步事件被打包在一个Observable里。
  比如，可以用Observable.fromPromise将fetch打包在Observable里
  var result = Rx.Observable.fromPromise(fetch('http://myserver.com/'));
  result.subscribe(x => console.log(x), e => console.error(e));
*/
const uploadHttp$ = Observable.create((observer: any) => {
  setTimeout(() => {
    observer.next('whatever') // 如果想看error，就用observer.error()
  }, 2000)
})

const uploadHttpObserver = {
  next: () => action$$.next({type: UPLOAD_COMPLETE}),
  error: () => action$$.next({type: UPLOAD_FAIL})
} // 结果为成功时，调用nextFn，即推送UPLOAD_COMPLETE给action$$

/*
  定义按钮click触发的处理
*/
const uploadButtonEClick$ = Observable.fromEvent(uploadButtonE, 'click')
  .do(() => {
    action$$.next({type: UPLOAD_START}); // 推送UPLOAD_START给action$$
    uploadButtonE.disabled = true;       // 按钮不可按
    sectionE.appendChild(uploadingE)     // 显示uploading...
    uploadHttp$.subscribe(uploadHttpObserver);  // 启动异步事件
  })

/*
  定义action为UPLOAD_COMPLETE时的处理
*/
const uploadComplete$ = action$$
  .filter(action => action.type === UPLOAD_COMPLETE)
  .do(() => {
    try {
      sectionE.removeChild(uploadingE); // 隐藏uploading...
    } catch(e) {
      console.log(e) // error due to no uploadingE
    }
    sectionE.appendChild(previewE); // 显示已经上传了的图片的缩略图
    uploadButtonE.disabled = false; // 按钮可按
  })

/*
  定义action为UPLOAD_FAIL时的处理
*/
const uploadFail$ = action$$
  .filter(action => action.type === UPLOAD_FAIL)
  .do(() => {
    try {
      sectionE.removeChild(uploadingE);
    } catch(e) {
      console.log(e)
    }
    sectionE.appendChild(errorE) // 显示error
    setTimeout(() => {
      sectionE.removeChild(errorE); // 2秒后，隐藏error
    }, 2000)
    uploadButtonE.disabled = false; // 按钮可按
  })
  
/*
  合并各个subX$，并用subscribe()启动。
*/
const upload_ = Observable.merge(
  uploadButtonEClick$,
  uploadFail$,
  uploadComplete$
)
  .subscribe();