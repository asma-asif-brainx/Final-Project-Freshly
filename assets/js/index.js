document.addEventListener('DOMContentLoaded', function () {
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

        firstDeliverySpan.innerHTML = formatDate(nextMonday);

        for (let i = 0; i < 10; i++) {
            const dateDiv = document.createElement('div');
            dateDiv.className = 'date-item';
            const dateText = document.createElement('span');
            dateText.className = 'date-text-item';
            dateText.innerHTML = formatDate(nextMonday);
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

            dateDiv.addEventListener('click', function () {
                container.querySelectorAll('.date-item.selected').forEach(item => {
                    if (item !== this) {
                        item.classList.remove('selected');
                    }
                });
                this.classList.add('selected');

                const selectedDateText = this.querySelector('span').innerHTML;
                firstDeliverySpan.innerHTML = selectedDateText;
            });

            container.appendChild(dateDiv);
            nextMonday.setDate(nextMonday.getDate() + 1);
        }
    }
    generateDates();


  


    fetch('../assets/json/meals.json')  
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
      
      // Apply special meal styling if applicable
      if (meal.specialMeal) {
        clone.querySelector('.meal-info').classList.add('special-meal-div');
      }

      container.appendChild(clone);
    });
  })
  .catch(error => {
    console.error('Error loading JSON:', error);
  });
});