import {
  Calendar,
  ContextualMenuItemType,
  DefaultButton,
  IContextualMenuItemProps,
  IContextualMenuProps,
  IStackTokens,
  Stack,
} from "@fluentui/react";
import { addDays, addWeeks, format } from "date-fns";
import * as React from "react";
import { classes } from "../../styles/Style";
import { dayPickerStrings } from "../../utils";

const tommorrow = format(addDays(new Date(), 1), "eeee");
const twoDaysLater = format(addDays(new Date(), 2), "eee ,MMM dd");
const nextWeek = format(addWeeks(new Date(), 1), "eee ,MMM dd");

const btnStackTokens: IStackTokens = {
  childrenGap: 8,
  padding: 8,
};

function ContextualMenu({ value, className, item, updateField, show }) {
  const [selectedRecord, setSelectedRecord] = React.useState(null);
  const [dueDate, setDueDate] = React.useState(null);
  const [selectedDate, setSelectedDate] = React.useState<Date>();

  const handleUpdate = (updateDate, key) => {
    updateField(updateDate, key);
  };

  const menuProps: IContextualMenuProps = React.useMemo(
    () => ({
      items: [
        {
          key: "tomorrow",
          text: "Tomorrow",
          secondaryText: tommorrow,
          onClick: () =>
            handleUpdate(
              format(addDays(new Date(), 1), "M/d/yyyy"),
              selectedRecord
            ),
        },
        {
          key: "twoDaysLaters",
          text: "2 Days later",
          secondaryText: twoDaysLater,
          onClick: () =>
            handleUpdate(
              format(addDays(new Date(), 2), "M/d/yyyy"),
              selectedRecord
            ),
        },
        {
          key: "nextWeek",
          text: "Next Week",
          secondaryText: nextWeek,
          onClick: () =>
            handleUpdate(
              format(addWeeks(new Date(), 1), "M/d/yyyy"),
              selectedRecord
            ),
        },
        { key: "divider_1", itemType: ContextualMenuItemType.Divider },
        {
          key: "Pickdate",
          text: "Pick Date",
          subMenuProps: {
            items: [
              {
                key: "date",
                text: "date",
                onRender: renderPickDateMenuItem,
              },
            ],
          },
        },
      ],
    }),
    [selectedRecord, dueDate]
  );

  const onDateChange = (datePicker) => {
    setSelectedDate(datePicker);
    setDueDate(format(new Date(datePicker), "M/d/yyyy"));
  };

  const handleRescheduleBtn = () => {
    updateField(dueDate, selectedRecord);
    if (format(new Date(), "M/d/yyyy") !== dueDate) {
      setTimeout(() => {
        document.body.click();
      }, 500);
    } else {
      return null;
    }
  };

  function renderPickDateMenuItem(
    item: any,
    dismissMenu: () => void
  ): JSX.Element {
    return (
      <>
        <Calendar
          value={selectedDate}
          showGoToToday={false}
          strings={dayPickerStrings}
          onSelectDate={onDateChange}
        />
        <Stack horizontal horizontalAlign="end" tokens={btnStackTokens}>
          <DefaultButton
            text="Cancel"
            className={classes.cancelBtn}
            onClick={() => {
              setTimeout(() => {
                document.body.click();
              }, 500);
            }}
          />
          <DefaultButton
            text="Reschedule"
            className={classes.rescheduleBtn}
            onClick={handleRescheduleBtn}
          />{" "}
        </Stack>
      </>
    );
  }

  const menuPriorityProps: IContextualMenuProps = React.useMemo(
    () => ({
      items: [
        {
          key: "high",
          secondaryText: "Priority 1",
          iconProps: { iconName: "flag" },
          onClick: () => updateField("high", selectedRecord),
          onRenderIcon: (props: IContextualMenuItemProps) => {
            return (
              <span className={`material-icons   ${classes.highPriority}`}>
                flag
              </span>
            );
          },
        },
        {
          key: "medium",
          secondaryText: "Priority 2",
          iconProps: { iconName: "flag" },
          onClick: () => updateField("medium", selectedRecord),
          onRenderIcon: (props: IContextualMenuItemProps) => {
            return (
              <span className={`material-icons  ${classes.mediumPriority}`}>
                flag
              </span>
            );
          },
        },
        {
          key: "low",
          secondaryText: "Priority 3",
          iconProps: { iconName: "flag" },
          onClick: () => updateField("low", selectedRecord),
          onRenderIcon: (props: IContextualMenuItemProps) => {
            return (
              <span className={`material-icons  ${classes.lowPriority}`}>
                flag
              </span>
            );
          },
        },
        {
          key: "others",
          secondaryText: "Priority 4",
          iconProps: { iconName: "flag" },
          onClick: () => updateField("others", selectedRecord),
          onRenderIcon: (props: IContextualMenuItemProps) => {
            return (
              <span className={`material-icons   ${classes.otherPriority}`}>
                flag
              </span>
            );
          },
        },
      ],
    }),
    [selectedRecord]
  );

  return (
    <DefaultButton
      onMenuClick={() => setSelectedRecord(item.key)}
      text={value}
      menuProps={show === "DueOn" ? menuProps : menuPriorityProps}
      className={className}
    />
  );
}

export default ContextualMenu;
