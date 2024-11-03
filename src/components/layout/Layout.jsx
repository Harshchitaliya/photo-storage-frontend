import React, { useState } from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Sidebar setIsOpen={setIsOpen} isOpen={isOpen} />
      <div className={`p-4 h-screen overflow-auto	${isOpen ? "sm:ml-64" : "sm:ml-16"}`}>
        {children}
      </div>
    </>
  );
};

export default Layout; 