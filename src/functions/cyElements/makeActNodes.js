//creats a Node object for each activity

import { actFields } from "../../data";

export function makeActNodes(data) {
  const cyNodes = [];
  for (let i = 0; i < data.length; i++) {
    // loops over meta fields to return value of specified meta fields
    const meta_fields = actFields.META_TEST.map((field) => {
      // data in array format ["field name", "field value"]
      return [field, data[i][field]];
    });

    const node = {
      group: "nodes",
      data: {
        type: "activityNode",
        size: 1,
        parent: `WP_${data[i][actFields.WP]}`,
        colorRef: `WP_${data[i][actFields.WP]}`,
        id: data[i][actFields.ID],
        label: data[i][actFields.ID],

        name: data[i][actFields.NAME], // can be undefined

        // Need to look into still
        endPrPeriod: data[i].endPrPeriod,
        startPrPeriod: data[i].startPrPeriod,
        endDate: data[i].endDate,
        startDate: data[i].startDate,

        // meta: {
        //   // all data from activity csv as defined by user
        //   ...data[i],
        // },

        meta: [...meta_fields],
      },
    };
    cyNodes.push(node);
  }

  return cyNodes;
}

export default makeActNodes;
