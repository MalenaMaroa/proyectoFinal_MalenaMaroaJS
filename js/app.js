document.addEventListener('DOMContentLoaded', () => {
    let musicData = [];

    
    fetch('music.json')
        .then(response => response.json())
        .then(data => {
            musicData = data;
            displayMusicList(musicData);
            attachAddToCartEvent();
        })
        .catch(error => console.error('Error cargando el JSON:', error));

    
    function displayMusicList(musicList) {
        const musicListContainer = document.getElementById('music-list');
        musicListContainer.innerHTML = '<h2>Lista de Álbumes</h2>'; 
        musicList.forEach(music => {
            const musicItem = document.createElement('div');
            musicItem.classList.add('music-item');
            musicItem.innerHTML = `
                <span>${music.name} - ${music.artist} $ ${music.price} </span>
                <button class="add-to-cart" data-id="${music.id}">Añadir al Carrito</button>
            `;
            musicListContainer.appendChild(musicItem);
        });
    }

    
    function attachAddToCartEvent() {
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', event => {
                const musicId = event.target.dataset.id;
                addToCart(musicId);
            });
        });
    }

    
    const cart = [];

    
    function addToCart(id) {
        const music = musicData.find(item => item.id === id);
        if (music) {
            cart.push(music);
            updateCart();
            Swal.fire({
                icon: 'success',
                title: 'Añadido al Carrito',
                text: `${music.name} - ${music.artist} fue añadido a tu carrito.`,
            });
        }
    }

    
    function updateCart() {
        const cartItems = document.getElementById('cart-items');
        cartItems.innerHTML = '';
        let totalPrice = 0;
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <span>${item.name} - ${item.artist} $ ${item.price} </span>
            `;
            cartItems.appendChild(cartItem);
            totalPrice += item.price;
        });
        document.getElementById('total-price').innerHTML = `<strong>Total: </strong>${totalPrice} `;
    }

   
    document.getElementById('checkout').addEventListener('click', () => {
        if (cart.length > 0) {
            Swal.fire({
                icon: 'success',
                title: 'Compra Realizada',
                text: 'Gracias por tu compra!',
            });
            cart.length = 0;
            updateCart();
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Carrito Vacío',
                text: 'Añade productos al carrito antes de finalizar la compra.',
            });
        }
    });

    
    document.getElementById('search').addEventListener('input', (event) => {
        const query = event.target.value.toLowerCase();
        const filteredData = musicData.filter(music => 
            music.name.toLowerCase().includes(query) || 
            music.artist.toLowerCase().includes(query)
        );
        displayMusicList(filteredData);
        attachAddToCartEvent();
    });

    
    document.getElementById('sort').addEventListener('change', (event) => {
        const sortBy = event.target.value;
        let sortedData = [...musicData];
        if (sortBy === 'name') {
            sortedData.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === 'artist') {
            sortedData.sort((a, b) => a.artist.localeCompare(b.artist));
        } else if (sortBy === 'price') {
            sortedData.sort((a, b) => a.price - b.price);
        }
        displayMusicList(sortedData);
        attachAddToCartEvent();
    });
});
