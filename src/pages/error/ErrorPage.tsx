import { useEffect, useState } from "react";
import { useRouteError, isRouteErrorResponse } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  const [errorMessage, setErrorMessage] = useState<string>("unknown error");
  useEffect(() => {
    if (isRouteErrorResponse(error)) {
      setErrorMessage(error.status + " " + error.statusText);
    }
  }, [error]);
  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{errorMessage}</i>
      </p>
    </div>
  );
}
