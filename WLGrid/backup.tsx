// import {
//   ConstrainMode,
//   DatePicker,
//   IColumn,
//   IconButton,
//   IContextualMenuItem,
//   IStackTokens,
//   ScrollablePane,
//   ScrollbarVisibility,
//   ShimmeredDetailsList,
//   Stack,
//   Sticky,
//   Text,
//   TextField,
// } from "@fluentui/react";
// import { addDays, format, subDays } from "date-fns";
// import * as React from "react";
// import styled from "styled-components";
// import {
//   careProtocolList,
//   getEngagemntID,
//   handleItemInvoked,
//   updateDueOn,
//   updatePriority,
//   usersList,
// } from "../../actions/ApiCall";
// import { classes } from "../../styles/Style";
// import {
//   filterByCareOrUserName,
//   filterLeftNavWorklistData,
//   filterWorklistData,
//   searchByText,
//   sortByColumn,
//   sortByColumnClick,
// } from "../../utils";
// import ContextualMenu from "../Common/ContextualMenu";
// import ContextualMenuSearch from "../Common/ContextualMenuSearch";
// import NavigatePatient from "../Common/Navigation";
// import PriorityIcon from "../Common/PriorityIcon";
// import LeftNavigtion from "../LeftNavigation";

// const SearchBoxWrapper = styled.span`
//   width: 350px;
// `;
// const DetailListWrapper = styled.div`
//   padding: 8px;
// `;
// const DatePickWrapper = styled.div`
//   width: 150px;
// `;
// const Main = styled.div`
//   width: 80%;
//   position: relative;
// `;

// const stackTokens: IStackTokens = {
//   childrenGap: 16,
//   padding: 8,
// };

// const currentDate = format(new Date(), "M/d/yyyy");

// export const Worklist = ({ pageRows, columnsOnView, refreshDataSet }) => {
//   const [worklistDataState, setWorklistDataState] = React.useState([]);
//   const [leftNavigationState, setLeftNavigationState] = React.useState(
//     pageRows
//   );
//   const [columns, setColumns] = React.useState(
//     mapCRMColumnsToDetailsListColmns(columnsOnView)
//   );
//   const [items, setItems] = React.useState<IContextualMenuItem[]>([]);
//   const [date, setDateRange] = React.useState<Date>(new Date());
//   const [navbarName, setNavbarName] = React.useState<string>("Due");
//   const [teamMembers, setTeamMembers] = React.useState<IContextualMenuItem[]>(
//     []
//   );
//   const [isLoading, setIsLoading] = React.useState(true);
//   const [isUpdate, setIsUpdate] = React.useState(false);
//   const [pageSize, setPageSize] = React.useState(20);
//   const [filterData, setFilterData] = React.useState([]);
//   const [workListData, setWorkListData] = React.useState([]);

//   // Dynamically adding link to head tag
//   React.useEffect(() => {
//     const link = document.createElement("link");
//     link.rel = "stylesheet";
//     link.href = "https://fonts.googleapis.com/icon?family=Material+Icons";
//     document.getElementsByTagName("head")[0].appendChild(link);
//   }, []);

//   // API call
//   React.useEffect(() => {
//     (async () => {
//       try {
//         const userResults = await usersList();
//         const userlists = userResults.entities.map((item) => ({
//           key: item.fullname,
//           text: item.fullname,
//           onClick: () => handleSelectedTeamMember(item.fullname),
//         }));
//         setIsLoading(false);
//         setTeamMembers(userlists);

//         const careProtocolResult = await careProtocolList();
//         const carePotocollists = careProtocolResult.entities.map(
//           (item, index) => ({
//             key: item.innocrm_name,
//             text: item.innocrm_name,
//             onClick: () => handlesetCareProtocolList(item.innocrm_name),
//           })
//         );
//         setItems(carePotocollists);
//       } catch (e) {
//         console.error(e);
//       }
//     })();
//   }, []);

//   function mapCRMColumnsToDetailsListColmns(columnsOnView: any): any {
//     let functionName = "mapCRMColumnsToDetailsListColmns";
//     let mappedColumn = [];
//     try {
//       for (const pointer in columnsOnView) {
//         let columnDimension = {
//           minWidth: 100,
//           maxWidth: 100,
//         };
//         switch (columnsOnView[pointer].displayName) {
//           case "Priority":
//             columnDimension = {
//               minWidth: 64,
//               maxWidth: 100,
//             };
//             break;
//           case "Patient (Activity)":
//             columnDimension = {
//               minWidth: 150,
//               maxWidth: 200,
//             };
//             break;

//           case "Patient Care Protocol (Activity)":
//             columnDimension = {
//               minWidth: 150,
//               maxWidth: 200,
//             };
//             break;

