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
});