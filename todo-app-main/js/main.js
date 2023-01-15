import { attr, css, getNode, insertAfter, insertFirst, insertLast, showAlert } from './lib/dom/index.js';

const header = getNode('.header');
const main = getNode('.main');
const brightToggleBtn = getNode('.bright-toggle-button');
const createInput = getNode('.create-input');
const createCheckBox = getNode('.create-check');
const toDoList = getNode('.todo-list');
const useState = (val) => {
  let state = val;
  function read() {
    return state;
  }
  function write(newVal) {
    state = newVal;
  }
  return [read, write];
}

const [read, write] = useState(0);

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
  countUpTodoNumber();
}

function countUpTodoNumber() {
  write(read() + 1);
  if (read() > 1) { 
    getNode('.list-left-number').remove();
    let template = `
      <span class="list-left-number">${read()} items left</span>
    `;
    insertFirst('.todo-list-handling', template);
    return ;
  }
  insertAfter(toDoList, `
    <div class="todo-list-handling" aria-hidden="true"> 
      <span class="list-left-number">${read()} items left</span>
      <button class="btn-all" data-is-active='true'>All</button>
      <button class="btn-active" data-is-active='false'>Active</button>
      <button class="btn-completed" data-is-active='false'>Completed</button>
      <button class="btn-clear-completed" data-is-active='false'>clear Completed</button>
    </div>
  `);
}

function countDownTodoNumber() {
  if (read() === 0) return ;
  write(read() - 1);
  getNode('.list-left-number').remove();
  if (read() === 0) 
    getNode('.todo-list-handling').remove();
  else {
    let template = `
      <span class="list-left-number">${read()} items left</span>
    `;
    insertFirst('.todo-list-handling', template);
  }
}

// 이벤트 위임
toDoList.addEventListener('click', function(e) {
  // 꼭 필요한 경우를 제외하곤 버블링을 막지 마세요!
  // e.stopPropagation();
  if (e.target.tagName !== 'BUTTON') return ;
  e.target.closest('li').remove();
  countDownTodoNumber();
})

getNode('.todo-list-handling')?.addEventListener('click', function(e) {
  
})