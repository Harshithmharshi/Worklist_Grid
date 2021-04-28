import {
  DefaultButton,
  IContextualMenuListProps,
  IRenderFunction,
  SearchBox,
} from "@fluentui/react";
import * as React from "react";
import { classes } from "../../styles/Style";
import { searchByName } from "../../utils";

function ContextualMenu({
  text,
  menuitems,
  title,
  resetUserOrCareProtocolFilterBy,
}) {
  const [items, setItems] = React.useState([]);
  const [inputValue, setInputValue] = React.useState("");

  React.useEffect(() => {
    const sortItems = menuitems.sort((a, b) =>
      a.text.toLowerCase().localeCompare(b.text.toLowerCase())
    );
    setItems(sortItems);
  }, [menuitems]);

  const onChange = (
    ev: React.ChangeEvent<HTMLInputElement>,
    newValue: string
  ) => {
    setInputValue(newValue);
    setItems(searchByName(items, newValue, menuitems));
  };

  const renderMenuList = (
    menuListProps: IContextualMenuListProps,
    defaultRender: IRenderFunction<IContextualMenuListProps>
  ) => {
    return (
      <>
        <SearchBox
          value={inputValue}
          placeholder="Search"
          onChange={onChange}
          className={classes.searchBoxStyles}
        />
        <div
          className={classes.dropdowncoded}
          onClick={resetUserOrCareProtocolFilterBy}
        >
          {title}
        </div>
        <div style={{ borderTop: "1px solid #ccc" }}>
          {defaultRender(menuListProps)}
        </div>
      </>
    );
  };

  const menuProps = React.useMemo(
    () => ({
      onRenderMenuList: renderMenuList,
      shouldFocusOnMount: true,
      items,
      calloutProps: {
        calloutMaxHeight: 250,
      },
    }),
    [items, renderMenuList]
  );

  return (
    <DefaultButton
      text={text}
      menuProps={menuProps}
      className={classes.button}
    />
  );
}

export default ContextualMenu;
