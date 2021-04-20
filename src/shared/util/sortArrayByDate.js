export const sortArrayByDate = (eventsArray, sortedYearsObject) => {
  let yearsObject = sortedYearsObject || {};

  for (const event of eventsArray) {
    const date = new Date(event.date);
    event.date = date;

    if (!yearsObject.hasOwnProperty(date.getFullYear())) {
      yearsObject[date.getFullYear()] = {};
    }
    const year = yearsObject[date.getFullYear()];

    if (!yearsObject[date.getFullYear()].hasOwnProperty(date.getMonth())) {
      yearsObject[date.getFullYear()][date.getMonth()] = [];
    }

    const monthArray = year[date.getMonth()];
    if (monthArray.length === 0) {
      monthArray.push(event);
    } else {
      const day = date.getDate();
      for (const monthEvent of monthArray) {
        if (day < monthEvent.date.getDate()) {
          const position = monthArray.indexOf(monthEvent);
          monthArray.splice(position, 0, event);
          break;
        } else if (day === monthEvent.date.getDate()) {
          if (date.getHours() < monthEvent.date.getHours()) {
            const position = monthArray.indexOf(monthEvent);
            monthArray.splice(position, 0, event);
            break;
          } else if (date.getHours() === monthEvent.date.getHours()) {
            if (date.getMinutes() <= monthEvent.date.getMinutes()) {
              const position = monthArray.indexOf(monthEvent);
              monthArray.splice(position, 0, event);
              break;
            } else {
              const position = monthArray.indexOf(monthEvent);
              if (position === monthArray.length - 1) {
                monthArray.push(event);
                break;
              } else if (day !== monthArray[position + 1].date.getDate()) {
                monthArray.splice(position + 1, 0, event);
                break;
              } else if (
                date.getHours() !== monthArray[position + 1].date.getHours()
              ) {
                monthArray.splice(position + 1, 0, event);
                break;
              }
            }
          } else {
            const position = monthArray.indexOf(monthEvent);
            if (position === monthArray.length - 1) {
              monthArray.push(event);
              break;
            } else if (day !== monthArray[position + 1].date.getDate()) {
              monthArray.splice(position + 1, 0, event);
              break;
            }
          }
        } else {
          if (monthArray.indexOf(monthEvent) === monthArray.length - 1) {
            monthArray.push(event);
            break;
          }
        }
      }
    }
  }

  return yearsObject;
};
