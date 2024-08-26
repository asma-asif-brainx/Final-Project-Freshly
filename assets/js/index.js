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
            popularText.textContent = 'Most popular';
            dateDiv.appendChild(dateText);
            dateDiv.appendChild(popularText);
    
            if (i === 0) {
                dateDiv.classList.add('selected'); 
                popularText.style.display = 'inline'; 
            } else {
                popularText.style.display = 'none'; 
            }
    
            dateDiv.addEventListener('click', function() {
                this.classList.toggle('selected'); 
    
                if (this === container.children[0]) {
                    this.querySelector('.popular-text').style.display = this.classList.contains('selected') ? 'inline' : 'none';
                } else {
                    this.querySelector('.popular-text').style.display = 'none';
                }
            });
    
            container.appendChild(dateDiv);
            nextMonday.setDate(nextMonday.getDate() + 1);
        }
    }
    
    generateDates();
});