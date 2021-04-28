import {
  ConstrainMode,
  DatePicker,
  IColumn,
  IconButton,
  IContextualMenuItem,
  IStackTokens,
  ScrollablePane,
  ScrollbarVisibility,
  ShimmeredDetailsList,
  Stack,
  Sticky,
  Text,
  TextField,
} from "@fluentui/react";
import { addDays, format, subDays } from "date-fns";
import * as React from "react";
import styled from "styled-components";
import {
  careProtocolList,
  getEngagemntID,
  getWorkList,
  handleItemInvoked,
  loadMoreWorkListData,
  updateDueOn,
  updatePriority,
  usersList,
} from "../../actions/ApiCall";
import { classes } from "../../styles/Style";
import {
  filterByCareOrUserName,
  filterWorklistData,
  searchByText,
  sortByColumn,
  sortByColumnClick,
} from "../../utils";
import ContextualMenu from "../Common/ContextualMenu";
import ContextualMenuSearch from "../Common/ContextualMenuSearch";
import Navigation from "../Common/Navigation";
import PriorityIcon from "../Common/PriorityIcon";
import LeftNavigtion from "../LeftNavigation";
import { Column } from "./Column";

const SearchBoxWrapper = styled.span`
  width: 350px;
`;
const DetailListWrapper = styled.div`
  padding: 8px;
`;
const DatePickWrapper = styled.div`
  width: 150px;
`;
const Main = styled.div`
  width: 80%;
  position: relative;
`;

const stackTokens: IStackTokens = {
  childrenGap: 16,
  padding: 8,
};

const currentDate = format(new Date(), "M/d/yyyy");

