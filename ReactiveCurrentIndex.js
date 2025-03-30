export class ReactiveCurrentIndex {
  #formRef = null;
  onvaluechange = null;

  constructor(formRef) {
    this.#formRef = formRef;
    this.#formRef.onchange = () => {
      this.onvaluechange?.(this.value);
    };
  }

  get value() {
    return parseInt(this.#formRef.elements.targetCurrentIndex.value);
  }

  set value(index) {
    if (index === this.value) {
      return;
    }
    this.#formRef.elements.targetCurrentIndex.value = index;
    this.#formRef.dispatchEvent(new Event("change", { bubbles: true }));
  }
}
