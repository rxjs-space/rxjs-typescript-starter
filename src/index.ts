import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';

Observable.of(1)
  .map(val => val*2)
  .subscribe(console.log);

// import './naive-observable';
// import './redux-mock';
import './upload';