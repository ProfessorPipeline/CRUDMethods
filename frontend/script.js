document.addEventListener("DOMContentLoaded", async () => {
    const itemsList = document.getElementById("items-list").querySelector('tbody');
    const addItemButton = document.getElementById("add-item");
    const symbolInput = document.getElementById("crypto-symbol");
    const nameInput = document.getElementById("crypto-name");
    const descriptionInput = document.getElementById("crypto-description");
    const priceInput = document.getElementById("crypto-price");

    // Fetch and display items
    const fetchItems = async () => {
        try {
            const response = await fetch('http://localhost:5117/api/items');
            const items = await response.json();
            itemsList.innerHTML = '';
            items.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="symbol">${item.symbol}</td>
                    <td>${item.name}</td>
                    <td>${item.description}</td>
                    <td>$${item.price}</td>
                    <td>
                        <button class="delete-btn">Delete</button>
                    </td>
                `;
                
                const deleteButton = row.querySelector('.delete-btn');
                deleteButton.addEventListener('click', async () => {
                    await fetch(`http://localhost:5117/api/items/${item.id}`, {
                        method: 'DELETE'
                    });
                    fetchItems();
                });

                itemsList.appendChild(row);
            });
        } catch (error) {
            console.error("Error fetching items:", error);
        }
    };

    // Add item
    addItemButton.addEventListener("click", async () => {
        const symbol = symbolInput.value;
        const name = nameInput.value;
        const description = descriptionInput.value;
        const price = parseFloat(priceInput.value);
        if (!symbol || !name || !description || isNaN(price)) {
            alert("Please enter all fields correctly");
            return;
        }

        const newItem = { symbol, name, description, price };
        try {
            await fetch('http://localhost:5117/api/items', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newItem)
            });
            symbolInput.value = '';
            nameInput.value = '';
            descriptionInput.value = '';
            priceInput.value = '';
            fetchItems();
        } catch (error) {
            console.error("Error adding item:", error);
        }
    });

    fetchItems();
});
