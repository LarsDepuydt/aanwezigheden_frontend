import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

import classes from "./LoadingSpinnerCenter.module.scss";

const LoadingSpinnerCenter = () => {
  return (
    <div className={classes.spinnerDiv}>
      <LoadingSpinner />
    </div>
  );
};

export default LoadingSpinnerCenter;
