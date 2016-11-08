import { CONST, State, listContainerElem, visibilityFormElem, listMap } from '../_shared';

export const renderer = (state: State) => {
  console.log(state);
  (<any>visibilityFormElem).VISIBILITY.value = state.visibility;
  listContainerElem.innerHTML = '';
  listMap.clear();  // 每次state更新，重新构建listMap
  state.items.forEach((item) => {
    const itemElem = document.createElement('div');
    (<any>visibilityFormElem).VISIBILITY.value === CONST.VISIBILITY_SHOW_UNDONE ? itemElem.hidden = item.done : itemElem.hidden = false;
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = item.done;
    itemElem.appendChild(checkbox);

    const content = document.createElement('input');
    content.value = decodeURIComponent(item.title);
    content.style.textDecoration = item.done ? 'line-through': '';
    content.disabled = true;
    itemElem.appendChild(content);

    const buttonX = document.createElement('button');
    buttonX.innerHTML = CONST.DELETE_BUTTON_TEXT;
    itemElem.appendChild(buttonX);

    listMap.set(itemElem, item.id);
    listContainerElem.appendChild(itemElem);
  })
}