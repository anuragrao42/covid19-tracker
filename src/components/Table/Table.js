import React from "react";
import "./table.css";
import numeral from "numeral";

function Table({ data }) {
  return (
    <div className="app__table">
      <table>
        <tbody>
          {data.map((country) => (
            <tr key={country.country}>
              <td>{country.country}</td>
              <td>
                <strong> {numeral(country.cases).format("0,0")}</strong>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
