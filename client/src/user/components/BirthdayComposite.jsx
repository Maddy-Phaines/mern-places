import { useMemo } from "react";

const MONTHS = [
  { value: "01", label: "Jan" },
  { value: "02", label: "Feb" },
  { value: "03", label: "Mar" },
  { value: "04", label: "Apr" },
  { value: "05", label: "May" },
  { value: "06", label: "Jun" },
  { value: "07", label: "Jul" },
  { value: "08", label: "Aug" },
  { value: "09", label: "Sep" },
  { value: "10", label: "Oct" },
  { value: "11", label: "Nov" },
  { value: "12", label: "Dec" },
];

function daysInMonth(year, month) {
  // month: "01".."12"
  const y = Number(year || 2000); // default leap-neutral year
  const m = Number(month || 1);
  return new Date(y, m, 0).getDate(); // last day of that month
}

/**
 * Props:
 *  value: { day: "06", month: "10", year: "2007" }
 *  onChange: (next) => void
 *  minYear?: number (default: currentYear - 120)
 *  maxYear?: number (default: currentYear)
 */
const BirthdaySelect = ({
  value,
  onChange,
  minYear,
  maxYear,
  idBase = "dob",
}) => {
  const now = new Date();
  const _maxYear = maxYear ?? now.getFullYear();
  const _minYear = minYear ?? _maxYear - 120;

  const years = useMemo(() => {
    const arr = [];
    for (let y = _maxYear; y >= _minYear; y--) arr.push(String(y));
    return arr;
  }, [_maxYear, _minYear]);

  const maxDay = daysInMonth(value.year, value.month);
  const days = useMemo(() => {
    return Array.from({ length: maxDay }, (_, i) =>
      String(i + 1).padStart(2, "0")
    );
  }, [maxDay]);

  // If current day is now invalid (e.g., switching Feb), clear it
  const safeDay = value.day && Number(value.day) <= maxDay ? value.day : "";

  const set = (k) => (e) => {
    const next = { ...value, [k]: e.target.value };
    // drop day if it exceeds the month length
    if (k !== "day") {
      const newMax = daysInMonth(
        k === "year" ? next.year : value.year,
        k === "month" ? next.month : value.month
      );
      if (Number(next.day) > newMax) next.day = "";
    }
    onChange(next);
  };

  return (
    <fieldset className="dob-fieldset" aria-describedby={`${idBase}-help`}>
      <legend className="dob-legend">Date of birth</legend>

      <div className="dob-row outline">
        <label className="sr-only" htmlFor={`${idBase}-day`}>
          Day
        </label>
        <select
          id={`${idBase}-day`}
          name="bday-day"
          autoComplete="bday-day"
          value={safeDay}
          onChange={set("day")}
          required
          className="dob-select outline px-3"
        >
          <option value="">Day</option>
          {days.map((d) => (
            <option key={d} value={d}>
              {Number(d)}
            </option>
          ))}
        </select>

        <label className="sr-only" htmlFor={`${idBase}-month`}>
          Month
        </label>
        <select
          id={`${idBase}-month`}
          name="bday-month"
          autoComplete="bday-month"
          value={value.month}
          onChange={set("month")}
          required
          className="dob-select"
        >
          <option value="">Mon</option>
          {MONTHS.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>

        <label className="sr-only" htmlFor={`${idBase}-year`}>
          Year
        </label>
        <select
          id={`${idBase}-year`}
          name="bday-year"
          autoComplete="bday-year"
          value={value.year}
          onChange={set("year")}
          required
          className="dob-select"
        >
          <option value="">Year</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
    </fieldset>
  );
};

export default BirthdaySelect;
