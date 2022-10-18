import { useEffect, useState } from "react";
import { actFields } from "../../../data";

export function CustomStory({
  stories,
  currentStory,
  customStoryDisplay,
  setCustomStory,
  actDataRef,
  customStoryFilter,
  setCustomStoryFilter,
  setStories,
  customStory,
  setCustomStoryDisplay,
  localStories,
}) {
  const [fieldCount, setFieldCount] = useState(0);
  //input Controls
  const [selectedName, setSelectedName] = useState("");
  const [selectedField, setSelectedField] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  //input controls

  const storyNames = stories.map((story) => story.name); // returns a list of the story names

  //hidescustom story options if a story is selected
  const customStoryStyle = () => {
    if (currentStory === null && customStoryDisplay === true) {
      return { display: "flex" };
    } else {
      return { display: "none" };
    }
  };

  // if the story name has been input alread then input box is red
  const customStoryNameStyle = (event) => {
    setSelectedName(event.target.value);
    if (storyNames.includes(event.target.value)) {
      event.target.style.backgroundColor = "#f40000";
    } else {
      event.target.style.backgroundColor = "white";
    }
  };

  const addStoryButtonStyle = {
    display: customStory.ids.length === 0 || customStory.name === "" ? "none" : "flex",
  };

  const addFieldButtonStyle = {
    display: customStory.ids.length === 0 || customStory.name === "" ? "none" : "flex",
  };

  const addFieldToFilter = (event) => {
    setFieldCount((prevState) => prevState + 1);
    console.log(fieldCount);
  };

  console.log(fieldCount);

  const addCustomStoryFilterName = (event) => {
    if (event.target.type === "button") {
      if (!storyNames.includes(document.getElementById("customStoryName").value)) {
        setCustomStory((prevState) => ({
          ...prevState,
          name: document.getElementById("customStoryName").value,
        }));
      }
    } else {
      if (!storyNames.includes(event.target.value)) {
        event.keyCode === 13 &&
          setCustomStory((prevState) => ({
            ...prevState,
            name: event.target.value,
          }));
      } // key code 13 === 'enter'
    }
  };

  const addCustomStoryFilterField = (event) => {
    if (event.target.type === "button") {
      if (!storyNames.includes(document.getElementById("customStoryField").value)) {
        setCustomStoryFilter((prevState) => [
          {
            values: prevState[0].values,
            field: document.getElementById("customStoryField").value,
          },
        ]);
      }
    } else {
      if (!storyNames.includes(event.target.value)) {
        event.keyCode === 13 &&
          setCustomStoryFilter((prevState) => [
            { values: prevState[0].values, field: event.target.value, name: prevState[0].name },
          ]);
      } // key code 13 === 'enter'
    }
  };

  const addCustomStoryFilterValues = (event) => {
    if (event.target.type === "button") {
      setCustomStoryFilter((prevState) => [
        {
          field: prevState[0].field,
          values: checkForDuplicates(document.getElementById("customStoryValues").value, prevState[0].values),
        },
      ]);
    } else {
      event.keyCode === 13 &&
        setCustomStoryFilter((prevState) => [
          {
            field: prevState[0].field,
            values: checkForDuplicates(event.target.value, prevState[0].values),
          },
        ]);
    }
  };

  function getCustomFilterIds() {
    const filters = customStoryFilter;
    const ids = filters.flatMap((filter) => {
      let values = filter.values;
      return values.flatMap((val) =>
        actDataRef.current.filter((act) => act[filter.field] === val).map((act) => act[actFields.ID])
      );
    });

    return ids;
  }

  useEffect(() => {
    setCustomStory((prevState) => ({ ...prevState, ids: getCustomFilterIds() }));
  }, [customStoryFilter]);

  //adds the new story to the story state to update list and adds the story to local storage (so next time page is loaded the stories are added to state automatically)
  const addCustomStoryToList = (event) => {
    setSelectedValue("");
    setSelectedField("");
    setSelectedName("");
    setStories((prevState) => [...prevState, customStory]); //adds the new story to the list of stories
    if (localStories === null) {
      window.localStorage.setItem("customStory", JSON.stringify([customStory]));
    } else {
      window.localStorage.setItem("customStory", JSON.stringify([...localStories, customStory]));
    }
    setCustomStory({ name: "", ids: [], custom: true }); // resets the custom story to empty
    setCustomStoryDisplay(false); //hides the current stroy options
    setCustomStoryFilter([{ field: "", values: [] }]);
  };

  //adds all matrix fields to the select list
  const matrixFieldOptions =
    actDataRef.current !== null &&
    Object.keys(actDataRef.current[0]).map((field) => (
      <option value={field} key={field}>
        {field}
      </option>
    ));

  //adds the options from the chosen field to a select list
  const chosenFieldOptions =
    customStoryFilter[0].field !== "" &&
    [...new Set(actDataRef.current.map((act) => act[customStoryFilter[0].field]))].map((option) => (
      <option value={option} key={option}>
        {option}
      </option>
    ));

  return (
    <div>
      <div className="customStorySection" style={customStoryStyle()}>
        <div className="customStoryInput">
          <input
            autoComplete="off"
            id="customStoryName"
            name="customStoryName"
            placeholder="story name"
            value={selectedName}
            onChange={customStoryNameStyle}
            onKeyUp={addCustomStoryFilterName}
          ></input>
          <button type="button" onClick={addCustomStoryFilterName}>
            <i className="fa-solid fa-plus"></i>
          </button>
        </div>
        <div className="customStoryInput">
          <select
            id="customStoryField"
            name="customStory"
            onKeyUp={addCustomStoryFilterField}
            onKeyDown={(e) => e.preventDefault()} //prevents 'enter' opening select dropdown
            // defaultValue=""
            value={selectedField}
            onChange={(e) => setSelectedField(e.target.value)}
          >
            <option disabled={true} value="">
              --matrix field--
            </option>
            {matrixFieldOptions}
          </select>
          <button type="button" onClick={addCustomStoryFilterField}>
            <i className="fa-solid fa-plus"></i>
          </button>
        </div>

        {customStoryFilter.field !== "" && (
          <div className="customStoryInput">
            <select
              name="field"
              className="fieldOptionSelect"
              id="customStoryValues"
              onKeyUp={addCustomStoryFilterValues}
              onKeyDown={(e) => e.preventDefault()}
              // defaultValue=""
              value={selectedValue}
              onChange={(e) => setSelectedValue(e.target.value)}
            >
              <option disabled={true} value="">
                --field value--
              </option>
              {chosenFieldOptions}
            </select>
            <button type="button" onClick={addCustomStoryFilterValues}>
              <i className="fa-solid fa-plus"></i>
            </button>
          </div>
        )}

        <p className="customName">Name: {customStory.name !== "" && customStory.name}</p>
        <p className="customOptions">Field: {customStoryFilter[0].field !== "" && customStoryFilter[0].field}</p>
        <p className="customOptions">
          Values: {customStoryFilter[0].values.length !== 0 && String(customStoryFilter[0].values)}
        </p>
      </div>
      <button style={addFieldButtonStyle} onClick={addFieldToFilter} className="customStoryButton">
        Add Field
      </button>
      <button onClick={addCustomStoryToList} style={addStoryButtonStyle} className="customStoryButton">
        Generate Story
      </button>
    </div>
  );
}

export default CustomStory;

//prevents 2 of the same value being chosen
function checkForDuplicates(newVal, prevVals) {
  if (prevVals.length === 0) {
    return [newVal];
  } else {
    if (prevVals.includes(newVal)) {
      return [...prevVals];
    } else {
      return [...prevVals, newVal];
    }
  }
}