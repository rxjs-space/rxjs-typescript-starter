import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/bindCallback';
import * as request from 'request';

const urlAll = 'http://localhost:3030/todos';

const temp = request.get;

export const getAll$Fac = () => {
  return Observable.bindCallback(request.get)({url: urlAll})
}

export const getOne$Fac = (id: any) => {
  const urlOne = urlAll + '/' + id;
  return Observable.bindCallback(request.get)({url: urlOne})
}

export const postForm$Fac = (form: any) => {
  return Observable.bindCallback(request.post)({url: urlAll, form})
}

export const patchOne$Fac = (id: any, form: any) => {
  const urlOne = urlAll + '/' + id;
  return Observable.bindCallback(request.patch)({url: urlOne, form})
}

export const deletetOne$Fac = (id: any) => {
  const urlOne = urlAll + '/' + id;
  return Observable.bindCallback(request.del)({url: urlOne})
}

// const form = {
//   title: 'from request library',
//   timeAdded: new Date(),
//   status: 'WIP'
// }

// export const postForm$ = postForm$Fac(form);