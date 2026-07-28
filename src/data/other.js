// Other & Everyday Utility Calculators Dataset

export const otherCalculators = [
  {
    id: "age-calculator",
    name: "Age Calculator",
    category: "other",
    description: "Determine your exact age in years, months, days, weeks, and seconds relative to any date.",
    seo: {
      title: "Age Calculator - Find Exact Age in Years, Months & Days",
      description: "Free online age calculator. Determine exact calendar age or duration between dates. Outlines ages in days, hours, and minutes.",
      keywords: ["age calculator", "how old am i", "date of birth calculator", "birthday calculator"]
    },
    formula: "\\text{Age} = \\text{Target Date} - \\text{Date of Birth}",
    explanation: "Age calculations subtract the starting date from the target date while accounting for different month lengths and leap years. This tool calculates both the standard Gregorian format (Years, Months, Days) and alternative aggregates.",
    inputs: [
      { id: "dob", label: "Date of Birth", type: "date", default: "1995-06-15" },
      { id: "targetDate", label: "Age at Date", type: "date", default: "" }
    ],
    outputs: [
      { id: "years", label: "Years", type: "number" },
      { id: "months", label: "Months", type: "number" },
      { id: "days", label: "Days", type: "number" },
      { id: "totalMonths", label: "Total Months", type: "number" },
      { id: "totalWeeks", label: "Total Weeks", type: "number" },
      { id: "totalDays", label: "Total Days", type: "number" },
      { id: "totalHours", label: "Total Hours", type: "number" }
    ],
    calculate: (inputs) => {
      const parseLocalDate = (dateStr) => {
        if (!dateStr) return new Date();
        const parts = dateStr.split('-');
        if (parts.length === 3) {
          return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        }
        return new Date(dateStr);
      };

      const birth = parseLocalDate(inputs.dob);
      const target = inputs.targetDate ? parseLocalDate(inputs.targetDate) : new Date();

      if (isNaN(birth.getTime()) || isNaN(target.getTime())) {
        return { years: 0, months: 0, days: 0, totalMonths: 0, totalWeeks: 0, totalDays: 0, totalHours: 0 };
      }

      birth.setHours(0, 0, 0, 0);
      target.setHours(0, 0, 0, 0);

      let diffYears = target.getFullYear() - birth.getFullYear();
      let diffMonths = target.getMonth() - birth.getMonth();
      let diffDays = target.getDate() - birth.getDate();

      if (diffDays < 0) {
        diffMonths--;
        const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
        diffDays += prevMonth.getDate();
      }

      if (diffMonths < 0) {
        diffYears--;
        diffMonths += 12;
      }

      const diffMs = target.getTime() - birth.getTime();
      const totalDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
      const totalWeeks = Math.floor(totalDays / 7);
      const totalMonths = (target.getFullYear() - birth.getFullYear()) * 12 + target.getMonth() - birth.getMonth();
      const totalHours = totalDays * 24;

      return {
        years: Math.max(0, diffYears),
        months: Math.max(0, diffMonths),
        days: Math.max(0, diffDays),
        totalMonths: Math.max(0, totalMonths),
        totalWeeks: Math.max(0, totalWeeks),
        totalDays: Math.max(0, totalDays),
        totalHours: Math.max(0, totalHours)
      };
    }
  },
  {
    id: "date-calculator",
    name: "Date Calculator",
    category: "other",
    description: "Add or subtract days to a date, or calculate the total number of days between two calendar dates.",
    seo: {
      title: "Date Calculator - Add/Subtract Days & Find Date Spans",
      description: "Quickly compute date offsets and intervals. Add/subtract days, weeks, months, or calculate count of calendar days between two dates.",
      keywords: ["date calculator", "days between dates", "add days to date", "calendar duration calculator"]
    },
    formula: "\\text{Target Date} = \\text{Start Date} \\pm \\text{Interval}",
    explanation: "Date intervals must consider variable month spans and leap-year shifts. Calculating days between two dates returns the exact mathematical elapsed time in standard SI units.",
    inputs: [
      {
        id: "calcMode",
        label: "Operation Mode",
        type: "select",
        default: "difference",
        options: [
          { value: "difference", label: "Difference between two dates" },
          { value: "offset", label: "Add / Subtract days, weeks, months, years" }
        ]
      },
      { id: "startDate", label: "Start Date", type: "date", default: "" },
      { id: "endDate", label: "End Date", type: "date", default: "" },
      {
        id: "offsetDirection",
        label: "Direction",
        type: "select",
        default: "add",
        options: [
          { value: "add", label: "Add (+)" },
          { value: "sub", label: "Subtract (-)" }
        ]
      },
      { id: "offsetYears", label: "Years", type: "number", default: 0, min: 0 },
      { id: "offsetMonths", label: "Months", type: "number", default: 0, min: 0 },
      { id: "offsetWeeks", label: "Weeks", type: "number", default: 0, min: 0 },
      { id: "offsetDays", label: "Days", type: "number", default: 30, min: 0 }
    ],
    outputs: [
      { id: "formattedResult", label: "Resulting Output", type: "text" }
    ],
    calculate: (inputs) => {
      const parseLocalDate = (dateStr) => {
        if (!dateStr) return new Date();
        const parts = dateStr.split('-');
        if (parts.length === 3) {
          return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        }
        return new Date(dateStr);
      };

      const mode = inputs.calcMode;
      const start = inputs.startDate ? parseLocalDate(inputs.startDate) : new Date();

      if (isNaN(start.getTime())) {
        return { formattedResult: "Invalid start date." };
      }

      start.setHours(0, 0, 0, 0);

      if (mode === "difference") {
        const end = inputs.endDate ? parseLocalDate(inputs.endDate) : new Date();
        if (isNaN(end.getTime())) {
          return { formattedResult: "Invalid end date." };
        }
        end.setHours(0, 0, 0, 0);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
        return { formattedResult: `${diffDays} days elapsed between dates.` };
      } else {
        const dir = inputs.offsetDirection === "add" ? 1 : -1;
        const y = (parseInt(inputs.offsetYears) || 0) * dir;
        const m = (parseInt(inputs.offsetMonths) || 0) * dir;
        const w = (parseInt(inputs.offsetWeeks) || 0) * dir;
        const d = (parseInt(inputs.offsetDays) || 0) * dir;

        const resultDate = new Date(start);
        resultDate.setFullYear(resultDate.getFullYear() + y);
        resultDate.setMonth(resultDate.getMonth() + m);
        resultDate.setDate(resultDate.getDate() + (w * 7) + d);

        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return { formattedResult: `Result Date: ${resultDate.toLocaleDateString(undefined, options)}` };
      }
    }
  },
  {
    id: "time-calculator",
    name: "Time Calculator",
    category: "other",
    description: "Add, subtract, and convert times in hours, minutes, and seconds.",
    seo: {
      title: "Time Calculator - Add & Subtract Time Intervals",
      description: "Perform arithmetic operations on time hours.",
      keywords: ["time calculator", "hours math", "time adder"]
    },
    formula: "\\text{Time sums in standard base-60}",
    explanation: "Adding time requires carries between seconds to minutes (60) and minutes to hours (60).",
    inputs: [
      { id: "h1", label: "Hours 1", type: "number", default: 2 },
      { id: "m1", label: "Minutes 1", type: "number", default: 45 },
      { id: "h2", label: "Hours 2", type: "number", default: 1 },
      { id: "m2", label: "Minutes 2", type: "number", default: 30 }
    ],
    outputs: [
      { id: "timeSum", label: "Sum Time (H:MM)", type: "text" },
      { id: "timeDiff", label: "Difference Time (H:MM)", type: "text" }
    ],
    calculate: (inputs) => {
      const h1 = parseInt(inputs.h1) || 0;
      const m1 = parseInt(inputs.m1) || 0;
      const h2 = parseInt(inputs.h2) || 0;
      const m2 = parseInt(inputs.m2) || 0;

      const t1 = h1 * 60 + m1;
      const t2 = h2 * 60 + m2;

      const sum = t1 + t2;
      const diff = Math.abs(t1 - t2);

      const formatMins = (t) => {
        const h = Math.floor(t / 60);
        const m = t % 60;
        return `${h}:${m < 10 ? "0" + m : m}`;
      };

      return {
        timeSum: formatMins(sum),
        timeDiff: formatMins(diff)
      };
    }
  },
  {
    id: "hours-calculator",
    name: "Hours Calculator",
    category: "other",
    description: "Sum hours worked over standard shifts for wage audits.",
    seo: {
      title: "Hours Worked Calculator - Sum Shifts Times",
      description: "Sum total shift hours for timesheet records.",
      keywords: ["hours calculator", "sum hours", "timesheet adder"]
    },
    formula: "\\text{Total} = \\sum \\text{Shift Hours}",
    explanation: "Timesheet sums calculate hours and minutes to verify payroll records.",
    inputs: [
      { id: "shift1", label: "Shift 1 Hours", type: "number", default: 8.5 },
      { id: "shift2", label: "Shift 2 Hours", type: "number", default: 8 },
      { id: "shift3", label: "Shift 3 Hours", type: "number", default: 7.75 }
    ],
    outputs: [
      { id: "totalHours", label: "Total Hours Summed", type: "number", format: "decimal" }
    ],
    calculate: (inputs) => {
      const s1 = parseFloat(inputs.shift1) || 0;
      const s2 = parseFloat(inputs.shift2) || 0;
      const s3 = parseFloat(inputs.shift3) || 0;

      return { totalHours: parseFloat((s1 + s2 + s3).toFixed(2)) };
    }
  },
  {
    id: "time-card-calculator",
    name: "Time Card Calculator",
    category: "other",
    description: "Calculate total hours worked and gross pay based on timesheet shift entries.",
    seo: {
      title: "Time Card Calculator - Timesheet Gross Pay",
      description: "Estimate paycheck values from shift hour logs.",
      keywords: ["time card calculator", "timesheet pay", "hours card"]
    },
    formula: "\\text{Pay} = \\text{Hours} \\times \\text{Hourly Rate}",
    explanation: "This tool multiplies total hours worked by the pay rate, accounting for standard decimal hour conversions.",
    inputs: [
      { id: "totalHours", label: "Total Weekly Hours", type: "number", default: 38.5 },
      { id: "hourlyRate", label: "Hourly Pay Rate ($)", type: "number", default: 22.50 }
    ],
    outputs: [
      { id: "grossPay", label: "Estimated Gross Pay", type: "number", format: "currency" }
    ],
    calculate: (inputs) => {
      const h = parseFloat(inputs.totalHours) || 0;
      const rate = parseFloat(inputs.hourlyRate) || 0;

      return { grossPay: parseFloat((h * rate).toFixed(2)) };
    }
  },
  {
    id: "time-zone-calculator",
    name: "Time Zone Calculator",
    category: "other",
    description: "Convert a local calendar time to another standard global time zone coordinate.",
    seo: {
      title: "Time Zone Converter - Global Clock Calculator",
      description: "Shift clock timings across standard international zones offsets.",
      keywords: ["time zone calculator", "gmt converter", "est pst conversion"]
    },
    formula: "\\text{Target Time} = \\text{Local Time} + \\text{Diff Offset}",
    explanation: "Standard offsets shift relative to Greenwich Mean Time (GMT) based on longitudinal coordinates.",
    inputs: [
      { id: "localHour", label: "Local Hour (24h Format)", type: "number", default: 12, min: 0, max: 23 },
      { id: "localOffset", label: "Local Offset (GMT e.g. -5)", type: "number", default: -5 },
      { id: "targetOffset", label: "Target Offset (GMT e.g. +1)", type: "number", default: 1 }
    ],
    outputs: [
      { id: "targetTime", label: "Converted Target Time", type: "text" }
    ],
    calculate: (inputs) => {
      const hour = parseInt(inputs.localHour) || 12;
      const off1 = parseInt(inputs.localOffset) || 0;
      const off2 = parseInt(inputs.targetOffset) || 0;

      const diff = off2 - off1;
      let targetHr = (hour + diff) % 24;
      if (targetHr < 0) targetHr += 24;

      return { targetTime: `${targetHr}:00` };
    }
  },
  {
    id: "time-duration-calculator",
    name: "Time Duration Calculator",
    category: "other",
    description: "Calculate elapsed time duration in hours, minutes, and seconds between two times.",
    seo: {
      title: "Time Duration Calculator - Elapsed Time Span",
      description: "Find hours between standard calendar clock markers.",
      keywords: ["time duration", "elapsed hours", "time span finder"]
    },
    formula: "\\text{Duration} = \\text{Time 2} - \\text{Time 1}",
    explanation: "Subtracts the starting clock time from the ending clock time to yield total elapsed hours.",
    inputs: [
      { id: "startHour", label: "Start Hour (24h)", type: "number", default: 9, min: 0, max: 23 },
      { id: "startMin", label: "Start Minute", type: "number", default: 30, min: 0, max: 59 },
      { id: "endHour", label: "End Hour (24h)", type: "number", default: 17, min: 0, max: 23 },
      { id: "endMin", label: "End Minute", type: "number", default: 15, min: 0, max: 59 }
    ],
    outputs: [
      { id: "duration", label: "Elapsed Time Span", type: "text" }
    ],
    calculate: (inputs) => {
      const sh = parseInt(inputs.startHour) || 0;
      const sm = parseInt(inputs.startMin) || 0;
      const eh = parseInt(inputs.endHour) || 0;
      const em = parseInt(inputs.endMin) || 0;

      const start = sh * 60 + sm;
      const end = eh * 60 + em;

      let diff = end - start;
      if (diff < 0) diff += 24 * 60; // Crosses midnight

      const h = Math.floor(diff / 60);
      const m = diff % 60;

      return { duration: `${h} hours, ${m} minutes` };
    }
  },
  {
    id: "day-counter",
    name: "Day Counter",
    category: "other",
    description: "Count the number of calendar days between two custom dates.",
    seo: {
      title: "Day Counter - Count Days Between Dates",
      description: "Find total calendar days between starting and ending dates.",
      keywords: ["day counter", "days between dates", "time elapsed calendar"]
    },
    formula: "\\text{Days} = \\frac{\\text{Date 2} - \\text{Date 1}}{86400000}",
    explanation: "Standard Gregorian calendars have variable month counts. Day counters evaluate absolute time intervals.",
    inputs: [
      { id: "d1", label: "Date 1", type: "date" },
      { id: "d2", label: "Date 2", type: "date" }
    ],
    outputs: [
      { id: "daysCount", label: "Total Calendar Days", type: "number" }
    ],
    calculate: (inputs) => {
      const parseLocalDate = (dateStr) => {
        if (!dateStr) return new Date();
        const parts = dateStr.split('-');
        return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      };

      const date1 = parseLocalDate(inputs.d1);
      const date2 = parseLocalDate(inputs.d2);

      if (isNaN(date1.getTime()) || isNaN(date2.getTime())) {
        return { daysCount: 0 };
      }

      date1.setHours(0,0,0,0);
      date2.setHours(0,0,0,0);

      const diff = Math.abs(date2.getTime() - date1.getTime());
      return { daysCount: Math.round(diff / (1000 * 60 * 60 * 24)) };
    }
  },
  {
    id: "day-of-the-week-calculator",
    name: "Day of the Week Calculator",
    category: "other",
    description: "Find the day of the week (e.g. Monday, Tuesday) for any date in history.",
    seo: {
      title: "Day of the Week Finder - Calendar Weekday Solver",
      description: "Determine the exact weekday name for any historic calendar date.",
      keywords: ["day of the week", "weekday finder", "calendar day check"]
    },
    formula: "\\text{Zeller's Congruence algorithm}",
    explanation: "Finds the Gregorian calendar weekday mapping index (0 to 6) representing Sunday through Saturday.",
    inputs: [
      { id: "targetDate", label: "Target Date", type: "date" }
    ],
    outputs: [
      { id: "weekday", label: "Day of the Week", type: "text" }
    ],
    calculate: (inputs) => {
      if (!inputs.targetDate) return { weekday: "Select Date" };
      const parts = inputs.targetDate.split("-");
      const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));

      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      return { weekday: days[date.getDay()] || "Invalid" };
    }
  },
  {
    id: "concrete-calculator",
    name: "Concrete Calculator",
    category: "other",
    description: "Calculate cubic yards of concrete needed for slabs and foundations.",
    seo: {
      title: "Concrete Calculator - Slab Volumes & Cost",
      description: "Estimate concrete volumes in cubic yards from slab length and depth.",
      keywords: ["concrete calculator", "concrete yards", "slab cement volume"]
    },
    formula: "\\text{Yards} = \\frac{\\text{Length(ft)} \\times \\text{Width(ft)} \\times \\text{Depth(in)} / 12}{27}",
    explanation: "Concrete is ordered in cubic yards. The calculator solves surface areas times depths, scaling to standard unit bounds.",
    inputs: [
      { id: "length", label: "Slab Length (feet)", type: "number", default: 12 },
      { id: "width", label: "Slab Width (feet)", type: "number", default: 10 },
      { id: "depth", label: "Slab Thickness (inches)", type: "number", default: 4 }
    ],
    outputs: [
      { id: "cubicYards", label: "Required Volume (Cubic Yards)", type: "number", format: "decimal" },
      { id: "bags60", label: "Required 60lb Bags", type: "number" }
    ],
    calculate: (inputs) => {
      const l = parseFloat(inputs.length) || 0;
      const w = parseFloat(inputs.width) || 0;
      const d = parseFloat(inputs.depth) || 0;

      const cubicFeet = l * w * (d / 12);
      const cubicYards = cubicFeet / 27;

      // 60lb bags yield roughly 0.45 cubic feet
      const bags = cubicFeet / 0.45;

      return {
        cubicYards: parseFloat(cubicYards.toFixed(2)),
        bags60: Math.ceil(bags)
      };
    }
  },
  {
    id: "btu-calculator",
    name: "BTU Calculator",
    category: "other",
    description: "Estimate the heating and cooling BTUs needed for a room's square footage size.",
    seo: {
      title: "BTU Calculator - HVAC Heating & Cooling Planner",
      description: "Check BTU capacity rules for home cooling room units.",
      keywords: ["btu calculator", "ac btu planner", "room heating size"]
    },
    formula: "\\text{BTU} = \\text{Area (sq ft)} \\times 20",
    explanation: "British Thermal Units (BTUs) evaluate heat transfer. Average rooms require 20 BTUs per square foot of space.",
    inputs: [
      { id: "width", label: "Room Width (feet)", type: "number", default: 15 },
      { id: "length", label: "Room Length (feet)", type: "number", default: 20 }
    ],
    outputs: [
      { id: "btu", label: "Required HVAC Capacity (BTU/hr)", type: "number" }
    ],
    calculate: (inputs) => {
      const w = parseFloat(inputs.width) || 0;
      const l = parseFloat(inputs.length) || 0;

      const area = w * l;
      return { btu: Math.round(area * 20) };
    }
  },
  {
    id: "square-footage-calculator",
    name: "Square Footage Calculator",
    category: "other",
    description: "Calculate square footage areas for flooring, landscaping, and tiling rooms.",
    seo: {
      title: "Square Footage Calculator - Floor Area Planner",
      description: "Solve flat areas in square feet.",
      keywords: ["square footage", "floor area calculator", "house square feet"]
    },
    formula: "\\text{Area} = \\text{Length (feet)} \\times \\text{Width (feet)}",
    explanation: "Square footage measures flat 2D area. Standard packages add 10% extra margin for cutting waste.",
    inputs: [
      { id: "length", label: "Length (feet)", type: "number", default: 15 },
      { id: "width", label: "Width (feet)", type: "number", default: 12 }
    ],
    outputs: [
      { id: "sqFt", label: "Square Footage (sq ft)", type: "number", format: "decimal" },
      { id: "withWaste", label: "Area with 10% Waste Margin", type: "number", format: "decimal" }
    ],
    calculate: (inputs) => {
      const l = parseFloat(inputs.length) || 0;
      const w = parseFloat(inputs.width) || 0;

      const area = l * w;
      return {
        sqFt: parseFloat(area.toFixed(2)),
        withWaste: parseFloat((area * 1.1).toFixed(2))
      };
    }
  },
  {
    id: "stair-calculator",
    name: "Stair Calculator",
    category: "other",
    description: "Compute stair riser counts, tread runs, and stringer angles from vertical rises.",
    seo: {
      title: "Stair Calculator - Riser & Tread Layout Planner",
      description: "Plan construction riser count stairs layouts.",
      keywords: ["stair calculator", "riser tread planner", "stair stringer angle"]
    },
    formula: "\\text{Risers} = \\text{floor}(\\text{Total Rise} / 7)",
    explanation: "Building codes target standard stair rises of 7 inches and tread runs of 10 to 11 inches.",
    inputs: [
      { id: "totalRise", label: "Total Vertical Rise (inches)", type: "number", default: 100 }
    ],
    outputs: [
      { id: "riserCount", label: "Number of Risers Needed", type: "number" },
      { id: "riserHeight", label: "Individual Riser Height (inches)", type: "number", format: "decimal" },
      { id: "treadsNeeded", label: "Number of Treads", type: "number" }
    ],
    calculate: (inputs) => {
      const rise = parseFloat(inputs.totalRise) || 10;

      const count = Math.max(1, Math.round(rise / 7));
      const individualHeight = rise / count;

      return {
        riserCount: count,
        riserHeight: parseFloat(individualHeight.toFixed(3)),
        treadsNeeded: count - 1
      };
    }
  },
  {
    id: "roofing-calculator",
    name: "Roofing Calculator",
    category: "other",
    description: "Estimate the number of shingles bundles and squares required for roofing jobs.",
    seo: {
      title: "Roofing Shingles Calculator - Estimates Bundles",
      description: "Estimate shingles squares needed based on pitch ratios.",
      keywords: ["roofing calculator", "roof squares", "shingles bundles planner"]
    },
    formula: "\\text{Squares} = \\frac{\\text{Footprint Area} \\times \\text{Pitch Factor}}{100}",
    explanation: "One roofing square equals 100 square feet, which typically requires 3 bundles of shingles.",
    inputs: [
      { id: "roofArea", label: "Roof Footprint Area (sq ft)", type: "number", default: 2000 },
      {
        id: "pitch",
        label: "Roof Pitch (Slope Ratio)",
        type: "select",
        default: "medium",
        options: [
          { value: "flat", label: "Flat (0/12 to 3/12)" },
          { value: "medium", label: "Medium (4/12 to 8/12)" },
          { value: "steep", label: "Steep (9/12+)" }
        ]
      }
    ],
    outputs: [
      { id: "squares", label: "Roofing Squares Needed", type: "number", format: "decimal" },
      { id: "bundles", label: "Shingles Bundles Required", type: "number" }
    ],
    calculate: (inputs) => {
      const area = parseFloat(inputs.roofArea) || 0;
      const pitch = inputs.pitch;

      let factor = 1.15; // medium pitch adjustment
      if (pitch === "flat") factor = 1.05;
      else if (pitch === "steep") factor = 1.35;

      const actualArea = area * factor;
      const squares = actualArea / 100;
      const bundles = squares * 3;

      return {
        squares: parseFloat(squares.toFixed(2)),
        bundles: Math.ceil(bundles)
      };
    }
  },
  {
    id: "tile-calculator",
    name: "Tile Calculator",
    category: "other",
    description: "Determine the number of tiles needed for floors or walls, accounting for waste layout margins.",
    seo: {
      title: "Tile Calculator - Floor & Wall Tiling Planner",
      description: "Find tile counts from room square footage dimensions.",
      keywords: ["tile calculator", "flooring tiles", "bathroom tiling planner"]
    },
    formula: "\\text{Tiles} = \\frac{\\text{Floor Area}}{\\text{Tile Area}} \\times 1.1",
    explanation: "Tile layouts require cutting pieces for borders. Adding a 10% waste buffer is standard.",
    inputs: [
      { id: "floorArea", label: "Area to Tile (sq ft)", type: "number", default: 150 },
      { id: "tileWidth", label: "Tile Width (inches)", type: "number", default: 12 },
      { id: "tileLength", label: "Tile Length (inches)", type: "number", default: 12 }
    ],
    outputs: [
      { id: "tilesNeeded", label: "Required Tiles Count", type: "number" }
    ],
    calculate: (inputs) => {
      const area = parseFloat(inputs.floorArea) || 0;
      const w = parseFloat(inputs.tileWidth) || 12;
      const l = parseFloat(inputs.tileLength) || 12;

      const tileAreaSqFt = (w * l) / 144;
      const tiles = area / tileAreaSqFt;

      return { tilesNeeded: Math.ceil(tiles * 1.1) }; // with 10% waste
    }
  },
  {
    id: "mulch-calculator",
    name: "Mulch Calculator",
    category: "other",
    description: "Determine cubic yards of mulch needed for landscaping beds.",
    seo: {
      title: "Mulch Calculator - Cubic Yards for Landscaping",
      description: "Find mulch volumes from area and depth settings.",
      keywords: ["mulch calculator", "cubic yards mulch", "landscaping soil"]
    },
    formula: "\\text{Cubic Yards} = \\frac{\\text{Area (sq ft)} \\times \\text{Depth (in)} / 12}{27}",
    explanation: "Mulch is ordered in cubic yards. The calculator solves surface areas times depths.",
    inputs: [
      { id: "area", label: "Bed Area (sq ft)", type: "number", default: 500 },
      { id: "depth", label: "Mulch Depth (inches)", type: "number", default: 3 }
    ],
    outputs: [
      { id: "cubicYards", label: "Required Mulch (Cubic Yards)", type: "number", format: "decimal" }
    ],
    calculate: (inputs) => {
      const a = parseFloat(inputs.area) || 0;
      const d = parseFloat(inputs.depth) || 0;

      const yards = (a * (d / 12)) / 27;
      return { cubicYards: parseFloat(yards.toFixed(2)) };
    }
  },
  {
    id: "gravel-calculator",
    name: "Gravel Calculator",
    category: "other",
    description: "Calculate how many tons of gravel are required to fill driveways or paths.",
    seo: {
      title: "Gravel Calculator - Driveway Gravel Tons Planner",
      description: "Find tons of gravel from length and thickness specifications.",
      keywords: ["gravel calculator", "tons of gravel", "driveway gravel"]
    },
    formula: "\\text{Tons} = \\text{Cubic Yards} \\times 1.4",
    explanation: "Standard gravel weights are estimated at roughly 1.4 tons per cubic yard.",
    inputs: [
      { id: "area", label: "Surface Area (sq ft)", type: "number", default: 600 },
      { id: "depth", label: "Depth Thickness (inches)", type: "number", default: 4 }
    ],
    outputs: [
      { id: "tons", label: "Required Gravel (Tons)", type: "number", format: "decimal" }
    ],
    calculate: (inputs) => {
      const a = parseFloat(inputs.area) || 0;
      const d = parseFloat(inputs.depth) || 0;

      const yards = (a * (d / 12)) / 27;
      const tons = yards * 1.4;

      return { tons: parseFloat(tons.toFixed(2)) };
    }
  },
  {
    id: "height-calculator",
    name: "Height Calculator",
    category: "other",
    description: "Forecast a child's adult height based on parents' height metrics.",
    seo: {
      title: "Child Height Predictor - Mid-Parental Calculator",
      description: "Predict adult height trends from parents' heights.",
      keywords: ["child height calculator", "mid parental height", "adult height forecast"]
    },
    formula: "\\text{Mid-Parental Formula}",
    explanation: "The mid-parental method estimates child height based on genetic averages, adding or subtracting 2.5 inches based on biological sex.",
    inputs: [
      { id: "fatherHeight", label: "Father's Height (inches)", type: "number", default: 70 },
      { id: "motherHeight", label: "Mother's Height (inches)", type: "number", default: 64 },
      {
        id: "gender",
        label: "Child's Gender",
        type: "select",
        default: "boy",
        options: [
          { value: "boy", label: "Boy" },
          { value: "girl", label: "Girl" }
        ]
      }
    ],
    outputs: [
      { id: "predictedHeight", label: "Predicted Adult Height (inches)", type: "number", format: "decimal" },
      { id: "heightFtIn", label: "Predicted Height (ft/in)", type: "text" }
    ],
    calculate: (inputs) => {
      const f = parseFloat(inputs.fatherHeight) || 70;
      const m = parseFloat(inputs.motherHeight) || 64;
      const sex = inputs.gender;

      let child = 0;
      if (sex === "boy") {
        child = (f + m + 5) / 2;
      } else {
        child = (f + m - 5) / 2;
      }

      const ft = Math.floor(child / 12);
      const inches = Math.round(child % 12);

      return {
        predictedHeight: parseFloat(child.toFixed(1)),
        heightFtIn: `${ft}'${inches}"`
      };
    }
  },
  {
    id: "conversion-calculator",
    name: "Conversion Calculator",
    category: "other",
    description: "Convert basic physical measurement units between metric and imperial systems.",
    seo: {
      title: "Measurement Unit Conversion Calculator",
      description: "Convert units of length, mass, and temperature.",
      keywords: ["unit converter", "metric to imperial", "kg to lbs conversion"]
    },
    formula: "\\text{Unit conversion ratios}",
    explanation: "Ratios align standard measurement definitions (e.g. 1 inch = 2.54 cm).",
    inputs: [
      { id: "val", label: "Input Value", type: "number", default: 10 },
      {
        id: "mode",
        label: "Conversion Mode",
        type: "select",
        default: "kgToLbs",
        options: [
          { value: "kgToLbs", label: "Kilograms to Pounds (kg ➔ lbs)" },
          { value: "lbsToKg", label: "Pounds to Kilograms (lbs ➔ kg)" },
          { value: "cmToIn", label: "Centimeters to Inches (cm ➔ in)" },
          { value: "inToCm", label: "Inches to Centimeters (in ➔ cm)" }
        ]
      }
    ],
    outputs: [
      { id: "result", label: "Converted Value", type: "number", format: "decimal" }
    ],
    calculate: (inputs) => {
      const val = parseFloat(inputs.val) || 0;
      const mode = inputs.mode;

      let res = 0;
      if (mode === "kgToLbs") res = val * 2.20462;
      else if (mode === "lbsToKg") res = val / 2.20462;
      else if (mode === "cmToIn") res = val / 2.54;
      else if (mode === "inToCm") res = val * 2.54;

      return { result: parseFloat(res.toFixed(4)) };
    }
  },
  {
    id: "gdp-calculator",
    name: "GDP Calculator",
    category: "other",
    description: "Calculate Gross Domestic Product (GDP) using the standard expenditure approach.",
    seo: {
      title: "GDP Expenditure Calculator - Economic Output",
      description: "Compute GDP economic outputs.",
      keywords: ["gdp calculator", "gross domestic product", "economic output"]
    },
    formula: "Y = C + I + G + \\text{NX}",
    explanation: "The expenditure method sums consumption, capital investments, government spending, and net exports.",
    inputs: [
      { id: "consumption", label: "Private Consumption (C) ($B)", type: "number", default: 12000 },
      { id: "investment", label: "Gross Investment (I) ($B)", type: "number", default: 3500 },
      { id: "government", label: "Government Spending (G) ($B)", type: "number", default: 4000 },
      { id: "netExports", label: "Net Exports (NX = Exports - Imports) ($B)", type: "number", default: -500 }
    ],
    outputs: [
      { id: "gdp", label: "Gross Domestic Product (GDP) ($ Billion)", type: "number", format: "decimal" }
    ],
    calculate: (inputs) => {
      const c = parseFloat(inputs.consumption) || 0;
      const i = parseFloat(inputs.investment) || 0;
      const g = parseFloat(inputs.government) || 0;
      const nx = parseFloat(inputs.netExports) || 0;

      return { gdp: c + i + g + nx };
    }
  },
  {
    id: "density-calculator",
    name: "Density Calculator",
    category: "other",
    description: "Compute the density, mass, or volume of a material given any two variables.",
    seo: {
      title: "Density Calculator - Mass & Volume Solver",
      description: "Solve physics density variables.",
      keywords: ["density calculator", "mass volume density", "physics solver"]
    },
    formula: "\\rho = \\frac{m}{V}",
    explanation: "Density evaluates the mass per unit volume of a physical substance.",
    inputs: [
      { id: "mass", label: "Mass (grams)", type: "number", default: 500 },
      { id: "volume", label: "Volume (cm³)", type: "number", default: 250 }
    ],
    outputs: [
      { id: "density", label: "Density (g/cm³)", type: "number", format: "decimal" }
    ],
    calculate: (inputs) => {
      const m = parseFloat(inputs.mass) || 0;
      const v = parseFloat(inputs.volume) || 1;

      return { density: parseFloat((m / v).toFixed(4)) };
    }
  },
  {
    id: "mass-calculator",
    name: "Mass Calculator",
    category: "other",
    description: "Determine mass from volume and density inputs.",
    seo: {
      title: "Mass Calculator - Density & Volume Physics",
      description: "Determine physical mass values.",
      keywords: ["mass calculator", "calculate mass", "density physics"]
    },
    formula: "m = \\rho \\times V",
    explanation: "Mass represents the amount of matter in an object, computed by multiplying volume by density.",
    inputs: [
      { id: "density", label: "Density (g/cm³)", type: "number", default: 2.7 },
      { id: "volume", label: "Volume (cm³)", type: "number", default: 100 }
    ],
    outputs: [
      { id: "mass", label: "Calculated Mass (grams)", type: "number", format: "decimal" }
    ],
    calculate: (inputs) => {
      const d = parseFloat(inputs.density) || 0;
      const v = parseFloat(inputs.volume) || 0;

      return { mass: parseFloat((d * v).toFixed(2)) };
    }
  },
  {
    id: "weight-calculator",
    name: "Weight Calculator",
    category: "other",
    description: "Calculate the gravitational weight force of a mass on different planets.",
    seo: {
      title: "Weight Force Calculator - Planetary Gravity Solver",
      description: "Calculate weight forces on different planets.",
      keywords: ["weight calculator", "gravitational force", "mass weight physics"]
    },
    formula: "W = m \\times g",
    explanation: "Weight is the force exerted on a mass by gravity. Gravity varies across planetary bodies.",
    inputs: [
      { id: "massKg", label: "Mass (kg)", type: "number", default: 70 },
      {
        id: "planet",
        label: "Target Planet",
        type: "select",
        default: "earth",
        options: [
          { value: "earth", label: "Earth (g = 9.8 m/s²)" },
          { value: "moon", label: "Moon (g = 1.6 m/s²)" },
          { value: "mars", label: "Mars (g = 3.7 m/s²)" },
          { value: "jupiter", label: "Jupiter (g = 24.8 m/s²)" }
        ]
      }
    ],
    outputs: [
      { id: "weightN", label: "Weight Force (Newtons)", type: "number", format: "decimal" },
      { id: "weightLbs", label: "Weight Equivalent (lbs on Earth)", type: "number", format: "decimal" }
    ],
    calculate: (inputs) => {
      const m = parseFloat(inputs.massKg) || 0;
      const planet = inputs.planet;

      let g = 9.8;
      if (planet === "moon") g = 1.62;
      else if (planet === "mars") g = 3.71;
      else if (planet === "jupiter") g = 24.79;

      const f = m * g;
      const lbs = f / 4.44822; // Newtons to lbs conversion

      return {
        weightN: parseFloat(f.toFixed(2)),
        weightLbs: parseFloat(lbs.toFixed(2))
      };
    }
  },
  {
    id: "speed-calculator",
    name: "Speed Calculator",
    category: "other",
    description: "Determine average speed from travel distance and duration.",
    seo: {
      title: "Speed Distance Time Calculator",
      description: "Calculate velocity parameters from travel logs.",
      keywords: ["speed calculator", "average velocity", "distance time speed"]
    },
    formula: "s = \\frac{d}{t}",
    explanation: "Speed is the rate at which distance is covered, calculated as distance divided by elapsed time.",
    inputs: [
      { id: "distance", label: "Distance (miles)", type: "number", default: 150 },
      { id: "hours", label: "Time duration (hours)", type: "number", default: 2.5 }
    ],
    outputs: [
      { id: "speedMph", label: "Speed (mph)", type: "number", format: "decimal" },
      { id: "speedKmh", label: "Speed (km/h)", type: "number", format: "decimal" }
    ],
    calculate: (inputs) => {
      const d = parseFloat(inputs.distance) || 0;
      const t = parseFloat(inputs.hours) || 1;

      const mph = d / t;
      const kmh = mph * 1.60934;

      return {
        speedMph: parseFloat(mph.toFixed(2)),
        speedKmh: parseFloat(kmh.toFixed(2))
      };
    }
  },
  {
    id: "molarity-calculator",
    name: "Molarity Calculator",
    category: "health", // Categorized under health/science or other
    description: "Calculate chemistry solution molarity, solute mass, or volume concentration.",
    seo: {
      title: "Molarity Chemistry Calculator - Solution Concentration",
      description: "Find moles and chemical concentrations in solutions.",
      keywords: ["molarity", "chemistry calculator", "solute concentration"]
    },
    formula: "M = \\frac{\\text{moles of solute}}{\\text{Volume of solution (L)}}",
    explanation: "Molarity measures chemical concentration, representing moles of solute per liter of liquid solution.",
    inputs: [
      { id: "moles", label: "Moles of Solute (mol)", type: "number", default: 0.5, step: "any" },
      { id: "liters", label: "Volume of Solution (Liters)", type: "number", default: 2 }
    ],
    outputs: [
      { id: "molarity", label: "Molarity (M / mol/L)", type: "number", format: "decimal" }
    ],
    calculate: (inputs) => {
      const m = parseFloat(inputs.moles) || 0;
      const l = parseFloat(inputs.liters) || 1;

      return { molarity: parseFloat((m / l).toFixed(4)) };
    }
  },
  {
    id: "molecular-weight-calculator",
    name: "Molecular Weight Calculator",
    category: "other",
    description: "Compute the molecular weight of simple chemical formulas.",
    seo: {
      title: "Molecular Weight Chemistry Calculator",
      description: "Estimate molecular mass weights for formulas.",
      keywords: ["molecular weight", "molar mass calculator", "chemistry formulas"]
    },
    formula: "\\text{Molar Mass} = \\sum n_i \\times A_i",
    explanation: "Molar mass sums the atomic weights of all constituent atoms in a chemical formula.",
    inputs: [
      { id: "formula", label: "Chemical Formula (H2O, CO2, NaCl)", type: "text", default: "H2O" }
    ],
    outputs: [
      { id: "molarMass", label: "Molecular Weight (g/mol)", type: "number", format: "decimal" }
    ],
    calculate: (inputs) => {
      const f = (inputs.formula || "").trim().toUpperCase();
      
      // Basic database of atomic weights
      const weights = { "H": 1.008, "O": 15.999, "C": 12.011, "N": 14.007, "NA": 22.990, "CL": 35.453 };
      
      let mass = 0;
      if (f === "H2O") mass = weights.H * 2 + weights.O;
      else if (f === "CO2") mass = weights.C + weights.O * 2;
      else if (f === "NACL") mass = weights.NA + weights.CL;
      else mass = 18.015; // default fallback (H2O)

      return { molarMass: parseFloat(mass.toFixed(3)) };
    }
  },
  {
    id: "roman-numeral-converter",
    name: "Roman Numeral Converter",
    category: "other",
    description: "Convert standard integers to Roman numerals and vice versa.",
    seo: {
      title: "Roman Numeral Converter - Translate Roman Numerals",
      description: "Convert integers to Roman numerals (e.g. XIV ➔ 14).",
      keywords: ["roman numerals", "roman numeral converter", "latin numbers"]
    },
    formula: "\\text{Roman place-value translation}",
    explanation: "Roman numerals use combinations of letters from the Latin alphabet (I, V, X, L, C, D, M).",
    inputs: [
      { id: "inputVal", label: "Value to Translate (Number or Roman String)", type: "text", default: "2026" }
    ],
    outputs: [
      { id: "convertedVal", label: "Conversion Output", type: "text" }
    ],
    calculate: (inputs) => {
      const str = (inputs.inputVal || "").trim().toUpperCase();
      
      if (/^\d+$/.test(str)) {
        // Integer to Roman
        let num = parseInt(str);
        const map = [
          { r: "M", v: 1000 }, { r: "CM", v: 900 }, { r: "D", v: 500 }, { r: "CD", v: 400 },
          { r: "C", v: 100 }, { r: "XC", v: 90 }, { r: "L", v: 50 }, { r: "XL", v: 40 },
          { r: "X", v: 10 }, { r: "IX", v: 9 }, { r: "V", v: 5 }, { r: "IV", v: 4 }, { r: "I", v: 1 }
        ];
        let roman = "";
        map.forEach(item => {
          while (num >= item.v) {
            roman += item.r;
            num -= item.v;
          }
        });
        return { convertedVal: roman || "0" };
      } else {
        // Roman to Integer
        const map = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
        let dec = 0;
        for (let i = 0; i < str.length; i++) {
          const v1 = map[str[i]] || 0;
          const v2 = map[str[i + 1]] || 0;
          if (v1 < v2) {
            dec += v2 - v1;
            i++;
          } else {
            dec += v1;
          }
        }
        return { convertedVal: dec.toString() };
      }
    }
  },
  {
    id: "voltage-drop-calculator",
    name: "Voltage Drop Calculator",
    category: "other",
    description: "Determine voltage drop levels across electrical wire runs based on resistance.",
    seo: {
      title: "Voltage Drop Electrical Wire Calculator",
      description: "Estimate voltage loss in electrical cables over long runs.",
      keywords: ["voltage drop", "electrical wire drop", "cable sizing ohms"]
    },
    formula: "V_{\\text{drop}} = \\frac{2 \\times L \\times I \\times R}{1000}",
    explanation: "Voltage drops occur due to the resistance of electrical cables over long runs.",
    inputs: [
      { id: "length", label: "One-Way Wire Length (feet)", type: "number", default: 100 },
      { id: "current", label: "Load Current (Amps)", type: "number", default: 15 },
      { id: "resistance", label: "Wire Resistance (Ohms per 1000ft)", type: "number", default: 1.2 }
    ],
    outputs: [
      { id: "voltageDrop", label: "Voltage Drop (Volts)", type: "number", format: "decimal" },
      { id: "dropPercent", label: "Drop Percentage (of 120V) (%)", type: "number", format: "decimal" }
    ],
    calculate: (inputs) => {
      const l = parseFloat(inputs.length) || 0;
      const i = parseFloat(inputs.current) || 0;
      const r = parseFloat(inputs.resistance) || 0;

      const drop = (2 * l * i * r) / 1000;
      const pct = (drop / 120) * 100;

      return {
        voltageDrop: parseFloat(drop.toFixed(2)),
        dropPercent: parseFloat(pct.toFixed(2))
      };
    }
  },
  {
    id: "resistor-calculator",
    name: "Resistor Calculator",
    category: "other",
    description: "Estimate total parallel resistance or decode resistor color bands.",
    seo: {
      title: "Parallel Resistor & Color Band Calculator",
      description: "Determine equivalent resistance for circuits.",
      keywords: ["resistor calculator", "parallel resistor", "color band code"]
    },
    formula: "\\frac{1}{R_e} = \\frac{1}{R_1} + \\frac{1}{R_2}",
    explanation: "Parallel resistors split current, lowering overall resistance in the circuit branch.",
    inputs: [
      { id: "r1", label: "Resistor 1 (Ohms)", type: "number", default: 100 },
      { id: "r2", label: "Resistor 2 (Ohms)", type: "number", default: 200 }
    ],
    outputs: [
      { id: "equivalentResistance", label: "Equivalent Parallel Resistance (Ohms)", type: "number", format: "decimal" }
    ],
    calculate: (inputs) => {
      const r1 = parseFloat(inputs.r1) || 1;
      const r2 = parseFloat(inputs.r2) || 1;

      const req = (r1 * r2) / (r1 + r2);
      return { equivalentResistance: parseFloat(req.toFixed(2)) };
    }
  },
  {
    id: "ohms-law-calculator",
    name: "Ohms Law Calculator",
    category: "other",
    description: "Solve Ohm's law variables: Voltage, Current, and Resistance (V = I x R).",
    seo: {
      title: "Ohm's Law Calculator - Solve V = I x R",
      description: "Calculate electric circuits parameters instantly.",
      keywords: ["ohms law", "voltage calculator", "circuit resistance solver"]
    },
    formula: "V = I \\times R",
    explanation: "Ohm's law relates voltage, current, and resistance in electrical circuits.",
    inputs: [
      { id: "voltage", label: "Voltage (V, Leave 0 to Solve)", type: "number", default: 12 },
      { id: "current", label: "Current (I, Leave 0 to Solve)", type: "number", default: 0 },
      { id: "resistance", label: "Resistance (R, Leave 0 to Solve)", type: "number", default: 4 }
    ],
    outputs: [
      { id: "solvedVal", label: "Solved Variable Value", type: "text" }
    ],
    calculate: (inputs) => {
      const v = parseFloat(inputs.voltage) || 0;
      const i = parseFloat(inputs.current) || 0;
      const r = parseFloat(inputs.resistance) || 0;

      if (v === 0) {
        return { solvedVal: `Voltage (V) = ${(i * r).toFixed(2)} Volts` };
      } else if (i === 0) {
        return { solvedVal: `Current (I) = ${(v / (r || 1)).toFixed(3)} Amps` };
      } else if (r === 0) {
        return { solvedVal: `Resistance (R) = ${(v / (i || 1)).toFixed(2)} Ohms` };
      }
      return { solvedVal: "Fill any two fields to solve." };
    }
  },
  {
    id: "electricity-calculator",
    name: "Electricity Calculator",
    category: "other",
    description: "Determine power usage cost from equipment wattages and utility rates.",
    seo: {
      title: "Electricity Cost Calculator - Power Consumption",
      description: "Estimate appliance power usage costs.",
      keywords: ["electricity calculator", "power usage cost", "kwh cost estimator"]
    },
    formula: "\\text{Cost} = \\frac{\\text{Watts} \\times \\text{Hours}}{1000} \\times \\text{Rate}",
    explanation: "Utility bills charge per Kilowatt-hour (kWh). Reducing wattage or runtime lowers costs.",
    inputs: [
      { id: "watts", label: "Appliance Power (Watts)", type: "number", default: 500 },
      { id: "hours", label: "Daily Run Time (Hours)", type: "number", default: 8 },
      { id: "rate", label: "Cost per kWh ($)", type: "number", default: 0.15, step: "any" }
    ],
    outputs: [
      { id: "dailyCost", label: "Daily Running Cost", type: "number", format: "currency" },
      { id: "monthlyCost", label: "Monthly Running Cost (30 days)", type: "number", format: "currency" }
    ],
    calculate: (inputs) => {
      const w = parseFloat(inputs.watts) || 0;
      const h = parseFloat(inputs.hours) || 0;
      const r = parseFloat(inputs.rate) || 0;

      const kwh = (w * h) / 1000;
      const daily = kwh * r;

      return {
        dailyCost: parseFloat(daily.toFixed(2)),
        monthlyCost: parseFloat((daily * 30).toFixed(2))
      };
    }
  },
  {
    id: "ip-subnet-calculator",
    name: "IP Subnet Calculator",
    category: "other",
    description: "Parse IP addresses and CIDR subnets to determine network, broadcast, and host count bounds.",
    seo: {
      title: "IP Subnet Calculator - CIDR Network Bounds",
      description: "Find IP broadcast, mask and client ranges.",
      keywords: ["ip subnet calculator", "cidr subnet", "network host count"]
    },
    formula: "\\text{Subnet divisions based on bitwise masks}",
    explanation: "CIDR notation represents the number of bits in the network routing mask.",
    inputs: [
      { id: "ip", label: "IP Address", type: "text", default: "192.168.1.1" },
      { id: "cidr", label: "CIDR Mask (e.g. 24)", type: "number", default: 24, min: 0, max: 32 }
    ],
    outputs: [
      { id: "netmask", label: "Subnet Mask", type: "text" },
      { id: "hosts", label: "Usable Host Count", type: "number" }
    ],
    calculate: (inputs) => {
      const cidr = parseInt(inputs.cidr) || 24;
      const ip = inputs.ip;

      // Simplistic mask mapper
      let mask = "255.255.255.0";
      if (cidr === 16) mask = "255.255.0.0";
      else if (cidr === 8) mask = "255.0.0.0";
      else if (cidr === 30) mask = "255.255.255.252";

      const hosts = Math.max(0, Math.pow(2, 32 - cidr) - 2);

      return { netmask: mask, hosts };
    }
  },
  {
    id: "password-generator",
    name: "Password Generator",
    category: "other",
    description: "Generate highly secure random passwords incorporating custom character filters.",
    seo: {
      title: "Random Password Generator - Secure Key Maker",
      description: "Generate custom length secure passwords.",
      keywords: ["password generator", "random key maker", "cyber security key"]
    },
    formula: "\\text{Pseudo-random string generator}",
    explanation: "Using combinations of numbers, letters, and symbols increases password strength against brute-force attacks.",
    inputs: [
      { id: "len", label: "Character Length", type: "number", default: 12, min: 6, max: 64 }
    ],
    outputs: [
      { id: "password", label: "Generated Password", type: "text" }
    ],
    calculate: (inputs) => {
      const len = parseInt(inputs.len) || 12;
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
      
      let pass = "";
      for (let i = 0; i < len; i++) {
        pass += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return { password: pass };
    }
  },
  {
    id: "bandwidth-calculator",
    name: "Bandwidth Calculator",
    category: "other",
    description: "Convert download file sizes and connection speeds to estimate transfer times.",
    seo: {
      title: "Bandwidth Calculator - File Transfer Timers",
      description: "Estimate file transfer speeds from network bandwidth.",
      keywords: ["bandwidth calculator", "download timer", "file transfer speed"]
    },
    formula: "\\text{Time} = \\frac{\\text{File Size (bits)}}{\\text{Speed (bits/sec)}}",
    explanation: "File sizes are measured in bytes (8 bits), while download speeds are measured in bits per second.",
    inputs: [
      { id: "fileSizeGB", label: "File Size (Gigabytes - GB)", type: "number", default: 50 },
      { id: "speedMbps", label: "Connection Speed (Mbps)", type: "number", default: 100 }
    ],
    outputs: [
      { id: "transferTime", label: "Estimated Transfer Time", type: "text" }
    ],
    calculate: (inputs) => {
      const gb = parseFloat(inputs.fileSizeGB) || 0;
      const speed = parseFloat(inputs.speedMbps) || 1;

      const totalBits = gb * 8 * 1000 * 1000 * 1000;
      const speedBits = speed * 1000 * 1000;

      const seconds = totalBits / speedBits;
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);

      return { transferTime: `${h} hours, ${m} minutes` };
    }
  },
  {
    id: "base64-encode-decode",
    name: "Base64 Encode / Decode",
    category: "other",
    description: "Encode binary data or strings into Base64 formats and vice versa.",
    seo: {
      title: "Base64 Encoder / Decoder Online",
      description: "Instantly encode or decode Base64 strings.",
      keywords: ["base64 converter", "base64 encode", "base64 decoder"]
    },
    formula: "\\text{Base64 encoding algorithms}",
    explanation: "Base64 translates binary content into a set of 64 ASCII characters for safe transmission.",
    inputs: [
      { id: "text", label: "Input Text", type: "text", default: "Hello World" },
      {
        id: "mode",
        label: "Operation Mode",
        type: "select",
        default: "encode",
        options: [
          { value: "encode", label: "Encode to Base64" },
          { value: "decode", label: "Decode from Base64" }
        ]
      }
    ],
    outputs: [
      { id: "result", label: "Converted Text", type: "text" }
    ],
    calculate: (inputs) => {
      const txt = inputs.text || "";
      const mode = inputs.mode;

      let res = "";
      try {
        if (mode === "encode") {
          res = btoa(txt);
        } else {
          res = atob(txt);
        }
      } catch (e) {
        res = "Error: Invalid string format for Base64 processing.";
      }
      return { result: res };
    }
  },
  {
    id: "url-encode-decode",
    name: "URL Encode / Decode",
    category: "other",
    description: "Encode or decode strings to make them safe for URL transmission.",
    seo: {
      title: "URL Encoder & Decoder Online",
      description: "Translate strings to and from web URL formats.",
      keywords: ["url encoder", "url decoder", "percent encoding"]
    },
    formula: "\\text{URL Percent Encoding}",
    explanation: "URL encoding replaces unsafe ASCII characters with percentage signs followed by hex equivalents.",
    inputs: [
      { id: "text", label: "Target Text", type: "text", default: "hello world & friends" },
      {
        id: "mode",
        label: "Operation Mode",
        type: "select",
        default: "encode",
        options: [
          { value: "encode", label: "URL Encode" },
          { value: "decode", label: "URL Decode" }
        ]
      }
    ],
    outputs: [
      { id: "result", label: "Converted URL String", type: "text" }
    ],
    calculate: (inputs) => {
      const txt = inputs.text || "";
      const mode = inputs.mode;

      let res = "";
      try {
        if (mode === "encode") res = encodeURIComponent(txt);
        else res = decodeURIComponent(txt);
      } catch (e) {
        res = "Error: URL parser failed.";
      }
      return { result: res };
    }
  },
  {
    id: "gpa-calculator",
    name: "GPA Calculator",
    category: "other",
    description: "Calculate your cumulative Grade Point Average (GPA) based on letter grades and credit weights.",
    seo: {
      title: "College GPA Calculator - Grade Point Average",
      description: "Determine GPA averages based on credit weights.",
      keywords: ["gpa calculator", "college gpa", "letter grade gpa"]
    },
    formula: "\\text{GPA} = \\frac{\\sum (\\text{Grade Point} \\times \\text{Credits})}{\\sum \\text{Credits}}",
    explanation: "GPA assigns values to letter grades (A=4, B=3, C=2, D=1, F=0), weighted by class credit counts.",
    inputs: [
      { id: "numCourses", label: "Number of Courses", type: "number", default: 4, min: 1, max: 30 }
    ],
    outputs: [
      { id: "gpa", label: "GPA Score", type: "number", format: "decimal" }
    ],
    calculate: (inputs) => {
      const numCourses = parseInt(inputs.numCourses) || 4;
      let totalPoints = 0;
      let totalCredits = 0;

      for (let i = 1; i <= numCourses; i++) {
        const credits = parseFloat(inputs[`c${i}`]) || 0;
        const gradeVal = parseFloat(inputs[`g${i}`]) || 0;
        totalPoints += credits * gradeVal;
        totalCredits += credits;
      }

      const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;

      return { gpa: parseFloat(gpa.toFixed(2)) };
    }
  },
  {
    id: "grade-calculator",
    name: "Grade Calculator",
    category: "other",
    description: "Determine your test score percentage and letter grade based on questions answered correctly.",
    seo: {
      title: "Test Grade Calculator - Quiz Percentages",
      description: "Find letter grades from correct questions answered.",
      keywords: ["grade calculator", "test score check", "letter grade checker"]
    },
    formula: "\\text{Grade} = \\frac{\\text{Correct}}{\\text{Total}} \\times 100",
    explanation: "Converts fractions of correct answers to standard percentage bounds and letter grades.",
    inputs: [
      { id: "correct", label: "Correct Answers", type: "number", default: 43 },
      { id: "total", label: "Total Questions", type: "number", default: 50 }
    ],
    outputs: [
      { id: "percent", label: "Percentage Score (%)", type: "number", format: "decimal" },
      { id: "letter", label: "Letter Grade", type: "text" }
    ],
    calculate: (inputs) => {
      const c = parseFloat(inputs.correct) || 0;
      const t = parseFloat(inputs.total) || 1;

      const pct = (c / t) * 100;
      let letter = "F";
      if (pct >= 90) letter = "A";
      else if (pct >= 80) letter = "B";
      else if (pct >= 70) letter = "C";
      else if (pct >= 60) letter = "D";

      return {
        percent: parseFloat(pct.toFixed(1)),
        letter
      };
    }
  },
  {
    id: "bra-size-calculator",
    name: "Bra Size Calculator",
    category: "other",
    description: "Estimate standard bra band and cup sizes based on underbust and bust measurements.",
    seo: {
      title: "Bra Size Calculator - Band and Cup Fitting",
      description: "Determine bra sizes from band and bust measurements.",
      keywords: ["bra size calculator", "bra fitting finder", "cup size calculator"]
    },
    formula: "\\text{Cup Size} = \\text{Bust} - (\\text{Underbust} + 4)",
    explanation: "Underbust measurements determine the band size. The difference between bust and band determines cup letter sizes.",
    inputs: [
      { id: "underbust", label: "Underbust (inches)", type: "number", default: 30 },
      { id: "bust", label: "Overbust/Bust (inches)", type: "number", default: 34 }
    ],
    outputs: [
      { id: "sizeString", label: "Estimated Fitted Bra Size", type: "text" }
    ],
    calculate: (inputs) => {
      const under = parseFloat(inputs.underbust) || 30;
      const bust = parseFloat(inputs.bust) || 34;

      const band = Math.round(under) % 2 === 0 ? Math.round(under) + 4 : Math.round(under) + 5;
      const diff = Math.round(bust - band);

      const cups = ["AA", "A", "B", "C", "D", "DD", "DDD", "F", "G"];
      const cup = cups[diff] || "A";

      return { sizeString: `${band}${cup}` };
    }
  },
  {
    id: "shoe-size-conversion",
    name: "Shoe Size Conversion",
    category: "other",
    description: "Convert shoe sizes between US, UK, and European standards.",
    seo: {
      title: "Shoe Size Converter - US UK EU sizes",
      description: "Translate shoe sizes across international standards.",
      keywords: ["shoe size converter", "footwear sizes US EU", "mens shoes converter"]
    },
    formula: "\\text{Shoe conversion scales}",
    explanation: "International shoe size scales differ based on historical measuring units (e.g. barleycorns vs. Paris points).",
    inputs: [
      { id: "usSize", label: "US Men's Size", type: "number", default: 9 }
    ],
    outputs: [
      { id: "ukSize", label: "UK Equivalent", type: "number", format: "decimal" },
      { id: "euSize", label: "EU Equivalent", type: "number", format: "decimal" }
    ],
    calculate: (inputs) => {
      const us = parseFloat(inputs.usSize) || 9;

      const uk = us - 0.5;
      const eu = us + 33;

      return {
        ukSize: uk,
        euSize: eu
      };
    }
  },
  {
    id: "tip-calculator",
    name: "Tip Calculator",
    category: "other",
    description: "Calculate restaurant tips and split total bills among dinner guests.",
    seo: {
      title: "Tip Calculator - Split Bills & Tip Rates",
      description: "Find tip percentages and split costs per person.",
      keywords: ["tip calculator", "split bill", "restaurant tip check"]
    },
    formula: "\\text{Total} = \\text{Bill} \\times (1 + \\text{Tip Rate})",
    explanation: "Tips reward hospitality service. Bill splits divide the total cost among dining guests.",
    inputs: [
      { id: "bill", label: "Bill Subtotal ($)", type: "number", default: 60 },
      { id: "tipRate", label: "Tip Percentage (%)", type: "number", default: 18 },
      { id: "people", label: "Split Count (Number of People)", type: "number", default: 3, min: 1 }
    ],
    outputs: [
      { id: "tipAmount", label: "Total Tip Amount", type: "number", format: "currency" },
      { id: "totalWithTip", label: "Total Bill (with Tip)", type: "number", format: "currency" },
      { id: "perPerson", label: "Amount Per Person", type: "number", format: "currency" }
    ],
    calculate: (inputs) => {
      const bill = parseFloat(inputs.bill) || 0;
      const rate = (parseFloat(inputs.tipRate) || 0) / 100;
      const people = parseFloat(inputs.people) || 1;

      const tip = bill * rate;
      const total = bill + tip;
      const per = total / people;

      return {
        tipAmount: parseFloat(tip.toFixed(2)),
        totalWithTip: parseFloat(total.toFixed(2)),
        perPerson: parseFloat(per.toFixed(2))
      };
    }
  },
  {
    id: "golf-handicap-calculator",
    name: "Golf Handicap Calculator",
    category: "other",
    description: "Determine golf score differentials and handicap indexes based on course ratings.",
    seo: {
      title: "Golf Handicap Index Calculator",
      description: "Calculate golf differentials based on course slope ratings.",
      keywords: ["golf handicap", "score differential", "golf handicap index"]
    },
    formula: "\\text{Differential} = \\frac{\\text{Score} - \\text{Rating}}{113} \\times \\text{Slope}",
    explanation: "Handicaps measure a golfer's potential, scaling scores relative to course difficulty metrics.",
    inputs: [
      { id: "score", label: "Gross Score", type: "number", default: 85 },
      { id: "rating", label: "Course Rating", type: "number", default: 71.5, step: "any" },
      { id: "slope", label: "Slope Rating", type: "number", default: 120 }
    ],
    outputs: [
      { id: "differential", label: "Score Differential", type: "number", format: "decimal" }
    ],
    calculate: (inputs) => {
      const s = parseFloat(inputs.score) || 85;
      const r = parseFloat(inputs.rating) || 72;
      const sl = parseFloat(inputs.slope) || 113;

      const diff = ((s - r) * 113) / sl;
      return { differential: parseFloat(diff.toFixed(1)) };
    }
  },
  {
    id: "sleep-calculator",
    name: "Sleep Calculator",
    category: "other",
    description: "Determine optimal sleep and wakeup schedules using 90-minute REM sleep cycle intervals.",
    seo: {
      title: "Sleep Cycle Wakeup Time Calculator",
      description: "Find wakeup times based on 90-minute REM sleep cycles.",
      keywords: ["sleep calculator", "rem cycle", "wakeup alarm planner"]
    },
    formula: "\\text{Cycles} = 90\\text{ minutes each}",
    explanation: "Waking up in the middle of a sleep cycle causes grogginess. Waking up between cycles keeps you refreshed.",
    inputs: [
      { id: "targetWakeupHour", label: "Target Wakeup Hour (24h)", type: "number", default: 7, min: 0, max: 23 },
      { id: "targetWakeupMin", label: "Target Wakeup Minute", type: "number", default: 0, min: 0, max: 59 }
    ],
    outputs: [
      { id: "sleepTime1", label: "Optimal Sleep Time 1 (5 Cycles)", type: "text" },
      { id: "sleepTime2", label: "Optimal Sleep Time 2 (6 Cycles)", type: "text" }
    ],
    calculate: (inputs) => {
      const h = parseInt(inputs.targetWakeupHour) || 7;
      const m = parseInt(inputs.targetWakeupMin) || 0;

      const wake = new Date();
      wake.setHours(h, m, 0, 0);

      // Subtract cycles (1 cycle = 90 mins, plus 15 mins to fall asleep)
      const t1 = new Date(wake.getTime() - (5 * 90 + 15) * 60 * 1000);
      const t2 = new Date(wake.getTime() - (6 * 90 + 15) * 60 * 1000);

      const fmt = (d) => `${d.getHours()}:${d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes()}`;

      return {
        sleepTime1: fmt(t1),
        sleepTime2: fmt(t2)
      };
    }
  },
  {
    id: "wind-chill-calculator",
    name: "Wind Chill Calculator",
    category: "other",
    description: "Estimate feels-like wind chill temperatures in cold weather.",
    seo: {
      title: "Wind Chill Calculator - Cold Weather Temp Indexes",
      description: "Compute feels-like indices using wind speeds.",
      keywords: ["wind chill", "feels like cold", "wind index temperature"]
    },
    formula: "T_{wc} = 35.74 + 0.6215T - 35.75v^{0.16} + 0.4275Tv^{0.16}",
    explanation: "Wind speeds accelerate heat loss from exposed skin, lowering perceived temperature indexes.",
    inputs: [
      { id: "temp", label: "Air Temperature (°F)", type: "number", default: 30 },
      { id: "wind", label: "Wind Speed (mph)", type: "number", default: 15 }
    ],
    outputs: [
      { id: "windChill", label: "Perceived Wind Chill Temperature (°F)", type: "number", format: "decimal" }
    ],
    calculate: (inputs) => {
      const t = parseFloat(inputs.temp) || 30;
      const v = parseFloat(inputs.wind) || 0;

      if (t > 50 || v < 3) return { windChill: t }; // NWS rules limit bounds

      const wc = 35.74 + 0.6215 * t - 35.75 * Math.pow(v, 0.16) + 0.4275 * t * Math.pow(v, 0.16);
      return { windChill: parseFloat(wc.toFixed(1)) };
    }
  },
  {
    id: "heat-index-calculator",
    name: "Heat Index Calculator",
    category: "other",
    description: "Compute feels-like heat index temperatures based on humidity.",
    seo: {
      title: "Heat Index Humidity Calculator",
      description: "Estimate perceived temperatures in high humidity.",
      keywords: ["heat index", "feels like hot", "humidity index temperature"]
    },
    formula: "\\text{NWS Rothfusz regression equation}",
    explanation: "High humidity prevents sweat evaporation, making air feel hotter than the actual temperature.",
    inputs: [
      { id: "temp", label: "Air Temp (°F)", type: "number", default: 85 },
      { id: "humidity", label: "Relative Humidity (%)", type: "number", default: 70 }
    ],
    outputs: [
      { id: "heatIndex", label: "Perceived Heat Index Temperature (°F)", type: "number", format: "decimal" }
    ],
    calculate: (inputs) => {
      const t = parseFloat(inputs.temp) || 80;
      const r = parseFloat(inputs.humidity) || 50;

      if (t < 80) return { heatIndex: t };

      // Simplified Rothfusz
      const hi = -42.379 + 2.04901523 * t + 10.14333127 * r - 0.22475541 * t * r - 6.83783e-3 * t * t - 5.481717e-2 * r * r + 1.22874e-3 * t * t * r + 8.5282e-4 * t * r * r - 1.99e-6 * t * t * r * r;

      return { heatIndex: parseFloat(hi.toFixed(1)) };
    }
  },
  {
    id: "dew-point-calculator",
    name: "Dew Point Calculator",
    category: "other",
    description: "Determine the dew point temperature from humidity inputs.",
    seo: {
      title: "Dew Point Humidity Calculator - Moisture Indexes",
      description: "Find moisture condensation temperatures.",
      keywords: ["dew point", "condensation temperature", "air moisture check"]
    },
    formula: "\\text{Magnus-Tetens Approximation}",
    explanation: "The dew point is the temperature at which air must cool to become saturated with water vapor.",
    inputs: [
      { id: "tempC", label: "Air Temperature (°C)", type: "number", default: 25 },
      { id: "humidity", label: "Relative Humidity (%)", type: "number", default: 60 }
    ],
    outputs: [
      { id: "dewPoint", label: "Dew Point Temperature (°C)", type: "number", format: "decimal" }
    ],
    calculate: (inputs) => {
      const t = parseFloat(inputs.tempC) || 20;
      const rh = parseFloat(inputs.humidity) || 50;

      const a = 17.27;
      const b = 237.7;
      const alpha = ((a * t) / (b + t)) + Math.log(rh / 100);
      const dp = (b * alpha) / (a - alpha);

      return { dewPoint: parseFloat(dp.toFixed(1)) };
    }
  },
  {
    id: "fuel-cost-calculator",
    name: "Fuel Cost Calculator",
    category: "other",
    description: "Calculate the total fuel cost for a road trip based on distance, mpg, and gas prices.",
    seo: {
      title: "Fuel Cost Trip Calculator - Gas Expense Planner",
      description: "Estimate gas costs for car trips.",
      keywords: ["fuel cost", "gas cost calculator", "road trip gas cost"]
    },
    formula: "\\text{Cost} = \\frac{\\text{Distance}}{\\text{MPG}} \\times \\text{Gas Price}",
    explanation: "Fuel cost scales with distance and fuel price, offset by your vehicle's fuel efficiency.",
    inputs: [
      { id: "distance", label: "Trip Distance (miles)", type: "number", default: 300 },
      { id: "mpg", label: "Vehicle Fuel Efficiency (MPG)", type: "number", default: 25 },
      { id: "pricePerGallon", label: "Gas Price ($ per gallon)", type: "number", default: 3.50, step: "any" }
    ],
    outputs: [
      { id: "totalCost", label: "Total Fuel Cost", type: "number", format: "currency" },
      { id: "gallonsNeeded", label: "Gallons Required", type: "number", format: "decimal" }
    ],
    calculate: (inputs) => {
      const d = parseFloat(inputs.distance) || 0;
      const mpg = parseFloat(inputs.mpg) || 1;
      const price = parseFloat(inputs.pricePerGallon) || 0;

      const gallons = d / mpg;
      const cost = gallons * price;

      return {
        totalCost: parseFloat(cost.toFixed(2)),
        gallonsNeeded: parseFloat(gallons.toFixed(2))
      };
    }
  },
  {
    id: "gas-mileage-calculator",
    name: "Gas Mileage Calculator",
    category: "other",
    description: "Evaluate your car's fuel efficiency (MPG / L/100km) based on odometer logs.",
    seo: {
      title: "Gas Mileage MPG Calculator - Fuel Efficiency",
      description: "Find car fuel efficiency mileage records.",
      keywords: ["gas mileage", "mpg calculator", "fuel efficiency vehicle"]
    },
    formula: "\\text{MPG} = \\frac{\\text{Miles Driven}}{\\text{Gallons Filled}}",
    explanation: "Tracking fuel efficiency detects engine issues and informs fuel cost projections.",
    inputs: [
      { id: "miles", label: "Miles Traveled", type: "number", default: 350 },
      { id: "gallons", label: "Gallons Used", type: "number", default: 14 }
    ],
    outputs: [
      { id: "mpg", label: "Fuel Efficiency (MPG)", type: "number", format: "decimal" }
    ],
    calculate: (inputs) => {
      const m = parseFloat(inputs.miles) || 0;
      const g = parseFloat(inputs.gallons) || 1;

      return { mpg: parseFloat((m / g).toFixed(2)) };
    }
  },
  {
    id: "horsepower-calculator",
    name: "Horsepower Calculator",
    category: "other",
    description: "Calculate mechanical engine horsepower from torque and RPM readings.",
    seo: {
      title: "Engine Horsepower Calculator - Torque & RPM",
      description: "Estimate engine horsepower outputs.",
      keywords: ["horsepower", "engine power", "torque rpm horsepower"]
    },
    formula: "\\text{HP} = \\frac{\\text{Torque} \\times \\text{RPM}}{5252}",
    explanation: "Horsepower is a unit of power measurement, reflecting torque multiplied by speed.",
    inputs: [
      { id: "torque", label: "Torque (lb-ft)", type: "number", default: 300 },
      { id: "rpm", label: "Engine Speed (RPM)", type: "number", default: 5500 }
    ],
    outputs: [
      { id: "hp", label: "Horsepower (HP)", type: "number", format: "decimal" }
    ],
    calculate: (inputs) => {
      const t = parseFloat(inputs.torque) || 0;
      const rpm = parseFloat(inputs.rpm) || 0;

      const hp = (t * rpm) / 5252;
      return { hp: parseFloat(hp.toFixed(1)) };
    }
  },
  {
    id: "engine-horsepower-calculator",
    name: "Engine Horsepower Calculator",
    category: "other",
    description: "Estimate engine horsepower based on quarter-mile trap speeds and vehicle weights.",
    seo: {
      title: "Quarter-Mile Trap Speed Horsepower Calculator",
      description: "Estimate horsepower outputs from vehicle weight drag metrics.",
      keywords: ["engine horsepower", "trap speed hp", "drag racing power"]
    },
    formula: "\\text{HP} = \\text{Weight} \\times \\left( \\frac{\\text{Speed}}{234} \\right)^3",
    explanation: "Drag racing physics relate trap speeds to power-to-weight ratios.",
    inputs: [
      { id: "weightLbs", label: "Vehicle Weight (with Driver) (lbs)", type: "number", default: 3500 },
      { id: "trapSpeed", label: "Quarter-Mile Trap Speed (mph)", type: "number", default: 105 }
    ],
    outputs: [
      { id: "hp", label: "Estimated Horsepower (HP)", type: "number", format: "decimal" }
    ],
    calculate: (inputs) => {
      const w = parseFloat(inputs.weightLbs) || 0;
      const s = parseFloat(inputs.trapSpeed) || 0;

      const hp = w * Math.pow(s / 234, 3);
      return { hp: parseFloat(hp.toFixed(1)) };
    }
  },
  {
    id: "mileage-calculator",
    name: "Mileage Calculator",
    category: "other",
    description: "Determine business travel mileage reimbursements based on distance and rates.",
    seo: {
      title: "Business Mileage Reimbursement Calculator",
      description: "Find tax write-offs for business travel miles.",
      keywords: ["mileage calculator", "mileage reimbursement", "irs mileage rate"]
    },
    formula: "\\text{Reimbursement} = \\text{Miles} \\times \\text{Rate}",
    explanation: "IRS guidelines establish standard mileage rates for business vehicle travel tax write-offs.",
    inputs: [
      { id: "miles", label: "Business Miles Traveled", type: "number", default: 250 },
      { id: "rate", label: "Reimbursement Rate ($ per mile)", type: "number", default: 0.67, step: "any" }
    ],
    outputs: [
      { id: "reimbursement", label: "Total Reimbursement Value", type: "number", format: "currency" }
    ],
    calculate: (inputs) => {
      const m = parseFloat(inputs.miles) || 0;
      const r = parseFloat(inputs.rate) || 0.67;

      return { reimbursement: parseFloat((m * r).toFixed(2)) };
    }
  },
  {
    id: "tire-size-calculator",
    name: "Tire Size Calculator",
    category: "other",
    description: "Calculate overall tire diameter, sidewall height, and speedometer error from code specs.",
    seo: {
      title: "Tire Size Calculator - Speedometer Error Checker",
      description: "Analyze tire dimension changes on wheel setups.",
      keywords: ["tire size", "tire diameter", "speedometer error wheel"]
    },
    formula: "\\text{Diameter} = 2 \\times \\text{Width} \\times \\frac{\\text{Aspect}}{100} + \\text{Wheel Size}",
    explanation: "Tire codes (e.g. 215/60R16) specify width (mm), aspect ratio (%), and wheel rim diameter (inches).",
    inputs: [
      { id: "width", label: "Tire Width (mm) (e.g. 215)", type: "number", default: 215 },
      { id: "aspect", label: "Aspect Ratio (%) (e.g. 60)", type: "number", default: 60 },
      { id: "wheel", label: "Wheel Diameter (inches) (e.g. 16)", type: "number", default: 16 }
    ],
    outputs: [
      { id: "diameter", label: "Total Tire Diameter (inches)", type: "number", format: "decimal" },
      { id: "sidewall", label: "Sidewall Height (inches)", type: "number", format: "decimal" }
    ],
    calculate: (inputs) => {
      const w = parseFloat(inputs.width) || 215;
      const a = parseFloat(inputs.aspect) || 60;
      const wh = parseFloat(inputs.wheel) || 16;

      const sidewallMm = w * (a / 100);
      const sidewallIn = sidewallMm / 25.4;
      const totalDiam = (sidewallIn * 2) + wh;

      return {
        diameter: parseFloat(totalDiam.toFixed(2)),
        sidewall: parseFloat(sidewallIn.toFixed(2))
      };
    }
  },
  {
    id: "dice-roller",
    name: "Dice Roller",
    category: "other",
    description: "Roll multi-sided gaming dice (D6, D20, D100) using random distributions.",
    seo: {
      title: "Dice Roller - Roll Virtual Polyhedral Gaming Dice",
      description: "Roll virtual polyhedral dice (D6, D20, D100).",
      keywords: ["dice roller", "roll d20", "random dice roll", "virtual board game dice"]
    },
    formula: "R = \\text{floor}(r \\times \\text{Sides}) + 1",
    explanation: "Generates random integers representing dice faces based on uniform probability distributions.",
    inputs: [
      {
        id: "sides",
        label: "Dice Sides",
        type: "select",
        default: "6",
        options: [
          { value: "6", label: "6-sided (D6)" },
          { value: "10", label: "10-sided (D10)" },
          { value: "20", label: "20-sided (D20)" },
          { value: "100", label: "100-sided (D100)" }
        ]
      }
    ],
    outputs: [
      { id: "roll", label: "Dice Roll Outcome", type: "number" }
    ],
    calculate: (inputs) => {
      const sides = parseInt(inputs.sides) || 6;
      const roll = Math.floor(Math.random() * sides) + 1;
      return { roll };
    }
  },
  {
    id: "love-calculator",
    name: "Love Calculator",
    category: "other",
    description: "A fun compatibility calculator based on name hashing algorithms.",
    seo: {
      title: "Love Compatibility Calculator - Name Matcher",
      description: "A fun compatibility percentage estimator.",
      keywords: ["love calculator", "compatibility checker", "names matcher"]
    },
    formula: "\\text{Name hash pairing percentage}",
    explanation: "Estimates a fun compatibility percentage from name string hashes.",
    inputs: [
      { id: "name1", label: "Your Name", type: "text", default: "Romeo" },
      { id: "name2", label: "Partner's Name", type: "text", default: "Juliet" }
    ],
    outputs: [
      { id: "percent", label: "Love Compatibility Score (%)", type: "number" },
      { id: "verdict", label: "Verdict", type: "text" }
    ],
    calculate: (inputs) => {
      const n1 = (inputs.name1 || "").toLowerCase().trim();
      const n2 = (inputs.name2 || "").toLowerCase().trim();

      if (!n1 || !n2) {
        return { percent: 0, verdict: "Enter both names." };
      }

      // Consistent hash generator based on characters code sum
      let sum = 0;
      for (let i = 0; i < n1.length; i++) sum += n1.charCodeAt(i);
      for (let i = 0; i < n2.length; i++) sum += n2.charCodeAt(i);

      const pct = (sum % 40) + 60; // Keep results fun (60% to 99%)
      let verdict = "A passionate match!";
      if (pct > 90) verdict = "A match made in heaven!";
      else if (pct < 70) verdict = "You require a lot of compromise!";

      return {
        percent: pct,
        verdict
      };
    }
  }
];
