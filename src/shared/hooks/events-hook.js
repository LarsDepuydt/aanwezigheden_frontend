import { useState, useCallback } from "react";

export const useEventsSort = () => {
  const [events, setEvents] = useState({});

  const sortArrayByDate = useCallback((eventsArray, startEventsObj) => {
    let yearsObject = startEventsObj;

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

    setEvents(yearsObject);
  }, []);

  const resortOneDateArray = (obj, year, month, number) => {
    const oldEvents = { ...events };
    const updatedEvent = oldEvents[year][month][number];

    if (
      obj.name !== updatedEvent["name"] ||
      obj.date.toISOString() !== updatedEvent["date"].toISOString()
    ) {
      updatedEvent["name"] = obj.name;
      updatedEvent["date"] = obj.date;

      let newMonthArray = oldEvents[year][month];
      newMonthArray.splice(number, 1);
      const pulledEvents = {
        ...events,
        [year]: { ...events[year], [month]: newMonthArray },
      };
      setEvents(pulledEvents);

      sortArrayByDate([updatedEvent], events);
      return true;
    }
    return false;
  };

  const updateCardInfo = (value, year, month, number) => {
    const newEvent = {
      ...events[year][month][number],
      touched: true,
      state: value,
    };

    const newMonthArray = events[year][month];
    newMonthArray[number] = newEvent;
    const newEvents = {
      ...events,
      [year]: { ...events[year], [month]: newMonthArray },
    };
    setEvents(newEvents);
  };

  const deleteCard = (number, month, year) => {
    const newMonthArray = events[year][month];

    let newEvents;
    if (newMonthArray.length >= 2) {
      // delete event
      newMonthArray.splice(number, number + 1);
      newEvents = {
        ...events,
        [year]: { ...events[year], [month]: newMonthArray },
      };
    } else if (Object.keys(events[year]).length >= 2) {
      // delete maand
      newEvents = { ...events };
      delete newEvents[year][month];
    } else if (Object.keys(events).length >= 2) {
      // delete jaar
      newEvents = { ...events };
      delete newEvents[year];
    } else {
      // delete all
      newEvents = {};
    }

    setEvents(newEvents);
  };

  return {
    events,
    sortArrayByDate,
    resortOneDateArray,
    updateCardInfo,
    deleteCard,
  };
};
