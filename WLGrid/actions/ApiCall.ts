interface IWorkListItem {
  key: number;
  name: string;
  value: number;
}
const worklist_entity = "innocrm_worklisttodo";
export const navigateToPatient = (id: string) => {
  return (window as any).appContext.webAPI
    .retrieveRecord(
      worklist_entity,
      id,
      "?$select=_innocrm_activity_value&$expand=innocrm_Activity($select=_innocrm_patient_value)"
    )
    .then(
      function success(result) {
        const entityFormOptions = {
          entityName:
            result.innocrm_Activity[
              "_innocrm_patient_value@Microsoft.Dynamics.CRM.lookuplogicalname"
            ],
          entityId: result.innocrm_Activity["_innocrm_patient_value"],
        };
        /** Using navigation method */
        NavPatientBoard(entityFormOptions);
      },
      function (error) {
        console.log(error);
      }
    )
    .catch((e) => console.log(e));
};

export const navigateToPatientCareProtocol = async (id: string) => {
  await (window as any).appContext.webAPI
    .retrieveRecord(
      worklist_entity,
      id,
      "?$select=_innocrm_activity_value&$expand=innocrm_Activity($select=_innocrm_patientcareprotocol_value)"
    )
    .then(
      function success(result) {
        const entityFormOptions = {
          entityName:
            result.innocrm_Activity[
              "_innocrm_patientcareprotocol_value@Microsoft.Dynamics.CRM.lookuplogicalname"
            ],
          entityId:
            result.innocrm_Activity["_innocrm_patientcareprotocol_value"],
        };
        /** Using navigation method */
        NavPatientBoard(entityFormOptions);
      },
      function (error) {
        console.log(error);
      }
    )
    .catch((e) => console.log(e));
};

const NavPatientBoard = async (entityReference: any) => {
  const entityFormOptions = {
    entityName: entityReference.entityName,
    entityId: entityReference.entityId,
  };

  /** Using navigation method */
  await (window as any).appContext.navigation
    .openForm(entityFormOptions)
    .then((response: any) => {
      console.log(response);
    })
    .catch((error: any) => {
      console.log(error);
    });
};

export const handleItemInvoked = (item: IWorkListItem) => {
  openWorklistRecord(item.key);
};

function openWorklistRecord(recordId: any) {
  try {
    if (recordId) {
      const entityReference = (window as any).appContext.parameters.sampleDataSet.records[
        recordId
      ].getNamedReference();

      const entityFormOptions = {
        entityName: entityReference.LogicalName,
        entityId: entityReference.id,
      };

      /** Using navigation method */
      (window as any).appContext.navigation
        .openForm(entityFormOptions)
        .then((response: any) => {})
        .catch((error: any) => {
          console.log(error);
        });
    }
  } catch (error) {
    console.log(error);
  }
}

export const usersList = () => {
  return (window as any).appContext.webAPI.retrieveMultipleRecords(
    "systemuser",
    "?$filter=not contains(fullname, '%23')"
  );
};

export const careProtocolList = () => {
  return (window as any).appContext.webAPI.retrieveMultipleRecords(
    "innocrm_careprotocol",
    "?$filter=statuscode eq 1"
  );
};

export const getEngagemntID = (key) => {
  return (window as any).appContext.webAPI.retrieveRecord(
    worklist_entity,
    key,
    "?$select=innocrm_name&$expand=innocrm_Activity($select=innocrm_patientcareprotocolengagementid)"
  );
};

export const updateDueOn = (setEngaementID: string, dueDate: any) => {
  let entity = {};
  entity["innocrm_scheduledon"] = dueDate;
  return (window as any).appContext.webAPI.updateRecord(
    "innocrm_patientcareprotocolengagement",
    setEngaementID,
    entity
  );
};

export const updatePriority = (priorityValue: string, key: string) => {
  const priority =
    priorityValue === "low"
      ? 511620000
      : priorityValue === "medium"
      ? 511620001
      : priorityValue === "high"
      ? 511620002
      : 511620003;

  let entity = {};
  entity["innocrm_priority"] = priority;
  return (window as any).appContext.webAPI.updateRecord(
    worklist_entity,
    key,
    entity
  );
};

export const getWorkList = () => {
  return (window as any).appContext.webAPI.retrieveMultipleRecords(
    worklist_entity,
    `?$select=createdon,_innocrm_activity_value,innocrm_dueon,innocrm_name,innocrm_priority,innocrm_status,innocrm_worklisttodoid,_ownerid_value,_innocrm_activity_value,_innocrm_caremanager_value,innocrm_dueon,innocrm_name&$expand=innocrm_Activity($select=_innocrm_patientcareprotocol_value),innocrm_Patient($select=birthdate,fullname,gendercode)&$orderby=createdon desc&$top=20`
  );
};

export const loadMoreWorkListData = (createdData) => {
  return (window as any).appContext.webAPI.retrieveMultipleRecords(
    worklist_entity,
    `?$select=createdon,_innocrm_activity_value,innocrm_dueon,innocrm_name,innocrm_priority,innocrm_status,innocrm_worklisttodoid,_ownerid_value,_innocrm_activity_value,_innocrm_caremanager_value,innocrm_dueon,innocrm_name&$expand=innocrm_Activity($select=_innocrm_patientcareprotocol_value),innocrm_Patient($select=birthdate,fullname,gendercode)&$filter=createdon lt ${createdData} &$orderby=createdon desc&$top=20`
  );
};

export const fetchNavigation = () => {
  return (window as any).appContext.webAPI.retrieveMultipleRecords(
    worklist_entity,
    `?$select=createdon,_innocrm_activity_value,innocrm_dueon,innocrm_name,innocrm_priority,innocrm_status,innocrm_worklisttodoid`
  );
};
