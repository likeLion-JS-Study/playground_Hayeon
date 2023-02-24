import React, { useState, useEffect } from "react";
import AppRouter from "./Router";
import { authService } from "../fBase";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function App() {
  // false : 아직 초기화 안됨 파이어베이스가 초기화할때까지 기다리고, 그 후에 로그인되도록 하자 -> useEffect 사용
  const [init, setInit] = useState(false);
  // authService.currentUser를 통해 로그인 여부를 판별가능하게 해줌
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 처음 시작할때 즉 컴포넌트가 mount 될 때 실행되는 것
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        const uid = user.uid;
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);

  console.log(authService.currentUser);

  // firebase가 초기화되고 모든걸 로드할때까지 기다려줄 시간이 없어 로그아웃 되는 것.
  // 타이머를 주고 확인하자.
  /*   setInterval(() => {
    console.log(authService.currentUser);
  }, 2000); */

  return (
    <>
      {/* init이 false라면, 라우터를 숨긴다. 만약 초기화 되었다면, 라우터를 보여주고 아니면 저런 문구 보여줌
      파이어베이스를 기다렸고 로그인되었다는 사실을 알게됨 / 새로고침하면 initialize.. 하고 로그인 되면 라우터(HOME)를 보여줄 것. */}
      {init ? <AppRouter isLoggedIn={isLoggedIn} /> : "Initializing..."}
      <footer>&copy; {new Date().getFullYear()} Nwitter</footer>
    </>
  );
}

export default App;
