document.addEventListener('DOMContentLoaded', function () {
    let cardContainer = document.getElementById('cardContainer');
    let products;
    let ascendingOrder = true;
    let mostPopularButton = document.getElementById('mostpopular');
    let mostcheapButton = document.getElementById('mostcheap');
    let Clean = document.getElementById('clean');

    Clean.style.display = 'none';

    fetch('https://fakestoreapi.com/products')
        .then(response => response.json())
        .then(data => {
            products = data;
            data.forEach(product => {
                displayProduct(product);
            });
        })
        .catch(error => console.error('Erro ao obter dados da API:', error));

    function displayProduct(product) {
        let truncatedTitle = product.title.length > 20 ? product.title.substring(0, 18) + "..." : product.title;

        
        let productCard = document.createElement('div');
        productCard.classList.add('card');
        productCard.style.animation = 'zoomIn';
        productCard.style.animationDuration = '1s';
        productCard.style.animationIterationCount = '1';

        let productImage = document.createElement('div');
        productImage.classList.add('cardImage');
        let img = document.createElement('img');
        img.src = product.image;
        productImage.appendChild(img);

        const subjectCard = document.createElement('div');
        subjectCard.classList.add('subjectCard');
        const title = document.createElement('h1');
        title.textContent = truncatedTitle;
        const category = document.createElement('h2');
        category.textContent = product.category;
        const price = document.createElement('h3');
        price.textContent = `R$${product.price.toFixed(2)}`;

        const starsContainer = displayStars(product.rating.rate, product.rating.count);

        subjectCard.appendChild(title);
        subjectCard.appendChild(category);
        subjectCard.appendChild(price);
        subjectCard.appendChild(starsContainer);

        let buy = document.createElement('div');
        buy.id = 'buy';
        let button = document.createElement('button');
        button.textContent = 'Comprar';
        buy.appendChild(button);

        productCard.appendChild(productImage);
        productCard.appendChild(subjectCard);
        productCard.appendChild(buy);

        cardContainer.appendChild(productCard);
    }

    function displayStars(rate, count) {
        const starsContainer = document.createElement('div');
        starsContainer.classList.add('stars');

        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('img');
            star.classList.add('star-icon');

            if (i <= rate) {
                star.src = 'icon/estrela_cheia.png';
            } else {
                star.src = 'icon/estrela_vazia.png';
            }

            starsContainer.appendChild(star);
        }

        const countElement = document.createElement('span');
        countElement.textContent = `${count} avaliações`;
        starsContainer.appendChild(countElement);

        return starsContainer;
    }

    const searchInput = document.getElementById('searchspace');
    searchInput.addEventListener('input', function () {
        const searchTerm = searchInput.value.toLowerCase();

        const filteredProducts = products.filter(product => {
            const productName = product.title.toLowerCase();
            return productName.includes(searchTerm);
        });

        cardContainer.innerHTML = '';

        filteredProducts.forEach(product => {
            displayProduct(product);
        });
    });

    mostcheapButton.addEventListener('click', function () {
        mostcheapButton.classList.toggle('selected');

        ascendingOrder = !ascendingOrder;

        updateCleanAvailability();
        
        const cheapProducts = products.slice().sort((a, b) => {
            return ascendingOrder ? b.price - a.price : a.price - b.price;
        });

        cardContainer.innerHTML = '';

        cheapProducts.forEach(product => {
            displayProduct(product);
        });
    });

    mostPopularButton.addEventListener('click', function () {
        mostPopularButton.classList.toggle('selected');
        if (!ascendingOrder) {
            ascendingOrder = true;
        } else {
            ascendingOrder = !ascendingOrder;
        }

        updateCleanAvailability();
        
        const popularProducts = products.slice().sort((a, b) => {
            return ascendingOrder ? a.rating.rate - b.rating.rate : b.rating.rate - a.rating.rate;
        });

        cardContainer.innerHTML = '';

        popularProducts.forEach(product => {
            displayProduct(product);
        });
    });

    Clean.addEventListener('click', function () {
        ascendingOrder = true;
        cardContainer.innerHTML = '';

        products.forEach(product => {
            displayProduct(product);
        });

        resetFilters();
        Clean.classList.add('disabled');

    });

    function resetFilters() {
        mostcheapButton.classList.remove('selected');
        mostPopularButton.classList.remove('selected');
        Clean.classList.add('disabled');
    }

    function updateCleanAvailability() {
        if (mostcheapButton.classList.contains('selected') || mostPopularButton.classList.contains('selected')) {
            Clean.style.animation = 'bounceIn';
            Clean.style.animationDuration = '1s';
            Clean.style.display = 'flex';
        } else {
            Clean.style.display = 'none';
        }
    } 
});