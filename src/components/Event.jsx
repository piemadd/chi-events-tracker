import { DATE_FORMAT, TIME_FORMAT } from "../common";
import BaseballScore from "./BaseballScore";
import FootballScore from "./FootballScore";
import Tags from "./Tags";

const Event = ({ eventData, eventIndex }) => {
  let finalTags = [
    [DATE_FORMAT.format(new Date(eventData.start_date)), "#00a5c2"],
    [TIME_FORMAT.format(new Date(eventData.start_date)), "#6ba900"],
    [eventData.venue?.name, "#ff6200"],
    [eventData.category, "#ff1100"],
    [eventData.genre, "#007b04"],
    [eventData.sub_genre, "#ffd900"]
  ];

  if (eventData.attendance) finalTags.push([`${eventData.attendance.toLocaleString()} Attendees`, '#3d00a0', "#fff"])

  return (
    <div className="eventCard" key={eventIndex}>
      {eventData.image_url && eventData.category != "Sports" ? (
        <img src={eventData.image_url} style={{ maxHeight: "100px", aspectRatio: 1, objectFit: "cover" }} />
      ) : null}
      <div className="eventCardDetails">
        <h4>{eventData.teams_list ? eventData.teams_list.map((team) => team.name).join(" vs. ") : eventData.name}</h4>
        <Tags tagsArray={finalTags} />
        {eventData.category == "Sports" && eventData.genre == "Football" ? (
          <FootballScore eventObject={eventData} />
        ) : null}
        {eventData.category == "Sports" && eventData.genre == "Baseball" ? (
          <BaseballScore eventObject={eventData} />
        ) : null}
      </div>
    </div>
  );
};

export default Event;
