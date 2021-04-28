import { Icon, IStackTokens, Stack, Text } from "@fluentui/react";
import { format } from "date-fns";
import * as React from "react";
import styled from "styled-components";
import { fetchNavigation } from "../../actions/ApiCall";
import { classes } from "../../styles/Style";
import { filterLeftNavWorklistData, getDataLength } from "../../utils";
import ContextualMenuSearch from "../Common/ContextualMenuSearch";
const currentDate = format(new Date(), "M/d/yyyy");

interface LeftBarItem {
  icon: any;
  name: string;
  isColored: boolean;
}

const stackTokens: IStackTokens = {
  childrenGap: 8,
  padding: 8,
};

const LeftNavBarWrapper = styled.div`
  width: 180px;
`;
const LeftNavigationWrapper = styled.div`
  margin-top: 8px;
`;

const LeftNavItems: LeftBarItem[] = [
  {
    icon: "Accept",
    name: "To-do's",
    isColored: true,
  },
  {
    icon: null,
    name: "Due",
    isColored: true,
  },
  {
    icon: null,
    name: "Completed",
    isColored: false,
  },
  {
    icon: "ArrowTallUpRight",
    name: "Received",
    isColored: false,
  },
  {
    icon: "ArrowTallDownLeft",
    name: "Sent",
    isColored: false,
  },
];

function LeftNavigation({
  teamMembersList,
  filterLeftNavData,
  resetUserOrCareProtocolFilterBy,
  datechange,
}) {
  const [addNameStyle, setAddNameStyle] = React.useState("Due");
  const [navigationCount, setNavigationCount] = React.useState([]);
  const [leftNavigationState, setLeftNavigationState] = React.useState([]);

  // API call
  React.useEffect(() => {
    (async () => {
      try {
        const response = await fetchNavigation();
        if (!response) {
          console.error(response);
        } else {
          leftNavigateMap(response.entities);
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const leftNavigateMap = (response) => {
    const leftNavData = response.map((item: any, index) => {
      if (item !== null && item !== "undefined") {
        return {
          key: item.innocrm_worklisttodoid,
          createdon:
            item["createdon@OData.Community.Display.V1.FormattedValue"],
          dueon:
            item["innocrm_dueon@OData.Community.Display.V1.FormattedValue"],
          priority:
            item["innocrm_priority@OData.Community.Display.V1.FormattedValue"],
          status:
            item["innocrm_status@OData.Community.Display.V1.FormattedValue"],
        };
      }
    });
    setNavigationCount(leftNavData);
  };

  // Update based on dependencies
  React.useEffect(() => {
    if (currentDate === format(datechange, "M/d/yyyy")) {
      setLeftNavigationState(
        filterLeftNavWorklistData(
          navigationCount,
          true,
          format(datechange, "M/d/yyyy")
        )
      );
    } else {
      setLeftNavigationState(
        filterLeftNavWorklistData(
          navigationCount,
          false,
          format(datechange, "M/d/yyyy")
        )
      );
    }
  }, [datechange, leftNavigationState]);

  const onClickNavBar = (name: string) => {
    filterLeftNavData(name);
    setAddNameStyle(name);
  };

  return (
    <Stack horizontal tokens={stackTokens}>
      <LeftNavBarWrapper>
        <ContextualMenuSearch
          text="My Worklist"
          title="Team Members"
          menuitems={teamMembersList}
          resetUserOrCareProtocolFilterBy={resetUserOrCareProtocolFilterBy}
        />
        <LeftNavigationWrapper>
          {LeftNavItems.map((leftbarItem, index) => (
            <Stack
              key={index}
              horizontal
              tokens={stackTokens}
              className={
                leftbarItem.name === addNameStyle
                  ? classes.styledLeftNav
                  : classes.leftNav
              }
              onClick={() => onClickNavBar(leftbarItem.name)}
            >
              <Stack.Item>
                <Icon
                  iconName={leftbarItem.icon}
                  title={leftbarItem.icon}
                  className={classes.icons}
                />
              </Stack.Item>
              <Stack.Item grow={1}>
                <Text variant={"medium"}>{leftbarItem.name}</Text>
              </Stack.Item>
              <Stack.Item className={classes.LeftNavBarValue}>
                <Text
                  variant={"medium"}
                  className={leftbarItem.isColored ? classes.navBarValue : null}
                >
                  {getDataLength(
                    leftNavigationState,
                    leftbarItem.name,
                    datechange
                  )}
                </Text>
              </Stack.Item>
            </Stack>
          ))}{" "}
        </LeftNavigationWrapper>
      </LeftNavBarWrapper>
    </Stack>
  );
}

export default LeftNavigation;
