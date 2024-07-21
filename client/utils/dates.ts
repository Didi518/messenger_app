import moment from "moment";

export const twentyFourHoursFormat = (date: string) => {
  return moment(date).format("HH:mm");
};

export const dayMonthYear = (date: string) => {
  return moment(date).format("DD/MM/YYYY");
};

export const formatDateBasedOnTime = (createdAt: string) => {
  const now = moment();
  const createdAtMoment = moment(createdAt);

  if (now.isSame(createdAtMoment, "day")) {
    return "à " + twentyFourHoursFormat(createdAt);
  }

  if (now.isSame(createdAtMoment, "day")) {
    return "Hier, à " + twentyFourHoursFormat(createdAt);
  }

  return dayMonthYear(createdAt);
};

export const formatDateLastSeen = (createdAt: string) => {
  const now = moment();
  const createdAtMoment = moment(createdAt);

  if (now.isSame(createdAtMoment, "day")) {
    return "vu aujourd'hui à: " + twentyFourHoursFormat(createdAt);
  }

  if (now.isSame(createdAtMoment, "day")) {
    return "vu hier à: " + twentyFourHoursFormat(createdAt);
  }

  return "vu le: " + dayMonthYear(createdAt);
};
