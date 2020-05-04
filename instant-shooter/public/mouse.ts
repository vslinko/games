export class Mouse {
  public mouseX: number;
  public mouseY: number;

  constructor() {
    this.mouseX = 0;
    this.mouseY = 0;

    document.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });
  }
}
