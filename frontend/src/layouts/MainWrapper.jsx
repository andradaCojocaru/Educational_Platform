import { useEffect, useState } from "react";
import BaseHeader from "../views/partials/BaseHeader";
import BaseFooter from "../views/partials/BaseFooter";

import { setUser } from "../utils/auth";

const MainWrapper = ({ children }) => {
  const [loadingState, setLoadingState] = useState(true);

  useEffect(() => {
    const handler = async () => {
      setLoadingState(true);
      await setUser();
      setLoadingState(false);
    };

    handler();
  }, []);

  return (
    <>
      {loadingState ? null : (
        <>
          <BaseHeader />
          <main style={{ minHeight: "100vh" }}>{children}</main>
          <BaseFooter />
        </>
      )}
    </>
  );
};

export default MainWrapper;
