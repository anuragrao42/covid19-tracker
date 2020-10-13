import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { buildChartData } from "../../utils";
import numeral from "numeral";
import "./linegraph.css";

function Linegraph({ caseType }) {
  const [data, setData] = useState({});
  const options = {
    legend: {
      display: false,
    },
    elements: {
      point: {
        radius: 0,
      },
    },
    maintainAspectRatio: false,
    tooltips: {
      mode: "index",
      intersect: false,
      callbacks: {
        label: function (tooltipItem, data) {
          return numeral(tooltipItem.value).format("+0,0");
        },
      },
    },
    scales: {
      xAxes: [
        {
          type: "time",
          time: {
            format: "MM/DD/YY",
            tooltipFormat: "ll",
          },
        },
      ],
      yAxes: [
        {
          gridLines: {
            display: false,
          },
          ticks: {
            callback: function (value, index, values) {
              return numeral(value).format("0a");
            },
          },
        },
      ],
    },
  };

  useEffect(() => {
    const getData = async () => {
      await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=150")
        .then((res) => res.json())
        .then((data) => {
          setData(buildChartData(data, caseType));
        });
    };
    getData();
  }, [caseType]);

  return data.length > 0 ? (
    <div className="app__linegraph">
      <Line
        data={{
          datasets: [
            {
              data: data,
              borderColor: "#CC1034",
              backgroundColor: "rgba(204, 16, 52, 0.5)",
            },
          ],
        }}
        options={options}
      />
    </div>
  ) : null;
}

export default Linegraph;
