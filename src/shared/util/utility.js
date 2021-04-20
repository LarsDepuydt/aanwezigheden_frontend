export const updateObject = (oldObject, updatedProperties) => {
  return {
    ...oldObject,
    ...updatedProperties,
  };
};

// export const updateObjectInArray = (array, key, updatedProperties) => {
//   const newArray = array.map((arr) =>
//     arr.key === key
//       ? {
//           ...arr,
//           ...updatedProperties,
//         }
//       : arr
//   );
//   return newArray;
// };

// export const checkValidArray = (array) => {
//   let validArray = array.length > 0 ? true : false;
//   for (let i = 0; i < array.length; i++) {
//     validArray = validArray && array[i].isValid;
//   }
//   return validArray;
// };
