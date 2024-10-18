// Fetch the database from db.json
let db = {};  

fetch('./db.json')
    .then(response => response.json())
    .then(data => {
        db = data;  // Assigns the fetched data to db
        initializeGameStore();  // Initializes game store functionality
    })
    .catch(error => console.error('Error fetching data:', error));

// Cart to store ordered games
let cart = [];

// Initializes the game store (once db is fetched)
function initializeGameStore() {
    const orderButtons = document.querySelectorAll('.order-now');
    const cartItems = document.getElementById('cart-items');
    const loginMessage = document.getElementById('login-message');
    const modal = document.getElementById('order-modal');
    const orderMessage = document.getElementById('order-message');

    // Handles the Order Button Clicks
    orderButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const gameId = event.target.getAttribute('data-game-id');
            const selectedGame = db.games.find(game => game.id == gameId);

            if (selectedGame) {
                showOrderModal(selectedGame);
            }
        });
    });

    // Showing Order Modal Function
    function showOrderModal(game) {
        // Populate the modal with the selected game details
        orderMessage.innerText = `Do you want to order "${game.title}" for $${game.price}?`;
        modal.style.display = 'block';  // Show the modal

        // Confirm order
        document.getElementById('confirm-order').onclick = () => {
            addToCart(game.id);  // Add the game to the cart
            modal.style.display = 'none';  // Hide the modal after confirmation
        };

        // Cancel order
        document.getElementById('cancel-order').onclick = () => {
            modal.style.display = 'none';  // Hide the modal when canceled
        };
    }

    // Adds the game to Cart
    function addToCart(gameId) {
        const game = db.games.find(g => g.id == gameId);

        // Check if the game has stock available
        if (game.stock > 0) {
            game.stock--;  // Reduce stock by 1
            cart.push(game);  // Add the game to the cart
            alert(`${game.title} added to cart!`);
            console.log(`Game added: ${game.title}, Remaining Stock: ${game.stock}`);
            updateCartUI();  // Update the cart display
        } else {
            alert(`${game.title} is out of stock!`);
        }
    }

    // Update the Cart UI
    function updateCartUI() {
        cartItems.innerHTML = '';  // Clear previous cart items

        // Display the updated cart items
        cart.forEach(game => {
            const cartItem = document.createElement('li');
            cartItem.innerText = `${game.title} (1) - $${game.price}`;
            cartItems.appendChild(cartItem);
        });
    }

    // Login Functionality
    document.getElementById('login-btn').addEventListener('click', () => {
        const userName = prompt("Enter your name:");
    
        // Ensure that db.users is populated before trying to find the user
        if (db && db.users) {
            const user = db.users.find(user => user.name.toLowerCase() === userName.toLowerCase());
    
            // Ensure loginMessage is defined and display the appropriate message
            const loginMessage = document.getElementById('login-message');
            if (loginMessage) {
                if (user) {
                    loginMessage.innerText = `Welcome, ${user.name}!`;
                } else {
                    loginMessage.innerText = "User not found!";
                }
            } else {
                console.error('Login message element not found in the DOM.');
            }
        } else {
            console.error('User database not available.');
        }
    });
}    