//           case "Due On":
//             columnDimension = {
//               minWidth: 80,
//               maxWidth: 100,
//             };
//             break;
//           default:
//             columnDimension = {
//               minWidth: 120,
//               maxWidth: 150,
//             };
//             break;
//         }
//         mappedColumn.push({
//           key: pointer,
//           name: columnsOnView[pointer].displayName,
//           fieldName: columnsOnView[pointer].name,
//           ...columnDimension,
//           isResizable: true,
//           data: "string",
//           onRender: (item: any) => {
//             switch (columnsOnView[pointer].displayName) {
//               case "Patient (Activity)":
//                 return (
//                   <NavigatePatient
//                     name={item[columnsOnView[pointer].name]}
//                     item={item}
//                     linkTo="Patient"
//                   />
//                 );
//               case "Patient Care Protocol (Activity)":
//                 return (
//                   <NavigatePatient
//                     name={item[columnsOnView[pointer].name]}
//                     item={item}
//                     linkTo="CareProtocol"
//                   />
//                 );
//               case "Due On":
//                 return item.innocrm_dueon !== "undefined" &&
//                   item.innocrm_dueon !== null &&
//                   new Date(item.innocrm_dueon) < new Date(currentDate) ? (
//                   <>
//                     <Text className={classes.overDue}>Overdue</Text>
//                     <br />
//                     <ContextualMenu
//                       value={item[columnsOnView[pointer].name]}
//                       className={classes.dueOnColored}
//                       item={item}
//                       updateField={setDueDate}
//                       show="DueOn"
//                     />
//                   </>
//                 ) : (
//                   <ContextualMenu
//                     value={item[columnsOnView[pointer].name]}
//                     className={classes.dueOn}
//                     item={item}
//                     updateField={setDueDate}
//                     show="DueOn"
//                   />
//                 );
//               case "Priority":
//                 return (
//                   <ContextualMenu
//                     value={<PriorityIcon item={item} />}
//                     className={classes.dropDown}
//                     item={item}
//                     updateField={setPriority}
//                     show="Priority"
//                   />
//                 );
//               default:
//                 return React.createElement(
//                   "span",
//                   null,
//                   item[columnsOnView[pointer].name]
//                 );
//             }
//           },
//         });
//       }
//     } catch (error) {
//       console.log(functionName + "" + error);
//     }
//     return mappedColumn;
//   }

//   //Update when date, pageRows or pagesize updated
//   React.useEffect(() => {
//     if (currentDate === format(date, "M/d/yyyy")) {
//       setWorklistDataState(
//         filterWorklistData(
//           worklistDataState,
//           true,
//           navbarName,
//           format(date, "M/d/yyyy")
//         )
//       );
//       setLeftNavigationState(
//         filterLeftNavWorklistData(pageRows, true, format(date, "M/d/yyyy"))
//       );
//     } else {
//       setWorklistDataState(
//         filterWorklistData(
//           worklistDataState,
//           false,
//           navbarName,
//           format(date, "M/d/yyyy")
//         )
//       );
//       setLeftNavigationState(
//         filterLeftNavWorklistData(pageRows, false, format(date, "M/d/yyyy"))
//       );
//     }
//     setFilterData(worklistDataState);
//   }, [date, pageRows, navbarName]);

//   // Update API call for DueOn field
//   const setDueDate = (dueOnDate: any, key: string) => {
//     (async () => {
//       try {
//         setIsLoading(true);
//         const response = await getEngagemntID(key);
//         if (!response) {
//           console.error(response);
//         } else {
//           const updateDueDate = await updateDueOn(
//             response.innocrm_Activity.innocrm_patientcareprotocolengagementid,
//             dueOnDate
//           );
//           updateDueDate && refreshDataSet();
//           setIsLoading(false);
//         }
//       } catch (e) {
//         console.error(e);
//       }
//     })();
//   };

//   // Update API call for Priority field
//   const setPriority = (priority: string, key: string) => {
//     (async () => {
//       try {
//         setIsLoading(true);
//         const priorityResponse = await updatePriority(priority, key);
//         if (!priorityResponse) {
//           console.error(priorityResponse);
//         } else {
//           priorityResponse && refreshDataSet();
//           setIsLoading(false);
//         }
//       } catch (e) {
//         console.error(e);
//       }
//     })();
//   };

//   // Reset care protocol or Team Member searched data
//   const resetUserOrCareProtocolFilterBy = () => {
//     if (currentDate === format(date, "M/d/yyyy")) {
//       setWorklistDataState(
//         filterWorklistData(pageRows, true, navbarName, format(date, "M/d/yyyy"))
//       );
//     } else {
//       setWorklistDataState(
//         filterWorklistData(
//           pageRows,
//           false,
//           navbarName,
//           format(date, "M/d/yyyy")
//         )
//       );
//     }
//   };

//   // Search worklist data
//   const onChangeText = (
//     ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
//     text: string
//   ): void => {
//     setWorklistDataState(searchByText(worklistDataState, text, filterData));
//   };

