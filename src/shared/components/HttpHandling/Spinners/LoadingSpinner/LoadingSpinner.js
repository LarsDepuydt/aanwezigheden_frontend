import "./LoadingSpinner.scss";

const LoadingSpinner = (props) => {
  return (
    <div
      className={["lds-dual-ring", props.backdrop && "backdrop"].join(" ")}
    ></div>
  );
};

export default LoadingSpinner;
