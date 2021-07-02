const date = new Date();
const currentYear = date.getFullYear();
let yearOptions = [];
for (let i = currentYear; i >= 1900; i = i - 1) {
  yearOptions.push(i);
}

export default yearOptions;
