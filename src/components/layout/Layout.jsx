import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="app-layout">      
      <div className="content-wrapper">
        <Sidebar />
        {children}
      </div>
    </div>
  );
};

export default Layout; 