import { Provider } from 'react-redux';
import { store } from '@/store';
import { Navbar } from './Navbar';
import { CartOffcanvas } from './CartOffcanvas';
import { LoginModal } from './LoginModal';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>{children}</main>
        <CartOffcanvas />
        <LoginModal />
      </div>
    </Provider>
  );
}
