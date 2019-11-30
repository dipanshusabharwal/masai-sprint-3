window.onload = fillBreedsSelector();

var selectBreed = document.getElementById("breedSelect");
selectBreed.addEventListener("change", fillSubBreedSelector);

var randomDog = document.getElementById("randomDog");
randomDog.addEventListener("click", getRandomDog);

var searchBreed = document.getElementById("searchDogBreed");
searchBreed.addEventListener("click", searchDogBreed);

var thisBreed = null;
var thisSubBreed = null;
var isSubBreed = false;

var quotes = [
  "Outside of a dog, a book is a man's best friend. Inside of a dog its too dark to read",
  "My fashion philosophy is, if you’re not covered in dog hair, your life is empty.",
  "No one appreciates the very special genius of your conversation as the dog does.",
  "Dog is God spelled backward.",
  "Scratch a dog and you’ll find a permanent job.",
  "A boy can learn a lot from a dog: obedience, loyalty, and the importance of turning around three times before lying down.",
  "When a man’s best friend is his dog, that dog has a problem.",
  "Dogs have boundless enthusiasm but no sense of shame. I should have a dog as a life coach.",
  "You want a friend in Washington? Get a dog.",
  "The dog is the god of frolic.",
  "If you don’t own a dog, at least one, there is not necessarily anything wrong with you, but there may be something wrong with your life.",
  "What do dogs do on their day off? Can’t lie around – that’s their job.",
  "I don’t understand people who don’t touch their pets. Their cat or dog is called a pet for a reason.",
  "The dog is the god of frolic.",
  "When a man’s best friend is his dog, that dog has a problem."
];

function fillBreedsSelector() {
  var returnOfAPICall = null;
  obj = {};
  var xhr = new XMLHttpRequest();
  apiUrl = "https://dog.ceo/api/breeds/list/all";
  xhr.open("GET", apiUrl);
  xhr.send();
  xhr.onload = function() {
    if (xhr.status == 200) {
      returnOfAPICall = xhr.response;
      obj = JSON.parse(returnOfAPICall);
      console.log(obj.message);
      for (key in obj.message) {
        var option = document.createElement("option");
        option.textContent = key.toUpperCase();
        option.setAttribute("class", "bg-light text-info");
        selectBreed.appendChild(option);
      }
    } else {
      console.log("Error code is", xhr.status);
    }
  };
}

function fillSubBreedSelector() {
  console.log(selectBreed.value);
  if (selectBreed.value == "") {
    return;
  }

  thisBreed = selectBreed.value.toLowerCase();

  var returnOfAPICall = null;
  obj = {};
  var xhr = new XMLHttpRequest();
  apiUrl =
    "https://dog.ceo/api/breed/" + selectBreed.value.toLowerCase() + "/list";
  console.log(apiUrl);
  xhr.open("GET", apiUrl);
  xhr.send();
  xhr.onload = function() {
    if (xhr.status == 200) {
      returnOfAPICall = xhr.response;
      obj = JSON.parse(returnOfAPICall);
      console.log(obj.message);

      if (obj.message.length > 0) {
        isSubBreed = true;
        var inputPane = document.getElementById("inputPane");

        if (document.getElementById("subBreed") != null) {
          inputPane.removeChild(document.getElementById("subBreed"));
        }
        if (document.getElementById("countDiv") != null) {
          inputPane.removeChild(document.getElementById("countDiv"));
        }

        var subBreed = document.createElement("select");
        subBreed.setAttribute(
          "class",
          "form-control-lg bg-info text-white mt-3 w-100"
        );
        subBreed.setAttribute("id", "subBreed");
        subBreed.addEventListener("change", askImgCount);
        inputPane.appendChild(subBreed);

        var option = document.createElement("option");
        option.textContent = "Sub Breed";
        option.setAttribute("class", "bg-light text-info");
        subBreed.appendChild(option);

        obj.message.forEach(function(e) {
          var option = document.createElement("option");
          option.textContent = e.toUpperCase();
          option.setAttribute("class", "bg-light text-info");
          subBreed.appendChild(option);
        });
      } else {
        isSubBreed = false;
        var inputPane = document.getElementById("inputPane");

        if (document.getElementById("subBreed") != null) {
          inputPane.removeChild(document.getElementById("subBreed"));
        }

        askImgCount();
      }
    } else {
      console.log("Error code is", xhr.status);
    }
  };
}

function askImgCount() {
  var inputPane = document.getElementById("inputPane");

  if (document.getElementById("countDiv") != null) {
    inputPane.removeChild(document.getElementById("countDiv"));
  }

  var cont = document.createElement("div");
  cont.setAttribute("class", "input-group mt-3");
  cont.setAttribute("id", "countDiv");
  inputPane.appendChild(cont);

  var input = document.createElement("input");
  input.setAttribute("class", "form-control");
  input.setAttribute("id", "imgCount");
  input.setAttribute("placeholder", "How many doggos?");
  cont.appendChild(input);

  var btnCont = document.createElement("div");
  btnCont.setAttribute("class", "input-group-append");
  cont.appendChild(btnCont);

  var button = document.createElement("button");
  button.setAttribute("class", "btn btn-outline-secondary");
  button.textContent = "Fetch";
  button.addEventListener("click", fetchImages);
  btnCont.appendChild(button);
}

