class Cart {
    constructor(source, container = '.cart') {
        this.source = source;
        this.container = container;
        this.countGoods = 0; // Общее кол-во товаров в корзине
        this.amount = 0; // Общая стоимость товаров в корзине
        this.cartItems = []; // Все товары
        this._init();
    }

    _init() {
        this._render();
        fetch(this.source)
            .then(result => result.json())
            .then(data => {
                for (let product of data.contents) {
                    this.cartItems.push(product);
                    this._renderItem(product);
                }
                this.countGoods = data.countGoods;
                this.amount = data.amount;
                this._renderSum();
            })
    }

    _render() {
        let $cartItemsDiv = $('<div/>', {
            class: 'cart-items-wrap'
        });
        let $totalGoods = $('<div/>', {
            class: 'cart-summary sum-goods'
        });
        let $totalPrice = $('<div/>', {
            class: 'cart-summary sum-price'
        });
        $(this.container).text('Корзина');
        $cartItemsDiv.appendTo($(this.container));
        $totalGoods.appendTo($(this.container));
        $totalPrice.appendTo($(this.container));
    }

    _renderItem(product) {
        let $container = $('<div/>', {
            class: 'cart-item',
            'data-product': product.id_product
        });
        $container.append($(`<p class="product-name">${product.product_name}</p>`));
        let $quantity = $(`<input class="quantity" type="number" min="1"</input>`);
        $quantity.val(+product.quantity);
        $quantity.on('keydown paste', e => {
            e.preventDefault();
        });
        $quantity.click(() => {
            this._updateQuantity(product.id_product, $quantity.val())
        });
        $container.append($quantity);
        $container.append($(`<p class="product-price">${product.price} руб.</p>`));
        let $remBtn = $(`<button class="remBtn">&otimes;</button>`);
        $remBtn.click(() => {
            this._remove(product.id_product)
        });
        $container.append($remBtn);
        $container.appendTo($('.cart-items-wrap'));
    }

    _renderSum() {
        $('.sum-goods').text(`Всего товаров в корзине: ${this.countGoods}`);
        $('.sum-price').text(`Общая сумма: ${this.amount} руб.`);
    }

    _updateCart(product) {
        let $container = $(`div[data-product="${product.id_product}"]`);
        $container.find('.quantity').val(product.quantity);
        $container.find('.product-price').text(`${product.quantity * product.price} руб.`);
    }

    addProduct(element) {
        let productId = +$(element).data('id');
        let find = this.cartItems.find(product => product.id_product === productId);
        if (find) {
            find.quantity++;
            this.countGoods++;
            this.amount += find.price;
            this._updateCart(find);
        } else {
            let product = {
                id_product: productId,
                product_name: $(element).data('name'),
                price: +$(element).data('price'),
                quantity: 1
            };
            this.cartItems.push(product);
            this._renderItem(product);
            this.amount += product.price;
            this.countGoods += product.quantity;
        }
        this._renderSum();
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
        this._renderSum();
    }

    _remove(id) {
        let find = this.cartItems.find(product => product.id_product === id);
        this.cartItems.splice(this.cartItems.indexOf(find), 1);
        $(`div[data-product="${id}"]`).remove();
        this.amount -= find.price * find.quantity;
        this.countGoods -= find.quantity;
        this._renderSum();
    }
}