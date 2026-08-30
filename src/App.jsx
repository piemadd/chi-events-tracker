import { useState, useEffect } from "react";
import Event from "./components/Event";

const App = () => {
  const [eventsArr, setEventsArr] = useState([]);
  const [filters, setFilters] = useState(
    localStorage.getItem("chi-events-tracker-v1-settings")
      ? JSON.parse(localStorage.getItem("chi-events-tracker-v1-settings"))
      : { onlyChicagoSports: true, hideCompleteEvents: false }
  );
  const [loadingMessage, setLoadingMessage] = useState("Loading events list...");

  const updateFilters = (updatedFilters) => {
    setFilters((currentFilters) => {
      const newFilters = { ...currentFilters, ...updatedFilters };
      localStorage.setItem("chi-events-tracker-v1-settings", JSON.stringify(newFilters));
      return newFilters;
    });
  };

  const fetchData = () => {
    fetch("https://store.transitstat.us/chi_events_tracker")
      .then((res) => {
        if (!res.ok) {
          setLoadingMessage(`Error loading events. Code ${res.status} (${res.statusText}). URL ${res.url}`);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          setEventsArr(data.events);
          setLoadingMessage(null);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    fetchData();

    setInterval(fetchData, 30000);
  }, []);

  if (loadingMessage) {
    return (
      <>
        <h1>Chicago Events Tracker</h1>
        <p>{loadingMessage}</p>
      </>
    );
  }

  return (
    <>
      <h1>Chicago Events Tracker</h1>
      <section id="filters">
        <div className="filter">
          <input
            type="checkbox"
            id="filter_onlyChicagoSports"
            name="onlyChicagoSports"
            checked={filters.onlyChicagoSports}
            onChange={(e) => updateFilters({ onlyChicagoSports: e.target.checked })}
          />
          <label htmlFor="onlyChicagoSports">Only Chicago Sports?</label>
        </div>
        <div className="filter">
          <input
            type="checkbox"
            id="filter_hideCompleteEvents"
            name="hideCompleteEventshideCompleteEvents"
            checked={filters.hideCompleteEvents}
            onChange={(e) => updateFilters({ hideCompleteEvents: e.target.checked })}
          />
          <label htmlFor="hideCompleteEvents">Hide Complete Events?</label>
        </div>
      </section>
      <section id="events">
        {eventsArr.filter((event) => {
          if (filters.onlyChicagoSports && !event.isChicagoEvent) return false;
          if (filters.hideCompleteEvents && event.score?.latestWallClock && Date.now() > new Date(event.score?.latestWallClock).valueOf()) return false;

            return true;
        }).map((event, i) => {
          return (
            <>
              <Event eventData={event} eventIndex={i} />
            </>
          );
        })}
      </section>
      <p>&copy;<a href="https://piemadd.com/" target="_blank">Piero Maddaleni</a> {new Date().getFullYear()}</p>
      <p>Event Data from Ticketmaster and ESPN</p>
      <p>v0.1.0 Beta</p>
    </>
  );
};

export default App;
