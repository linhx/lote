import { ModalProvider } from '@/hooks/modal';
import Header from '../components/shared/organisms/Header';

export default function MainLayout({ children }) {
  return (
    <>
      <ModalProvider>
        <Header
          className="w-full text-gray-800 dark:text-slate-200"
          innerClass="md:max-w-3xl mx-auto px-4 md:px-0"
        />
        <div className="text-gray-800 dark:text-slate-400 px-4 md:px-0 pb-8 md:max-w-3xl mx-auto">
          {children}
        </div>
      </ModalProvider>
    </>
  );
}
