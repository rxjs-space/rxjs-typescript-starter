import { Observable } from 'rxjs/Observable';

import { addNew$ } from './add-new';
import { delete$$ } from './delete';
import { edit$$ } from './edit';
import { toggleComplete$$ } from './toggle-complete';
import { toggleView$$ } from './toggle-view';

export const domTriggers$ = Observable.merge(addNew$, delete$$, edit$$, toggleComplete$$, toggleView$$);
