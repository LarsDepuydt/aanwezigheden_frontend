import classes from "./Footer.module.scss";

const Footer = () => {
  const today = new Date();
  return (
    <>
      <p className={classes.footer}>Lars Depuydt · ©{today.getFullYear()}</p>
    </>
  );
};

export default Footer;
