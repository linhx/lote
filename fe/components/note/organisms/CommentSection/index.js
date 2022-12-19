import CommentRepository from '@/repositories/CommentRepository';
import { classNames } from '@/utils';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import CommentInput from '../../molecules/CommentInput';
import CommentItem from '../../molecules/CommentItem';
import Comment from './Comment';

const getCaptcha = () => {
  return new Promise((resolve, reject) => {
    grecaptcha.ready(function() {
      try {
        grecaptcha.execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, { action: 'submit' }).then((token) => {
          resolve(token);
        }).catch((e) => {
          reject(e);
        });
      } catch(e) {
        reject(e);
      }
    });
  });
}

export default function CommentSection({ className, permalink }) {
  const { t } = useTranslation('common');

  const [comments, setComments] = useState([]);
  useEffect(() => {
    CommentRepository.getList(permalink).then((res) => {
      if (res.items && res.items.length) {
        const commentsClone = [...res.items];
        commentsClone.sort((a, b) => {
          return a.postedAt > b.postedAt ? 1 : 0;
        });
        const commentsMap = new Map();
        commentsClone.forEach((commentDto) => {
          if (!commentDto.parentId) {
            commentsMap.set(commentDto.id, new Comment(commentDto));
          } else {
            const parent = commentsMap.get(commentDto.parentId);
            if (parent) {
              parent.subs.push(new Comment(commentDto));
            } else {
              // TODO deleted parent
            }
          }
        });
        setComments(Array.from(commentsMap.values()));
      }
    });
  }, []);

  const [newComment, setNewComment] = useState({
    content: '',
    authorName: '',
  });

  const onComment = async (_newComment) => {
    const captcha = await getCaptcha().catch((e) => {
      alert(t('error.comment.create.captcha'));
      throw e;
    });

    return CommentRepository.post(permalink, {
      captcha,
      parentId: _newComment.parentId,
      content: _newComment.content,
      authorName: _newComment.authorName
    }).then(() => {
      alert(t('message.comment.create.success'));
    }).catch(e => {
      alert(t(e.response.data.message));
      throw e;
    });
  };

  const onParentComment = (_newComment) => {
    onComment(_newComment).then(() => {
      setNewComment({
        ..._newComment,
        content: ''
      });
    }).catch(() => {});
  }

  return (
    <div className={classNames(className)}>
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} onSend={onComment} />
      ))}

      <CommentInput
        value={newComment}
        className="mt-4"
        onChange={(val) => setNewComment(val)}
        onSend={() => onParentComment(newComment)}
      />
    </div>
  );
}
