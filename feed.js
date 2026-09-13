const feeds = [
  { url: '/feed.xml'}
];
const ITEMS_PER_FEED = 11;

async function fetchFeed(url) {
  const res = await fetch(url);
  const text = await res.text();
  const parser = new DOMParser();
  return parser.parseFromString(text, "text/xml");
}

function parseRSS(doc) {
  const items = [...doc.querySelectorAll("item")].slice(0, ITEMS_PER_FEED);
  return items.map(item => ({
    title: item.querySelector("title")?.textContent ?? "(No title)",
    link: item.querySelector("link")?.textContent ?? "#",
    image: item.querySelector("enclosure")?.getAttribute("url") ?? "#",
    date: new Date(item.querySelector("pubDate")?.textContent ?? 0)
  }));
}

function parseFeed(doc) {
  return parseRSS(doc);
}

(async () => {
  const allItems = [];

  for (const { url, label } of feeds) {
    try {
      const doc = await fetchFeed(url);
      const items = parseFeed(doc).map(item => ({ ...item, source: label }));
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

    //Generate text
    const text = document.createElement("p");
    const res = await fetch(item.link);
    if(!res.ok){  continue; }
    text.textContent = await res.text();;

    //Generate image
    const image = document.createElement("img");
    image.src = item.image

    //Add image and text to content
    content.appendChild(text);
    content.appendChild(image)

    //Add all elements to the post
    post.appendChild(title);
    post.appendChild(dateSpan);
    post.appendChild(hr);
    post.appendChild(content);

    blog.appendChild(post);
  }

  document.getElementById("feed-box").innerHTML = "";
  document.getElementById("feed-box").appendChild(blog);
})();