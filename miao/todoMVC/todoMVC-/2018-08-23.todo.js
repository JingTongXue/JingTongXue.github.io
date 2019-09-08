
//add item
todo.addEventListener("keydown", e => {//当触发按键按下事件时
  if (e.keyCode == 13 && todo.value != "") {//当按键按下回车键并且input内容不为空时
    addItem(todo.value);//调用添加函数,将input的内容传给该函数
    todo.value = "";
  }
  updateRemain();
});

//completeAll
completeAll.addEventListener("click", e => {
  console.log(e);
  let items = document.querySelectorAll("item");
  if (Array.from(items).every(item => item.classList.contains("done"))) {
    console.log(true);
    items.forEach(item => item.classList.remove("done"));
  } else if (!items.forEach(item => item.classList.contains("done"))) {
    item.classList.add("done");
  }
});


// toggle item status && delete
container.addEventListener("click", e => {
  if (e.target.classList.contains("del")) {
    e.target.parentNode.remove();
  } else if (e.target.classList.contains("symbol")) {
    e.target.parentNode.classList.toggle("done");
    e.target.classList.toggle("fa-circle-thin");
    e.target.classList.toggle("fa-check-square-o");
  }
});

// show all items
all.addEventListener("click", () => {
  let items = document.querySelectorAll(".item");
  items.forEach(item => item.style.display = "block");
});
// show active items
active.addEventListener("click", () => {
  let items = document.querySelectorAll(".item");
  items.forEach(item => item.classList.contains("done") ? item.style.display = "none" : item.style.display = "block");
});
// show completed items
completed.addEventListener("click", () => {
  let items = document.querySelectorAll(".item");
  items.forEach(item => item.classList.contains("done") ? item.style.display = "block" : item.style.display = "none");
});

// clear complete
clear.addEventListener("click", () => {
  let items = document.querySelectorAll(".item.done");
  items.forEach(item => item.remove())
});

//toggle footer display
window.addEventListener("click", () => {
  updateRemain();
  let total = container.children.length;
  footer.style.display = (total == 0 ? "none" : "flex");
});



function addItem(str) {
  //新建HTML标签
  let item = document.createElement("li");
  let symbol = document.createElement("span");
  let text = document.createElement("span");
  let del = document.createElement("span");
  //对其赋予class名
  item.classList.add("item");
  symbol.classList.add("symbol", "fa", "fa-circle-thin");
  text.classList.add("text");
  del.classList.add("del", "fa", "fa-remove");

  //将提交的input内容添加到新建的text中
  text.textContent = str;

  item.append(symbol, text, del);
  container.appendChild(item);
}

function updateRemain() {
  let remainCount = document.querySelectorAll(".item").length - document.querySelectorAll(".done").length;
  remain.textContent = `${remainCount} item${remainCount ? "s" : ""} left`;
}
