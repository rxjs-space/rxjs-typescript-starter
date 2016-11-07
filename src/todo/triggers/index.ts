import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/merge';

import { domTriggers$ } from './dom-triggers';

export const triggers$ = Observable.merge(domTriggers$);
