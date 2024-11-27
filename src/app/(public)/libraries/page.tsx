import React from "react";
import { Libraries } from "./Container";
import TableContainer from "./table/TableContainer";
import ChartsContainer from "./charts/ChartsContainer";
import UserContainer from "./user/Container";
const page = () => {
  return (
    <div>
      <Libraries />
      <TableContainer />
      <ChartsContainer />
      <UserContainer />
    </div>
  );
};

export default page;
