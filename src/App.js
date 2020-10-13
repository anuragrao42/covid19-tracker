//created-by:- Anurag
import {
  Card,
  CardContent,
  FormControl,
  MenuItem,
  Select,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import InfoBox from "./components/infobox/InfoBox";
import Map from "./components/map/Map";
import live from "./images/liveicon.png";
import Table from "./components/Table/Table";
import { sortData, prettyPrint } from "./utils";
import Linegraph from "./components/linegraph/Linegraph";
import "leaflet/dist/leaflet.css";

import "./App.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCentre, setMapCentre] = useState({ lat: 20, lng: 77 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [caseType, setCaseType] = useState("cases");

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((res) => res.json())
      .then((data) => {
        const {
          cases,
          todayCases,
          recovered,
          todayRecovered,
          deaths,
          todayDeaths,
        } = data;
        setCountryInfo({
          cases,
          todayCases,
          recovered,
          todayRecovered,
          deaths,
          todayDeaths,
        });
      });
  }, []);

  useEffect(() => {
    const getCountries = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((res) => res.json())
        .then((data) => {
          const countries = data.map((item) => {
            return {
              name: item.country,
              code: item.countryInfo.iso2,
              total: item.cases,
            };
          });
          setCountries(countries);
          setMapCountries(data);
          setTableData(sortData(data));
        });
    };
    getCountries();
  }, []);

  const onCountrySelect = async (e) => {
    const countryCode = e.target.value;
    setCountry(countryCode);

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const {
          cases,
          todayCases,
          recovered,
          todayRecovered,
          deaths,
          todayDeaths,
        } = data;
        setCountryInfo({
          cases,
          todayCases,
          recovered,
          todayRecovered,
          deaths,
          todayDeaths,
        });
        countryCode === "worldwide"
          ? setMapCentre({ lat: 20, lng: 77 })
          : setMapCentre({
              lat: data.countryInfo.lat,
              lng: data.countryInfo.long,
            });
        setMapZoom(4);
      });

    //https://disease.sh/v3/covid-19/countries/IN?strict=true
  };

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <div className="title">
            <h1>COVID-19 Tracker </h1>
            <img src={live} alt="live-logo" className="livelogo" />
          </div>

          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              onChange={onCountrySelect}
              value={country}
            >
              <MenuItem value="worldwide" key="ww">
                Worldwide
              </MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.code} key={country.name}>
                  {country.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="info__stats">
          <InfoBox
            active={caseType === "cases"}
            isRed={true}
            onClick={(e) => setCaseType("cases")}
            title="Corona Virus Cases"
            todayCases={prettyPrint(countryInfo.todayCases)}
            total={countryInfo.cases}
          />
          <InfoBox
            active={caseType === "recovered"}
            isRed={false}
            onClick={(e) => setCaseType("recovered")}
            title="Cases Recovered"
            todayCases={prettyPrint(countryInfo.todayRecovered)}
            total={countryInfo.recovered}
          />
          <InfoBox
            isRed={true}
            active={caseType === "deaths"}
            onClick={(e) => setCaseType("deaths")}
            title="Deaths"
            todayCases={prettyPrint(countryInfo.todayDeaths)}
            total={countryInfo.deaths}
          />
        </div>

        {/*Map */}
        <div className="map">
          <Map
            centre={mapCentre}
            zoom={mapZoom}
            countries={mapCountries}
            casesType={caseType}
          />
        </div>
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Countries by Cases [Live]</h3>
          <Table data={tableData} />
          <h3>WorldWide New-{caseType} </h3>
          <Linegraph caseType={caseType} />
        </CardContent>
        <h4>
          <em>Created By: Anurag</em>
        </h4>
      </Card>
    </div>
  );
}

export default App;
