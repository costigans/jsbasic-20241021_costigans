import createElement from '../../assets/lib/create-element.js';

export default class ProductCard {
  elem = null;
  product = {};

  #button = null;

  constructor(product) {
    this.product = product || this.product;

    this.#render();
  }

  #template() {
    return `
      <div class="card">
        <div class="card__top">
            <img src="/assets/images/products/${this.product.image}" class="card__image" alt="product">
            <span class="card__price">€${this.product.price.toFixed(2)}</span>
        </div>
        <div class="card__body">
            <div class="card__title">${this.product.name}</div>
            <button type="button" class="card__button">
                <img src="/assets/images/icons/plus-icon.svg" alt="icon">
            </button>
        </div>
      </div>
    `;
  }

  #onButtonClick = () => {
    const event = new CustomEvent('product-add', {
      detail: this.product.id,
      bubbles: true
    });
    this.elem.dispatchEvent(event);
  };

  #render() {
    this.elem = createElement(this.#template());
    this.#button = this.elem.querySelector('.card__button');
    this.#button.addEventListener('click', this.#onButtonClick);
  }
}