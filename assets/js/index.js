document.addEventListener('DOMContentLoaded', function () {
    function getNextMonday(date) {
        const day = date.getDay();
        const diff = (7 - day + 1) % 7;
        return new Date(date.setDate(date.getDate() + (diff === 0 ? 7 : diff)));
    }

    function formatDate(date) {
        return date.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short' });
    }

    function generateDates() {
        const container = document.querySelector('.date-container');
        const firstDeliverySpan = document.querySelector('.first-delivery-date');
        let currentDate = new Date();
        let nextMonday = getNextMonday(currentDate);

        firstDeliverySpan.textContent = formatDate(nextMonday);

        for (let i = 0; i < 10; i++) {
            const dateDiv = document.createElement('div');
            dateDiv.className = 'date-item';
            const dateText = document.createElement('span');
            dateText.textContent = formatDate(nextMonday);

            const popularText = document.createElement('span');
            popularText.className = 'popular-text';
            popularText.innerHTML = '&#9734; Most popular';

            if (i === 0) {
                dateDiv.classList.add('selected');
            } else {
                popularText.style.display = 'none';
            }

            dateDiv.appendChild(dateText);
            dateDiv.appendChild(popularText);

            dateDiv.addEventListener('click', function() {
                container.querySelectorAll('.date-item.selected').forEach(item => {
                    if (item !== this) {
                        item.classList.remove('selected');
                    }
                });
                this.classList.add('selected');
            });

            container.appendChild(dateDiv);
            nextMonday.setDate(nextMonday.getDate() + 1);
        }
    }

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
            console.log(`Day selected: ${selectedDateText}`);

            showSection('meals-step');
            localStorage.setItem('currentStep', 'meals-step');
        });
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
                //  targetStep.addClass('enabled-active-pointer');
                // targetStep.addClass('enabled-underline');
                showSection(targetStep);
            }
        });
    }


    function displayDeliveryDay(){
        const storedValue = localStorage.getItem('selectedDay');

        const displayDeliveryDay= document.getElementById('delivery-day-value');

        if (storedValue) {
            displayDeliveryDay.textContent = storedValue;
        } else {
            displayDeliveryDay.textContent = 'No value found in local storage.';
        }
    }

    localStorage.setItem('currentStep', 'plan-step');
    showSection('plan-step');

    generateDates();

    setupPlanCardClick();
    setupDayStep();
    setupMealsStep();

    setupStepNavigation();

    displayDeliveryDay();

});
