# DOU Slider

A lightweight, dependency-free, and reactive image slider built entirely with Vanilla JavaScript and Web Components (Custom Elements & Shadow DOM). No frameworks or external libraries required.

## Features

- **Dependency-free:** Pure JavaScript, no external libraries.
- **Native scrolling:** Smooth slide transitions without CSS transforms.
- **Automatic slide rotation:** Set custom intervals for automatic cycling.
- **Manual controls:** Simple navigation with next and previous buttons or slide markers.
- **Reactive internal state:** Built-in reactivity using HTML form and radio inputs.
- **Accessibility (a11y):** Native support for keyboard navigation and ARIA roles.
- **Minimal & Functional styling:** No built-in presentation styles; easy external styling via CSS `::part()` selectors.

## Browser Support

- ✅ Chrome
- ✅ Firefox
- ✅ Edge
- ❌ Safari _(due to lack of necessary browser support)_

## Installation

Just import the script and use the `<dou-slider>` element directly in your HTML:

```html
<script type="module" src="dou-slider.js"></script>
```

## Usage

Basic example:

```html
<dou-slider interval="3000">
  <div class="slide">Slide 1</div>
  <div class="slide">Slide 2</div>
  <div class="slide">Slide 3</div>

  <span slot="prev" class="icon-prev"></span>
  <span slot="next" class="icon-next"></span>
</dou-slider>
```

## Styling

Easily customize buttons and indicators from your external stylesheet using CSS parts:

```css
dou-slider::part(button) {
  background-color: black;
  color: white;
}

dou-slider::part(scroll-marker):checked {
  background-color: orange;
}
```

## Public API

### Methods

- `showNextSlide()` – Manually navigate to the next slide.
- `showPrevSlide()` – Manually navigate to the previous slide.

### Attributes & Properties

- `interval` – Set or get slide rotation interval (milliseconds).

```js
// Example
const slider = document.querySelector("dou-slider");
slider.interval = 5000;
slider.showNextSlide();
```

## License

[MIT](https://opensource.org/license/mit)
