import * as React from "react";
import * as ReactDOM from "react-dom";
import { Worklist as App } from "./components/WorkList";
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;
type DataSet = ComponentFramework.PropertyTypes.DataSet;

export class WLGrid
  implements ComponentFramework.StandardControl<IInputs, IOutputs> {
  /**
   * Empty constructor.
   */
  private _container: any;
  constructor() {}

  /**
   * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
   * Data-set values are not initialized here, use updateView.
   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
   * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
   * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
   * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
   */
  public init(
    context: ComponentFramework.Context<IInputs>,
    notifyOutputChanged: () => void,
    state: ComponentFramework.Dictionary,
    container: HTMLDivElement
  ) {
    // Add control initialization code
    this._container = container;
    (window as any).appContext = context;
  }

  /**
   * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
   */
  public updateView(context: ComponentFramework.Context<IInputs>): void {
    // Add code to update control view
    const columnsOnView = context.parameters.sampleDataSet.columns;

    const pageRows = this.getAllPageRecords(
      columnsOnView,
      context.parameters.sampleDataSet
    );

    const removeColumnList = ["Birthday (Patient)", "Gender (Patient)"];
    const filterColumns = columnsOnView.filter(
      (item) => !removeColumnList.includes(item.displayName)
    );

    const appProps = {
      columnsOnView: filterColumns,
      pageRows,
    };

    ReactDOM.render(React.createElement(App, appProps), this._container);
  }

  public getAllPageRecords(
    columnsOnView: DataSetInterfaces.Column[],

    gridParam: DataSet
  ) {
    let functionName = "loadPagingRecords";

    let pagingDataRows: any = [];

    let currentPageRecordsID = gridParam.sortedRecordIds;

    try {
      for (const pointer in currentPageRecordsID) {
        pagingDataRows[pointer] = {};

        pagingDataRows[pointer]["key"] = currentPageRecordsID[pointer];

        columnsOnView.forEach((columnItem: any, index) => {
          if (columnItem.name.includes("innocrm_patient")) {
            pagingDataRows[pointer][columnItem.name] = gridParam.records[
              currentPageRecordsID[pointer]
            ].getFormattedValue(columnItem.name);
          } else {
            {
              pagingDataRows[pointer][columnItem.name] = gridParam.records[
                currentPageRecordsID[pointer]
              ].getFormattedValue(columnItem.name);
            }
          }
        });
      }
    } catch (error) {
      console.log(functionName + "" + error);
    }

    return pagingDataRows;
  }

  /**
   * It is called by the framework prior to a control receiving new data.
   * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
   */
  public getOutputs(): IOutputs {
    return {};
  }

  /**
   * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
   * i.e. cancelling any pending remote calls, removing listeners, etc.
   */
  public destroy(): void {
    // Add code to cleanup control if necessary
  }
}
