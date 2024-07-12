import * as Api from "../api.js";

const payBtn = document.querySelector("#payBtn");
const cart = localStorage.getItem("cart");
console.log(cart);
const totalPrice = localStorage.getItem("totalprice");
const products = [];
for(let i=0; i<cart.length; i++){
  let name = cart[i].name;
  let _id = cart[i].productId;
  let quantity = cart[i].count;
  let orderData = { name, _id, quantity }
  products.push(orderData);
}

payBtn.addEventListener("click", async function() {
  const userName = document.getElementById("fullName").value;
  const userEmail = document.getElementById("email").value;
  const userAddress = document.getElementById("address").value;
  const userPhoneNumber = document.getElementById("phoneNumber").value;
 
  console.log(cart);
  console.log(products, userName, userEmail, userAddress, userPhoneNumber);
  try{
    const data = { userName, userEmail, userAddress, userPhoneNumber };
    await Api.post("api/orders", data);
    alert("성공적으로 주문되었습니다.")
    window.location.href = "/login";
  }catch(err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. ${err.message}`);
  }
  
})
