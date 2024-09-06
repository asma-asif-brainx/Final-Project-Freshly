$(document).ready(function () {
    const steps = ['plan-step', 'day-step', 'meals-step', 'checkout-step'];
  
    // Utility function to set and get localStorage values
    function updateLocalStorage(key, value) {
      localStorage.setItem(key, value);
    }
  
    function getFromLocalStorage(key) {
      return localStorage.getItem(key);
    }
  
    // Utility function to handle section visibility
    function showSection(targetStep) {
      $('section').removeClass('active');
      $(`section[data-step="${targetStep}"]`).addClass('active');
  
      $('.header-list').removeClass('active');
      $(`.header-list[data-step-target="${targetStep}"]`).addClass('active');
  
      // Mark visited steps as previous steps
      const currentIndex = steps.indexOf(targetStep);
      steps.forEach((step, index) => {
        if (index <= currentIndex) {
          $(`.header-list[data-step-target="${step}"]`).addClass('previous');
        }
      });
    }
  
    // Function to set up plan card click and move to the next step
    function setupPlanCardClick() {
      $('.plan-meals-card').on('click', function () {
        const selectedMealCount = $(this).find('.meal-count').text().trim();
        updateLocalStorage('selectedMealCount', selectedMealCount);
        console.log(`Meal plan selected: ${selectedMealCount}`);
  
        updateLocalStorage('currentStep', 'day-step');
        showSection('day-step');
      });
    }
  
    // Function to handle day step and store the selected day
    function setupDayStep() {
      $('.next-button-delivery').on('click', function () {
        const selectedDateItem = $('.date-container .selected');
        const selectedDateText = selectedDateItem.find('span').first().text().trim();
  
        updateLocalStorage('selectedDay', selectedDateText);
        displayDeliveryDay(selectedDateText);
        updateMealsSection(selectedDateText);
  
        updateLocalStorage('currentStep', 'meals-step');
        showSection('meals-step');
      });
    }
  
    // Function to display the selected delivery day
    function displayDeliveryDay(selectedDateText) {
      const displayDeliveryDay = document.getElementById('delivery-day-value');
      if (displayDeliveryDay) {
        displayDeliveryDay.textContent = selectedDateText;
      } else {
        console.error('Delivery day element not found.');
      }
    }
  
    // Function to update the meals section with the selected delivery day
    function updateMealsSection(selectedDateText) {
      const displayDeliveryDayCart = document.getElementById('delivery-date-cart');
      if (displayDeliveryDayCart) {
        displayDeliveryDayCart.textContent = selectedDateText;
      } else {
        console.error("Element with id 'delivery-date-cart' not found.");
      }
    }
  
    // Function to handle meal step and move to checkout step
    function setupMealsStep() {
      $('.next-btn-cart').on('click', function () {
        if (!$(this).is(':disabled')) {
          const storedDate = getFromLocalStorage('selectedDay');
          updateMealsSection(storedDate);
  
          updateLocalStorage('currentStep', 'checkout-step');
          showSection('checkout-step');
        }
      });
    }
  
    // Function to enable navigation between steps
    function setupStepNavigation() {
      $('.header-list').on('click', function () {
        const targetStep = $(this).data('step-target');
        const currentStep = getFromLocalStorage('currentStep') || 'plan-step';
  
        if (steps.indexOf(targetStep) <= steps.indexOf(currentStep)) {
          showSection(targetStep);
        }
      });
    }
  
    // Initial setup
    updateLocalStorage('currentStep', 'plan-step');
    showSection('plan-step');
  
    setupPlanCardClick();
    setupDayStep();
    setupMealsStep();
    setupStepNavigation();
  
    // Display the selected day if already stored
    const storedValue = getFromLocalStorage('selectedDay');
    if (storedValue) {
      displayDeliveryDay(storedValue);
    }
  });
  