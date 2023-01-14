import { attr, css, getNode, insertFirst, insertLast, showAlert } from './lib/dom/index.js';

const header = getNode('.header');
const main = getNode('.main');
const brightToggleBtn = getNode('.bright-toggle-button');
const createInput = getNode('.create-input');
const createCheckBox = getNode('.create-check');
const toDoList = getNode('.todo-list');

function clearText(target) {
  target.value = '';
}

brightToggleBtn.addEventListener('click', convertBrightTheme);
createInput.addEventListener('keydown', e => {
  if (e.keyCode !== 13) return ;
  insertInputTodo();
});
createCheckBox.addEventListener('change', insertInputTodo);


function convertBrightTheme() {
  console.log(attr('.main', 'class'));
  if (!attr('.main', 'class').includes('dark')) {
   main.classList.toggle('dark');
   header.style.background = 'url("../images/bg-desktop-dark.jpg") no-repeat center / auto 100%';
   main.style.background = '#212121';
   brightToggleBtn.style.background = 'url("../images/icon-sun.svg") no-repeat 50% 50% / 50%'; 
  }
  else {
   main.classList.toggle('dark');
   header.style.background = 'url("../images/bg-desktop-light.jpg") no-repeat center / auto 100%';
   main.style.background = '#fff';
   brightToggleBtn.style.background = 'url("../images/icon-moon.svg") no-repeat 50% 50% / 50%'; 
  }
}

function insertInputTodo() {
  console.log(createInput.value);
  if(!createInput.value) {
    showAlert('.alert-error', '할일을 입력해주세요.', 2000);
    return;
  }
  let template = `
  <li>
    <label for="check" class="a11y-hidden">추가</label>
    <input type="checkbox" class="update-check" id="check" checked="true"/>
    <label for="update" class="update-label a11y-hidden">todo 추가란</label>
    <input type="text" id="update" class="update-input" value=${createInput.value} />
    <button class="is-delete"></button>
  </li>
  `;
  insertFirst(toDoList, template);
  clearText(createInput);
}