//creats a Node object for each activity

export function makeActNodes(data, config) {
  const actFields = config.actFields;
  const cyNodes = data.map((act) => {
    // if user does not specify names then generate them
    const actName = act[actFields.NAME] ? act[actFields.NAME] : `Activity ${act[actFields.ID]}`; // name with no id infront
    const displayName = act[actFields.NAME]
      ? `${act[actFields.ID]}. ${act[actFields.NAME]}`
      : `Activity ${act[actFields.ID]}`; // name with id in front

    return {
      group: "nodes",
      data: {
        type: "activityNode",
        size: 1,
        parent: `WP_${act[actFields.WP]}`,
        colorRef: `WP_${act[actFields.WP]}`,
        bgColor: act.bgColor,
        borderColor: act.borderColor,
        id: act[actFields.ID],
        label: act[actFields.ID],
        name: actName,
        displayName: displayName,
        ...(act.SDGs && { SDGs: act.SDGs }),

        dates: {
          endPrPeriod: act.endPrPeriod,
          startPrPeriod: act.startPrPeriod,
          endDate: act.endDate,
          startDate: act.startDate,
        },

        meta: act.meta,
      },
    };
  });

  return cyNodes;
}

export default makeActNodes;
