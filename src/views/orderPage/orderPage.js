import * as Api from "../api.js";

const customerName  = document.querySelector("#name");
const customerEmail = document.getElementById("email");
const customerPhoneNumber = document.getElementById("phoneNumber");
const customerAddress = document.getElementById("address");
const totalPrice = document.getElementById("totalPrice");
test();
function test() {
  console.log(customerName);
  console.log(customerEmail);
  console.log(customerPhoneNumber);
  console.log(customerAddress);
  console.log(totalPrice);
}

myData();
async function myData() {
    const data = await Api.get("/api/users");
    const { fullName, email, phoneNumber } = data;
    console.log(fullName);
  
}
