import React, { useEffect, useRef } from "react";
import { ENGAGEMENT, BORDER, ENGRANK } from "../../configs/COLORS";

// import iconByCategory from "../cytoscape/functions/iconByCategory";
import styleActivitiesByWP from "../cytoscape/functions/styleActivitiesByWP";

import "./Legend.css";

export function Legend({ cyState, networkVeiw, selectedNode, networkVeiwEls, engScoreVeiw, stakeholdersDisplay }) {
  const legendData = useRef({ wps: "", categorys: "" });

  const eng =
    selectedNode.id !== "" &&
    cyState.cy
      .nodes(`#${selectedNode.id}`)
      .connectedEdges("[type = 'stakeholderEdge']")
      .map((e) => e.data("engagement"))
      .sort(function (a, b) {
        return a - b;
      });

  const uniqueEng = selectedNode.id !== "" && [...new Set([...eng])];

  const engLegendItems =
    selectedNode.id !== "" &&
    uniqueEng.map((e, i) => (
      <div key={i} className="boxContainer">
        <div className="engBox" style={styleEngLegend(e)}></div>
        <p className="legendLable">Engagement level {e}</p>
      </div>
    ));

  useEffect(() => {
    // gets all WPS  and descriptions present in cy graph
    const wps = cyState.cy.nodes("[type = 'wp']").map((wp) => wp.data());
    //sort WPS in number order before adding to legend
    wps.sort(function (a, b) {
      return a.id.slice(2) - b.id.slice(2);
    });

    const wpLegendItems = wps.map((wp) => (
      <div key={wp.id} className="boxContainer">
        <div className="box" title={`Category: ${wp.category}`} style={styleActivitiesByWP(wp.id)}></div>
        <p className="legendLable" title={`Category: ${wp.category}`}>
          {wp.id}: {wp.name}
        </p>
      </div>
    ));
    legendData.current = { wps: wpLegendItems };
  }, [cyState.cy, cyState.elements.length, cyState]);

  const engScoreScale = (
    <div className="scale">
      <p>High</p>
      <div className="scaleBox" style={{ background: `linear-gradient(${ENGRANK.high}, ${ENGRANK.low})` }}></div>
      <p>Low</p>
    </div>
  );

  return (
    <div className="legend">
      <h2>Work Packages:</h2>
      {legendData.current.wps}
      {engScoreVeiw && !stakeholdersDisplay && <h2>Engagement Ranking:</h2>}
      {engScoreVeiw && !stakeholdersDisplay && engScoreScale}
      {/* <h2>{engScoreVeiw ? "Engagement Ranking:" : "Work Packages:"}</h2>
      {engScoreVeiw ? engScoreScale : legendData.current.wps} */}
      {/* <h2>Categorys:</h2>
      {legendData.current.categorys} */}
      {networkVeiw && !stakeholdersDisplay && engLegendItems.length !== 0 && <h2>Engagement Level:</h2>}
      {networkVeiw && !stakeholdersDisplay && engLegendItems.length !== 0 && engLegendItems}
    </div>
  );
}

export default Legend;

function styleEngLegend(eng) {
  return eng === "1"
    ? { backgroundColor: ENGAGEMENT[0], height: "2px" }
    : eng === "2"
    ? { backgroundColor: ENGAGEMENT[1], height: "4px" }
    : eng === "3"
    ? { backgroundColor: ENGAGEMENT[2], height: "6px" }
    : eng === "4"
    ? { backgroundColor: ENGAGEMENT[3], height: "8px" }
    : BORDER.other;
}

// // returns unique array of activity categorys
// const categorys = [
//   ...new Set(cyState.cy.nodes("[type = 'activityNode']").map((act) => act.data().meta["Activity Category"])),
// ];

// const catLegendItems = categorys.map((cat, i) => (
//   <div key={cat} className="boxContainer">
//     <div className="box" title={`Category: ${cat}`}>
//       {iconByCategory(cat)}
//     </div>
//     <p className="legendLable" title={`Category: ${cat}`}>
//       {cat}
//     </p>
//   </div>
// ));
