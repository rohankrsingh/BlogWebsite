import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Header, Footer } from "./components";


const BaseLayout = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const noHeaderFooterRoutes = ["/login", "/signup"];

  const shouldShowHeaderFooter = !noHeaderFooterRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowHeaderFooter && <Header />}
      <main
        className={`min-h-screen bg-gray-50 dark:bg-background pt-0 ${shouldShowHeaderFooter ? "py-8" : "pt-0"
          }`}
      >
        {children}
      </main>
      {shouldShowHeaderFooter && <Footer />}
    </>
  );
};

export default BaseLayout;
