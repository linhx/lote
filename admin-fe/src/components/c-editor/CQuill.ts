import Quill from 'quill';
import BlotFormatter from 'quill-blot-formatter/dist/BlotFormatter';
import RightClickBubbleTheme from "./RightClickBubbleTheme";
import ImageWithIdBlot from "./ImageWithIdBlot";
import CodeWithLanguage from "./CodeWithLanguage";

Quill.register('modules/blotFormatter', BlotFormatter);
Quill.register('themes/bubble', RightClickBubbleTheme);
Quill.register(ImageWithIdBlot, true);
Quill.register(CodeWithLanguage, true);

export default Quill;
