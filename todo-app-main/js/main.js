import { attr, css, getNode, getNodes, insertAfter, insertFirst, insertLast, showAlert } from './lib/dom/index.js';

const header = getNode('.header');
const main = getNode('.main');
const brightToggleBtn = getNode('.bright-toggle-button');
const createInput = getNode('.create-input');
const createCheckBox = getNode('.create-check');
const toDoList = getNode('.todo-list');
const todoListHandling = getNode('todo-list-handling');
const useState = (val) => { // 클로져 생성
  let state = val;
  function read() {
    return state;
  }
  function write(newVal) {
    state = newVal;
  }
  return [read, write];
}
const [readTodoNum, writeTodoNum] = useState(0);
const [readTodoList, writeTodoList] = useState([]);

function clearText(target) {
  target.value = '';
}

brightToggleBtn.addEventListener('click', convertBrightTheme);

createInput.addEventListener('keydown', e => {
  if (e.keyCode !== 13) return ;
  insertTodo();
});
createCheckBox.addEventListener('change', insertTodo);
// 이벤트 위임
toDoList.addEventListener('click', function(e) {
  // 꼭 필요한 경우를 제외하곤 버블링을 막지 마세요!
  // e.stopPropagation();
  if (e.target.tagName !== 'BUTTON') return ;
  // e.target.closest('li').remove();
  deleteTodo(e.target.closest('li'));
})

getNode('.todo-list-handling')?.addEventListener('click', function(e) {
  
})

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

function deleteTodo(target) { // 여기 부분 리뷰 받고싶음 - 2
  const newTodoList = [...readTodoList().filter(item => (item.content !== target.children[3].value))]; // input value로 비교하여 같은 값을 뺴는데 count -1만 하기 때문에 해결방안으로 중복값 입력을 막음.
  console.log(newTodoList);
  writeTodoList(newTodoList);
  localStorage.setItem('todoList', JSON.stringify(readTodoList()));
  countDownTodoNumber();
  refreshTodoListFromLocalStorage(getLoadedLocalStorageTodoList);
}

function insertTodo() { // 여기 부분 리뷰 받고싶음 - 1
  console.log(createInput.value);
  if (!createInput.value) {
    showAlert('.alert-error', '할일을 입력해주세요.', 2000);
    return;
  }
  let duplicatedContentFlag = false;
  readTodoList().forEach(item => {
    if (item.content === createInput.value) {
      duplicatedContentFlag = true;
    }
  })
  if (duplicatedContentFlag) {
    showAlert('.alert-error', '중복된 값을 넣지말아주세요.', 2000);
    clearText(createInput);
    return ;
  }
  const newTodoList = [...readTodoList()]; // 전체를 지우고 다시 쓰는 방식, 다른 더 좋은 방법이 있을까요?
  newTodoList.push({
    type: 'active',
    content: createInput.value
  });
  writeTodoList(newTodoList);
  localStorage.setItem('todoList', JSON.stringify(readTodoList()));
  clearText(createInput);
  countUpTodoNumber();
  refreshTodoListFromLocalStorage(getLoadedLocalStorageTodoList);
}

function countUpTodoNumber() {
  writeTodoNum(readTodoNum() + 1);
}

function countDownTodoNumber() {
  if (readTodoNum() === 0) return ;
  writeTodoNum(readTodoNum() - 1);
}

function getLoadedLocalStorageTodoList() {
  const todoListArr = localStorage.getItem('todoList');
  if (todoListArr === null) return ;
  const parsedTodoList = JSON.parse(todoListArr);
  return parsedTodoList;
}

function refreshTodoListFromLocalStorage(callback) {
  const parsedTodList = callback();
  if (!parsedTodList) {
    todoListHandling?.remove();
    return ;
  }
  refreshTodoListHandling();
  getNodes('.todo-list > li').forEach(item => {item.remove();});
  parsedTodList.forEach((item, idx) => {
    let template = `
      <li>
        <label for="check" class="a11y-hidden">추가</label>
        <input type="checkbox" class="update-check" id="check" checked="true"/>
        <label for="update" class="update-label a11y-hidden">todo 추가란</label>
        <input type="text" id="update" class="update-input" value="${item.content}"/>
        <button class="is-delete"></button>
      </li>
    `;
    insertFirst(toDoList, template);
  })
}

function refreshTodoListHandling() {
  getNode('.todo-list-handling')?.remove();
  insertAfter(toDoList, `
    <div class="todo-list-handling" aria-hidden="true"> 
      <span class="list-left-number">${readTodoNum()} items left</span>
      <button class="btn-all" data-is-active='true'>All</button>
      <button class="btn-active" data-is-active='false'>Active</button>
      <button class="btn-completed" data-is-active='false'>Completed</button>
      <button class="btn-clear-completed" data-is-active='false'>clear Completed</button>
    </div>
  `);
  if (readTodoNum() === 0)
   getNode('.todo-list-handling').remove();
}