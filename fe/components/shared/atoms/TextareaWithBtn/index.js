import { classNames } from '@/utils';
import style from './style.module.css';

export default function TextareaWithBtn({
  className,
  value,
  rows,
  placeholder,
  maxLength,
  onChange,
}) {
  const _onChange = (e) => {
    onChange(e.target.value)
  };

  return (
    <div className={classNames(style['textarea-container'], className)}>
      <textarea
        rows={rows}
        placeholder={placeholder}
        className="resize-y dark:bg-slate-800 dark:text-slate-100 border-gray-300 dark:border-slate-600 "
        value={value}
        maxLength={maxLength}
        onChange={_onChange}
        onInput={_onChange}
      ></textarea>
    </div>
  );
}
