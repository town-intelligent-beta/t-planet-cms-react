//import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import CsrProject from "../../assets/csr-project.png";
import ProjectList from "./components/ProjectList";
import KpiList from "./components/KpiList";
import Chart from "./components/Chart";

const KPI = () => {
  return (
    <section>
      <div
        className="bg-cover mb-0 block bg-center h-48 md:h-80"
        style={{
          backgroundImage: `url(${CsrProject})`,
        }}
      ></div>
      <KpiList />
      <Chart />
      <ProjectList />
    </section>
  );
};

export default KPI;
