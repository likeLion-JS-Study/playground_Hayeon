import { clearContents, attr, css, getNode, getNodes, insertAfter, insertFirst, insertLast, showAlert } from './lib/dom/index.js';
import { memo } from './lib/utils/memo.js';

memo('@header', () => getNode('.header'));
memo('@main', () => getNode('.main'));
memo('@brightToggleBtn', () => getNode('.bright-toggle-button'));
memo('@createInput', () => getNode('.create-input'));
memo('@createCheckBox', () => getNode('.create-check'));
memo('@toDoList', () => getNode('.todo-list'));
// memo('@todoListHandling', () => getNode('todo-list-handling'));
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

memo('@brightToggleBtn').addEventListener('click', convertBrightTheme);

memo('@createInput').addEventListener('keydown', e => {
  if (e.keyCode !== 13) return ;
  insertTodo();
});
memo('@createCheckBox').addEventListener('change', insertTodo);
// 이벤트 위임
memo('@toDoList').addEventListener('click', function(e) {
  // 꼭 필요한 경우를 제외하곤 버블링을 막지 마세요!
  // e.stopPropagation();
  if (attr(e.target, 'class') === 'update-check')
    completeTodo(e.target);
  // if (attr(e.target, 'class') === 'update-input')
  if (e.target.tagName === 'BUTTON')
    deleteTodo(e.target.closest('li'));
  // e.target.closest('li').remove();
})

// getNode('.todo-list-handling')?.addEventListener('click', function(e) {
//   alert('hi');
// })

function completeTodo(target) {
  if (attr(target, 'data-checked') === 'false') {
    attr(target, 'data-checked', 'true');
  }
  else {
    attr(target, 'data-checked', 'false');
  }
  updateTodo(target);
  console.log(readTodoList());
}

function updateTodo(target) {
  // 리뷰 받고 싶은 곳 - 3
  // 직접 수정, 다른 좋은 방법이? 
  readTodoList().forEach(item => {
    if (item.content === target.closest('li').children[3].value) {
      item.type = (item.type === 'active') ? 'completed' : 'active';
    }
  });
}

function convertBrightTheme() {
  console.log(attr('.main', 'class'));
  if (!attr('.main', 'class').includes('dark')) {
    memo('@header').style.background = 'url("../images/bg-desktop-dark.jpg") no-repeat center / auto 100%';
    memo('@main').style.background = '#212121';
    memo('@brightToggleBtn').style.background = 'url("../images/icon-sun.svg") no-repeat 50% 50% / 50%'; 
  }
  else {
    memo('@header').style.background = 'url("../images/bg-desktop-light.jpg") no-repeat center / auto 100%';
    memo('@main').style.background = '#fff';
    memo('@brightToggleBtn').style.background = 'url("../images/icon-moon.svg") no-repeat 50% 50% / 50%'; 
  }
  memo('@main').classList.toggle('dark');
}

function deleteTodo(target) { // 여기 부분 리뷰 받고싶음 - 2
  const newTodoList = [...readTodoList().filter(item => (item.content !== target.children[3].value))]; // input value로 비교하여 같은 값을 뺴는데 count -1만 하기 때문에 해결방안으로 중복값 입력을 막음.
  writeTodoList(newTodoList);
  localStorage.setItem('todoList', JSON.stringify(readTodoList()));
  countDownTodoNumber();
  refreshTodoListFromLocalStorage(getLoadedLocalStorageTodoList);
}

function insertTodo() { // 여기 부분 리뷰 받고싶음 - 1
  console.log(memo('@createInput').value);
  if (!memo('@createInput').value) {
    showAlert('.alert-error', '할일을 입력해주세요.', 2000);
    return;
  }
  let duplicatedContentFlag = false;
  readTodoList().forEach(item => {
    if (item.content === memo('@createInput').value) {
      duplicatedContentFlag = true;
    }
  })
  if (duplicatedContentFlag) {
    showAlert('.alert-error', '중복된 값을 넣지말아주세요.', 2000);
    clearText(memo('@createInput'));
    return ;
  }
  const newTodoList = [...readTodoList()]; // 전체를 지우고 다시 쓰는 방식, 다른 더 좋은 방법이 있을까요?
  newTodoList.push({
    type: 'active',
    content: memo('@createInput').value
  });
  writeTodoList(newTodoList);
  localStorage.setItem('todoList', JSON.stringify(readTodoList()));
  clearText(memo('@createInput'));
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
        <input type="checkbox" class="update-check" id="check" data-checked='false'/>
        <label for="update" class="update-label a11y-hidden">todo 추가란</label>
        <input type="text" id="update" class="update-input" readOnly value="${item.content}"/>
        <button class="is-delete"></button>
      </li>
    `;
    insertFirst(memo('@toDoList'), template);
  })
}

function refreshTodoListHandling() {
  getNode('.todo-list-handling')?.remove();
  insertAfter(memo('@toDoList'), `
    <div class="todo-list-handling" aria-hidden="true"> 
      <span class="list-left-number">${readTodoNum()} items left</span>
      <button class="btn-all" data-active='true'>All</button>
      <button class="btn-active" data-active='false'>Active</button>
      <button class="btn-completed" data-active='false'>Completed</button>
      <button class="btn-clear-completed" data-active='false'>clear Completed</button>
    </div>
  `);
  if (readTodoNum() === 0) {
    getNode('.todo-list-handling').remove();
    return ;
  }
  // addEventListener 이때 넣어야함
  // 이벤트 위임
  getNode('.todo-list-handling').addEventListener('click', todoListMenuHandling);
}

function todoListMenuHandling(e) {
  // 꼭 필요한 경우를 제외하곤 버블링을 막지 마세요!
  // e.stopPropagation();
  const btnAll = getNode('.btn-all');
  const btnActive = getNode('.btn-active');
  const btnCompleted = getNode('.btn-completed');
  if (attr(e.target, 'class') === 'btn-all') {
    changeToAll({btnAll, btnActive, btnCompleted});
  }
  else if (attr(e.target, 'class') === 'btn-active') {
    changeToActive({btnAll, btnActive, btnCompleted});
  }
  else if (attr(e.target, 'class') === 'btn-completed') {
    changeToCompleted({btnAll, btnActive, btnCompleted});
  }
  else if (attr(e.target, 'class') === 'btn-clear-completed') {
    changeToAll({btnAll, btnActive, btnCompleted});
  }
  // if (attr(e.target, 'class') === 'update-input')
  // if (e.target.tagName === 'BUTTON')
  //   deleteTodo(e.target.closest('li'));
  // e.target.closest('li').remove();
}

/* -------------------------------------------------------------------------- */
/*                             change data status                             */
/* -------------------------------------------------------------------------- */
function changeToAll({btnAll, btnActive, btnCompleted}) {
  attr(btnAll, 'data-active', 'true');
  attr(btnActive, 'data-active', 'false');
  attr(btnCompleted, 'data-active', 'false'); 
}

function changeToActive({btnAll, btnActive, btnCompleted}) {
  attr(btnAll, 'data-active', 'false');
  attr(btnActive, 'data-active', 'true');
  attr(btnCompleted, 'data-active', 'false');
}

function changeToCompleted({btnAll, btnActive, btnCompleted}) {
  attr(btnAll, 'data-active', 'false');
  attr(btnActive, 'data-active', 'false');
  attr(btnCompleted, 'data-active', 'true');
}

