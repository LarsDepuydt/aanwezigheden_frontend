const checkIfValidId = (id) => {
  const checkForId = new RegExp("^[0-9a-fA-F]{24}$");

  return checkForId.test(id);
};

export default checkIfValidId;
