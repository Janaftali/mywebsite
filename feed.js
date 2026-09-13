const feeds = [
  { url: '/feed.xml'}
];

async function fetchFeed(url) {
  const res = await fetch(url);
  const text = await res.text();
  const parser = new DOMParser();
  return parser.parseFromString(text, "text/xml");
}

function parseRSS(doc, number) {
  const items = [...doc.querySelectorAll("item")].slice(0, number);
  return items.map(item => ({
    title: item.querySelector("title")?.textContent ?? "(No title)",
    text: item.querySelector("description")?.textContent ?? "#",
    image: item.querySelector("enclosure")?.getAttribute("url") ?? "#",
    date: new Date(item.querySelector("pubDate")?.textContent ?? 0)
  }));
}

async function loadBlogPosts(number){
  const allItems = [];

  for (const { url, label } of feeds) {
    try {
      const doc = await fetchFeed(url);
      const items = parseRSS(doc, number).map(item => ({ ...item, source: label }));
      allItems.push(...items);
    } catch (err) {
      console.error(`Error parsing ${url}:`, err);
    }
  }

  allItems.sort((a, b) => b.date - a.date);

  //Create the blog
  const blog = document.createElement("div");
  for (const item of allItems) {
    //Create a post for each item in xml
    const post = document.createElement("div");
    post.className = "post";

    //Add the title to post
    const title = document.createElement("h2");
    title.textContent = item.title;
    title.id = item.title.replace(/ /g,"-");

    //Add the date to post
    const dateSpan = document.createElement("span");
    dateSpan.className = "post-date";
    dateSpan.textContent = `${item.date.toISOString().split("T")[0]}`;

    //Add the horizontal line to post
    const hr = document.createElement("hr");

    //Generate content
    const content = document.createElement("div");
    content.className = "post-content";

    //Add text to content
    const text = document.createElement("p");
    text.textContent = item.text;
    content.appendChild(text);

    //Add image to content
    if(item.image != '#'){
      const image = document.createElement("img");
      image.src = item.image
      content.appendChild(image)
    }

    //Add all elements to the post
    post.appendChild(title);
    post.appendChild(dateSpan);
    post.appendChild(hr);
    post.appendChild(content);

    blog.appendChild(post);
  }

  document.getElementById("feed-box").innerHTML = "";
  document.getElementById("feed-box").appendChild(blog);
};