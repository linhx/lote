import TextareaWithBtn from '@/components/shared/atoms/TextareaWithBtn';
import { useTranslation } from 'next-i18next';
import iconSend from '@/assets/img/icon-send-letter-48.png';
import { classNames } from '@/utils';

export default function CommentInput({ className, value, onChange, onSend }) {
  const { t } = useTranslation('common');

  const onChangeContent = (val) => {
    onChange({
      ...value,
      content: val,
    });
  };

  const onChangeName = (e) => {
    onChange({
      ...value,
      authorName: e.target.value,
    });
  };

  const onEnter = (e) => {
    if (e.key === 'Enter') {
      onSend(value);
    }
  };

  return (
    <div className={classNames(className)}>
      <TextareaWithBtn
        value={value?.content}
        placeholder={t('comment.content.placeholder')}
        maxLength={500}
        onChange={onChangeContent}
      ></TextareaWithBtn>
      <div className="flex items-center mt-2">
        <input
          type="text"
          value={value?.authorName}
          placeholder={t('comment.name.placeholder')}
          maxLength="30"
          className="c-input comment-name border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          onChange={onChangeName}
          onKeyDown={onEnter}
        />
        <button
          className="w-9 h-9 inline-block rounded-full hover:shadow-md overflow-hidden ml-1"
          onClick={onSend}
        >
          <img src={iconSend.src}></img>
        </button>
      </div>
    </div>
  );
}