export const Worklist = () => {
  const [initialWorkList, setInitialWorkList] = React.useState([]);
  const [worklistDataState, setWorklistDataState] = React.useState(
    initialWorkList
  );
  const [columns, setColumns] = React.useState(
    mapCRMColumnsToDetailsListColmns(Column)
  );
  const [items, setItems] = React.useState<IContextualMenuItem[]>([]);
  const [date, setDateRange] = React.useState<Date>(new Date());
  const [navbarName, setNavbarName] = React.useState<string>("Due");
  const [teamMembers, setTeamMembers] = React.useState<IContextualMenuItem[]>(
    []
  );
  const [lastRecordDate, setLastRecordDate] = React.useState<any>(null);

  // Dynamically adding link to head tag
  React.useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/icon?family=Material+Icons";
    document.getElementsByTagName("head")[0].appendChild(link);
  }, []);

  // API call for care protocol and team members
  React.useEffect(() => {
    (async () => {
      try {
        const userResults = await usersList();
        const userlists = userResults.entities.map((item) => ({
          key: item.fullname,
          text: item.fullname,
          onClick: () => handleSelectedName(item.fullname, "TeamMember"),
        }));
        setTeamMembers(userlists);

        const careProtocolResult = await careProtocolList();
        const carePotocollists = careProtocolResult.entities.map(
          (item, index) => ({
            key: item.innocrm_name,
            text: item.innocrm_name,
            onClick: () =>
              handleSelectedName(item.innocrm_name, "CareProtocol"),
          })
        );
        setItems(carePotocollists);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [worklistDataState]);

  // API call for worklist data
  React.useEffect(() => {
    fetchWorkList();
  }, []);

  // fetch worklist data
  const fetchWorkList = async () => {
    try {
      const workListResponse = await getWorkList();
      if (!workListResponse) {
        console.error(workListResponse);
      } else {
        workListMap(workListResponse.entities);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Load more worklist data
  const loadMoreData = async () => {
    setInitialWorkList((prev) => [...prev, null, null]);
    try {
      const workListResponse = await loadMoreWorkListData(lastRecordDate);
      if (!workListResponse) {
        console.error(workListResponse);
      } else {
        setTimeout(() => {
          workListMap(workListResponse.entities);
        }, 2000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Mapping worklist data
  const workListMap = (response) => {
    const workListData = response.map((item: any, index) => {
      if (item !== null && item !== "undefined") {
        return {
          key: item.innocrm_worklisttodoid,
          createdon:
            item["createdon@OData.Community.Display.V1.FormattedValue"],
          dueon:
            item["innocrm_dueon@OData.Community.Display.V1.FormattedValue"],
          todo: item.innocrm_name,
          priority:
            item["innocrm_priority@OData.Community.Display.V1.FormattedValue"],
          status:
            item["innocrm_status@OData.Community.Display.V1.FormattedValue"],
          patientname: item["innocrm_Patient"]["fullname"],
          careprotocol:
            item["innocrm_Activity"] === null
              ? "Care Protocol"
              : item["innocrm_Activity"][
                  "_innocrm_patientcareprotocol_value@OData.Community.Display.V1.FormattedValue"
                ],
          caremanager:
            item["_ownerid_value@OData.Community.Display.V1.FormattedValue"],
          birthdate: item["innocrm_Patient"]["birthdate"],
          gender:
            item["innocrm_Patient"][
              "gendercode@OData.Community.Display.V1.FormattedValue"
            ],
          ISOcreatedon: item["createdon"],
        };
      }
    });
    const lastRecord = workListData[workListData.length - 1].ISOcreatedon;
    setLastRecordDate(lastRecord);
    const workListArr = [
      ...initialWorkList.filter((row) => row),
      ...workListData,
    ];
    setInitialWorkList(workListArr);
  };

  function mapCRMColumnsToDetailsListColmns(columnsOnView: any): any {
    let functionName = "mapCRMColumnsToDetailsListColmns";
    let mappedColumn = [];
    try {
      for (const pointer in columnsOnView) {
        let columnDimension = {
          minWidth: 100,
          maxWidth: 100,
        };
        switch (columnsOnView[pointer].displayName) {
          case "Priority":
            columnDimension = {
              minWidth: 64,
              maxWidth: 100,
            };
            break;
          case "Patient":
            columnDimension = {
              minWidth: 150,
              maxWidth: 200,
            };
            break;

          case "Care Protocol":
            columnDimension = {
              minWidth: 150,
              maxWidth: 200,
            };
            break;

          case "Due On":
            columnDimension = {
              minWidth: 80,
              maxWidth: 100,
            };
            break;
          default:
            columnDimension = {
              minWidth: 120,
              maxWidth: 150,
            };
            break;
        }
        mappedColumn.push({
          key: pointer,
          name: columnsOnView[pointer].displayName,
          fieldName: columnsOnView[pointer].fieldName,
          ...columnDimension,
          isResizable: true,
          data: "string",
          onRender: (item: any) => {
            switch (columnsOnView[pointer].displayName) {
              case "Patient":
                return (
                  <Navigation
                    name={item.patientname}
                    item={item}
                    linkTo="Patient"
                  />
                );
              case "Care Protocol":
                return (
                  <Navigation
                    name={item.careprotocol}
                    item={item}
                    linkTo="CareProtocol"
                  />
                );
              case "Due On":
                return item.dueon !== "undefined" &&
                  item.dueon !== null &&
                  new Date(item.dueon) < new Date(currentDate) ? (
                  <>
                    <Text className={classes.overDue}>Overdue</Text>
                    <br />
                    <ContextualMenu
                      value={item.dueon}
                      className={classes.dueOnColored}
                      item={item}
                      updateField={setDueDate}
                      show="DueOn"
                    />
                  </>
                ) : (
                  <ContextualMenu
                    value={item.dueon}
                    className={classes.dueOn}
                    item={item}
                    updateField={setDueDate}
                    show="DueOn"
                  />
                );
              case "Priority":
                return (
                  <ContextualMenu
                    value={<PriorityIcon item={item} />}
                    className={classes.dropDown}
                    item={item}
                    updateField={setPriority}
                    show="Priority"
                  />
                );
              default:
                return React.createElement(
                  "span",
                  null,
                  item[columnsOnView[pointer].fieldName]
                );
            }
          },
        });
      }
    } catch (error) {
      console.log(functionName + "" + error);
    }
    return mappedColumn;
  }

  // Update based on dependencies
  React.useEffect(() => {
    if (currentDate === format(date, "M/d/yyyy")) {
      setWorklistDataState(
        filterWorklistData(
          initialWorkList,
          true,
          navbarName,
          format(date, "M/d/yyyy")
        )
      );
    } else {
      setWorklistDataState(
        filterWorklistData(
          initialWorkList,
          false,
          navbarName,
          format(date, "M/d/yyyy")
        )
      );
    }
  }, [date, initialWorkList, navbarName]);

  // Update API call for DueOn field
  const setDueDate = (dueOnDate: any, key: string) => {
    (async () => {
      try {
        const response = await getEngagemntID(key);
        if (!response) {
          console.error(response);
        } else {
          const updateDueDate = await updateDueOn(
            response.innocrm_Activity.innocrm_patientcareprotocolengagementid,
            dueOnDate
          );
          updateDueDate && fetchWorkList();
        }
      } catch (e) {
        console.error(e);
      }
    })();
  };

  // Update API call for Priority field
  const setPriority = (priority: string, key: string) => {
    (async () => {
      try {
        const priorityResponse = await updatePriority(priority, key);
        if (!priorityResponse) {
          console.error(priorityResponse);
        } else {
          priorityResponse && fetchWorkList();
        }
      } catch (e) {
        console.error(e);
      }
    })();
  };

  // Search worklist data
  const onChangeText = (
    ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    text: string
  ): void => {
    setWorklistDataState(
      searchByText(worklistDataState, text, initialWorkList)
    );
  };

  // Sort by column click
  const onColumnClick = (
    event: React.MouseEvent<HTMLElement>,
    column: IColumn
  ): void => {
    setWorklistDataState(sortByColumnClick(worklistDataState, column));
    setColumns(sortByColumn(columns, column));
  };

  // Handle selected name
  const handleSelectedName = (protocolname: string, name: string) => {
    setWorklistDataState(
      filterByCareOrUserName(worklistDataState, protocolname, date, name)
    );
  };

  // Increment date
  const incrementDateRange = () => {
    setDateRange(addDays(date, 1));
  };

  // Decrement date
  const decrementDateRange = () => {
    setDateRange(subDays(date, 1));
  };

  // Filter based on LeftNavBar status
  const filterLeftNavData = (value: string) => {
    setNavbarName(value);
  };

  // Change the date from DatePicker
  const onDateChange = (datePicker: Date | null | undefined): void => {
    setDateRange(datePicker);
    if (format(new Date(), "M/d/yyyy") === format(datePicker, "M/d/yyyy")) {
      setWorklistDataState(
        filterWorklistData(
          initialWorkList,
          true,
          navbarName,
          format(datePicker, "M/d/yyyy")
        )
      );
    } else {
      setWorklistDataState(
        filterWorklistData(
          initialWorkList,
          false,
          navbarName,
          format(datePicker, "M/d/yyyy")
        )
      );
    }
  };

  // Reset care protocol or Team Member searched data
  const resetUserOrCareProtocolFilterBy = () => {
    if (currentDate === format(date, "M/d/yyyy")) {
      setWorklistDataState(
        filterWorklistData(
          initialWorkList,
          true,
          navbarName,
          format(date, "M/d/yyyy")
        )
      );
    } else {
      setWorklistDataState(
        filterWorklistData(
          initialWorkList,
          false,
          navbarName,
          format(date, "M/d/yyyy")
        )
      );
    }
  };

  // Handle infinite scrolling
  const handleScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight, scrollBottom } = e.target;
    if (!scrollBottom && scrollHeight - scrollTop === clientHeight) {
      loadMoreData();
    }
  };

  return (
    <Stack
      horizontal
      horizontalAlign="space-between"
      tokens={stackTokens}
      className={classes.container}
    >
      <LeftNavigtion
        filterLeftNavData={filterLeftNavData}
        teamMembersList={teamMembers}
        resetUserOrCareProtocolFilterBy={resetUserOrCareProtocolFilterBy}
        datechange={date}
      />
      <Main>
        <ScrollablePane
          scrollbarVisibility={ScrollbarVisibility.auto}
          onScroll={handleScroll}
        >
          <Sticky>
            <Stack horizontal horizontalAlign="space-between">
              <Stack horizontal tokens={stackTokens}>
                <DatePickWrapper>
                  <DatePicker
                    placeholder={format(date, "MMM dd, yyyy")}
                    className={classes.button}
                    onSelectDate={onDateChange}
                  />
                </DatePickWrapper>
                <Stack horizontal tokens={{ childrenGap: 4 }}>
                  <IconButton
                    iconProps={{ iconName: "ChevronLeftMed" }}
                    className={classes.button}
                    onClick={decrementDateRange}
                  />
                  <IconButton
                    iconProps={{ iconName: "ChevronRightMed" }}
                    className={classes.button}
                    onClick={incrementDateRange}
                  />
                </Stack>
              </Stack>
              <Stack
                horizontal
                horizontalAlign="space-between"
                tokens={stackTokens}
              >
                <SearchBoxWrapper>
                  <TextField
                    noValidate
                    autoComplete="false"
                    onChange={onChangeText}
                    placeholder="Search Patient or Activity"
                    className={classes.button}
                  />
                </SearchBoxWrapper>
              </Stack>
              <Stack horizontal tokens={stackTokens}>
                <ContextualMenuSearch
                  text="Filter By"
                  menuitems={items}
                  title="All activities"
                  resetUserOrCareProtocolFilterBy={
                    resetUserOrCareProtocolFilterBy
                  }
                />
                <IconButton
                  iconProps={{ iconName: "Print" }}
                  title="Print"
                  className={classes.button}
                />
              </Stack>
            </Stack>
          </Sticky>
          <DetailListWrapper>
            <ShimmeredDetailsList
              items={worklistDataState}
              columns={columns}
              onColumnHeaderClick={onColumnClick}
              onItemInvoked={handleItemInvoked}
              isHeaderVisible={true}
              enableShimmer={!worklistDataState.length}
              constrainMode={ConstrainMode.unconstrained}
            />
          </DetailListWrapper>
        </ScrollablePane>
      </Main>
    </Stack>
  );
};
