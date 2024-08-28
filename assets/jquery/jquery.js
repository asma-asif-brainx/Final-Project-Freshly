$(document).ready(function () {
    function showSection(targetStep) {
        $('section').removeClass('active');
        $(`section[data-step="${targetStep}"]`).addClass('active');

        $('.header-list').removeClass('active');
        $(`.header-list[data-step-target="${targetStep}"]`).addClass('active');
    }

    function setupPlanCardClick() {
        $('.plan-meals-card').on('click', function () {
            const selectedMealCount = $(this).find('.meal-count').text().trim();
            localStorage.setItem('selectedMealCount', selectedMealCount);
            console.log(`Meal plan selected: ${selectedMealCount}`);

            showSection('day-step');
            localStorage.setItem('currentStep', 'day-step');
        });
    }

    function setupDayStep() {
        $('.next-button-delivery').on('click', function () {
            const selectedDateItem = $('.date-container .selected');
            const selectedDateText = selectedDateItem.find('span').first().text().trim();
    
            localStorage.setItem('selectedDay', selectedDateText);

            displayDeliveryDay(selectedDateText);

            showSection('meals-step');
            localStorage.setItem('currentStep', 'meals-step');
        });
    }

    function displayDeliveryDay(selectedDateText) {
        const displayDeliveryDay = document.getElementById('delivery-day-value');
        if (displayDeliveryDay) {
            displayDeliveryDay.textContent = selectedDateText;
        } else {
            displayDeliveryDay.textContent = 'No value found in local storage.';
        }
    }

    function setupMealsStep() {
        $('.meal-step-next-button').on('click', function () {
            showSection('checkout-step');
            localStorage.setItem('currentStep', 'checkout-step');
        });
    }

    function setupStepNavigation() {
        const steps = ['plan-step', 'day-step', 'meals-step', 'checkout-step'];

        $('.header-list').on('click', function () {
            const targetStep = $(this).data('step-target');
            const currentStep = localStorage.getItem('currentStep') || 'plan-step';

            if (steps.indexOf(targetStep) <= steps.indexOf(currentStep)) {
                showSection(targetStep);
            }
        });
    }

    localStorage.setItem('currentStep', 'plan-step');
    showSection('plan-step');

    setupPlanCardClick();
    setupDayStep();
    
    const storedValue = localStorage.getItem('selectedDay');
    if (storedValue) {
        displayDeliveryDay(storedValue);
    }
    setupMealsStep();
    setupStepNavigation();

});
