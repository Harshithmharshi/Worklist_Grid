import * as React from "react";
import { classes } from "../../styles/Style";

function PriorityIcon({ item }) {
  const setPriorityColor = (item: string) => {
    switch (item["priority"]) {
      case "Low":
        return classes.lowPriority;
      case "Medium":
        return classes.mediumPriority;
      case "High":
        return classes.highPriority;
      case "Others":
        return classes.otherPriority;
      default:
        classes.otherPriority;
    }
  };
  return (
    <span className={`material-icons  ${setPriorityColor(item)}`}>flag</span>
  );
}
export default PriorityIcon;
