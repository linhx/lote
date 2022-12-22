import Footer from '@/components/shared/organisms/Footer';
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
        <div className="content-wrapper text-gray-800 dark:text-slate-400 px-4 md:px-0 pb-6 md:max-w-3xl mx-auto">
          {children}
        </div>
        <Footer
          className="w-full h-14 border-t-1 border-slate-100 dark:border-slate-800"
          innerClass="h-full px-4 md:px-0 md:max-w-3xl mx-auto"
        />
      </ModalProvider>
    </>
  );
}
