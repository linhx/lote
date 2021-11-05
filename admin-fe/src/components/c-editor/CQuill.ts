import Quill from 'quill';
import BlotFormatter from 'quill-blot-formatter';
import RightClickBubbleTheme from "./RightClickBubbleTheme";
import ImageWithIdBlot from "./ImageWithIdBlot";

Quill.register('modules/blotFormatter', BlotFormatter);
Quill.register("themes/bubble", RightClickBubbleTheme);
Quill.register(ImageWithIdBlot, true);

export default Quill;
