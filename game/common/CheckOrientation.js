let screenButtonToggle = document.querySelector(".screenButtonToggle");
let screenButtonBottom = document.querySelector(".screenButtonBottom");
let screenButtonsEmoji = document.querySelector(".screenButtonsEmoji");

const CheckOrientation = () => {
  if (window.orientation === 0 || window.orientation === 180) {
    screenButtonBottom.style.display = "none";
    screenButtonsEmoji.style.display = "none";
    screenButtonToggle.innerHTML = '<i class="fas fa-angle-double-right"></i>';
  } else if (window.orientation === 90 || window.orientation === -90) {
    screenButtonBottom.style.display = "flex";
  }
};

export { CheckOrientation };
