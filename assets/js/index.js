document.addEventListener('DOMContentLoaded', function () {
    
  // ------------------checkout Form validation---------------------
  const form = document.getElementById('checkout-form');
  const submitButton = document.querySelector('.checkout-buttton');

  const errorMessages = {
      requiredField: "This field is required",
      emails: "Please enter valid email addresses.",
      emailDuplicate: "Duplicate emails not allowed.",
      contact: "Contact number must be 11 digits or 12 digits with a leading plus sign (+).",
      name: "Name must only contain letters (a-z, A-Z)."
  };

  const validateName = value => /^[a-zA-Z]+$/.test(value);
  
  const validateEmail = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const validateEmails = value => {
      const emailList = value.split(',').map(email => email.trim());
      const uniqueEmails = new Set(emailList);
      const hasDuplicates = emailList.length !== uniqueEmails.size;
      const allEmailsValid = emailList.every(email => validateEmail(email));
      return { hasDuplicates, allEmailsValid };
  };

  const validateContact = value => {
      const contactPattern = /^\+?\d{11,12}$/;
      return contactPattern.test(value) && (value.startsWith('+') ? value.length === 12 : value.length === 11);
  };

  const validators = {
      fname: value => validateName(value) ? '' : errorMessages.name,
      lname: value => validateName(value) ? '' : errorMessages.name,
      email: value => {
          const { hasDuplicates, allEmailsValid } = validateEmails(value);
          if (hasDuplicates) return errorMessages.emailDuplicate;
          if (!allEmailsValid) return errorMessages.emails;
          return '';
      },
      phone: value => validateContact(value) ? '' : errorMessages.contact,
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
      const id = input.id;

      if (requiredFields.includes(id) && !value) {
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
    const firstName = document.getElementById('fname').value;
    const lastName = document.getElementById('lname').value;
    const emails = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;

    const { hasDuplicates, allEmailsValid } = validateEmails(emails);

    const isFormValid = validateName(firstName) &&
        validateName(lastName) &&
        !hasDuplicates &&
        allEmailsValid &&
        validateContact(phone);

    submitButton.disabled = !isFormValid;
  };

  const requiredFields = ['fname', 'lname', 'email'];
  form.querySelectorAll('input').forEach(input => {
      input.addEventListener('focus', () => clearErrorMessage(input));
      input.addEventListener('blur', validateField);
  });

  form.addEventListener('submit', event => {
      if (submitButton.disabled) {
          event.preventDefault();
          alert("Please correct the errors in the form.");
      } else {
          alert("Form validated successfully!");
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

  let mealCart = [];
  let price;
  let numOfSpecialMeals;
  let subtotal;

  function addToCart(meal) {
    const mealCountLimit = getMealCountFromStorage();
    if (mealCart.length < mealCountLimit) {
      mealCart.push(meal);
      toggleOrderSummaryVisibilty()
      renderCart();
      calculatePrice();
    }  
    const nextButton = document.querySelector('.next-btn-cart');
    const readyText= document.querySelector('.enter-msg-cart');

    if (mealCart.length === mealCountLimit) {
      nextButton.classList.remove('disabled');
      nextButton.removeAttribute('disabled');
      readyText.textContent ='Ready to go!';
    } else {
      nextButton.classList.add('disabled');
      nextButton.setAttribute('disabled', 'true');
    }
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

  function addDuplicateToCart(meal) {
    const mealCountLimit = getMealCountFromStorage();
  
    if (mealCart.length < mealCountLimit) {
      mealCart.push(meal);
      toggleOrderSummaryVisibilty()
      renderCart();
      calculatePrice();
    }
    const nextButton = document.querySelector('.next-btn-cart');
    nextButton.classList.toggle('disabled', mealCart.length !== mealCountLimit);
    const readyText= document.querySelector('.enter-msg-cart');

      if (mealCart.length === mealCountLimit) {
        nextButton.removeAttribute('disabled');
        readyText.textContent ='Ready to go!';
      } else {
          nextButton.setAttribute('disabled', 'true');
      }
  }
  
  function removeFromCart(index) {
    mealCart.splice(index, 1); 
    toggleOrderSummaryVisibilty()
    renderCart();
    calculatePrice();
  
    const nextButton = document.querySelector('.next-btn-cart');
    nextButton.classList.toggle('disabled', mealCart.length !== getMealCountFromStorage());
     if (mealCart.length === getMealCountFromStorage()) {
        nextButton.removeAttribute('disabled');
      } else {
          nextButton.setAttribute('disabled', 'true');
      }

    const mealsText= document.querySelector('.enter-msg-cart');
    mealsText.innerHTML = `Please add total <span id="meals-count-cart"> </span> to continue`;

    updateOrderSummary();
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
    card.querySelector('.meal-plus').addEventListener('click', () => addDuplicateToCart(meal));
  
    return card;
  }

  function updateOrderSummary() {
    const mealCount = getMealCountFromStorage();

    document.querySelector('.order-cart-meal-count').textContent =  `${mealCart.length} Meals` ;

    const mealsCountCart = document.getElementById('meals-count-cart');
    if(mealsCountCart){
      mealsCountCart.textContent = `${mealCount} items`;
    }
  }

  function calculatePrice(){
    price=0;
    numOfSpecialMeals=0;
    subtotal=0;

    mealCart.forEach((meal, index) => {
      price += meal.price;
      if(meal.specialMeal){
        numOfSpecialMeals++; 
      }
    });
    subtotal = (price + numOfSpecialMeals *11.49).toFixed(2); 
    
    const sub = document.getElementById('subtotal-order-price');
    sub.innerHTML = "$" + subtotal;

    const priceString = document.getElementById('meals-sum-price');
    priceString.innerHTML = "$" + price + " + $" + (numOfSpecialMeals * 11.49).toFixed(2);

    const subtotalCartPrice = document.getElementById('subtotal-cart-price');
    subtotalCartPrice.textContent = "$" + subtotal;
  }

  document.querySelector('.clear-all').addEventListener('click', () => clearCart());
  function clearCart(){
    mealCart = [];
    document.querySelector('.meal-cards-added-cart').innerHTML = "";
    toggleOrderSummaryVisibilty()
    calculatePrice();
  }

  document.querySelector('.next-btn-cart').addEventListener('click', () => checkoutMealPrice());
  function checkoutMealPrice(){
    const mealSum = document.querySelector('.meals-price-sum');
    mealSum.innerHTML = "$" + subtotal;

    const totalCheckoutCost = document.querySelector('.total-price-sum');
    const cost = parseFloat(subtotal) + 8.99 + 10.99;
    totalCheckoutCost.innerHTML = "$" + cost.toFixed(2);
  }

  document.querySelector('.next-btn-cart').addEventListener('click', () => renderMealSummary());
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
          mealCard.querySelector('.order-summary-meal-card').classList.add('special-meal');
        }

        summaryMealCardContainer.appendChild(mealCard);
    });
 }

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

  const cartIcon = document.querySelector('.cart-icon');
  cartIcon.addEventListener('click', showCart);

  const cartDownArrow = document.querySelector('.cart-down-arrow');
  cartDownArrow.addEventListener('click', hideCart);

  //  ------------------------------ Fetch meals json data  ------------------------------
  fetch('assets/json/meals.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      const container = document.getElementById('meal-cards-container');
      const template = document.getElementById('meal-card-template');

      data.forEach(meal => {
        const card = template.content.cloneNode(true);

        const mealImgPath = card.querySelector('.meal-image');
        const mealImgAltName = card.querySelector('.meal-image');
        const mealName = card.querySelector('.meal-name') ;
        const mealSpeciality = card.querySelector('.meal-speciality');
        const mealGluten = card.querySelector('.meal-gluten');
        const mealCalories = card.querySelector('.meal-calories');
        const mealCarbs = card.querySelector('.meal-carbs');
        const mealProtein = card.querySelector('.meal-protein');

        mealImgPath.src = meal.imagePath;
        mealImgAltName.alt = meal.name;
        mealName.textContent =meal.name;
        mealSpeciality.textContent =  meal.speciality;
        mealGluten.textContent =  meal.gluten;
        mealCalories.textContent = ` ${meal.calories}`;
        mealCarbs.textContent =` ${meal.carbs}`
        mealProtein.textContent =` ${meal.protein}`;

        if (meal.specialMeal) {
          card.querySelector('.meal-info').classList.add('special-meal-div');

          const specialTag = document.createElement('div');
          specialTag.classList.add('special-tag');
          specialTag.textContent = '+ $11.49';

          const mealSpecialImgParent = mealImgPath.parentElement;
          mealSpecialImgParent.style.position = 'relative'; 
          mealSpecialImgParent.appendChild(specialTag);
        }
        card.querySelector('.add-btn').addEventListener('click', () => addToCart(meal));

        container.appendChild(card);
      });
    })
    .catch(error => {
      console.error('Error loading JSON:', error);
    });
});