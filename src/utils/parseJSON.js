const parseJSON = (jsonStr) => {
  console.log("validating JSON string");
  try {
    return JSON.parse(jsonStr);
  } catch (err) {
    return false;
  }
};

module.exports = {
  parseJSON,
};
