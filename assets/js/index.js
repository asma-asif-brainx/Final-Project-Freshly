document.addEventListener('DOMContentLoaded', function () {
    
 // ------------------checkout Form validation---------------------

 const form = document.getElementById('checkout-form');
 const submitButton = document.getElementById('checkout-btn');
 
 const errorMessages = {
     requiredField: "This field is required",
     emails: "Please enter valid email addresses.",
     emailDuplicate: "Duplicate emails not allowed.",
     contact: "Contact number must be 11 digits or 12 digits with a leading plus sign (+).",
     name: "Name must only contain letters (a-z, A-Z).",
     fullName: "Full name must contain alphabets (a-z, A-Z).",
     city: "City must only contain letters (a-z, A-Z).",
     state: "State must only contain letters (a-z, A-Z).",
     zip: "Zip must contain exactly 5 digits from 0-9.",
     zipAlphabet: "Zip must only contain digits",
     address: "Address must contain only alphabets (a-z, A-Z), digits (0-9), and special characters (#, _)."
 };
 
 const validateName = value => /^[a-zA-Z ]+$/.test(value);
 const validateAddress = value => /^[a-zA-Z0-9#_, ]+$/.test(value);
 const validateZip = value => {
  if (/[^0-9]/.test(value)) {
      showErrorMessage(document.getElementById('zip'), errorMessages.zipAlphabet);
      return false;
  }
  if (value.length !== 5) {
      showErrorMessage(document.getElementById('zip'), errorMessages.zip);
      return false;
  }
  return true;
 };
 const validateEmail = value => /^[^\s@]+@[^\s@]+\.com$/.test(value);
 // Validate multiple emails
 const validateEmails = value => {
     const emailList = value.split(',').map(email => email.trim());
     const uniqueEmails = new Set(emailList);
     const hasDuplicates = emailList.length !== uniqueEmails.size;
     const allEmailsValid = emailList.every(email => validateEmail(email));
     return { hasDuplicates, allEmailsValid };
 };
 const validateContact = value => {
     const contactPattern = /^\+?\d{11,12}$/;
     return contactPattern.test(value) && (value.startsWith('+') ? value.length === 13 : value.length === 11);
 };
 const validators = {
     fname: value => validateName(value) ? '' : errorMessages.name,
     lname: value => validateName(value) ? '' : errorMessages.name,
     'full-delivery-address': value => validateName(value) ? '' : errorMessages.fullName,
     'full-delivery-address-two': value => validateName(value) ? '' : errorMessages.fullName,
     city: value => validateName(value) ? '' : errorMessages.city,
     state: value => validateName(value) ? '' : errorMessages.state,
     'first-address-name': value => validateAddress(value) ? '' : errorMessages.address,
     'second-address-name': value => validateAddress(value) ? '' : errorMessages.address,
     email: value => {
         const { hasDuplicates, allEmailsValid } = validateEmails(value);
         if (hasDuplicates) return errorMessages.emailDuplicate;
         if (!allEmailsValid) return errorMessages.emails;
         return '';
     },
     phone: value => validateContact(value) ? '' : errorMessages.contact
 };
 const showErrorMessage = (input, message) => {
     let errorSpan = input.nextElementSibling;
     if (!errorSpan || errorSpan.tagName !== 'SPAN') {
         errorSpan = document.createElement('span');
         errorSpan.className = 'error-message';
         input.parentNode.insertBefore(errorSpan, input.nextSibling);
     }
     errorSpan.innerText = message;
 };
 const clearErrorMessage = input => {
     let errorSpan = input.nextElementSibling;
     if (errorSpan && errorSpan.tagName === 'SPAN') {
         errorSpan.innerText = '';
     }
 };
 const validateField = event => {
     const input = event.target;
     const value = input.value.trim();
     const id = input.id || input.name;
 
     if (requiredFields.includes(id) && value === '') {
         showErrorMessage(input, errorMessages.requiredField);
         return;
     }
     const errorMessage = validators[id] ? validators[id](value) : '';
     if (errorMessage) {
         showErrorMessage(input, errorMessage);
     } else {
         clearErrorMessage(input);
     }
     validateForm();
 };
 
 const validateForm = () => {
  let firstName = document.getElementById('fname').value;
  let lastName = document.getElementById('lname').value.trim();
  let emails = document.getElementById('email').value.trim();
  let phone = document.getElementById('phone').value.trim();
  let fullName1 = document.getElementById('full-delivery-address').value.trim();
  let fullName2 = document.getElementById('full-delivery-address-two').value.trim();
  let city = document.getElementById('city').value.trim();
  let state = document.getElementById('state').value.trim();
  let zip = document.getElementById('zip').value.trim();
  let address1 = document.getElementsByName('first-address-name')[0].value.trim();
  let address2 = document.getElementsByName('second-address-name')[0].value.trim();

  const { hasDuplicates, allEmailsValid } = validateEmails(emails);

  const isFormValid = validateName(firstName) &&
      validateName(lastName) &&
      validateName(fullName1) &&
      validateName(fullName2) &&
      validateName(city) &&
      validateName(state) &&
      validateZip(zip) &&
      validateContact(phone) &&
      validateAddress(address1) &&
      validateAddress(address2) &&
      !hasDuplicates &&
      allEmailsValid;

  submitButton.disabled = !isFormValid;
 };
 
 const requiredFields = ['fname', 'lname', 'full-delivery-address', 'full-delivery-address-two', 'city', 'state', 'zip', 'phone', 'email', 'first-address-name', 'second-address-name'];
 const inputFields = form.querySelectorAll('input');
 
 inputFields.forEach(input => {
     input.addEventListener('focus', () => clearErrorMessage(input));
     input.addEventListener('blur', validateField);
 });
 
  //On clicking zip change link, the zip field is set to null
 const zipInput = document.getElementById('zip');
 const changeZipLink = document.getElementById('change-zip');
 
 changeZipLink.addEventListener('click', function (event) {
     event.preventDefault();
     zipInput.value = '';
     zipInput.focus();
 });
 
 form.addEventListener('submit', event => {
  if (submitButton.disabled) {
      event.preventDefault();
  }
  else{
    alert('Your order placed sucessfully');
  }
 });

  // ------------------------ Date items rendering in day section ------------------------
  function getNextMonday(date) {
      const day = date.getDay();
      const diff = (7 - day + 1) % 7;
      return new Date(date.setDate(date.getDate() + (diff === 0 ? 7 : diff)));
  }

  function formatDate(date) {
      const options = { weekday: 'long', day: 'numeric', month: 'short' };
      const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
      const [weekday, day, month] = formattedDate.split(' ');
      return `<strong>${weekday}</strong> ${day} ${month}`;
  }

  function generateDates() {
    const container = document.querySelector('.date-container');
    const firstDeliverySpan = document.querySelector('.first-delivery-date');

    // variable for date template
    const template = document.getElementById('date-template');

    let currentDate = new Date();
    let nextMonday = getNextMonday(currentDate);

    updateFirstDeliveryDate(firstDeliverySpan, nextMonday);

    for (let i = 0; i < 10; i++) {

        //sending the template variable in createDateDiv function
        const dateDiv = createDateDiv(template, nextMonday, i === 0);

        dateDiv.addEventListener('click', () => handleDateClick(dateDiv, firstDeliverySpan));
        container.appendChild(dateDiv);
        nextMonday.setDate(nextMonday.getDate() + 1);
    }
  }
  
  function updateFirstDeliveryDate(span, date) {
      span.innerHTML = formatDate(date);
  }

  function createDateDiv(template, date, isSelected) {
    const dateDiv = template.content.cloneNode(true).firstElementChild;
    const dateText = dateDiv.querySelector('.date-text-item');
    const popularText = dateDiv.querySelector('.popular-text');

    dateText.innerHTML = formatDate(date);

    if (!isSelected) {
        popularText.style.display = 'none';
    }
    if (isSelected) {
        dateDiv.classList.add('selected');
    }
    return dateDiv;
  }

  function handleDateClick(clickedDiv, firstDeliverySpan) {
      const container = document.querySelector('.date-container');
      container.querySelectorAll('.date-item.selected').forEach(item => {
          if (item !== clickedDiv) {
              item.classList.remove('selected');
          }
      });
      clickedDiv.classList.add('selected');
      const selectedDateText = clickedDiv.querySelector('span').innerHTML;
      firstDeliverySpan.innerHTML = selectedDateText;
  }
  
  generateDates();

  // ------------------------------Meals cards rendering in cart and meals/checkout section ------------------------------
  // Fetch the meal count limit from local storage
  function getMealCountFromStorage() {
    const selectedMealCount = localStorage.getItem('selectedMealCount');
    if (selectedMealCount) {
      const match = selectedMealCount.match(/(\d+)\s*Meals/);
      if (match) {
        return parseInt(match[1], 10);
      }
    }
    return 0; 
  }

    // Toggle visibility of order summary and shipping section based on the cart state
    function toggleOrderSummaryVisibilty(){
      const orderSummaryCart = document.querySelector('.order-summary-cart');
      const cartShipping = document.querySelector('.cart-shipping');
      if (mealCart.length > 0) {
        orderSummaryCart.classList.remove('hidden');
        cartShipping.classList.remove('hidden');
      } else {
          orderSummaryCart.classList.add('hidden');
          cartShipping.classList.add('hidden');
      }
    }
  
  // ------------------------------ Cart Operations ------------------------------
  let mealCart = [];
  let price;
  let numOfSpecialMeals;
  let subtotal;
  
  //Helper function to disable/enable the meal add button
  function toggleDisableAddButton(){
    const mealCountLimit = getMealCountFromStorage();
    const addButtons = document.querySelectorAll('.add-btn');
  addButtons.forEach(button => {
    if (mealCart.length === mealCountLimit) {
      button.setAttribute('disabled', 'true');
      button.setAttribute('title', 'Your cart is full'); 
    } else {
      button.removeAttribute('disabled');
      button.removeAttribute('title'); 
    }
  });
  }

  function updateCart(meal) {
    const mealCountLimit = getMealCountFromStorage();
  
    if (mealCart.length < mealCountLimit) {
      mealCart.push(meal);
      toggleOrderSummaryVisibilty();
      renderCart();
      calculatePrice();
    }
  
    const nextButton = document.querySelector('.next-btn-cart');
    const readyText = document.querySelector('.enter-msg-cart');
  
    if (mealCart.length === mealCountLimit) {
      nextButton.classList.remove('disabled');
      nextButton.removeAttribute('disabled');
      readyText.innerHTML = '<span id="meals-count-cart">Ready to go!</span>';
    } else {
      nextButton.classList.add('disabled');
      nextButton.setAttribute('disabled', 'true');
      readyText.innerHTML = 'Please add <span id="meals-count-cart">' 
      + (mealCountLimit - mealCart.length) + ' more' 
      + '</span> meals.';
    }
    toggleDisableAddButton();
  }
  
  function addToCart(meal) {
    updateCart(meal);
  }
  
  function renderCart() {
    const cartContainer = document.querySelector('.meal-cards-added-cart');
    cartContainer.innerHTML = ''; 
    mealCart.forEach((meal, index) => {
      const clone = createMealCard(meal, index);
      cartContainer.appendChild(clone);
    });
    const countSpan = document.querySelector('.cart-item-count');
    countSpan.textContent = mealCart.length;
    updateOrderSummary();
  }
  
  function removeFromCart(index) {
    const mealCountLimit = getMealCountFromStorage();
    mealCart.splice(index, 1); 
    toggleOrderSummaryVisibilty();
    renderCart();
    calculatePrice();
  
    const nextButton = document.querySelector('.next-btn-cart');
    const readyText = document.querySelector('.enter-msg-cart');
  
    nextButton.classList.toggle('disabled', mealCart.length !== mealCountLimit);
    if (mealCart.length === mealCountLimit) {
      nextButton.removeAttribute('disabled');
    } else {
      nextButton.setAttribute('disabled', 'true');
    }
  
    toggleDisableAddButton();

    readyText.innerHTML = 'Please add <span id="meals-count-cart">' 
    + (mealCountLimit - mealCart.length) + ' more' 
    + '</span> meals.';
  }
  
  function createMealCard(meal, index) {
    const template = document.getElementById('selected-meal-template');
    const card = template.content.cloneNode(true).firstElementChild;
    
    card.querySelector('.cart-meal-img').src = meal.imagePath;
    card.querySelector('.cart-meal-img').alt = meal.name;
    card.querySelector('.cart-meal-name').textContent = meal.name;
    
    card.querySelector('.meal-minus').dataset.index = index;
    card.querySelector('.meal-plus').dataset.index = index;
    
    card.querySelector('.meal-minus').addEventListener('click', () => removeFromCart(index));
    card.querySelector('.meal-plus').addEventListener('click', () => updateCart(meal, true));
  
    if (meal.specialMeal) {
      const specialTag = document.createElement('div');
      specialTag.classList.add('special-tag-cart'); 
      specialTag.textContent = '+ $11.49'; 
      
      const mealImgParent = card.querySelector('.cart-meal-img').parentElement;
      mealImgParent.style.position = 'relative'; 
      mealImgParent.appendChild(specialTag);
  
      card.querySelector('.cart-meal-card').classList.add('special-bacground');
    }
  
    return card;
  }
  
  // ------------------------------ Order Summary and Price Calculation ------------------------------
  // Update order summary based on selected meals
  function updateOrderSummary() {
    const mealCount = getMealCountFromStorage();
  
    document.querySelector('.order-cart-meal-count').textContent = `${mealCart.length} Meals`;
  
    const mealsCountCart = document.getElementById('meals-count-cart');
    if(mealsCountCart){
      mealsCountCart.textContent = `${mealCount} items`;
    }
  }
  
  // Calculate total price of meals in the cart
  function calculatePrice() {
    price = 0;
    numOfSpecialMeals = 0;
    mealCart.forEach(meal => {
      price += meal.price;
      if (meal.specialMeal) {
        numOfSpecialMeals++;
      }
    });
    subtotal = (price + numOfSpecialMeals * 11.49).toFixed(2);
  
    document.getElementById('subtotal-order-price').textContent = `$${subtotal}`;
    if (numOfSpecialMeals > 0) {
      document.getElementById('meals-sum-price').textContent = `$${price} + $${(numOfSpecialMeals * 11.49).toFixed(2)}`;
    } else {
        document.getElementById('meals-sum-price').textContent = `$${price}`;
    }
      document.getElementById('subtotal-cart-price').textContent = `$${subtotal}`;
  }
  
  // ------------------------------ Cart and Checkout Actions ------------------------------
  // Clear all items in the cart
  function clearCart() {
    mealCart = [];
    document.querySelector('.meal-cards-added-cart').innerHTML = "";
    const countSpan = document.querySelector('.cart-item-count');
    countSpan.textContent = mealCart.length;
    const nextButton = document.querySelector('.next-btn-cart');
    const readyText = document.querySelector('.enter-msg-cart');
  
    const mealCountLimit = getMealCountFromStorage();
  
    if (mealCart.length === mealCountLimit) {
      nextButton.classList.remove('disabled');
      nextButton.removeAttribute('disabled');
      readyText.innerHTML = '<span id="meals-count-cart">Ready to go!</span>';
    } else {
      nextButton.classList.add('disabled');
      nextButton.setAttribute('disabled', 'true');
  
      readyText.innerHTML = 'Please add <span id="meals-count-cart">' 
      + (mealCountLimit - mealCart.length) + '' 
      + '</span> meals to continue.';
    }
    toggleDisableAddButton();
    calculatePrice();
    toggleOrderSummaryVisibilty();
  }
  
  // ------------------------------ Event Listener ------------------------------
  document.querySelector('.clear-all').addEventListener('click', () => clearCart());
  
  // Function to display the cart and expand the cart section
  function showCart() {
    const cartItemsContainer = document.querySelector('.cart-items-container');
    const addToCartContainer = document.querySelector('.add-to-cart-container');
  
    if (cartItemsContainer.classList.contains('hide')) {
      cartItemsContainer.classList.remove('hide');
      cartItemsContainer.classList.add('show');
      addToCartContainer.classList.add('expanded');
      addToCartContainer.classList.remove('collapsed');
    }
  }
  
  // Function to hide the cart and collapse the cart section
  function hideCart() {
    const cartItemsContainer = document.querySelector('.cart-items-container');
    const addToCartContainer = document.querySelector('.add-to-cart-container');
  
    if (cartItemsContainer.classList.contains('show')) {
      cartItemsContainer.classList.remove('show');
      cartItemsContainer.classList.add('hide');
      addToCartContainer.classList.add('collapsed');
      addToCartContainer.classList.remove('expanded');
    }
  }  

  // Add click event listener to the cart icon to show the cart when clicked in mobile screen
  const cartIcon = document.querySelector('.cart-icon-container');
  cartIcon.addEventListener('click', showCart);

 // Add click event listener to the cart down arrow to hide the cart when clicked in mobile screen
  const cartDownArrow = document.querySelector('.cart-down-arrow');
  cartDownArrow.addEventListener('click', hideCart);

  // Add click event listener to the "Next" button for delivery and update cart message
  document.querySelector('.next-button-delivery').addEventListener('click', () => cartMessage());

  // Function to display the cart message with the number of meals in the cart
  function cartMessage() {
    let message = getMealCountFromStorage() + ' items';
    const readyText = document.querySelector('.enter-msg-cart');
    readyText.innerHTML = 'Please add total <span id="meals-count-cart">'
      + message + ''
      + '</span> to continue.';
  }

  // Add event listener to the promo code link to replace it with an input field on click
  const promoCodeLink = document.querySelector('.promo-code-link');
  promoCodeLink.addEventListener('click', function(event) {
    event.preventDefault(); 
    const promoInput = document.createElement('input');
    promoInput.type = 'text';
    promoInput.className = 'promo-code-input';
    promoInput.placeholder = 'Enter Promo Code';
    
    this.parentNode.replaceChild(promoInput, this);
    
    promoInput.focus();
    
    promoInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            promoInput.blur(); 
        }
      });
  });


  // Render the meal summary for checkout
  function renderMealSummary() {
    const summaryMealCardContainer = document.querySelector('.summary-meal-card');
    summaryMealCardContainer.innerHTML = '';

    const template = document.getElementById('order-summary-meal-template').content;
    const mealSummary = {}; 

    mealCart.forEach(meal => {
        if (mealSummary[meal.name]) {
            mealSummary[meal.name].count += 1;
        } else {
            mealSummary[meal.name] = { ...meal, count: 1 };
        }
    });

    Object.values(mealSummary).forEach(meal => {
        const mealCard = template.cloneNode(true);

        mealCard.querySelector('.count-same-meal-added').textContent = meal.count;
        mealCard.querySelector('.order-meal-summary-img').src = meal.imagePath;
        mealCard.querySelector('.order-summary-meal-name').textContent = meal.name;
        mealCard.querySelector('.summary-order-speciality').textContent = meal.speciality;

        if (meal.specialMeal) { 
          const specialTag = document.createElement('div');
          specialTag.classList.add('special-summary-tag'); 
          specialTag.textContent = '+ $11.49'; 
          
          const mealImgParent = mealCard.querySelector('.order-meal-summary-img').parentElement;
          mealImgParent.style.position = 'relative'; 
          mealImgParent.appendChild(specialTag);

          mealCard.querySelector('.order-summary-meal-card').classList.add('special-meal');
        }

        summaryMealCardContainer.appendChild(mealCard);
    });
 }

  // Proceed to checkout and calculate final price
  function checkoutMealPrice(){
    const mealSum = document.querySelector('.meals-price-sum');
    mealSum.innerHTML = "$" + subtotal;

    const totalCheckoutCost = document.querySelector('.total-price-sum');
    const cost = parseFloat(subtotal) + 8.99 + 10.99;
    totalCheckoutCost.innerHTML = "$" + cost.toFixed(2);
  }
  
  // Event listeners
  document.querySelector('.next-btn-cart').addEventListener('click', () => checkoutMealPrice());
  document.querySelector('.next-btn-cart').addEventListener('click', () => renderMealSummary());

