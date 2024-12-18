import React, { useState } from "react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRangePicker } from "react-date-range";
// import locale from "dayjs/locale/fr";
// import locale from "date-fns/locale/fr-FR";

const DateSlider = ({ onDateChange, onFilterChange }) => {
  const [dateRange, setDateRange] = useState({
    startDate: undefined,
    endDate: undefined,
    key: "selection",
  });

  const handleSelect = (ranges) => {
    setDateRange(ranges.selection);
    onDateChange(ranges.selection.startDate, ranges.selection.endDate);
    onFilterChange(ranges.selection.startDate, ranges.selection.endDate);
  };

  const handleClearFilter = () => {
    setDateRange({
      startDate: undefined,
      endDate: undefined,
      key: "selection",
    });
    onDateChange(null, null);
    onFilterChange(null, null);
  };
  return (
    <>
      <h5>Filtrer les réservations par date</h5>
      <DateRangePicker
        ranges={[dateRange]}
        // locale={locale}
        onChange={handleSelect}
        className="mb-4"
      />
      <button className="btn btn-secondary" onClick={handleClearFilter}>
        Enlever le filtre
      </button>
    </>
  );
};

export default DateSlider;
