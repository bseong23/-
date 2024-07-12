let prev = document.querySelector(".prev");
let next = document.querySelector(".next");


console.log(sliderNav);

//이전 이미지
function previousSlide() { 
  for (let i = 0; i < radioButton.length; i++) {
    if (radioButton[i].checked === true) {
      if (i === 0) {
        // 아 어렵다...
        break;
      }
      first.style.marginLeft = `${-(i - 1) * 20}%`;
      radioButton[i - 1].checked = true;

      break;
    }
  }
}
function nextSlide() {
  for (let i = 0; i < radioButton.length; i += 1) {
    if (radioButton[i].checked === true) {
      if (i === 5) {
        break;
      }
      slide.style.transition = `${1}s`;
      first.style.marginLeft = `${-(i + 1) * 20}%`;
      radioButton[i + 1].checked = true;

      break;
    }
  }
}
function timerSlide() {
  setInterval(() => {
    for (let i = 0; i < radioButton.length; i += 1) {
      if (radioButton[i].checked === true) {
        if (i === 3) {
          radioButton[0].checked = true;
          first.style.marginLeft = `${-80}%`;
          setTimeout(() => {
            slide.style.transition = `${0}s`;
            first.style.marginLeft = `${0}%`;
          }, 1000);

          break;
        }
        slide.style.transition = `${1}s`;
        first.style.marginLeft = `${-(i + 1) * 20}%`;
        radioButton[i + 1].checked = true;

        break;
      }
    }
  }, 5000);
}