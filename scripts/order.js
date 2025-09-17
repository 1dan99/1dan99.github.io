document.addEventListener('DOMContentLoaded', () => {
    const orderCart = document.getElementById('order-cart');
    const sendWhatsappBtn = document.getElementById('send-whatsapp');
    const clearCartBtn = document.getElementById('clear-cart');

    function loadCart() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        orderCart.innerHTML = '';

        if (cart.length === 0) {
            orderCart.innerHTML = '<p>El carrito está vacío.</p>';
            sendWhatsappBtn.style.display = 'none';
            clearCartBtn.style.display = 'none';
            return;
        }

        let total = 0;
        let whatsappMessage = '¡Hola! Me gustaría hacer el siguiente pedido:\n\n';

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            whatsappMessage += `- ${item.name} x${item.quantity} ($${item.price.toLocaleString('es-CL')})\n`;

            const itemElement = document.createElement('div');
            itemElement.style.cssText = 'border-bottom: 1px solid #ccc; padding: 10px 0; display: flex; justify-content: space-between; align-items: center;';
            itemElement.innerHTML = `
                <div>
                    <h4>${item.name}</h4>
                    <p>Cantidad: ${item.quantity}</p>
                </div>
                <span>$${itemTotal.toLocaleString('es-CL')}</span>
            `;
            orderCart.appendChild(itemElement);
        });

        const totalElement = document.createElement('div');
        totalElement.style.cssText = 'font-weight: bold; font-size: 1.2rem; margin-top: 20px; text-align: right;';
        totalElement.innerHTML = `Total: $${total.toLocaleString('es-CL')}`;
        orderCart.appendChild(totalElement);

        sendWhatsappBtn.style.display = 'block';
        clearCartBtn.style.display = 'block';

        sendWhatsappBtn.onclick = () => {
            const phoneNumber = '56935041223'; // Numero de wsp
            const encodedMessage = encodeURIComponent(whatsappMessage);
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
            window.open(whatsappUrl, '_blank');
        };
    }

    clearCartBtn.addEventListener('click', () => {
        localStorage.removeItem('cart');
        loadCart();
    });

    loadCart();
});