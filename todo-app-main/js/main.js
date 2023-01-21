import { clearContents, attr, css, getNode, getNodes, insertAfter, insertFirst, insertLast, showAlert } from './lib/dom/index.js';
import { memo } from './lib/utils/memo.js';

// 데이터의 unique한 값을 content로 세워 진행함.
const header = getNode('.header');
const main = getNode('.main');
const brightToggleBtn = getNode('.bright-toggle-button');
const createInput = getNode('.create-input');
const createCheckBox = getNode('.create-check');
const toDoList = getNode('.todo-list');
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
const [readRenderingTodoList, writeRenderingTodoList] = useState([]);
const [readSeekState, writeSeekState] = useState('all');

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
  if (attr(e.target, 'class') === 'update-check')
    updateTodo(e.target);
  if (e.target.tagName === 'BUTTON')
    deleteTodo(e.target.closest('li'));
})

/* -------------------------------------------------------------------------- */
/*                             toggle bright theme                            */
/* -------------------------------------------------------------------------- */
function convertBrightTheme() {
  if (!attr('.main', 'class').includes('dark')) {
    header.style.background = 'url("../images/bg-desktop-dark.jpg") no-repeat center / auto 100%';
    main.style.background = '#212121';
    brightToggleBtn.style.background = 'url("../images/icon-sun.svg") no-repeat 50% 50% / 50%'; 
  }
  else {
    header.style.background = 'url("../images/bg-desktop-light.jpg") no-repeat center / auto 100%';
    main.style.background = '#fff';
    brightToggleBtn.style.background = 'url("../images/icon-moon.svg") no-repeat 50% 50% / 50%'; 
  }
  main.classList.toggle('dark');
}
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                           create, update, delete                           */
/* -------------------------------------------------------------------------- */
function insertTodo() { // 여기 부분 리뷰 받고싶음 - 1
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
  // countUpTodoNumber();
  refreshTodoListFromLocalStorage();
}

function deleteTodo(target) { // 여기 부분 리뷰 받고싶음 - 2
  const newTodoList = [...readTodoList().filter(item => (item.content !== target.children[3].value))]; // input value로 비교하여 같은 값을 뺴는데 count -1만 하기 때문에 해결방안으로 중복값 입력을 막음.
  writeTodoList(newTodoList);
  localStorage.setItem('todoList', JSON.stringify(readTodoList()));
  // countDownTodoNumber();
  refreshTodoListFromLocalStorage();
}

function updateTodo(target) { // 리뷰 받고 싶은 곳 - 3
  const newTodoList = readTodoList().map(item => {
    if (item.content === target.closest('li').children[3].value)
      return (item.type === 'active') ? {type: 'completed', content: item.content} : {type: 'active', content: item.content};
    return item;
  });
  writeTodoList(newTodoList);
  localStorage.setItem('todoList', JSON.stringify(readTodoList()));
  refreshTodoListFromLocalStorage();
}
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                    rendering todoList from localStorage                    */
/* -------------------------------------------------------------------------- */

/* ----------------------------- todoList datas ----------------------------- */
function refreshTodoListFromLocalStorage() {
  renderTodoList();
  renderTodoListMenuHandling();
}

function getLoadedLocalStorageTodoList() {
  const allTodoListArr = localStorage.getItem('todoList');
  if (allTodoListArr === null) return ;
  const parsedTodoList = JSON.parse(allTodoListArr);
  let retTodoList = [];
  if (readSeekState() === 'all')
    retTodoList = [...parsedTodoList];
  else if (readSeekState() === 'active')
    retTodoList = [...parsedTodoList.filter(item => item.type === 'active')];
  else if (readSeekState() === 'completed')
    retTodoList = [...parsedTodoList.filter(item => item.type === 'completed')];
  writeTodoNum(retTodoList.length);
  return retTodoList;
}


function renderTodoList() {
  const parsedTodListData = getLoadedLocalStorageTodoList();
  getNodes('.todo-list > li').forEach(item => {item.remove();});
  parsedTodListData.forEach((item, idx) => {
    let template = `
      <li>
        <label for="check" class="a11y-hidden">추가</label>
        <input type="checkbox" class="update-check" id="check" data-checked='${item.type !== 'active'}'/>
        <label for="update" class="update-label a11y-hidden">todo 추가란</label>
        <input type="text" id="update" class="update-input" readOnly value="${item.content}"/>
        <button class="is-delete"></button>
      </li>
    `;
    insertFirst(toDoList, template);
  })
}

/* ------------------------------ todoList menu ----------------------------- */
function renderTodoListMenuHandling() {
  getNode('.todo-list-handling')?.remove();
  insertAfter(toDoList, `
    <div class="todo-list-handling" aria-hidden="true"> 
      <span class="list-left-number">${readTodoNum()} items left</span>
      <button class="btn-all" data-active='${readSeekState() === 'all'}'>All</button>
      <button class="btn-active" data-active='${readSeekState() === 'active'}'>Active</button>
      <button class="btn-completed" data-active='${readSeekState() === 'completed'}'>Completed</button>
      <button class="btn-clear-completed" data-active='false'>clear Completed</button>
    </div>
  `);
  // 이벤트 위임
  getNode('.todo-list-handling').addEventListener('click', todoListMenuHandling);
}
/* -------------------------------------------------------------------------- */

function todoListMenuHandling(e) {
  // 꼭 필요한 경우를 제외하곤 버블링을 막지 마세요!
  // e.stopPropagation();
  const btnAll = getNode('.btn-all');
  const btnActive = getNode('.btn-active');
  const btnCompleted = getNode('.btn-completed');
  if (attr(e.target, 'class') === 'btn-all')
    changeToAll({btnAll, btnActive, btnCompleted});
  else if (attr(e.target, 'class') === 'btn-active')
    changeToActive({btnAll, btnActive, btnCompleted});
  else if (attr(e.target, 'class') === 'btn-completed')
    changeToCompleted({btnAll, btnActive, btnCompleted});
  else if (attr(e.target, 'class') === 'btn-clear-completed') {
    changeToAll({btnAll, btnActive, btnCompleted});
    clearCompleted();
  }
  renderTodoList();
  renderTodoListMenuHandling();
}

/* -------------------------------------------------------------------------- */
/*                             change data status                             */
/* -------------------------------------------------------------------------- */
function changeToAll({btnAll, btnActive, btnCompleted}) {
  attr(btnAll, 'data-active', 'true');
  attr(btnActive, 'data-active', 'false');
  attr(btnCompleted, 'data-active', 'false'); 
  writeSeekState('all');
}

function changeToActive({btnAll, btnActive, btnCompleted}) {
  attr(btnAll, 'data-active', 'false');
  attr(btnActive, 'data-active', 'true');
  attr(btnCompleted, 'data-active', 'false');
  writeSeekState('active');
}

function changeToCompleted({btnAll, btnActive, btnCompleted}) {
  attr(btnAll, 'data-active', 'false');
  attr(btnActive, 'data-active', 'false');
  attr(btnCompleted, 'data-active', 'true');
  writeSeekState('completed');
}

function clearCompleted() {
  const newTodoList = [...readTodoList().filter(item => item.type === 'active')];
  writeTodoList(newTodoList);
  localStorage.setItem('todoList', JSON.stringify(newTodoList));
}

