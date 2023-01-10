'use strict'

const brightToggleBtn = getNode('.bright-toggle-button');

brightToggleBtn.addEventListener('click', convertTheme);

function convertTheme() {
  console.log(_getAttr('.main', 'class'));
  if (_getAttr('.main', 'class').includes('light')) {
    getNode('.main').style.backgroundColor = '#212121';
    // getNode('.main').removeAttribute('class');
    getNode('.main').classList.toggle('light');
    getNode('.bright-toggle-button').style.background = 'url("../images/icon-sun.svg") no-repeat 50% 50% / 50%';
    getNode('.header').style.background = 'url("../images/bg-desktop-dark.jpg") no-repeat center / auto 100%';
  } else {
    // _setAttr('.main', 'class', 'main light');
    getNode('.main').style.backgroundColor = '#fff';
    // getNode('.main').className('main light');
    getNode('.main').classList.toggle('light');
    getNode('.bright-toggle-button').style.background = 'url("../images/icon-moon.svg") no-repeat 50% 50% / 50%';
    getNode('.header').style.background = 'url("../images/bg-desktop-light.jpg") no-repeat center / auto 100%';
  }
}