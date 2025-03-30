import { ReactiveCurrentIndex } from "./ReactiveCurrentIndex";
import { Timer } from "./Timer.js";
import { Attributes, ButtonActions } from "./constants.js";

class DouSlider extends HTMLElement {
  static get observedAttributes() {
    return [Attributes.Interval];
  }

  #timer = null;
  #currentIndex = null;
  #slideCountCache = null;
  #scrollviewWidthCache = 0;
  #intervalCache = 0;
  #scrollviewRefCache = null;
  #scrollviewResizeObserver = new ResizeObserver(([entry]) => {
    this.#scrollviewWidthCache = entry.contentRect.width;
  });

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.#render();
    this.#setupTimer();
    this.#currentIndex = new ReactiveCurrentIndex(this.shadowRoot.getElementById("scrollMarkerGroup"));
    this.#registerEventHandlers();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) {
      return;
    }

    if (name === Attributes.Interval) {
      this.#intervalCache = null;
      this.#setupTimer();
    }
  }

  #setupTimer() {
    const timer = (this.#timer ??= new Timer(this.interval, () => this.showNextSlide()));
    timer.duration = this.interval;
    timer.restart();
  }

  #render() {
    this.shadowRoot.innerHTML = carouselTemplate;
  }

  #registerEventHandlers() {
    this.shadowRoot.getElementById("controls").onclick = (event) => {
      if (!event.target.dataset?.action) {
        return;
      }
      this.#handleButtonClick(event.target.dataset.action);
    };

    this.shadowRoot.onfocusin = () => {
      this.#suspendTimer();
    };

    this.shadowRoot.onfocusout = () => {
      this.#resumeTimer();
    };

    this.#currentIndex.onvaluechange = () => {
      this.#scrollToCurrentSlide();
    };

    this.#scrollviewRef.onslotchange = () => {
      this.#slideCountCache = null;
      this.#renderMarkers();
    };

    this.#scrollviewRef.onmouseenter = () => {
      this.#suspendTimer();
    };

    this.#scrollviewRef.onmouseleave = () => {
      this.#resumeTimer();
    };

    this.#scrollviewRef.onscrollend = ({ target: { scrollLeft } }) => {
      this.#currentIndex.value = Math.round(scrollLeft / this.#scrollviewWidthCache);
      this.#timer.restart();
    };

    this.#scrollviewResizeObserver.observe(this.#scrollviewRef);
  }

  disconnectedCallback() {
    this.#scrollviewResizeObserver.disconnect();
    this.#scrollviewResizeObserver = null;
    this.#timer.disable();
  }

  #handleButtonClick(action) {
    switch (action) {
      case ButtonActions.Next:
        this.showNextSlide();
        break;
      case ButtonActions.Prev:
        this.showPrevSlide();
        break;
      default:
        return;
    }
  }

  #renderMarkers() {
    const markerGroup = this.shadowRoot.getElementById("scrollMarkerGroup");
    const markerTemplate = this.shadowRoot.getElementById("scrollMarkerTemplate");
    const fragment = document.createDocumentFragment();

    for (let index = 0; index < this.#slideCount; index++) {
      const input = markerTemplate.cloneNode(true).content.firstElementChild;
      input.value = index;
      input.checked = index === 0;
      fragment.append(input);
    }

    markerGroup.replaceChildren(fragment);
  }

  #scrollToCurrentSlide() {
    this.#scrollviewRef.scrollTo({ left: this.#currentIndex.value * this.#scrollviewWidthCache });
  }

  showNextSlide() {
    this.#currentIndex.value = (this.#currentIndex.value + 1) % this.#slideCount;
  }

  showPrevSlide() {
    this.#currentIndex.value = (this.#currentIndex.value + this.#slideCount - 1) % this.#slideCount;
  }

  #suspendTimer() {
    this.#timer.disable();
  }

  #resumeTimer() {
    this.#timer.enable();
  }

  get interval() {
    return (this.#intervalCache ??= DouSlider.getPositiveInterval(this.getAttribute(Attributes.Interval)));
  }

  set interval(interval) {
    this.#intervalCache = null;
    this.setAttribute(Attributes.Interval, DouSlider.getPositiveInterval(interval));
  }

  get #scrollviewRef() {
    return (this.#scrollviewRefCache ??= this.shadowRoot.getElementById("scrollview"));
  }

  get #slideCount() {
    return (this.#slideCountCache ??= this.shadowRoot.getElementById("scrollviewContent").assignedElements().length);
  }

  static getPositiveInterval(interval) {
    const num = parseInt(interval);
    return Number.isInteger(num) ? Math.max(num, 0) : 0;
  }
}

const carouselStyles = `
:where(*) { margin: 0; padding: 0;  box-sizing: border-box; }
:host { display: flex; flex-direction: column; }

button { background: none; }
button ::slotted(*) { pointer-events: none; }

#scrollview {
  display: flex;
  flex: 1;
  overflow-x: scroll;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  scrollbar-width: none;
  overscroll-behavior-x: contain;
}

#scrollview ::slotted(*) {
  scroll-snap-align: center;
  flex: 0 0 100%;
}`;

const carouselTemplate = `
<style>${carouselStyles}</style>
<header id=controls part=controls>
  <button part=button data-action="${ButtonActions.Prev}" aria-label="Previous Slide" aria-controls="scrollview">
    <slot name=prev></slot>
  </button>
  <form id="scrollMarkerGroup" part="scroll-marker-group" aria-label="Carousel Indicators"></form>
  <button part=button data-action="${ButtonActions.Next}" aria-label="Next Slide" aria-controls="scrollview">
    <slot name=next></slot>
  </button>
</header>
<div id=scrollview role="region" aria-label="Image Slider" tabindex="0">
  <slot id=scrollviewContent></slot>
</div>
<template id=scrollMarkerTemplate>
  <input type=radio id=scrollMarker name=targetCurrentIndex part="scroll-marker"/>
</template>`;

customElements.define("dou-slider", DouSlider);
