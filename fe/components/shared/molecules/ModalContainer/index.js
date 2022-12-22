import { classNames } from '@/utils';

export default function ModalContainer({ modals, className }) {
  return (
    <>
      <div
        tabIndex="-1"
        aria-hidden="true"
        className={classNames(
          'c-modal-container',
          className,
          modals.length ? '' : '!hidden'
        )}
      >
        <div className="c-modal-wrapper">
          {modals.map((modal) => {
            const Modal = modal.component;
            return (
              <Modal key={modal.id} {...modal.props} onClose={modal.onClose} />
            );
          })}
        </div>
      </div>
      {!!modals.length && <div className="c-modal-backdrop"></div>}
    </>
  );
}
