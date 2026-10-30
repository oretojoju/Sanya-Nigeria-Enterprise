
let isLoggedIn = localStorage.getItem("sanyaIsLoggedIn");
let savedName = localStorage.getItem("sanyaUserName");

let welcomeText = document.getElementById("welcome-user");
if (welcomeText) {
  if (isLoggedIn === "true" && savedName) {
    welcomeText.innerText = "Welcome, " + savedName + " to";
  } else {
    welcomeText.innerText = "Welcome to";
  }
}

let navSignIn = document.getElementById("nav-signin");
if (navSignIn) {
  if (isLoggedIn === "true") {
    navSignIn.innerText = "Sign Out";
    navSignIn.href = "#";
    navSignIn.onclick = function (event) {
      event.preventDefault();
      localStorage.setItem("sanyaIsLoggedIn", "false");
      alert("You have been signed out.");
      window.location.href = "index.html";
    };
  } else {
    navSignIn.innerText = "Sign In";
    navSignIn.href = "sign-in.html";
  }
}

function showSignUp() {
  document.getElementById("signin-card").style.display = "none";
  document.getElementById("signup-card").style.display = "block";
}

function showSignIn() {
  document.getElementById("signup-card").style.display = "none";
  document.getElementById("signin-card").style.display = "block";
}

function handleSignUp(event) {
  event.preventDefault();
  let firstName = document.getElementById("first-name").value.trim();
  let email = document.getElementById("signup-email").value.trim().toLowerCase();
  let password = document.getElementById("pwd").value;
  let confirmPassword = document.getElementById("pwd-2").value;

  if (password.length < 4) {
    alert("Password must be at least 4 characters long.");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match! Please check and try again.");
    return;
  }

  localStorage.setItem("sanyaUserName", firstName);
  localStorage.setItem("sanyaUserEmail", email);
  localStorage.setItem("sanyaUserPassword", password);
  localStorage.setItem("sanyaIsLoggedIn", "true");

  alert("Account created successfully! Welcome, " + firstName + "!");
  window.location.href = "index.html";
}

function handleSignIn(event) {
  event.preventDefault();

  let enteredEmail = document.getElementById("signin-email").value.trim().toLowerCase();
  let enteredPassword = document.getElementById("signin-pwd").value;

  let storedEmail = localStorage.getItem("sanyaUserEmail");
  let storedPassword = localStorage.getItem("sanyaUserPassword");
  let storedName = localStorage.getItem("sanyaUserName");

  if (!storedEmail || !storedPassword) {
    alert("No account found! Please click 'Sign Up' below to create an account first.");
    showSignUp();
    return;
  }

  if (enteredEmail === storedEmail && enteredPassword === storedPassword) {
    localStorage.setItem("sanyaIsLoggedIn", "true");
    alert("Sign in successful! Welcome back, " + storedName + "!");
    window.location.href = "index.html";
  } else {
    alert("Incorrect email or password! Please try again.");
  }
}

function changeSizePrice(selectElement, basePrice) {
  let selectedSize = selectElement.value;
  let newPrice = basePrice;
  // Baby Diaper size price differences
  if (selectedSize === "Size 3") {
    newPrice = basePrice + 1500;
  } else if (selectedSize === "Size 4") {
    newPrice = basePrice + 3000;
  }
  // Detergent size price differences
  else if (selectedSize === "80g") {
    newPrice = basePrice + 1500;
  } else if (selectedSize === "170g") {
    newPrice = basePrice + 3000;
  } else if (selectedSize === "800g") {
    newPrice = basePrice + 5000;
  } else if (selectedSize === "1.7kg") {
    newPrice = basePrice + 7500;
  }
  // Baby Wipes size price differences
  else if (selectedSize === "Medium") {
    newPrice = basePrice + 1500;
  } else if (selectedSize === "Big") {
    newPrice = basePrice + 3000;
  }

  let card = selectElement.parentElement;
  let priceTag = card.querySelector(".price");
  priceTag.innerText = "₦" + newPrice.toLocaleString();

  card.setAttribute("data-current-price", newPrice);
}

let cart = [];
let totalAmount = 0;

function addToCart(productName, basePrice, buttonElement) {
  if (localStorage.getItem("sanyaIsLoggedIn") !== "true") {
    alert("Please Sign In or Sign Up first before ordering goods!");
    window.location.href = "sign-in.html";
    return;
  }

  let card = buttonElement.parentElement;
  let sizeDropdown = card.querySelector(".dropdown");
  let selectedSize = "";

  if (sizeDropdown) {
    if (sizeDropdown.value === "") {
      alert("Please select a size for " + productName + " first!");
      return;
    }
    selectedSize = " (" + sizeDropdown.value + ")";
  }

  let updatedPrice = card.getAttribute("data-current-price");
  let finalPrice = updatedPrice ? Number(updatedPrice) : basePrice;

  let item = {
    name: productName + selectedSize,
    price: finalPrice
  };

  cart.push(item);
  totalAmount = totalAmount + finalPrice;

  updateCartDisplay();
}

function updateCartDisplay() {
  let cartList = document.getElementById("cart-items");
  let cartTotal = document.getElementById("cart-total");
  let cartCount = document.getElementById("cart-count");

  cartList.innerHTML = "";

  if (cart.length === 0) {
    cartList.innerHTML = '<li class="text-muted">No goods added yet. Click "Add to Cart" on any item above!</li>';
  } else {
    for (let i = 0; i < cart.length; i++) {
      let li = document.createElement("li");
      li.className = "cart-item-row";
      li.innerHTML =
        "<span>" + cart[i].name + "</span>" +
        "<strong>₦" + cart[i].price.toLocaleString() + "</strong>";
      cartList.appendChild(li);
    }
  }

  cartTotal.innerText = "₦" + totalAmount.toLocaleString();
  cartCount.innerText = cart.length;
}

function clearCart() {
  cart = [];
  totalAmount = 0;
  updateCartDisplay();
}

function checkoutWhatsApp() {
  if (localStorage.getItem("sanyaIsLoggedIn") !== "true") {
    alert("Please Sign In or Sign Up first before placing an order!");
    window.location.href = "sign-in.html";
    return;
  }

  if (cart.length === 0) {
    alert("Your cart is empty! Please add some goods first.");
    return;
  }

  let customerName = localStorage.getItem("sanyaUserName") || "Customer";
  let sellerPhone = "2349065702605"; 

  let message = "Hello Sanya Nigeria Enterprise! My name is " + customerName + ".\n";
  message += "I would like to purchase the following goods:\n\n";

  for (let i = 0; i < cart.length; i++) {
    message += (i + 1) + ". " + cart[i].name + " - ₦" + cart[i].price.toLocaleString() + "\n";
  }

  message += "\nTotal Amount: ₦" + totalAmount.toLocaleString();

  let whatsappUrl = "https://wa.me/" + sellerPhone + "?text=" + encodeURIComponent(message);
  window.open(whatsappUrl, "_blank");
}

function handleContact(event) {
  event.preventDefault();
  alert("Thank you for reaching out to Sanya Nigeria Enterprise! We will contact you shortly.");
  event.target.reset();
}