import * as Api from "../api.js";
const myPage = document.querySelector("#myPage");
const signIn = document.querySelector("#signIn");
const signUp = document.getElementById("signUp");
const token = sessionStorage.getItem('token');
const cart = document.querySelector("#cartLogo")

//로그인 했을시 세션스토리지에 token이 생김 token유무로 헤더 변경
if(token){
  const myData = await Api.get(`/api/users`);
  const fullName = myData.user.fullName;
  myPage.href = "../certify/certify.html";
  cart.href = "../cart/cart.html"
  signIn.innerHTML = `${fullName}님`;
  signUp.innerHTML = "LogOut";
  viewItem();
  signUp.addEventListener("click", function() {
    alert("로그아웃되었습니다.")
    window.location.href = "/home/home.html";
    sessionStorage.clear();
    
  })
}else{
  cart.href = "../unregisterCart/unregisterCart.html"
  myPage.href = "../login/login.html";
  signIn.href = "../login/login.html";
  signUp.href = "../register/register.html";
  signIn.innerHTML = "Sign In"
  signUp.innerHTML = "Sign Up"
  viewItem();
}
async function viewItem() {
  const data = await Api.get("/api/product");
  console.log(data);
  const mainPage = document.getElementById("mainPage");
  console.log(mainPage);
  for(let i=0; i<data.length; i++){
    let item = `<div class="clothes">
                  <img src=../image/${data[i].name}.jpg class="img">
                  <input 
                    type="image" 
                    src=${"../image/cart.png"} 
                    class="itemCart">
                  <h4>${data[i].name}</h4>
                  <p>${data[i].price.toLocaleString('ko-KR')}원</p>            
                </div>`
    mainPage.insertAdjacentHTML('beforeend', item);
    mainPage.onclick = function(e){
      if(e.target.tagName === "IMG" || e.target.tagName === "H4" || e.target.tagName === "P"){
        return;
      }
      alert("장바구니에 추가되었습니다.");
      let parent = e.target.parentNode; //el의 부모노드
      let children = parent.children; //parent의 자식들 배열
      let imgSrc = children[0].src;  //child[0](img)의 src 
      let name = children[2].innerHTML; //child[2](h4)의 html (상품명)
      let price = children[3].innerHTML; //child[3](p)의 html (가격)
      let count = 1;
      let productId;
      for(let i=0; i<data.length; i++){
        if(name == data[i].name){
          productId = data[i]._id;
        }
      }
      console.log(productId);
      let obj = { //obj 객체 {name, price, count, imgSrc} 
        name, 
        price, 
        count,
        imgSrc,
        productId,
      }
      if(localStorage.cart){
        let cartItems = JSON.parse(localStorage.getItem('cart'));
        for(let i=0; i<cartItems.length; i++){
          if(obj.name == cartItems[i].name){
            cartItems[i].count += 1;
            return localStorage.setItem('cart', JSON.stringify(cartItems));
          }
        }
        cartItems.push(obj);
        localStorage.setItem('cart', JSON.stringify(cartItems));
      }else{
      localStorage.setItem('cart', JSON.stringify([obj]));
      }
    }
  }
}




