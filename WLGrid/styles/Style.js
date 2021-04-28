import { mergeStyleSets } from "@fluentui/react";

export const classes = mergeStyleSets({
  container: {
    height: "100%",
    backgroundColor: "#f4f4f4",
  },
  icons: {
    fontSize: "10px",
    lineHeight: "15px",
    width: "15px",
    color: "#373737",
    "&:hover": {
      color: "#373737",
    },
  },

  navBarValue: {
    color: "#4696e4",
  },

  button: {
    color: "#373737",
    backgroundColor: "#e5e5e5",
    border: "1px solid #e5e5e5",
    "&:hover": {
      color: "#373737",
      backgroundColor: "#e5e5e5",
      border: "1px solid #e5e5e5",
    },
  },

  searchBoxStyles: {
    margin: "8px",
  },

  leftNavBarValue: {
    alignItems: "center",
    display: "flex",
    justifyContent: "flex-end",
  },

  linkPatient: {
    cursor: "pointer",
    "&:hover": {
      textDecoration: "none",
    },
  },

  highPriority: {
    color: "#D93737",
    fontSize: "15px",
    lineHeight: "20px",
    width: "20px",
    fontWeight: "bold",
  },

  lowPriority: {
    color: "#2EA843",
    fontSize: "15px",
    lineHeight: "20px",
    width: "20px",
    fontWeight: "bold",
  },

  mediumPriority: {
    color: "#FFC208",
    fontSize: "15px",
    lineHeight: "20px",
    width: "20px",
    fontWeight: "bold",
  },

  otherPriority: {
    color: "#A6A6A6",
    fontSize: "15px",
    lineHeight: "20px",
    width: "20px",
    fontWeight: "bold",
  },

  
  dropdowncoded: {
    padding: "8px",
    cursor: "pointer",
  },

  leftNav: {
    cursor: "pointer",
    "&:hover": {
      cursor: "pointer",
      backgroundColor: "#DCECF9",
      color: "#0070DD",
      borderRadius: "0 16px 16px 0",
    },
  },
  styledLeftNav: {
    backgroundColor: "#DCECF9",
    color: "#0070DD",
    borderRadius: "0 16px 16px 0",
  },

  dueOnColored: {
    border: "none",
    fontSize: 12,
    color: "#D93737",
    "&:hover": {
      color: "#D93737",
      border: "none",
    },
  },

  dueOn: {
    border: "none",
    fontSize: 12,
  },

  overDue: {
    color: "#2F2F2F",
    fontSize: 14,
  },

  dropDown: {
    border: "none",
    fontSize: 12,
  },

  rescheduleBtn: {
    border: "none",
    backgroundColor: "rgb(46, 168, 67)",
    "&:hover": {
      border: "none",
      backgroundColor: "rgb(46, 168, 67)",
    },
  },
  cancelBtn: {
    border: "none",
    backgroundColor: " rgb(229, 229, 229)",
    "&:hover": {
      border: "none",
      backgroundColor: " rgb(229, 229, 229)",
    },
  },

});
