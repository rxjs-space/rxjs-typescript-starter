import './_dom-styles';

// input addButton checkbox title deleteButton showAll/showUndoneOnly


const containerElem = document.createElement('section');
document.body.appendChild(containerElem);

const titleContainer = document.createElement('div');
containerElem.appendChild(titleContainer);
titleContainer.innerHTML = '<h2>Todo List coded in RxJS</h2><h5>double-click on an existing item to edit.</h5>';

const inputContainerElem = document.createElement('div');
containerElem.appendChild(inputContainerElem);

export const inputElem = document.createElement('input');
export const addNewButtonElem = document.createElement('button');
addNewButtonElem.innerText = 'Add New';
inputContainerElem.appendChild(inputElem);
inputContainerElem.appendChild(addNewButtonElem);

const statusContainer = document.createElement('div');
containerElem.appendChild(statusContainer);
statusContainer.style.height = '2em';
export const statusElem = document.createElement('div');
statusContainer.appendChild(statusElem);

export const listElem = document.createElement('div');
containerElem.appendChild(listElem);

export const listMap = new Map(); // maps listElem to the index of the item in the state.items

