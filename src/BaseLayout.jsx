import React from "react";
import { useLocation } from "react-router-dom";
import { Header, Footer } from "./components";


const BaseLayout = ({ children }) => {
  const location = useLocation();

  // Routes that should not display header and footer
  const noHeaderFooterRoutes = ["/login", "/signup"];

  const shouldShowHeaderFooter = !noHeaderFooterRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowHeaderFooter && <Header />}
      <main
        className={`min-h-screen bg-gray-100 dark:bg-background pt-0 ${shouldShowHeaderFooter ? "py-8" : "pt-0"
          }`}
      >
        {children}
      </main>
      {shouldShowHeaderFooter && <Footer />}
    </>
  );
};

export default BaseLayout;
