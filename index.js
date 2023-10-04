const apiKey = "efba76953df04c8f9959d24c3236faa3";
const url = "https://api.rebrandly.com/v1/links";

const inputField = document.getElementById("input");
const shortenButton = document.getElementById("shorten");
const responseField = document.getElementById("link");
const copy = document.getElementById("copy");

let recentUrls = JSON.parse(localStorage.getItem("recent")) || [];
console.log(recentUrls);

function renderRecentLinks() {
  const linksBlock = document.getElementById("links");
  linksBlock.textContent = "";
  const recentBlock = document.getElementById("recent-url-modal");
  recentBlock.style.display = "block";
  document
    .getElementById("close-recent")
    .addEventListener("click", () => (recentBlock.style.display = "none"));
  const box = document.createElement("ul");
  for (link in recentUrls) {
    const boxList = document.createElement("li");
    boxList.innerHTML = `<a href="https://${recentUrls[link]}" target="_blank">${recentUrls[link]}</a>`;
    box.appendChild(boxList);
    linksBlock.appendChild(box);
    console.log(recentUrls[link]);
  }

  document.getElementById("clear").addEventListener("click", function () {
    localStorage.removeItem("recent");
    renderRecentLinks();
  });
}


const shortenUrl = () => {
  const urlToShorten = inputField.value;
  const data = JSON.stringify({ destination: urlToShorten });
  fetch(url, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      apikey: apiKey,
    },
    body: data,
  })
    .then(
      (response) => {
        if (response.ok) {
          return response.json();
        }
        alert(
          "Limit reached for this API key, to test this app, sign up on Rebrandly.com to get your own API keys"
        );
        throw new Error("Request failed!");
      },
      (networkError) => {
        console.log(networkError.message);
      }
    )
    .then((jsonResponse) => {
      renderResponse(jsonResponse);
    });
};


const displayShortUrl = (event) => {
  if (inputField.value) {
    event.preventDefault();
    responseField.innerHTML = "";
    shortenUrl();

  } else {
    alert("Please enter a valid url");
    inputField.focus();
  }
};

shortenButton.addEventListener("click", displayShortUrl);

const renderResponse = (result) => {
  if (result.errors) {
    responseField.innerHTML =
      "<p>Sorry, couldn't format your URL.</p><p>Try again.</p>";
  } else {
    responseField.innerHTML = `<p>Here is your shortened url: </p><p> ${result.shortUrl} </p>`;
    copy.textContent = "Copy";
    copy.style.display = "block";
    recentUrls.push(result.shortUrl);
    localStorage.setItem("recent", JSON.stringify(recentUrls));
    inputField.value = "";
    document.getElementById("result").style.visibility = "visible";
    copy.addEventListener("click", () => {
      copyToClipboard(result.shortUrl);
    });
  }
};

const renderRawResponse = (result) => {
  if (result.errors) {
    responseField.innerHTML =
      "<p>Sorry, couldn't format your URL.</p><p>Try again.</p>";
  } else {

    let structuredRes = JSON.stringify(result).replace(/,/g, ", \n");
    structuredRes = `<pre>${structuredRes}</pre>`;
    responseField.innerHTML = `${structuredRes}`;
  }
};


const renderJsonResponse = (response) => {
  
  let rawJson = {};
  for (let key in response) {
    rawJson[key] = response[key];
  }
  
  rawJson = JSON.stringify(rawJson).replace(/,/g, ", \n");
 
  responseField.innerHTML = `<pre>${rawJson}</pre>`;
};

function copyToClipboard(result) {
  navigator.clipboard.writeText(result);
  if (!result) {
    alert("Sorry, your link was not generated correctly. Try again.");
    return;
  }
  copy.textContent = "Copied!";
}
