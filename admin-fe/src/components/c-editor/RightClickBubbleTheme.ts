import Quill from "quill";

const BubbleTheme = Quill.import("themes/bubble");
export default class RightClickBubbleTheme extends BubbleTheme {

  constructor(quill: any, options: any) {
    super(quill, options);

    quill.container.addEventListener('contextmenu', (e: Event) => {
      e.preventDefault();

      const range = quill.getSelection();
      quill.theme.tooltip.show();
      quill.theme.tooltip.position(quill.getBounds(range));
      return false;
    });
  }
}
