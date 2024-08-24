export const actionNameToChinese = (actionName: string) => {
  switch (actionName) {
    case "flick":
      return "轻击";
    case "pound":
      return "重击";
    case "bounce":
      return "振刀";
    case "treat":
      return "治愈";
    case "rage":
      return "怒气";
  }
};
