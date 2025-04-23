// HoverDetails.tsx
import { CovidData } from "./types";

type HoverDetailsProps = {
  data: CovidData | null;
};

const HoverDetails = ({ data }: HoverDetailsProps) => {
  if (!data) return <p className="hover-placeholder">Hover graph to see data</p>;

  const hosp = data.outcomes?.hospitalized;
  const pcr = data.tests?.pcr;

  const hoverEntries: [string, number | null | undefined][] = [
    ["Total Recovered", data.outcomes?.recovered],
    ["Total PCR Tests", pcr?.total],
    ["Currently Hospitalized", hosp?.currently],
    ["Currently in ICU", hosp?.in_icu?.currently],
    ["Currently on Ventilator", hosp?.on_ventilator?.currently],
  ];

  return (
    <div className="hover-details">
      <h3 className="hover-title">{data.date}</h3>
      <ul className="hover-list">
        {hoverEntries.map(
          ([label, value]) =>
            value != null && <li key={label}>{label}: {value}</li>
        )}
      </ul>
    </div>
  );
};

export default HoverDetails;