// Fetch meals JSON data and handle success or failure
fetch('assets/json/meals.json')
  .then(response => {
    // Check if the network response is not ok and throw an error
    if (!response.ok) {
      throw new Error('Failed to load meal data. Please try again later.');
    }
    return response.json(); // Parse JSON if response is ok
  })
  .then(data => {
    const container = document.getElementById('meal-cards-container');
    const template = document.getElementById('meal-card-template');

    // Loop through each meal object in the fetched data
    data.forEach(meal => {
      const card = template.content.cloneNode(true);

      // Populate meal details into card elements
      const mealImgPath = card.querySelector('.meal-image');
      const mealImgAltName = card.querySelector('.meal-image');
      const mealName = card.querySelector('.meal-name');
      const mealSpeciality = card.querySelector('.meal-speciality');
      const mealGluten = card.querySelector('.meal-gluten');
      const mealCalories = card.querySelector('.meal-calories');
      const mealCarbs = card.querySelector('.meal-carbs');
      const mealProtein = card.querySelector('.meal-protein');

      mealImgPath.src = meal.imagePath;
      mealImgAltName.alt = meal.name;
      mealName.textContent = meal.name;
      mealSpeciality.textContent = meal.speciality;
      mealGluten.textContent = meal.gluten;
      mealCalories.textContent = ` ${meal.calories}`;
      mealCarbs.textContent = ` ${meal.carbs}`;
      mealProtein.textContent = ` ${meal.protein}`;

      // Check if the meal is special and add special tag if necessary
      if (meal.specialMeal) {
        card.querySelector('.meal-info').classList.add('special-meal-div');
        const specialTag = document.createElement('div');
        specialTag.classList.add('special-tag');
        specialTag.textContent = '+ $11.49';
        const mealSpecialImgParent = mealImgPath.parentElement;
        mealSpecialImgParent.style.position = 'relative';
        mealSpecialImgParent.appendChild(specialTag);
      }

      // Add meal to cart when 'Add to Cart' button is clicked
      card.querySelector('.add-btn').addEventListener('click', () => addToCart(meal));

      // Append the newly created card to the container
      container.appendChild(card);
    });
  })
  .catch(error => {
    console.error('Error loading JSON:', error); // Log the error for debugging

    // Display an error message to the user on the page
    const container = document.getElementById('meal-cards-container');
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.textContent = 'Unable to load meal data at this time. Please check your connection and try again later.';
    container.appendChild(errorMessage); // Append error message to the container
  });
  
  //clearCart as a global scope for plan meal value change
  window.clearCart = clearCart;
});