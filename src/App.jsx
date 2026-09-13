import { useState, useEffect } from "react";
import Event from "./components/Event";

const App = () => {
  const [eventsArr, setEventsArr] = useState([]);
  const [filters, setFilters] = useState(
    localStorage.getItem("chi-events-tracker-v1-settings")
      ? JSON.parse(localStorage.getItem("chi-events-tracker-v1-settings"))
      : {
          onlySportsChicago: true,
          onlyChicagoSportsTeams: false,
          onlySports: false,
          hideCompleteEvents: false,
          onlyTodayEvents: true
        }
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
        <details>
          <summary style={{
            fontSize: 24
          }}>Filters</summary>
          <div className="filter">
            <input
              type="checkbox"
              id="filter_onlySportsChicago"
              name="onlySportsChicago"
              checked={filters.onlySportsChicago}
              onChange={(e) => updateFilters({ onlySportsChicago: e.target.checked })}
            />
            <label htmlFor="onlySportsChicago">Only Sports in Chicago?</label>
          </div>
          <div className="filter">
            <input
              type="checkbox"
              id="filter_onlyChicagoSportsTeams"
              name="onlyChicagoSportsTeams"
              checked={filters.onlyChicagoSportsTeams}
              onChange={(e) => updateFilters({ onlyChicagoSportsTeams: e.target.checked })}
            />
            <label htmlFor="onlyChicagoSportsTeams">Only Chicago Sports Teams?</label>
          </div>
          <div className="filter">
            <input
              type="checkbox"
              id="filter_onlySports"
              name="onlySports"
              checked={filters.onlySports}
              onChange={(e) => updateFilters({ onlySports: e.target.checked })}
            />
            <label htmlFor="onlySports">Only Sports Events?</label>
          </div>
          <div className="filter">
            <input
              type="checkbox"
              id="filter_hideCompleteEvents"
              name="hideCompleteEvents"
              checked={filters.hideCompleteEvents}
              onChange={(e) => updateFilters({ hideCompleteEvents: e.target.checked })}
            />
            <label htmlFor="hideCompleteEvents">Hide Complete Events?</label>
          </div>
          <div className="filter">
            <input
              type="checkbox"
              id="filter_onlyTodayEvents"
              name="onlyTodayEvents"
              checked={filters.onlyTodayEvents}
              onChange={(e) => updateFilters({ onlyTodayEvents: e.target.checked })}
            />
            <label htmlFor="onlyTodayEvents">Only Today's Events?</label>
          </div>
        </details>
      </section>
      <section id="events">
        {eventsArr
          .filter((event) => {
            if (filters.onlySportsChicago && !event.isChicagoEvent) return false;
            if (filters.onlyChicagoSportsTeams && !event.isChicagoTeam) return false;
            if (filters.onlySports && event.category != "Sports") return false;
            if (filters.hideCompleteEvents && event.score?.gameComplete) return false;

            const todayDateLocale = new Date().toLocaleDateString();
            const eventDateLocale = new Date(event.start_date).toLocaleDateString();

            if (filters.onlyTodayEvents && todayDateLocale != eventDateLocale) return false;

            return true;
          })
          .map((event, i) => {
            return (
              <>
                <Event eventData={event} eventIndex={i} />
              </>
            );
          })}
      </section>
      <p>
        &copy;
        <a href="https://piemadd.com/" target="_blank">
          Piero Maddaleni
        </a>{" "}
        {new Date().getFullYear()}
      </p>
      <p>Event Data from Ticketmaster and ESPN</p>
      <p>v0.1.3 Beta</p>
    </>
  );
};

export default App;
