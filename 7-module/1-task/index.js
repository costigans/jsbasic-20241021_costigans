import createElement from '../../assets/lib/create-element.js';

export default class RibbonMenu {
  elem = null;

  #SCROLL_STEP = '350';

  #ribbonInner = null;
  #ribbonArrowRight = null;
  #ribbonArrowLeft = null;

  constructor(categories) {
    this.categories = categories;

    this.#render();
    this.#addEventListeners();
    setTimeout(() => {
      this.#updateArrows();
      this.#selectItem(this.#ribbonInner.children[0]);
    }, 0);
  }

  #render() {
    this.elem = createElement(this.#template());

    this.#ribbonInner = this.elem.querySelector('.ribbon__inner');
    this.#ribbonArrowRight = this.elem.querySelector('.ribbon__arrow_right');
    this.#ribbonArrowLeft = this.elem.querySelector('.ribbon__arrow_left');
  }

  #template() {
    return `
      <div class="ribbon">
        <button class="ribbon__arrow ribbon__arrow_left">
          <img src="/assets/images/icons/angle-icon.svg" alt="icon">
        </button>

        <nav class="ribbon__inner">
          ${this.categories.map(category => `<a href="#" class="ribbon__item" data-id="${category.id}">${category.name}</a>`).join('\n')}
        </nav>

        <button class="ribbon__arrow ribbon__arrow_right">
          <img src="/assets/images/icons/angle-icon.svg" alt="icon">
        </button>
      </div>
    `;
  }

  #addEventListeners() {
    this.#ribbonInner.addEventListener('scroll', this.#onRibbonInnerScroll);
    this.#ribbonInner.addEventListener('click', this.#onRibbonInnerClick);
    this.#ribbonArrowRight.addEventListener('click', this.#onArrowClick);
    this.#ribbonArrowLeft.addEventListener('click', this.#onArrowClick);
  }

  #onArrowClick = ({ target }) => {
    this.#ribbonInner.scrollBy((target === this.#ribbonArrowRight ? 1 : -1) * this.#SCROLL_STEP, 0)
  }

  #onRibbonInnerScroll = () => {
    this.#updateArrows();
  }

  #onRibbonInnerClick = (evt) => {
    const targetElem = evt.target.closest('.ribbon__item');
    if (!targetElem) {
      return;
    }

    evt.preventDefault();
    this.#selectItem(targetElem);

    const ribbonSelectEvent = new CustomEvent('ribbon-select',
      {
        bubbles: true,
        detail: targetElem.dataset.id
      }
    );
    this.elem.dispatchEvent(ribbonSelectEvent);
  }

  #selectItem(activeElem) {
    Array.from(this.#ribbonInner.children).forEach(elem => {
      elem.classList.remove('ribbon__item_active');
    });

    activeElem.classList.add('ribbon__item_active');
  }

  #updateArrows() {
    let { scrollWidth, scrollLeft, clientWidth } = this.#ribbonInner;

    let arrowLeftMethod = scrollLeft === 0 ? 'remove' : 'add';
    this.#ribbonArrowLeft.classList[arrowLeftMethod]('ribbon__arrow_visible');

    let scrollRight = scrollWidth - scrollLeft - clientWidth;
    let arrowRightMethod = scrollRight < 1 ? 'remove' : 'add';
    this.#ribbonArrowRight.classList[arrowRightMethod]('ribbon__arrow_visible');
  }
}
