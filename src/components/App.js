import React, { useState } from "react";
import AppRouter from "./Router";
import { authService } from "../fBase";

function App() {
  // authService.currentUser를 통해 로그인 여부를 판별가능하게 해줌
  const [isLoggedIn, setIsLoggedIn] = useState(authService.currentUser);
  return (
    <>
      <AppRouter isLoggedIn={isLoggedIn} />
      <footer>&copy; {new Date().getFullYear()} Nwitter</footer>
    </>
  );
}

export default App;
