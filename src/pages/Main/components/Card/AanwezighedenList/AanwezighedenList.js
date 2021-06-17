import AanwezighedenListitem from "./AanwezighedenListitem/AanwezighedenListitem";

const AanwezighedenList = (props) => {
  const aanwezigListItems = props.allAanwezigheden.aanwezig.map((obj) => (
    <AanwezighedenListitem key={obj._id} text={obj.user.name} />
  ));
  const afwezigListItems = props.allAanwezigheden.afwezig.map((obj) => (
    <AanwezighedenListitem key={obj._id} text={obj.user.name} />
  ));
  const onbepaaldListItems = props.allAanwezigheden.onbepaald.map((obj) => (
    <AanwezighedenListitem key={obj._id} text={obj.user.name} />
  ));

  return (
    <>
      <ul>{aanwezigListItems}</ul>
      <ul>{afwezigListItems}</ul>
      <ul>{onbepaaldListItems}</ul>
    </>
  );
};

export default AanwezighedenList;
