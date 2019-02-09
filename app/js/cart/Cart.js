class Cart {
    constructor(source, container) {
        this.source = source;
        this.container = container;
        this.countGoods = 0; // Общее кол-во товаров в корзине
        this.amount = 0; // Общая стоимость товаров в корзине
        this.cartItems = []; // Все товары
        this._init();
    }

    _init() {
        if (!localStorage.getItem('userCart')) {
            this._render();
            fetch(this.source)
                .then(result => result.json())
                .then(data => {
                    for (let product of data.items) {
                        this.cartItems.push(product);
                        this._renderItem(product);
                    }
                    this.countGoods = data.countGoods;
                    this.amount = data.amount;
                    localStorage.setItem('userCart', JSON.stringify(this.cartItems));
                    localStorage.setItem('amount', JSON.stringify(this.amount));
                    localStorage.setItem('countGoods', JSON.stringify(this.countGoods));
                    this._renderSum();
                })
        } else if (localStorage.getItem('amount') === '0') {
            $('.shopping-cart_container').empty();
            this._renderSum();
        } else {
            this._render();
            this.cartItems = JSON.parse(localStorage.getItem('userCart'));
            for (let product of this.cartItems) {
                this._renderItem(product);
            }
            this.amount = JSON.parse(localStorage.getItem('amount'));
            this.countGoods = JSON.parse(localStorage.getItem('countGoods'));
            this._renderSum();
        }
    }

    _render() {
        let $productsBox = $('<div/>', {
            class: 'products-box'
        });
        let $shoppingCartHeader = $('<div/>', {
            class: 'products-box-header'
        });
        $shoppingCartHeader.append($(`<span>Product Details</span>`));
        $shoppingCartHeader.append($(`<span class="unite-price-header">unite Price</span>`));
        $shoppingCartHeader.append($(`<span class="quantity-header">Quantity</span>`));
        $shoppingCartHeader.append($(`<span class="shipping-header">shipping</span>`));
        $shoppingCartHeader.append($(`<span class="subtotal-header">Subtotal</span>`));
        $shoppingCartHeader.append($(`<span class="action-header">ACTION</span>`));
        let $shoppingCartButton = $('<div/>', {
            class: "shopping-cart-button container"
        });
        let $remBtn = $(`<button class="shopping-cart-button_clear">CLEAR SHOPPING CART</button>`);
        $remBtn.click(() => {
            this.cartItems = [];
            $('.header-cart-count_goods').text('0');
            $('.shopping-cart_container').empty();
            localStorage.setItem('userCart', JSON.stringify(this.cartItems));
            localStorage.setItem('amount', '0');
            localStorage.setItem('countGoods', '0');
        });
        $shoppingCartButton.append($remBtn);
        $shoppingCartButton.append($(`<button class="shopping-cart-button_continue">CONTINUE SHOPPING</button>`));
        $shoppingCartHeader.appendTo($productsBox);
        $productsBox.appendTo($(this.container));
        $shoppingCartButton.appendTo($(this.container));
    }

    _renderItem(product) {
        let $container = $('<div/>', {
            class: 'product-box-details',
            'data-product': product.id_product
        });
        // noinspection JSUnresolvedVariable
        $container.append($(`<img src="${product.product_img}" class="product-box-img" alt="product_photo">`));
        let $detailsBox = $(`<div/>`, {
            class: 'product-details-box_parameter'
        });
        $detailsBox.append($(`<a class="product-details-link" href="#">${product.product_name}</a>`));
        let $comment = $(`<div/>`, {
            class: 'box-details-comment'
        });
        // noinspection JSUnresolvedVariable
        $comment.append($(`<span class="product-details-comment">${product.product_rating}</span>`));
        $detailsBox.append($comment);
        let $color = $(`<div/>`, {
            class: 'product-details-color'
        });
        $color.append($(`<span class="product-details-parameter">Color:</span>`));
        // noinspection JSUnresolvedVariable
        $color.append($(`<span class="product-details-value">${product.product_color}</span>`));
        $detailsBox.append($color);
        let $size = $(`<div/>`, {
            class: 'product-details-size'
        });
        $size.append($(`<span class="product-details-parameter">Size:</span>`));
        // noinspection JSUnresolvedVariable
        $size.append($(`<span class="product-details-value">${product.product_size}</span>`));
        $detailsBox.append($size);
        $container.append($detailsBox);
        let $price = $(`<div/>`, {
            class: 'cart-product-price'
        });
        $price.append($(`<span class="cart-product-value_text">$${product.price}</span>`));
        $container.append($price);
        let $quantityBox = $(`<label/>`, {
            class: 'cart-product-quantity'
        });
        let $quantity = $(`<input class="cart-quantity-value" type="number" min="1"</input>`);
        $quantity.val(+product.quantity);
        $quantity.on('keydown paste', e => {
            e.preventDefault();
        });
        $quantity.click(() => {
            this._updateQuantity(product.id_product, $quantity.val())
        });
        $quantityBox.append($quantity);
        $container.append($quantityBox);
        let $shipping = $(`<div/>`, {
            class: `cart-product-shipping`
        });
        // noinspection JSUnresolvedVariable
        $shipping.append($(`<span class="cart-product-value_text">${product.product_shipping}</span>`));
        $container.append($shipping);
        let $subtotal = $(`<div/>`, {
            class: 'cart-product-subtotal'
        });
        $subtotal.append($(`<span class="cart-product-subtotal_value">$${product.price * product.quantity}</span>`));
        $container.append($subtotal);
        let $action = $(`<div/>`, {
            class: 'cart-product-action'
        });
        let $remBtn = $(`<button class="cart-product-remBtn">&#10005;</button>`);
        $remBtn.click(() => {
            this._remove(product.id_product)
        });
        $action.append($remBtn);
        $container.append($action);
        $container.appendTo($('.products-box'));
    }

    _renderSum() {
        $('.sub-total-value').text(`$${this.amount}`);
        $('.grand-total-value').text(`$${this.amount}`);
        $('.header-cart-count_goods').text(`${this.countGoods}`);
    }

    // noinspection JSMethodCanBeStatic
    _updateCart(product) {
        let $container = $(`div[data-product="${product.id_product}"]`);
        $container.find('.cart-product-subtotal_value').text(`$${product.price * product.quantity}`);
    }

    _updateQuantity(id, quantity) {
        let find = this.cartItems.find(product => product.id_product === id);
        if (find.quantity < quantity) {
            find.quantity = quantity;
            this.countGoods++;
            this.amount += find.price;
            this._updateCart(find);
        } else if (find.quantity > quantity) {
            find.quantity = quantity;
            this.countGoods--;
            this.amount -= find.price;
            this._updateCart(find);
        }
        localStorage.setItem('userCart', JSON.stringify(this.cartItems));
        localStorage.setItem('amount', JSON.stringify(this.amount));
        localStorage.setItem('countGoods', JSON.stringify(this.countGoods));
        this._renderSum();
    }

    _remove(id) {
        let find = this.cartItems.find(product => product.id_product === id);
        this.cartItems.splice(this.cartItems.indexOf(find), 1);
        $(`div[data-product="${id}"]`).remove();
        this.amount -= find.price * find.quantity;
        this.countGoods -= find.quantity;
        localStorage.setItem('userCart', JSON.stringify(this.cartItems));
        localStorage.setItem('amount', JSON.stringify(this.amount));
        localStorage.setItem('countGoods', JSON.stringify(this.countGoods));
        this._renderSum();
    }
}