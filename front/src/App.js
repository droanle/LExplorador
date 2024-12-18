import { BrowserRouter, Routes, Route } from "react-router-dom";

import { IconButton } from 'rsuite';
import DonutChartIcon from '@rsuite/icons/DonutChart';
import IndirectIcon from '@rsuite/icons/Indirect';

import Main from "./view/pages/Main/Main";
import Explorer from "./view/pages/Explorer/Explorer";


import Cookies from "universal-cookie";

import { CustomProvider } from "rsuite";
import PTBR from "rsuite/locales/pt_BR";
import "./utils/global.scss";
import "./utils/theme.scss";
import { useState } from "react";

export default function App() {
  const cookies = new Cookies();
  const [isGraphql, setIsGraphql] = useState(cookies.get("isGraphql") ?? true);

  return (
    <CustomProvider locale={PTBR} theme="light">
      <IconButton
        style={{ position: "absolute", right: "12px", top: "12px" }}
        icon={isGraphql ? <DonutChartIcon /> : <IndirectIcon />}
        appearance="default"
        onClick={() => {
          cookies.set('isGraphql', !isGraphql);
          setIsGraphql(!isGraphql)
        }}>
        Using  {isGraphql ? "GraphQL" : "REST"}
      </IconButton>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/exploring" element={<Explorer />} />
        </Routes>
      </BrowserRouter>
    </CustomProvider >
  );
}

