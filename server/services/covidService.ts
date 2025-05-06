export const fetchCovidData = async (state: string) => {
    const response = await fetch(
      `https://api.covidtracking.com/v2/states/${state.toLowerCase()}/daily/simple.json`
    );
  
    const { data } = await response.json();
    const sorted = [...data].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  //test
    return sorted;
  };
  