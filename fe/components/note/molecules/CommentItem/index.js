import ROLES from '@/constants/roles';
import { classNames } from '@/utils';
import CommentInput from '../CommentInput';
import style from './style.module.css';
import { useState } from 'react';
import adminAvatar from '@/assets/img/admin-avatar.png';
import CommentAvatar from '../../atoms/CommentAvatar';
import { useTranslation } from 'next-i18next';

export default function CommentItem({ comment, onSend }) {
  const { t } = useTranslation('common');
  const [showReply, setShowReply] = useState(false);
  const onClickReply = () => {
    setShowReply((val) => !val);
  };

  const [newComment, setNewComment] = useState({
    parentId: comment.id,
    content: '',
    authorName: '',
  });

  const send = () => {
    onSend(newComment).then(() => {
      setNewComment({
        ...newComment,
        content: '',
      });
    }).catch(() => {});
  };

  return (
    <div className="border-gray-200 flex mb-3">
      <div className="w-14 h-14 flex items-center">
        <div
          className={classNames(
            'md:h-12 md:w-12 w-10 h-10 rounded-full shadow-md overflow-hidden',
            style['comment-avatar']
          )}
        >
          {comment.author?.role === ROLES.ADMIN ? (
            <img
              src={adminAvatar.src}
              alt="Admin"
              className="md:h-12 md:w-12 w-10 h-10"
            ></img>
          ) : (
            <CommentAvatar
              hash={comment.author.uuid}
              name={comment.author.name}
            />
          )}
        </div>
      </div>
      <div className="ml-2 flex-1">
        <h6 className="font-bold text-base p-0 m-0">
          {comment.author?.name}
          <span className="text-gray-400 ml-2 font-normal text-xs">
            {comment.postedAt?.toLocaleString()}
          </span>
        </h6>
        <p className="text-sm md:text-base font-normal tracking-wide leading-6 whitespace-pre-wrap break-all p-0 m-0">
          {comment.content}
        </p>
        <div className="flex items-center">
          {!comment.parentId && (
            <span
              className="inline-block cursor-pointer text-blue-500 text-sx"
              onClick={onClickReply}
            >
              {showReply ? t('close') : t('reply')}
            </span>
          )}
        </div>
        {comment.subs && !!comment.subs.length && (
          <div className="mt-2">
            {comment.subs.map((subComment) => (
              <CommentItem
                comment={subComment}
                key={subComment.id}
              ></CommentItem>
            ))}
          </div>
        )}
        <div></div>
        {showReply && (
          <CommentInput
            value={newComment}
            className="mt-2"
            onChange={(val) => setNewComment(val)}
            onSend={send}
          ></CommentInput>
        )}
      </div>
    </div>
  );
}
