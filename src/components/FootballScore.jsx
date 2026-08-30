import { TIME_FORMAT } from "../common";
import Tags from "./Tags";

const TeamScore = ({ team, scoreObject, reverse = false }) => {
  return (
    <div className="teamScore" style={{ flexDirection: !reverse ? "row" : "row-reverse" }}>
      <img src={team.logo} style={{ height: 60 }} />
      <p>{scoreObject[team.homeAway]}</p>
    </div>
  );
};

const FootballScore = ({eventObject}) => {
    if (!eventObject.score) return null;

  let homeTeam = null;
  let awayTeam = null;

  eventObject.teams_list.forEach((team) => {
    if (team.homeAway == "home") homeTeam = team;
    if (team.homeAway == "away") awayTeam = team;
  });

  return (
    <div className="score">
      <div className="teamScores">
        <TeamScore team={awayTeam} scoreObject={eventObject.score} />
        <p style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>-</p>
        <TeamScore team={homeTeam} scoreObject={eventObject.score} reverse={true} />
      </div>
      <div className="gameStatus">
        {!eventObject.score.gameStarted ? (
          <>
            <Tags tagsArray={[["Not Yet Started", "#007b04"]]} />
          </>
        ) : null}
        {eventObject.score.gameStarted && !eventObject.score.gameComplete ? (
          <>
            <Tags tagsArray={[["Not Implemented", "#007b04"]]} />
            {/*}
            <Tags
              tagsArray={[
                [`${eventObject.score?.topOfInning ? "Top" : "Bottom"} of ${eventObject.score?.inningText}`, "#007b04"]
              ]}
            />
            <Tags
              tagsArray={[
                [`${eventObject.score?.thisInning?.balls} B`, "#6ba900"],
                [`${eventObject.score?.thisInning?.strikes} S`, "#00a5c2"],
                [`${eventObject.score?.thisInning?.outs} O`, "#ff6200"]
              ]}
            />
            {*/}
          </>
        ) : null}
        {eventObject.score.gameStarted && eventObject.score.gameComplete ? (
          <>
            <Tags tagsArray={[["Final", "#007b04"]]} />
            <Tags tagsArray={[[TIME_FORMAT.format(new Date(eventObject.score?.latestWallClock)), "#00a5c2"]]} />
          </>
        ) : null}
      </div>
    </div>
  );
};

export default FootballScore;