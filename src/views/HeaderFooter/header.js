import * as Api from "../api.js";
const myPage = document.querySelector("#myPage");
const signIn = document.querySelector("#signIn");
const signUp = document.getElementById("signUp");
const token = sessionStorage.getItem('token');
if(token){
  const myData = await Api.get(`/api/users`);
  const fullName = myData.user.fullName;
  console.log(window.location.href);
  if(window.location.href == "/admin/admin.html" || window.location.href == "/myPage/myPage.html"){
    myPage.href = "#"
  }else{
    myPage.href = "../certify/certify.html";
  }
  
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