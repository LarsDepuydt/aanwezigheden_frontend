import AanwezighedenListitem from "./AanwezighedenListitem/AanwezighedenListitem";
import classes from "./AanwezighedenList.module.scss";

const AanwezighedenList = (props) => {
  const aanwezigLength = props.allAanwezigheden.aanwezig.length;
  const afwezigLength = props.allAanwezigheden.afwezig.length;
  const onbepaaldLength = props.allAanwezigheden.onbepaald.length;

  let aanwezigListItems;
  if (aanwezigLength > 0) {
    aanwezigListItems = props.allAanwezigheden.aanwezig.map((obj) => (
      <AanwezighedenListitem key={obj._id} text={obj.user.name} />
    ));
  } else {
    aanwezigListItems = (
      <AanwezighedenListitem key="geenAanwezig" text="geen" />
    );
  }

  let afwezigListItems;
  if (afwezigLength) {
    afwezigListItems = props.allAanwezigheden.afwezig.map((obj) => (
      <AanwezighedenListitem key={obj._id} text={obj.user.name} />
    ));
  } else {
    afwezigListItems = <AanwezighedenListitem key="geenAfwezig" text="geen" />;
  }

  let onbepaaldListItems;
  if (onbepaaldLength) {
    onbepaaldListItems = props.allAanwezigheden.onbepaald.map((obj) => (
      <AanwezighedenListitem key={obj._id} text={obj.user.name} />
    ));
  } else {
    onbepaaldListItems = (
      <AanwezighedenListitem key="geenOnbepaald" text="geen" />
    );
  }

  return (
    <>
      <label className={classes.Label}>
        {"aanwezig (" + aanwezigLength + ")"}
      </label>
      <ul className={classes.Ul}>{aanwezigListItems}</ul>
      <label className={classes.Label}>
        {"afwezig (" + afwezigLength + ")"}
      </label>
      <ul className={classes.Ul}>{afwezigListItems}</ul>
      <label className={classes.Label}>
        {"onbepaald (" + onbepaaldLength + ")"}
      </label>
      <ul className={classes.Ul}>{onbepaaldListItems}</ul>
    </>
  );
};

export default AanwezighedenList;
