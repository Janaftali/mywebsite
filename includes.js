function includeHTML() {
  var z, i, elmnt, file, xhttp;
  /*loop through a collection of all HTML elements:*/
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    /*search for elements with a certain atrribute:*/
    file = elmnt.getAttribute("include-html");
    if (file) {
      /*make an HTTP request using the attribute value as the file name:*/
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
          if (this.status == 200) {elmnt.innerHTML = this.responseText;}
          if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
          /*remove the attribute, and call this function once more:*/
          elmnt.removeAttribute("include-html");
          includeHTML();
        }
      }      
      xhttp.open("GET", file, true);
      xhttp.send();
      return;
    }
  }
};

function loadBlogPosts(amount) {
  return (async () => {
    const blog = document.getElementById("blog");
    let loadedPosts = 0;

    for (let i = 9; i >= 0 && loadedPosts < amount; i--) {
      const postName = `../posts/post${i}.html`;

      const res = await fetch(postName);
      if (!res.ok) continue;

      let html = await res.text();
      html = html.replace(/src=/g, "src=../posts/");

      const post = document.createElement("div");
      post.classList.add("post");
      post.innerHTML = html;

      blog.appendChild(post);
      loadedPosts++;
    }
  })();
}

function setLanguage(lang){
  var currentPage = location.href.split("/").slice(-1).toString();

  location.replace("../"+lang+"/"+currentPage);
}

function activePage(){
  console.log("test");
  var currentPage = location.href.split("/").slice(-1).toString();
  var navButtons = document.getElementsByClassName("navButton");
  console.log(navButtons.length)
  for (i = 0; i < navButtons.length; i++) {
    link = navButtons[i].href;
    
    if (currentPage==link){
      console.log(currentPage)
    }
  }
}

function dropdown(content){
  console.log(content)
  var x = document.getElementById(content)
  var y = document.getElementById("dropdown-"+content)
  if (x.style.display === "none") {
    x.style.display = "block";
    y.innerHTML = y.innerHTML.replace("◁", "▽")
  
  } else {
    x.style.display = "none";
    y.innerHTML = y.innerHTML.replace("▽", "◁");
  }
}

function displayProject(projectName){
  console.log(projectName)
  var projectFrame = document.getElementById("projectFrame");
  projectFrame.style.display="block";

  var iframe = document.getElementById("projectiframe");
  iframe.src= projectName;
}

function closeProject(){
  var projectFrame = document.getElementById("projectFrame");
  projectFrame.style.display="none";
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

function restartGif(imgElement) { 
  let element = document.getElementById(imgElement);
  console.log('GIF reloaded.');
  if (element) {
     var imgSrc = element.src;
     element.src = imgSrc; 
  }
}
