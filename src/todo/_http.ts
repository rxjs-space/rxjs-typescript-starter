import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/bindCallback';
import 'rxjs/add/observable/dom/ajax';

const urlAll = 'http://localhost:3030/todos';

export const getAll$Fac = () => {
  return Observable.ajax({
    url: urlAll,
    method: 'GET'
  })
}

export const getOne$Fac = (id: any) => {
  const urlOne = urlAll + '/' + id;
  return Observable.ajax({
    url: urlOne,
    method: 'GET'
  })
}

export const postForm$Fac = (form: any) => {
  return Observable.ajax({
    url: urlAll,
    body: form,
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    method: 'POST'
  })
}

export const patchOne$Fac = (id: any, form: any) => {
  const urlOne = urlAll + '/' + id;
  return Observable.ajax({
    url: urlOne,
    body: form,
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    method: 'PATCH'
  })
}

export const deletetOne$Fac = (id: any) => {
  const urlOne = urlAll + '/' + id;
  return Observable.ajax({
    url: urlOne,
    method: 'DELETE'
  })
}



// export interface AjaxRequest {
//     url?: string;
//     body?: any;
//     user?: string;
//     async?: boolean;
//     method?: string;
//     headers?: Object;
//     timeout?: number;
//     password?: string;
//     hasContent?: boolean;
//     crossDomain?: boolean;
//     withCredentials?: boolean;
//     createXHR?: () => XMLHttpRequest;
//     progressSubscriber?: Subscriber<any>;
//     responseType?: string;
// }

// Content-Type: application/x-www-form-urlencoded