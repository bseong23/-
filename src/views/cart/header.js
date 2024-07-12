import * as Api from "../api.js";
if(token){
  const email = sessionStorage.getItem("email").replace('"', "").replace('"', "");
  const myData = await Api.get(`/api/users?email=${email}`);
  const fullName = myData.user.fullName;
  myPage.href = "../certify/certify.html";
  signIn.innerHTML = `${fullName}님`;
  signUp.innerHTML = "LogOut";
  signUp.addEventListener("click", function() {
    alert("로그아웃되었습니다.")
    window.location.href = "/home/home.html";
    sessionStorage.clear();
  })
}else{
  myPage.href = "../login/login.html";
  signIn.href = "../login/login.html";
  signUp.href = "../register/register.html";
  signIn.innerHTML = "Sign In"
  signUp.innerHTML = "Sign Up"
}