function fetchImages() {
  var count = document.getElementById("imgCount").value;

  var input = document.getElementById("imgCount");
  input.value = "";

  if (count == "") {
    alert("Please enter valid value");
    return;
  }

  if (count > 50) {
    alert("Please enter value less than 50");
    return;
  }

  var returnOfAPICall = null;
  obj = {};
  var xhr = new XMLHttpRequest();
  if (isSubBreed && subBreed.value != "Sub Breed") {
    console.log(subBreed.value);
    thisSubBreed = subBreed.value.toLowerCase();
    apiUrl =
      "https://dog.ceo/api/breed/" +
      thisBreed +
      "/" +
      thisSubBreed +
      "/images/random/" +
      count;
  } else {
    apiUrl =
      "https://dog.ceo/api/breed/" + thisBreed + "/images/random/" + count;
  }
  xhr.open("GET", apiUrl);
  xhr.send();
  xhr.onload = function() {
    if (xhr.status == 200) {
      returnOfAPICall = xhr.response;
      obj = JSON.parse(returnOfAPICall);
      console.log(obj.message);
      pushImagesToCarousel(obj.message);
    } else {
      console.log("Error code is", xhr.status);
    }
  };
}

function pushImagesToCarousel(array) {
  var carousel = document.getElementById("carousel-inner");
  if (carousel != null) {
    carousel.innerHTML = "";
  }

  var mainCarouselDiv = document.getElementById("carouselDiv");

  array.forEach(function(e, i) {
    var carouselItem = document.createElement("div");
    if (i == 0) {
      carouselItem.setAttribute("class", "carousel-item active");
    } else {
      carouselItem.setAttribute("class", "carousel-item");
    }
    carouselItem.setAttribute("data-interval", "2000");
    carousel.appendChild(carouselItem);

    var carouselImg = document.createElement("img");
    carouselImg.setAttribute("src", e);
    carouselImg.setAttribute(
      "class",
      "d-block cust-img m-auto badge badge-pill"
    );
    carouselItem.appendChild(carouselImg);

    var carouselCaption = document.createElement("div");
    carouselCaption.setAttribute(
      "class",
      "carousel-caption d-none d-md-block text-warning font-weight-bold"
    );
    var carouselCaptionHeader = document.createElement("h5");
    carouselCaptionHeader.textContent = i + 1;
    carouselCaption.appendChild(carouselCaptionHeader);
    carouselItem.appendChild(carouselCaption);
  });

  var quote = document.getElementById("dogQuote");
  quote.textContent = quotes[Math.floor(getRandomArbitrary(0, 9))];

  mainCarouselDiv.setAttribute("class", "col-9 m-auto p-3 visible");
}

function getRandomDog() {
  var returnOfAPICall = null;
  obj = {};
  var xhr = new XMLHttpRequest();
  apiUrl = "https://dog.ceo/api/breeds/image/random";
  xhr.open("GET", apiUrl);
  xhr.send();
  xhr.onload = function() {
    if (xhr.status == 200) {
      returnOfAPICall = xhr.response;
      obj = JSON.parse(returnOfAPICall);
      console.log(obj);
      console.log(obj.message);

      var carousel = document.getElementById("carousel-inner");
      if (carousel != null) {
        carousel.innerHTML = "";
      }

      var carouselItem = document.createElement("div");
      carouselItem.setAttribute("class", "carousel-item active");
      carouselItem.setAttribute("data-interval", "2000");
      carousel.appendChild(carouselItem);

      var carouselImg = document.createElement("img");
      carouselImg.setAttribute("src", obj.message);
      carouselImg.setAttribute("class", "d-block cust-img m-auto");
      carouselItem.appendChild(carouselImg);

      var quote = document.getElementById("dogQuote");
      quote.textContent = quotes[Math.floor(getRandomArbitrary(0, 9))];

      var mainCarouselDiv = document.getElementById("carouselDiv");
      mainCarouselDiv.setAttribute("class", "col-9 m-auto p-3 visible");
    } else {
      console.log("Error code is", xhr.status);
    }
  };
}

function searchDogBreed() {
  var searchDogBreed = document.getElementById("customDogBreed").value;
  console.log(searchDogBreed);
  if (searchDogBreed == "") {
    alert("Please enter valid breed");
    return;
  }

  var returnOfAPICall = null;
  obj = {};
  var xhr = new XMLHttpRequest();
  apiUrl = "https://dog.ceo/api/breed/" + searchDogBreed + "/images/random";
  xhr.open("GET", apiUrl);
  xhr.send();
  xhr.onload = function() {
    if (xhr.status == 200) {
      returnOfAPICall = xhr.response;
      obj = JSON.parse(returnOfAPICall);
      console.log(obj);
      console.log(obj.message);

      var carousel = document.getElementById("carousel-inner");
      if (carousel != null) {
        carousel.innerHTML = "";
      }

      var carouselItem = document.createElement("div");
      carouselItem.setAttribute("class", "carousel-item active");
      carouselItem.setAttribute("data-interval", "2000");
      carousel.appendChild(carouselItem);

      var carouselImg = document.createElement("img");
      carouselImg.setAttribute("src", obj.message);
      carouselImg.setAttribute("class", "d-block cust-img m-auto");
      carouselItem.appendChild(carouselImg);

      var quote = document.getElementById("dogQuote");
      quote.textContent =
        quotes[Math.floor(getRandomArbitrary(0, quotes.length))];

      var mainCarouselDiv = document.getElementById("carouselDiv");
      mainCarouselDiv.setAttribute("class", "col-9 m-auto p-3 visible");
    } else {
      console.log("Error code is", xhr.status);
      alert("Not a valid breed. This may be a sub breed ?");
    }
  };
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
