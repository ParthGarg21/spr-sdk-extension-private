// Function to shorten the url
// In case of routes from the home page, we clip the homepage
// Else we keep the entire url
// We also clip the query parameters

const shortenURL = (url, home) => {
  // Clip the http/https header
  url = url.split("//")[1];

  // Clip url query parameters
  url = url.split("?")[0];

  // If the url is a route from the current home page, then clip that portion
  if (url.includes(home) && url.length !== home.length + 1) {
    url = url.substring(home.length + 1);
  }

  // Clip the lastmost '/'
  if (url[url.length - 1] === "/") {
    url = url.substring(0, url.length - 1);
  }
  return url;
};

// Sort a given array on the basis of key passed
const sortArray = (array, key) => {
  array.sort((element1, element2) => {
    if (element2[key] > element1[key]) {
      return 1;
    } else if (element2[key] === element1[key]) {
      return 0;
    } else {
      return -1;
    }
  });
};
