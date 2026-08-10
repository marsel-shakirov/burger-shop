import './styles/index.css';

import { HomePage } from '@/pages/home';
import { Header } from '@/widgets/header';

export const App = () => {
  return (
    <>
      <Header />
      <HomePage />
    </>
  );
};
