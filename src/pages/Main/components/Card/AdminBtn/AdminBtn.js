import Button from "../../../../../shared/components/UI/Button/Button";

const AdminBtn = (props) => {
  return (
    <>
      <Button small btnType="secondary" clicked={props.aanpassenClicked}>
        Event aanpassen
      </Button>
      <Button small btnType="secondary">
        Event verwijderen
      </Button>
    </>
  );
};

export default AdminBtn;
