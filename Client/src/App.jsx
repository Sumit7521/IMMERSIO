import React from 'react';
import AppRoute from './routes/AppRoutes';
import { AvatarProvider } from './contexts/AvatarContext'; // import the context provider

const App = () => {
  return (
    <AvatarProvider>
      <AppRoute />
    </AvatarProvider>
  );
};

export default App;
