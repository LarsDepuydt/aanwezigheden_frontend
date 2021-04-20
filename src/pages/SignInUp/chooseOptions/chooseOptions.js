const date = new Date();
const currentYear = date.getFullYear();
const currentMonth = date.getMonth();
const afdelingen = ["sloeber", "speelclub", "rakwi", "tito", "keti", "aspi"];
let yearOptions = [];
let j;
currentMonth < 8 ? (j = 7) : (j = 6);
for (let i = 0; i < 11; i++) {
  const afdeling = afdelingen[Math.floor(i / 2)];
  yearOptions.push({
    value: currentYear - j - i,
    text: currentYear - j - i + " - " + afdeling,
  });
}

export default yearOptions;
