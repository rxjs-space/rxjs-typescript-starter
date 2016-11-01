import { State } from './_shared';
import { listElem, listMap } from './_dom-elements';

export const renderer = (state: State) => {
  console.log(state);
  listElem.innerHTML = '';
  state.items.forEach((item) => {
    const itemElem = document.createElement('div');
    itemElem.innerHTML = '<input type="checkbox"><input type="text" disabled value="'+decodeURIComponent(item.title)+'"><button>X</button>';
    listMap.set(itemElem, item.id);
    listElem.appendChild(itemElem);
  })
}