//   // Sort by column click
//   const onColumnClick = (
//     event: React.MouseEvent<HTMLElement>,
//     column: IColumn
//   ): void => {
//     setWorklistDataState(sortByColumnClick(pageRows, column));
//     setColumns(sortByColumn(columns, column));
//   };

//   // Increment date
//   const incrementDateRange = () => {
//     setDateRange(addDays(date, 1));
//   };

//   // Decrement date
//   const decrementDateRange = () => {
//     setDateRange(subDays(date, 1));
//   };

//   //Handle care protocol name
//   const handlesetCareProtocolList = (protocolname: string) => {
//     setWorklistDataState(
//       filterByCareOrUserName(pageRows, protocolname, date, "CareProtocol")
//     );
//   };

//   //Handle team member name
//   const handleSelectedTeamMember = (protocolname: string) => {
//     setWorklistDataState(
//       filterByCareOrUserName(pageRows, protocolname, date, "TeamMembers")
//     );
//   };

//   // Filter based on LeftNavBar status
//   const filterLeftNavData = (value: string) => {
//     setNavbarName(value);
//   };

//   // Change the date from DatePicker
//   const onDateChange = (datePicker: Date | null | undefined): void => {
//     setDateRange(datePicker);

//     if (format(new Date(), "M/d/yyyy") === format(datePicker, "M/d/yyyy")) {
//       setWorklistDataState(
//         filterWorklistData(
//           pageRows,
//           true,
//           navbarName,
//           format(datePicker, "M/d/yyyy")
//         )
//       );
//     } else {
//       setWorklistDataState(
//         filterWorklistData(
//           pageRows,
//           false,
//           navbarName,
//           format(datePicker, "M/d/yyyy")
//         )
//       );
//     }
//   };

//   // Handle infinite scrolling
//   const handleScroll = (e) => {
//     const { scrollTop, clientHeight, scrollHeight } = e.target;
//     if (scrollHeight - scrollTop === clientHeight) {
//       setPageSize((prevPageSize) => prevPageSize + 20);
//     }
//   };

//   return (
//     <Stack
//       horizontal
//       horizontalAlign="space-between"
//       tokens={stackTokens}
//       className={classes.container}
//     >
//       <LeftNavigtion
//         worklistData={leftNavigationState}
//         filterLeftNavData={filterLeftNavData}
//         teamMembersList={teamMembers}
//         resetUserOrCareProtocolFilterBy={resetUserOrCareProtocolFilterBy}
//         datechange={date}
//       />

//       <Main>
//         <ScrollablePane
//           scrollbarVisibility={ScrollbarVisibility.auto}
//           onScroll={handleScroll}
//         >
//           <Sticky>
//             <Stack horizontal horizontalAlign="space-between">
//               <Stack horizontal tokens={stackTokens}>
//                 <DatePickWrapper>
//                   <DatePicker
//                     placeholder={format(date, "MMM dd, yyyy")}
//                     className={classes.button}
//                     onSelectDate={onDateChange}
//                   />
//                 </DatePickWrapper>
//                 <Stack horizontal tokens={{ childrenGap: 4 }}>
//                   <IconButton
//                     iconProps={{ iconName: "ChevronLeftMed" }}
//                     className={classes.button}
//                     onClick={() => decrementDateRange()}
//                   />
//                   <IconButton
//                     iconProps={{ iconName: "ChevronRightMed" }}
//                     className={classes.button}
//                     onClick={() => incrementDateRange()}
//                   />
//                 </Stack>
//               </Stack>
//               <Stack
//                 horizontal
//                 horizontalAlign="space-between"
//                 tokens={stackTokens}
//               >
//                 <SearchBoxWrapper>
//                   <TextField
//                     noValidate
//                     autoComplete="false"
//                     onChange={onChangeText}
//                     placeholder="Search Patient or Activity"
//                     className={classes.button}
//                   />
//                 </SearchBoxWrapper>
//               </Stack>
//               <Stack horizontal tokens={stackTokens}>
//                 <ContextualMenuSearch
//                   text="Filter By"
//                   menuitems={items}
//                   title="All activities"
//                   resetUserOrCareProtocolFilterBy={
//                     resetUserOrCareProtocolFilterBy
//                   }
//                 />
//                 <IconButton
//                   iconProps={{ iconName: "Print" }}
//                   title="Print"
//                   className={classes.button}
//                 />
//               </Stack>
//             </Stack>
//           </Sticky>
//           <DetailListWrapper>
//             <ShimmeredDetailsList
//               items={worklistDataState}
//               constrainMode={ConstrainMode.unconstrained}
//               columns={columns}
//               onColumnHeaderClick={onColumnClick}
//               onItemInvoked={handleItemInvoked}
//               isHeaderVisible={true}
//               enableShimmer={isLoading}
//             />
//           </DetailListWrapper>
//         </ScrollablePane>
//       </Main>
//     </Stack>
//   );
// };
