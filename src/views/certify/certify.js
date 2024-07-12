import * as Api from "../api.js";
const certifyBtn = document.querySelector("#certifyBtn");
const emailInput = document.querySelector("#email");
console.log(certifyBtn);
certifyBtn.addEventListener("click", async function() {
  const email = emailInput.value;
  const data = sessionStorage.getItem("email").replace('"', "").replace('"', "");
  const token = sessionStorage.getItem("token");
  console.log(email);
  console.log(data);
  try{
   if(email === data){
    const myData = await Api.get(`/api/users?email=${data}`);
    if(myData.user.role === "admin"){
      alert("관리자 페이지로 접속합니다.");
      window.location.href = "../adminPage/adminPage.html";
      }else{
        alert("마이페이지로 이동합니다.")
        window.location.href = "../myPage/myPage.html";
      }
    }else{
      alert("이메일을 다시 입력해주세요.");
    }

  }catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  
  
}})
