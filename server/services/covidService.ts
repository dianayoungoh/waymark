/**
 * fetchCovidData
 *
 * Fetches simplified daily COVID-19 data for a given U.S. state from the public COVID Tracking Project API.
 * The returned dataset is sorted chronologically (oldest to newest) before being returned.
 *
 */
export const fetchCovidData = async (state: string) => {
    const response = await fetch(
      `https://api.covidtracking.com/v2/states/${state.toLowerCase()}/daily/simple.json`
    );
  
    const { data } = await response.json();
    const sorted = [...data].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    return sorted;
  };
  