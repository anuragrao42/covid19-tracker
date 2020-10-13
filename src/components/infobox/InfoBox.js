import { Card, CardContent, Typography } from "@material-ui/core";
import React from "react";
import "./infobox.css";
import numeral from "numeral";

function InfoBox({ title, todayCases, active, isRed, total, ...props }) {
  return (
    <Card
      className={`infobox ${active ? `activeBox` : null} ${
        isRed && active ? `activeBox--red` : null
      } `}
      onClick={props.onClick}
    >
      <CardContent>
        <Typography className="infobox__title" color="textSecondary">
          {title}
        </Typography>
        <h2
          className={`infobox__cases ${
            !isRed ? `activeBox--text--green` : null
          }`}
        >
          + {todayCases}
        </h2>
        <Typography color="textSecondary" className="infobox__total">
          Total: {numeral(total).format("0,0")}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default InfoBox;
