var domDiv=document.createElement("div");
domDiv.textContent="Hello Webpack!"
var root=document.querySelector("#root");
root.appendChild(domDiv);

var image = document.createElement("img");
image.src = require('../image/5.jpg');
root.appendChild(image);