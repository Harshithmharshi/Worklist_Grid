import { format } from "date-fns";

export const dayPickerStrings = {
  months: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  shortMonths: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  days: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
  shortDays: ["S", "M", "T", "W", "T", "F", "S"],
  goToToday: "Go to today",
  weekNumberFormatString: "Week number {0}",
  prevMonthAriaLabel: "Previous month",
  nextMonthAriaLabel: "Next month",
  prevYearAriaLabel: "Previous year",
  nextYearAriaLabel: "Next year",
  prevYearRangeAriaLabel: "Previous year range",
  nextYearRangeAriaLabel: "Next year range",
  closeButtonAriaLabel: "Close",
  monthPickerHeaderAriaLabel: "{0}, select to change the year",
  yearPickerHeaderAriaLabel: "{0}, select to change the month",
};

export const getKey = (item: any, key: string) => {
  const getKeys = Object.keys(item);
  return getKeys.find((getKey) => getKey.includes(key));
};

export function copyAndSort<T>(
  items: T[],
  columnKey: string,
  isSortedDescending?: boolean
): T[] {
  const key = columnKey as keyof T;
  return items
    .slice(0)
    .sort((a: T, b: T) =>
      (isSortedDescending ? a[key] < b[key] : a[key] > b[key]) ? 1 : -1
    );
}

export const getDataLength = (getData: any, value: string, date: any) => {
  const statusName = ["Due", "To-do's"].includes(value) ? "Pending" : value;
  const navDataLength = getData.filter((item) => {
    if (item === null) {
      return true;
    }
    return typeof item.dueon !== "undefined" &&
      typeof item.dueon !== "object" &&
      item.dueon <= format(date, "M/d/yyyy")
      ? item.status === statusName && item.dueon <= format(date, "M/d/yyyy")
      : item.dueon === format(date, "M/d/yyyy") && item.status === statusName;
  });
  return navDataLength.length;
};

export const filterWorklistData = (
  getData: any,
  onLoad: boolean,
  status: string,
  dateRange: string
) => {
  const statusName = ["Due", "To-do's"].includes(status) ? "Pending" : status;
  const filterItems = getData.filter((worklistItems: any) => {
    if (worklistItems === null) {
      return true;
    }
    return onLoad
      ? worklistItems.dueon !== "undefined" &&
          worklistItems.dueon !== null &&
          worklistItems.status === statusName &&
          worklistItems.dueon <= dateRange
      : worklistItems.dueon !== "undefined" &&
          worklistItems.dueon !== null &&
          worklistItems.status === statusName &&
          worklistItems.dueon === dateRange;
  });
  return filterItems;
};

export const filterLeftNavWorklistData = (
  getData: any,
  isCurrentDate: any,
  dateRange: string
) => {
  const filterItems = getData.filter((worklistItems: any) => {
    if (worklistItems === null) {
      return true;
    }
    return typeof worklistItems.dueon !== "undefined" &&
      typeof worklistItems.dueon !== "object" &&
      isCurrentDate
      ? new Date(worklistItems.dueon) <= new Date(dateRange)
      : worklistItems.dueon === dateRange;
  });
  return filterItems;
};

export const filterByCareOrUserName = (
  getData,
  name: string,
  date: Date,
  filterBy: string
) => {
  const filteredbyName = getData.filter((item) =>
    filterBy === "CareProtocol"
      ? item.dueon <= format(date, "M/d/yyyy") &&
        item.careprotocol.toLowerCase().indexOf(name.toLowerCase()) !== -1
      : item.dueon <= format(date, "M/d/yyyy") &&
        item.caremanager.toLowerCase().indexOf(name.toLowerCase()) !== -1
  );

  return filteredbyName;
};

export const searchByText = (getData: any, value: string, resetData: any) => {
  const filteredbyValue = value
    ? getData.filter((i) =>
        Object.keys(i).some(
          (key) =>
            i[key] !== "undefined" &&
            i[key] !== null &&
            i[key].toLowerCase().indexOf(value.toLowerCase()) > -1
        )
      )
    : resetData;
  return filteredbyValue;
};

export const searchByName = (getData, text, resetData) => {
  const filteredByText = text
    ? getData.filter(
        (item) =>
          item.text && item.text.toLowerCase().indexOf(text.toLowerCase()) > -1
      )
    : resetData;

  if (!filteredByText || !filteredByText.length) {
    filteredByText.push({
      key: "no_result",
      text: "No results found",
    });
  }
  return filteredByText;
};

export const sortByColumnClick = (getData, column) => {
  let sortedItems = getData;
  let isSortedDescending = column.isSortedDescending;
  if (column.isSorted) {
    isSortedDescending = !isSortedDescending;
  }
  sortedItems = copyAndSort(sortedItems, column.fieldName!, isSortedDescending);
  return sortedItems;
};

export const sortByColumn = (columns, column) => {
  return columns.map((col) => {
    col.isSorted = col.key === column.key;
    if (col.isSorted) {
      col.isSortedDescending = column.isSortedDescending;
    }
    return col;
  });
};
