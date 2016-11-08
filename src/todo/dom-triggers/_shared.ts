import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/fromEvent';

import { visibilityFormElem } from '../_shared';

const domClick$ = Observable.fromEvent(document, 'click');
export const domClick$$ = new Subject();
domClick$.subscribe(domClick$$);

const domDblClick$ = Observable.fromEvent(document, 'dblclick');
export const domDblClick$$ = new Subject();
domDblClick$.subscribe(domDblClick$$);

const domKeyup$ = Observable.fromEvent(document, 'keyup');
export const domKeyup$$ = new Subject();
domKeyup$.subscribe(domKeyup$$);

const visibilityChange$ = Observable.fromEvent(visibilityFormElem, 'change')
export const visibilityChange$$ = new Subject();
visibilityChange$.subscribe(visibilityChange$$);
