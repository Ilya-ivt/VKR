import "react";
import { Tabs, Tab } from "@mui/material";
import { useState } from "react";
import TableComponent from "../components/TableComponent";
import CityTable from "../components/CityTable";
import CompaniesTable from "../components/CompaniesTable.jsx";
import MedicinesTable from "../components/MedicinesTable.jsx";


const PharmaciesPage = () => {
  const [tab, setTab] = useState(0);
  return (
    <div>
      <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)} sx={{ marginBottom: 2 }}>
        <Tab label="Аптеки" />
        <Tab label="Города" />
        <Tab label="Компании" />
        <Tab label="Лекарства" />
      </Tabs>

      {tab === 0 && <TableComponent />}
      {tab === 1 && <CityTable />}
      {tab === 2 && <CompaniesTable />}
      {tab === 3 && <MedicinesTable />}
    </div>
  );
};

export default PharmaciesPage;