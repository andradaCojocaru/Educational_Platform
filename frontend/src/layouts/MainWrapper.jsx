import { useEffect, useState } from "react";

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

  return <>{loadingState ? null : children}</>;
};

export default MainWrapper;
