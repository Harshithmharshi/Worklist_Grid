import { Link } from "@fluentui/react";
import * as React from "react";
import styled from "styled-components";
import {
  navigateToPatient,
  navigateToPatientCareProtocol,
} from "../../actions/ApiCall";
import { classes } from "../../styles/Style";

const PatientinfoWrapper = styled.div`
  color: #868686;
  padding: 0.5px;
`;
function Navigation({ name, item, linkTo }) {
  return (
    <>
      {linkTo === "Patient" ? (
        <>
          <Link
            onClick={() => navigateToPatient(item.key)}
            className={classes.linkPatient}
          >
            {name}
          </Link>
          <PatientinfoWrapper>
            {`${item.birthdate},
              ${item.gender}
            `}
          </PatientinfoWrapper>
        </>
      ) : (
        <Link
          onClick={() => navigateToPatientCareProtocol(item.key)}
          className={classes.linkPatient}
        >
          {name}
        </Link>
      )}
    </>
  );
}

export default Navigation;
