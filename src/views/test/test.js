import * as Api from "../api.js";
const addItem = document.querySelector("#addItem");
console.log(addItem);

let fileInput = document.getElementById("fileInput");
fileInput.addEventListener("change", function(input){
  let file = input.target.files[0]; // 선택된 파일 가져오기
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function(){
    let newImage = document.createElement("img"); //새 이미지 추가
    //이미지 source 가져오기
    newImage.src = URL.createObjectURL(file);
    newImage.id = "img"
    newImage.style.width = "100%";
    newImage.style.height = "100%";
    newImage.style.objectFit = "cover";
    newImage.className = "photoFrame";
    
    //이미지를 image-show div에 추가
    document.getElementById('image-show').appendChild(newImage);
    //image-show 이미지 삭제
    newImage.addEventListener("click", function() {
      document.getElementById("image-show").removeChild(newImage);
    })
  }
})
const select = document.querySelector("#category");

window.onload = async function() {
    const data2 = await Api.get("/api/category");
    for(let i=0; i<data2.length; i++){
      let category = data2[i].category
      console.log(category)
      select.insertAdjacentHTML('beforeend',`<option value="${category}">${category}</option>`);
    }
}
addItem.addEventListener("click", addItemDB)
async function addItemDB(e) {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;
  const stock = document.getElementById("stock").value; 
  const imageUrl = document.getElementById("img").src;
  const category = document.getElementById("category").value;
  console.log(category);
  try{
    const data = { name, imageUrl, price, stock, category };
    
    await Api.post("/api/product", data);
    
    
    alert("상품이 추가되었습니다.");
  } catch(err){
    console.error(err.stack);
    alert(`문제가 발생하였습니다. ${err.message}`);
  }
  
}
