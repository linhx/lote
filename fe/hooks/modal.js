import { createContext, useContext, useState } from 'react';
import ModalContainer from '@/components/shared/molecules/ModalContainer';
import { remove } from '../utils/array.utils';

export const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [modals, setModals] = useState([]);
  const closeModal = (id) => {
    setModals((_modals) => [...remove(_modals, (modal) => modal.id === id)]);
  };
  const openModal = (component, props) => {
    return new Promise((resolve, reject) => {
      const id = new Date().getTime();
      setModals((_modals) => [
        ..._modals,
        {
          id,
          component,
          props,
          onClose(val) {
            closeModal(id);
            resolve(val);
          },
        },
      ]);
    });
  };
  return (
    <>
      <ModalContext.Provider value={{ modals, open: openModal }}>
        {children}
      </ModalContext.Provider>

      <ModalContainer modals={modals} />
    </>
  );
}

export const useModal = () => {
  return useContext(ModalContext);
};
