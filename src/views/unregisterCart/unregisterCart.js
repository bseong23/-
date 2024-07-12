let item = JSON.parse(localStorage.getItem("cart"));  //로컬스토리지에서 key="cart" 불러오기
let removeBtn = document.querySelectorAll('.removeBtn');
let totalPrice = document.querySelector("#totalPrice"); //id 값이 totalPrice인 요소 선택
const myCart = document.querySelector("#cart"); //id 값이 cart인 요소 선택
const subtractBtn = document.querySelector('.subtract');
const addBtn = document.querySelector('.add');
const allremoveBtn = document.querySelector(".allremoveBtn");
const myPage = document.querySelector("#myPage");
const signIn = document.querySelector("#signIn");
const signUp = document.getElementById("signUp");
const token = sessionStorage.getItem('token');
addCartItem();
function addCartItem() {
  let total = 0;
  for(let i=0; i<item.length; i++){  //addItem의 길이만큼 반복 로컬스토리지에 담긴 상품의 종류 수
    let name = item[i].name;  //item[i]번째 객체의 name 저장
    let price = item[i].price; //item[i]번째 객체의 price의 ','없애고  저장
    let count = item[i].count;
    total += (Number(price.slice(0,-1).replace(",",""))) * count
    localStorage.setItem('totalprice', total);
    let imgSrc = item[i].imgSrc;
    let cartElement = ` <div id="item">
                          <input type="checkbox" class="check" style="display:none">
                          <img src="${imgSrc}"></img>
                          <h1 class="title">${name}</h1>
                          <p class="price">${price}</p>
                          <div class="countManage">
                            <button class="subtract" onclick="subtract(this);"></button>
                            <p class="count">${count}</p>
                            <button class="add" onclick="add(this);"></button>
                          </div>
                          <button class="removeBtn"></button>
                        </div>
                        `;
    myCart.insertAdjacentHTML('beforeend', cartElement);
  }
  let dbtotalprice = localStorage.getItem('totalprice');
  totalPrice.innerText = `총 주문금액: ${dbtotalprice.toLocaleString('ko-KR')}원`;
  removeBtn = document.querySelectorAll('.removeBtn');
}
function subtract(e) { //매개변수 e로 e=this로 html에서 설정함
  let countText = e.parentNode.children[1];
  let count = Number(countText.innerText);  
  let parent = e.parentNode.parentNode; //parent = this.부모노드.부모노드
  let children = parent.children;
  let nameText = children[2].innerText;  //child = item[i]번째 객체의 name
  let total = 0;
  if(count > 1){ //count가 1보다 크면
    for(let i=0; i<item.length; i++){
      if(nameText === item[i].name){ 
        countText.innerText = count - 1; //count[i]번째의 HTML을 1 감소 후 저장
        item[i].count -= 1; //item[i].count를 1 감소
        localStorage.setItem('cart', JSON.stringify(item)) ;
        total += Number(item[i].price.slice(0,-1).replace(",","")) * (item[i].count);
        //return 로컬스토리지에 'cart'에 item 저장
      }else{
        total += Number(item[i].price.slice(0,-1).replace(",","")) * (item[i].count);
      }
    }
      localStorage.setItem('totalprice', total);
      totalPrice.innerText = `총 주문금액: ${total.toLocaleString("ko-KR")}원`;
  } 
}
function add(e) {
  let countText = e.parentNode.children[1];
  let count = Number(countText.innerText);  
  let parent = e.parentNode.parentNode; //parent = this.부모노드.부모노드
  let children = parent.children;
  let nameText = children[2].innerText;  //child = item[i]번째 객체의 name
  let total = 0;
  if(count < 99){ //count가 1보다 크면
    for(let i=0; i<item.length; i++){
      if(nameText === item[i].name){ 
        countText.innerText = count + 1; //count[i]번째의 HTML을 1 감소 후 저장
        item[i].count += 1; //item[i].count를 1 감소
        localStorage.setItem('cart', JSON.stringify(item)) 
        total += Number(item[i].price.slice(0,-1).replace(",","")) * (item[i].count);
        //return 로컬스토리지에 'cart'에 item 저장
      }else{
        total += Number(item[i].price.slice(0,-1).replace(",","")) * (item[i].count);
      }
      
    }
      localStorage.setItem('totalprice', total);
      totalPrice.innerText = `총 주문금액: ${total.toLocaleString("ko-KR")}원`;
  } 
}
allremoveBtn.addEventListener("click", function() {
  if(item){
    alert("장바구니를 비웠습니다");
  localStorage.clear(); 
  }
  
})
removeBtn.forEach((removeBtn, index) => {
  removeBtn.addEventListener("click", function() {
    alert("삭제되었습니다");
    item.splice(index, 1);  //배열로 저장되어있는 data에서 index에서 1개 제거
    localStorage.setItem('cart', JSON.stringify(item)); //로컬스토리지에 key = 'cart'로 저장
    const div = document.getElementById("item");
  })
})