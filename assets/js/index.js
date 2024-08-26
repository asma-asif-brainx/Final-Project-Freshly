document.addEventListener('DOMContentLoaded', function () {
    function getNextMonday(date) {
        const day = date.getDay();
        const diff = (7 - day + 1) % 7;
        const nextMonday = new Date(date);
        nextMonday.setDate(date.getDate() + (diff === 0 ? 7 : diff)); 
        return nextMonday;
    }

    function formatDate(date) {
        const options = { weekday: 'long', day: 'numeric', month: 'short' };
        return date.toLocaleDateString('en-US', options);
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
            
            const starSpan = document.createElement('span');
            starSpan.className = 'star';
            starSpan.innerHTML = '&#9734;';

            popularText.appendChild(starSpan);
            popularText.appendChild(document.createTextNode(' Most popular'));
            dateDiv.appendChild(dateText);
            dateDiv.appendChild(popularText);
    
            if (i === 0) {
                dateDiv.classList.add('selected'); 
                popularText.style.display = 'inline'; 
            } else {
                popularText.style.display = 'none'; 
            }
    
            dateDiv.addEventListener('click', function() {
                const selectedItems = container.querySelectorAll('.date-item.selected');
                selectedItems.forEach(item => {
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
    
    generateDates();
});
