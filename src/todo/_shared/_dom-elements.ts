import './_dom-styles';
import * as CONST from './_constants';

/*

Dom Elements

containerElem
    |
     -- titleContainerElem
    |
     -- inputContainerElem
    |
     -- visibilityContainerElem
    |
     -- statusContainerElem
    |
     -- listContainerElem
*/


const containerElem = document.createElement('section');
document.body.appendChild(containerElem);

const titleContainerElem = document.createElement('div');
containerElem.appendChild(titleContainerElem);
titleContainerElem.innerHTML = '<h2>Todo List coded in RxJS</h2><h5>double-click on an existing item to edit.</h5>';

const inputContainerElem = document.createElement('div');
containerElem.appendChild(inputContainerElem);

export const inputElem = document.createElement('input');
export const addNewButtonElem = document.createElement('button');
addNewButtonElem.innerText = 'Add New';
inputContainerElem.appendChild(inputElem);
inputContainerElem.appendChild(addNewButtonElem);

export const visibilityFormElem = document.createElement('form');
containerElem.appendChild(visibilityFormElem);
visibilityFormElem.style.marginTop = '5px';
const showAllElem = document.createElement('input');
Object.assign(showAllElem, {
    id: CONST.VISIBILITY_SHOW_ALL,
    type: 'radio',
    name: CONST.NAME_OF_VISIBILITY_RADIO,
    value: CONST.VISIBILITY_SHOW_ALL
})
const showAllLableElm = <HTMLLabelElement>document.createElement('label');
showAllLableElm.innerHTML = 'Show All';
showAllLableElm.htmlFor = CONST.VISIBILITY_SHOW_ALL;
visibilityFormElem.appendChild(showAllElem);
visibilityFormElem.appendChild(showAllLableElm);

const showUndoneElem = document.createElement('input');
Object.assign(showUndoneElem, {
    id: CONST.VISIBILITY_SHOW_UNDONE,
    type: 'radio',
    name: CONST.NAME_OF_VISIBILITY_RADIO,
    value: CONST.VISIBILITY_SHOW_UNDONE,
})
showUndoneElem.style.marginLeft = '30px';
const showUndoneLableElm = <HTMLLabelElement>document.createElement('label');
showUndoneLableElm.innerHTML = 'Show Undone';
showUndoneLableElm.htmlFor = CONST.VISIBILITY_SHOW_UNDONE;
visibilityFormElem.appendChild(showUndoneElem);
visibilityFormElem.appendChild(showUndoneLableElm);

const statusContainerElem = document.createElement('div');
containerElem.appendChild(statusContainerElem);
statusContainerElem.style.minHeight = '2em';
export const statusElem = document.createElement('div');
statusContainerElem.appendChild(statusElem);

export const listContainerElem = document.createElement('div');
containerElem.appendChild(listContainerElem);


