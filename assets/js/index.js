document.addEventListener('DOMContentLoaded', function () {
  // Date items rendering in delivery day section
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
    let currentDate = new Date();
    let nextMonday = getNextMonday(currentDate);

    updateFirstDeliveryDate(firstDeliverySpan, nextMonday);

    for (let i = 0; i < 10; i++) {
        const dateDiv = createDateDiv(nextMonday, i === 0);
        dateDiv.addEventListener('click', () => handleDateClick(dateDiv, firstDeliverySpan));
        container.appendChild(dateDiv);
        nextMonday.setDate(nextMonday.getDate() + 1);
    }
  }
  
  function updateFirstDeliveryDate(span, date) {
      span.innerHTML = formatDate(date);
  }

  function createDateDiv(date, isSelected) {
      const dateDiv = document.createElement('div');
      dateDiv.className = 'date-item';
      const dateText = document.createElement('span');
      dateText.className = 'date-text-item';
      dateText.innerHTML = formatDate(date);
      const popularText = document.createElement('span');
      popularText.className = 'popular-text';
      popularText.innerHTML = '&#9734; Most popular';
      if (!isSelected) {
          popularText.style.display = 'none';
      }
      dateDiv.appendChild(dateText);
      dateDiv.appendChild(popularText);
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

  
// ------------------------------Meals cards rendering in cart and meals section ------------------------------
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

  function addToCart(meal) {
    const mealCountLimit = getMealCountFromStorage();
    if (mealCart.length < mealCountLimit) {
      mealCart.push(meal);
      renderCart();
    }  
    const nextButton = document.querySelector('.next-btn-cart');
    if (mealCart.length === mealCountLimit) {
      nextButton.classList.remove('disabled');
    } else {
      nextButton.classList.add('disabled');
    }
  }

  function renderCart() {
    const cartContainer = document.querySelector('.meal-cards-added-cart');
    cartContainer.innerHTML = ''; 
    mealCart.forEach((meal, index) => {
      const clone = createMealCard(meal, index);
      cartContainer.appendChild(clone);
    });
    updateOrderSummary();
  }

  function addDuplicateToCart(meal) {
    const mealCountLimit = getMealCountFromStorage();
  
    if (mealCart.length < mealCountLimit) {
      mealCart.push(meal);
      renderCart();
    }
  
    const nextButton = document.querySelector('.next-btn-cart');
    nextButton.classList.toggle('disabled', mealCart.length !== mealCountLimit);
  }
  
  function removeFromCart(index) {
    mealCart.splice(index, 1); 
    renderCart();
  
    const nextButton = document.querySelector('.next-btn-cart');
    nextButton.classList.toggle('disabled', mealCart.length !== getMealCountFromStorage());
  }
  
  function createMealCard(meal, index) {
    const card = document.createElement('div');
    card.className = 'cart-meals col-md-12 col-sm-6 col-12 p w-xl-25 w-lg-25 w-md-25 w-sm-100 w-xs-100 p-1';
    card.innerHTML = `
      <div class="row cart-meal-card mx-0">
        <img class="col-6 cart-meal-img p-1 pe-0" src="${meal.imagePath}" alt="${meal.name}">
        <div class="col-5 cart-meal-info meal-info mt-2 p-0  me-3 d-flex justify-content-between align-items-center">
          <h4 class="cart-meal-name meal-name mx-2 mb-1 mt-md-0 mt-3 ">${meal.name}</h4>
        </div>
        <div class="col-1 meal-controls d-flex flex-column align-items-end">
            <button class=" meal-control-plus btn  btn-sm meal-minus" data-index="${index}">-</button>
            <button class="meal-control-minus btn  btn-sm meal-plus" data-index="${index}">+</button>
          </div>
      </div>`;
    
    card.querySelector('.meal-minus').addEventListener('click', () => removeFromCart(index));
    card.querySelector('.meal-plus').addEventListener('click', () => addDuplicateToCart(meal));
  
    return card;
  }

  function updateOrderSummary() {
    const mealCount = mealCart.length;
    const mealsCountCart = document.getElementById('meals-count-cart');
    const subtotalCartPrice = document.getElementById('subtotal-cart-price');
    const pricePerMeal = 10; 
    mealsCountCart.textContent = `${mealCount} items`;
    subtotalCartPrice.textContent = `$${mealCount * pricePerMeal}`;
    const nextButton = document.querySelector('.next-btn-cart');
    nextButton.classList.toggle('disabled', mealCount === 0);
  }


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
      const template = document.getElementById('meal-card-template').content;

      data.forEach(meal => {
        const clone = document.importNode(template, true);
        clone.querySelector('.meal-image').src = meal.imagePath;
        clone.querySelector('.meal-image').alt = meal.name;
        clone.querySelector('.meal-name').textContent = meal.name;
        clone.querySelector('.meal-speciality').textContent = meal.speciality;
        clone.querySelector('.meal-gluten').textContent = meal.gluten;
        clone.querySelector('.meal-calories').textContent = ` ${meal.calories}`;
        clone.querySelector('.meal-carbs').textContent = ` ${meal.carbs}g`;
        clone.querySelector('.meal-protein').textContent = ` ${meal.protein}`;

        if (meal.specialMeal) {
          clone.querySelector('.meal-info').classList.add('special-meal-div');
        }
        clone.querySelector('.add-btn').addEventListener('click', () => addToCart(meal));

        container.appendChild(clone);
      });
    })
    .catch(error => {
      console.error('Error loading JSON:', error);
    });

});