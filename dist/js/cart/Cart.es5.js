"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Cart =
/*#__PURE__*/
function () {
  function Cart(source, container) {
    _classCallCheck(this, Cart);

    this.source = source;
    this.container = container;
    this.countGoods = 0; // Общее кол-во товаров в корзине

    this.amount = 0; // Общая стоимость товаров в корзине

    this.cartItems = []; // Все товары

    this._init();
  }

  _createClass(Cart, [{
    key: "_init",
    value: function _init() {
      var _this = this;

      if (!localStorage.getItem('userCart')) {
        this._render();

        fetch(this.source).then(function (result) {
          return result.json();
        }).then(function (data) {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = data.items[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var product = _step.value;

              _this.cartItems.push(product);

              _this._renderItem(product);
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }

          _this.countGoods = data.countGoods;
          _this.amount = data.amount;
          localStorage.setItem('userCart', JSON.stringify(_this.cartItems));
          localStorage.setItem('amount', JSON.stringify(_this.amount));
          localStorage.setItem('countGoods', JSON.stringify(_this.countGoods));

          _this._renderSum();
        });
      } else if (localStorage.getItem('amount') === '0') {
        $('.shopping-cart_container').empty();

        this._renderSum();
      } else {
        this._render();

        this.cartItems = JSON.parse(localStorage.getItem('userCart'));
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = this.cartItems[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var product = _step2.value;

            this._renderItem(product);
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }

        this.amount = JSON.parse(localStorage.getItem('amount'));
        this.countGoods = JSON.parse(localStorage.getItem('countGoods'));

        this._renderSum();
      }
    }
  }, {
    key: "_render",
    value: function _render() {
      var _this2 = this;

      var $productsBox = $('<div/>', {
        class: 'products-box'
      });
      var $shoppingCartHeader = $('<div/>', {
        class: 'products-box-header'
      });
      $shoppingCartHeader.append($("<span>Product Details</span>"));
      $shoppingCartHeader.append($("<span class=\"unite-price-header\">unite Price</span>"));
      $shoppingCartHeader.append($("<span class=\"quantity-header\">Quantity</span>"));
      $shoppingCartHeader.append($("<span class=\"shipping-header\">shipping</span>"));
      $shoppingCartHeader.append($("<span class=\"subtotal-header\">Subtotal</span>"));
      $shoppingCartHeader.append($("<span class=\"action-header\">ACTION</span>"));
      var $shoppingCartButton = $('<div/>', {
        class: "shopping-cart-button container"
      });
      var $remBtn = $("<button class=\"shopping-cart-button_clear\">CLEAR SHOPPING CART</button>");
      $remBtn.click(function () {
        _this2.cartItems = [];
        $('.header-cart-count_goods').text('0');
        $('.shopping-cart_container').empty();
        localStorage.setItem('userCart', JSON.stringify(_this2.cartItems));
        localStorage.setItem('amount', '0');
        localStorage.setItem('countGoods', '0');
      });
      $shoppingCartButton.append($remBtn);
      $shoppingCartButton.append($("<button class=\"shopping-cart-button_continue\">CONTINUE SHOPPING</button>"));
      $shoppingCartHeader.appendTo($productsBox);
      $productsBox.appendTo($(this.container));
      $shoppingCartButton.appendTo($(this.container));
    }
  }, {
    key: "_renderItem",
    value: function _renderItem(product) {
      var _this3 = this;

      var $container = $('<div/>', {
        class: 'product-box-details',
        'data-product': product.id_product
      }); // noinspection JSUnresolvedVariable

      $container.append($("<img src=\"".concat(product.product_img, "\" class=\"product-box-img\" alt=\"product_photo\">")));
      var $detailsBox = $("<div/>", {
        class: 'product-details-box_parameter'
      });
      $detailsBox.append($("<a class=\"product-details-link\" href=\"#\">".concat(product.product_name, "</a>")));
      var $comment = $("<div/>", {
        class: 'box-details-comment'
      }); // noinspection JSUnresolvedVariable

      $comment.append($("<span class=\"product-details-comment\">".concat(product.product_rating, "</span>")));
      $detailsBox.append($comment);
      var $color = $("<div/>", {
        class: 'product-details-color'
      });
      $color.append($("<span class=\"product-details-parameter\">Color:</span>")); // noinspection JSUnresolvedVariable

      $color.append($("<span class=\"product-details-value\">".concat(product.product_color, "</span>")));
      $detailsBox.append($color);
      var $size = $("<div/>", {
        class: 'product-details-size'
      });
      $size.append($("<span class=\"product-details-parameter\">Size:</span>")); // noinspection JSUnresolvedVariable

      $size.append($("<span class=\"product-details-value\">".concat(product.product_size, "</span>")));
      $detailsBox.append($size);
      $container.append($detailsBox);
      var $price = $("<div/>", {
        class: 'cart-product-price'
      });
      $price.append($("<span class=\"cart-product-value_text\">$".concat(product.price, "</span>")));
      $container.append($price);
      var $quantityBox = $("<label/>", {
        class: 'cart-product-quantity'
      });
      var $quantity = $("<input class=\"cart-quantity-value\" type=\"number\" min=\"1\"</input>");
      $quantity.val(+product.quantity);
      $quantity.on('keydown paste', function (e) {
        e.preventDefault();
      });
      $quantity.click(function () {
        _this3._updateQuantity(product.id_product, $quantity.val());
      });
      $quantityBox.append($quantity);
      $container.append($quantityBox);
      var $shipping = $("<div/>", {
        class: "cart-product-shipping"
      }); // noinspection JSUnresolvedVariable

      $shipping.append($("<span class=\"cart-product-value_text\">".concat(product.product_shipping, "</span>")));
      $container.append($shipping);
      var $subtotal = $("<div/>", {
        class: 'cart-product-subtotal'
      });
      $subtotal.append($("<span class=\"cart-product-subtotal_value\">$".concat(product.price * product.quantity, "</span>")));
      $container.append($subtotal);
      var $action = $("<div/>", {
        class: 'cart-product-action'
      });
      var $remBtn = $("<button class=\"cart-product-remBtn\">&#10005;</button>");
      $remBtn.click(function () {
        _this3._remove(product.id_product);
      });
      $action.append($remBtn);
      $container.append($action);
      $container.appendTo($('.products-box'));
    }
  }, {
    key: "_renderSum",
    value: function _renderSum() {
      $('.sub-total-value').text("$".concat(this.amount));
      $('.grand-total-value').text("$".concat(this.amount));
      $('.header-cart-count_goods').text("".concat(this.countGoods));
    } // noinspection JSMethodCanBeStatic

  }, {
    key: "_updateCart",
    value: function _updateCart(product) {
      var $container = $("div[data-product=\"".concat(product.id_product, "\"]"));
      $container.find('.cart-product-subtotal_value').text("$".concat(product.price * product.quantity));
    }
  }, {
    key: "_updateQuantity",
    value: function _updateQuantity(id, quantity) {
      var find = this.cartItems.find(function (product) {
        return product.id_product === id;
      });

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
  }, {
    key: "_remove",
    value: function _remove(id) {
      var find = this.cartItems.find(function (product) {
        return product.id_product === id;
      });
      this.cartItems.splice(this.cartItems.indexOf(find), 1);
      $("div[data-product=\"".concat(id, "\"]")).remove();
      this.amount -= find.price * find.quantity;
      this.countGoods -= find.quantity;
      localStorage.setItem('userCart', JSON.stringify(this.cartItems));
      localStorage.setItem('amount', JSON.stringify(this.amount));
      localStorage.setItem('countGoods', JSON.stringify(this.countGoods));

      this._renderSum();
    }
  }]);

  return Cart;
}();