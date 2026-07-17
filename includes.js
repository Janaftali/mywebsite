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
      const postName = `posts/post${i}.html`;

      const res = await fetch(postName);
      if (!res.ok) continue;

      let html = await res.text();
      html = html.replace(/src=/g, "src=posts/");

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
  var currentPage = location.href.split("/").slice(-1).toString();
  var navButtons = document.getElementsByClassName("navButton");
  console.log(navButtons.length)
  for (i = 0; i < navButtons.length; i++) {
    button = navButtons[i].outerHTML;
    
    if (currentPage.test(button)==true){
      console.log("true")
    }
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
