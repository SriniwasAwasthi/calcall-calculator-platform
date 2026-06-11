// Fitness & Health Calculators Dataset

export const healthCalculators = [
  {
    id: "bmi-calculator",
    name: "BMI Calculator",
    category: "health",
    description: "Calculate your Body Mass Index (BMI) to understand if your weight is in a healthy range relative to your height.",
    seo: {
      title: "Body Mass Index (BMI) Calculator - Healthy Weight Checker",
      description: "Check your Body Mass Index (BMI) using metric or imperial units. Determine your weight classification (Underweight, Normal, Overweight, Obese) instantly.",
      keywords: ["bmi calculator", "body mass index", "healthy weight", "ideal weight calculator"]
    },
    formula: "\\text{BMI} = \\frac{\\text{Weight (kg)}}{\\text{Height (m)}^2}",
    explanation: "Body Mass Index (BMI) is a simple numerical assessment of weight-for-height. Although it does not directly measure body fat, it correlates closely with direct measurements of body fat and serves as an indicator of potential health risks associated with underweight or obesity.",
    inputs: [
      {
        id: "unitSystem",
        label: "Unit System",
        type: "select",
        default: "metric",
        options: [
          { value: "metric", label: "Metric (kg/cm)" },
          { value: "imperial", label: "Imperial (lbs/inches)" }
        ]
      },
      { id: "weight", label: "Weight", type: "number", default: 70, min: 1, step: "any" },
      { id: "height", label: "Height (cm / inches)", type: "number", default: 175, min: 1, step: "any" }
    ],
    outputs: [
      { id: "bmi", label: "BMI Score", type: "number", format: "decimal" },
      { id: "category", label: "Weight Category", type: "text" },
      { id: "gaugePosition", label: "Gauge Position (%)", type: "number" }
    ],
    calculate: (inputs) => {
      const isMetric = inputs.unitSystem === "metric";
      const w = parseFloat(inputs.weight) || 0;
      const h = parseFloat(inputs.height) || 0;
      let bmi = 0;

      if (w > 0 && h > 0) {
        if (isMetric) {
          const heightM = h / 100;
          bmi = w / (heightM * heightM);
        } else {
          bmi = (w / (h * h)) * 703;
        }
      }

      let category = "";
      let gaugePosition = 0;

      if (bmi < 18.5) {
        category = "Underweight";
        gaugePosition = Math.max(0, Math.min(25, ((bmi - 10) / 8.5) * 25));
      } else if (bmi >= 18.5 && bmi < 25) {
        category = "Normal Weight";
        gaugePosition = 25 + ((bmi - 18.5) / 6.5) * 25;
      } else if (bmi >= 25 && bmi < 30) {
        category = "Overweight";
        gaugePosition = 50 + ((bmi - 25) / 5) * 25;
      } else {
        category = "Obese";
        gaugePosition = 75 + Math.min(25, ((bmi - 30) / 15) * 25);
      }

      return {
        bmi: parseFloat(bmi.toFixed(2)),
        category,
        gaugePosition: Math.round(gaugePosition)
      };
    }
  },
  {
    id: "calorie-calculator",
    name: "Calorie Calculator",
    category: "health",
    description: "Determine your daily calorie needs for weight maintenance, weight loss, or weight gain based on activity levels.",
    seo: {
      title: "Daily Calorie Calculator - Maintenance & Weight Loss Goals",
      description: "Estimate target daily calories using the Mifflin-St Jeor metabolic formula.",
      keywords: ["calorie calculator", "daily calorie needs", "bmr calorie goals"]
    },
    formula: "\\text{Mifflin-St Jeor Equation with Activity Factor}",
    explanation: "Your daily calorie intake determines changes in body weight. To lose weight, you must create a caloric deficit.",
    inputs: [
      { id: "weightKg", label: "Weight (kg)", type: "number", default: 70 },
      { id: "heightCm", label: "Height (cm)", type: "number", default: 175 },
      { id: "ageYears", label: "Age (Years)", type: "number", default: 28 },
      {
        id: "gender",
        label: "Biological Sex",
        type: "select",
        default: "male",
        options: [
          { value: "male", label: "Male" },
          { value: "female", label: "Female" }
        ]
      },
      {
        id: "activity",
        label: "Daily Activity Level",
        type: "select",
        default: "light",
        options: [
          { value: "sedentary", label: "Sedentary (Little/no exercise)" },
          { value: "light", label: "Light (1-3 days/week)" },
          { value: "moderate", label: "Moderate (3-5 days/week)" },
          { value: "active", label: "Very Active (6-7 days/week)" }
        ]
      }
    ],
    outputs: [
      { id: "maintain", label: "Maintain Weight (calories/day)", type: "number" },
      { id: "lose", label: "Weight Loss (-500 kcal/day)", type: "number" },
      { id: "gain", label: "Weight Gain (+500 kcal/day)", type: "number" }
    ],
    calculate: (inputs) => {
      const w = parseFloat(inputs.weightKg) || 70;
      const h = parseFloat(inputs.heightCm) || 175;
      const a = parseFloat(inputs.ageYears) || 28;
      const sex = inputs.gender;
      const act = inputs.activity;

      // Mifflin-St Jeor
      let bmr = 10 * w + 6.25 * h - 5 * a;
      bmr = sex === "male" ? bmr + 5 : bmr - 161;

      let factor = 1.2;
      if (act === "light") factor = 1.375;
      else if (act === "moderate") factor = 1.55;
      else if (act === "active") factor = 1.725;

      const maintain = bmr * factor;

      return {
        maintain: Math.round(maintain),
        lose: Math.round(maintain - 500),
        gain: Math.round(maintain + 500)
      };
    }
  },
  {
    id: "body-fat-calculator",
    name: "Body Fat Calculator",
    category: "health",
    description: "Estimate your body fat percentage using the standard US Navy circumference method.",
    seo: {
      title: "Body Fat Percentage Calculator - Navy Tape Method",
      description: "Estimate body fat percentiles using waist, neck, and hip circumferences.",
      keywords: ["body fat calculator", "navy body fat method", "body composition"]
    },
    formula: "\\text{US Navy Circumference Equations}",
    explanation: "The US Navy body fat method estimates fat distribution from neck, waist, and hip measurements.",
    inputs: [
      { id: "waist", label: "Waist Circumference (cm)", type: "number", default: 85 },
      { id: "neck", label: "Neck Circumference (cm)", type: "number", default: 38 },
      { id: "hip", label: "Hip Circumference (Females Only) (cm)", type: "number", default: 95 },
      { id: "height", label: "Height (cm)", type: "number", default: 175 },
      {
        id: "gender",
        label: "Biological Sex",
        type: "select",
        default: "male",
        options: [
          { value: "male", label: "Male" },
          { value: "female", label: "Female" }
        ]
      }
    ],
    outputs: [
      { id: "bodyFat", label: "Estimated Body Fat (%)", type: "number", format: "decimal" }
    ],
    calculate: (inputs) => {
      const w = parseFloat(inputs.waist) || 0;
      const n = parseFloat(inputs.neck) || 0;
      const hip = parseFloat(inputs.hip) || 0;
      const h = parseFloat(inputs.height) || 175;
      const sex = inputs.gender;

      let bf = 0;
      if (sex === "male") {
        bf = 86.010 * Math.log10(w - n) - 70.041 * Math.log10(h) + 36.76;
      } else {
        bf = 163.205 * Math.log10(w + hip - n) - 97.684 * Math.log10(h) - 78.387;
      }

      return { bodyFat: parseFloat(Math.max(2, bf).toFixed(1)) };
    }
  },
  {
    id: "bmr-calculator",
    name: "BMR Calculator",
    category: "health",
    description: "Determine your Basal Metabolic Rate (BMR), the minimum daily energy expenditure needed at rest.",
    seo: {
      title: "BMR Calculator - Basal Metabolic Rate Solver",
      description: "Find baseline daily energy needs in calories.",
      keywords: ["bmr calculator", "basal metabolic rate", "metabolism calories"]
    },
    formula: "\\text{BMR} = 10w + 6.25h - 5a \\pm \\text{factor}",
    explanation: "BMR reflects the calories needed to sustain vital functions (heartbeat, breathing, brain activity) at rest.",
    inputs: [
      { id: "weight", label: "Weight (kg)", type: "number", default: 70 },
      { id: "height", label: "Height (cm)", type: "number", default: 175 },
      { id: "age", label: "Age (Years)", type: "number", default: 28 },
      {
        id: "gender",
        label: "Biological Sex",
        type: "select",
        default: "male",
        options: [
          { value: "male", label: "Male" },
          { value: "female", label: "Female" }
        ]
      }
    ],
    outputs: [
      { id: "bmr", label: "Basal Metabolic Rate (BMR) (kcal/day)", type: "number" }
    ],
    calculate: (inputs) => {
      const w = parseFloat(inputs.weight) || 70;
      const h = parseFloat(inputs.height) || 175;
      const a = parseFloat(inputs.age) || 28;
      const sex = inputs.gender;

      let bmr = 10 * w + 6.25 * h - 5 * a;
      bmr = sex === "male" ? bmr + 5 : bmr - 161;

      return { bmr: Math.round(bmr) };
    }
  },
  {
    id: "ideal-weight-calculator",
    name: "Ideal Weight Calculator",
    category: "health",
    description: "Estimate your target healthy body weight based on height and gender using standard formulas.",
    seo: {
      title: "Ideal Body Weight Calculator - Healthy Height Standards",
      description: "Estimate healthy weights using Robinson and Devine formulas.",
      keywords: ["ideal weight", "ideal body weight", "healthy weight ranges"]
    },
    formula: "\\text{Robinson Formula: } 50\\text{ kg} + 2.3\\text{ kg per inch over 5 feet}",
    explanation: "Ideal body weight estimations provide baseline targets, but individual healthy weights vary based on muscle mass and frame size.",
    inputs: [
      { id: "heightCm", label: "Height (cm)", type: "number", default: 175 },
      {
        id: "gender",
        label: "Biological Sex",
        type: "select",
        default: "male",
        options: [
          { value: "male", label: "Male" },
          { value: "female", label: "Female" }
        ]
      }
    ],
    outputs: [
      { id: "idealWeight", label: "Ideal Weight (kg)", type: "number", format: "decimal" },
      { id: "idealWeightLbs", label: "Ideal Weight (lbs)", type: "number", format: "decimal" }
    ],
    calculate: (inputs) => {
      const h = parseFloat(inputs.heightCm) || 175;
      const sex = inputs.gender;

      const inches = (h / 2.54) - 60;
      const multiplier = Math.max(0, inches);

      let idealKg = 0;
      if (sex === "male") {
        idealKg = 50 + 2.3 * multiplier;
      } else {
        idealKg = 45.5 + 2.3 * multiplier;
      }

      return {
        idealWeight: parseFloat(idealKg.toFixed(1)),
        idealWeightLbs: parseFloat((idealKg * 2.20462).toFixed(1))
      };
    }
  },
  {
    id: "pace-calculator",
    name: "Pace Calculator",
    category: "health",
    description: "Convert distance and time bounds to determine running paces or speeds.",
    seo: {
      title: "Running Pace Calculator - Distance & Time Speeds",
      description: "Determine target splits and pace guidelines for running events.",
      keywords: ["pace calculator", "running speed", "marathon pace solver"]
    },
    formula: "\\text{Pace} = \\frac{\\text{Time}}{\\text{Distance}}",
    explanation: "Pace represents the minutes required to cover one mile or kilometer.",
    inputs: [
      { id: "distanceKm", label: "Distance (Kilometers)", type: "number", default: 5 },
      { id: "hours", label: "Time: Hours", type: "number", default: 0 },
      { id: "minutes", label: "Time: Minutes", type: "number", default: 25 },
      { id: "seconds", label: "Time: Seconds", type: "number", default: 0 }
    ],
    outputs: [
      { id: "pacePerKm", label: "Pace (Minutes / km)", type: "text" },
      { id: "speedKmh", label: "Speed (km/h)", type: "number", format: "decimal" }
    ],
    calculate: (inputs) => {
      const dist = parseFloat(inputs.distanceKm) || 1;
      const hrs = parseFloat(inputs.hours) || 0;
      const mins = parseFloat(inputs.minutes) || 0;
      const secs = parseFloat(inputs.seconds) || 0;

      const totalMinutes = hrs * 60 + mins + secs / 60;
      const totalHours = totalMinutes / 60;

      const paceDec = totalMinutes / dist;
      const paceMins = Math.floor(paceDec);
      const paceSecs = Math.round((paceDec - paceMins) * 60);

      const speed = dist / totalHours;

      return {
        pacePerKm: `${paceMins}:${paceSecs < 10 ? "0" + paceSecs : paceSecs} / km`,
        speedKmh: parseFloat(speed.toFixed(2))
      };
    }
  },
  {
    id: "army-body-fat-calculator",
    name: "Army Body Fat Calculator",
    category: "health",
    description: "Determine compliance with US Army height-weight fat standard tests.",
    seo: {
      title: "Army Body Fat Calculator - Tape Compliance Test",
      description: "Check compliance with military fitness requirements.",
      keywords: ["army body fat", "military tape test", "army fitness standard"]
    },
    formula: "\\text{US Army regulation 600-9 tape equations}",
    explanation: "The military uses neck, abdominal, and hip measurements to check body composition standards.",
    inputs: [
      { id: "waist", label: "Abdominal/Waist (cm)", type: "number", default: 86 },
      { id: "neck", label: "Neck (cm)", type: "number", default: 39 },
      { id: "hips", label: "Hips (Females Only) (cm)", type: "number", default: 96 },
      { id: "height", label: "Height (cm)", type: "number", default: 175 },
      {
        id: "gender",
        label: "Biological Sex",
        type: "select",
        default: "male",
        options: [
          { value: "male", label: "Male" },
          { value: "female", label: "Female" }
        ]
      }
    ],
    outputs: [
      { id: "bodyFat", label: "Army Body Fat (%)", type: "number", format: "decimal" },
      { id: "verdict", label: "Standard Status", type: "text" }
    ],
    calculate: (inputs) => {
      const w = parseFloat(inputs.waist) || 0;
      const n = parseFloat(inputs.neck) || 0;
      const hips = parseFloat(inputs.hips) || 0;
      const h = parseFloat(inputs.height) || 175;
      const sex = inputs.gender;

      let bf = 0;
      if (sex === "male") {
        bf = 86.010 * Math.log10(w - n) - 70.041 * Math.log10(h) + 36.76;
      } else {
        bf = 163.205 * Math.log10(w + hips - n) - 97.684 * Math.log10(h) - 78.387;
      }

      let limit = sex === "male" ? 22 : 30; // standard 17-20 age bracket bounds
      const pass = bf <= limit;

      return {
        bodyFat: parseFloat(Math.max(1, bf).toFixed(1)),
        verdict: pass ? `PASS (Limit ${limit}%)` : `FAIL (Exceeds limit of ${limit}%)`
      };
    }
  },
  {
    id: "lean-body-mass-calculator",
    name: "Lean Body Mass Calculator",
    category: "health",
    description: "Determine your Lean Body Mass (LBM), excluding body fat weight.",
    seo: {
      title: "Lean Body Mass Calculator - LBM Boer Formula",
      description: "Determine lean tissue weights.",
      keywords: ["lean body mass", "lbm calculator", "body fat weight"]
    },
    formula: "\\text{Boer Formula for Lean Body Mass}",
    explanation: "Lean body mass includes muscle, bone, organs, and body water, excluding adipose fat tissue.",
    inputs: [
      { id: "weightKg", label: "Weight (kg)", type: "number", default: 75 },
      { id: "heightCm", label: "Height (cm)", type: "number", default: 178 },
      {
        id: "gender",
        label: "Biological Sex",
        type: "select",
        default: "male",
        options: [
          { value: "male", label: "Male" },
          { value: "female", label: "Female" }
        ]
      }
    ],
    outputs: [
      { id: "lbm", label: "Lean Body Mass (kg)", type: "number", format: "decimal" },
      { id: "fatMass", label: "Fat Mass (kg)", type: "number", format: "decimal" }
    ],
    calculate: (inputs) => {
      const w = parseFloat(inputs.weightKg) || 0;
      const h = parseFloat(inputs.heightCm) || 1;
      const sex = inputs.gender;

      let lbm = 0;
      if (sex === "male") {
        lbm = 0.407 * w + 0.267 * h - 19.2;
      } else {
        lbm = 0.252 * w + 0.473 * h - 48.3;
      }

      lbm = Math.max(10, lbm);
      const fat = Math.max(0, w - lbm);

      return {
        lbm: parseFloat(lbm.toFixed(1)),
        fatMass: parseFloat(fat.toFixed(1))
      };
    }
  },
  {
    id: "healthy-weight-calculator",
    name: "Healthy Weight Calculator",
    category: "health",
    description: "Determine your recommended weight range corresponding to standard healthy BMIs.",
    seo: {
      title: "Healthy Weight Range Calculator - BMI Limits",
      description: "Estimate target weights for healthy BMI ranges.",
      keywords: ["healthy weight", "ideal bmi range", "weight loss targets"]
    },
    formula: "\\text{Weight} = \\text{BMI} \\times \\text{Height}^2",
    explanation: "The World Health Organization defines a healthy BMI range as 18.5 to 24.9.",
    inputs: [
      { id: "heightCm", label: "Height (cm)", type: "number", default: 170 }
    ],
    outputs: [
      { id: "minWeight", label: "Minimum Healthy Weight (kg)", type: "number", format: "decimal" },
      { id: "maxWeight", label: "Maximum Healthy Weight (kg)", type: "number", format: "decimal" }
    ],
    calculate: (inputs) => {
      const h = parseFloat(inputs.heightCm) || 170;
      const m = h / 100;

      const minW = 18.5 * m * m;
      const maxW = 24.9 * m * m;

      return {
        minWeight: parseFloat(minW.toFixed(1)),
        maxWeight: parseFloat(maxW.toFixed(1))
      };
    }
  },
  {
    id: "calories-burned-calculator",
    name: "Calories Burned Calculator",
    category: "health",
    description: "Determine the calories burned during physical exercises using MET standards.",
    seo: {
      title: "Calories Burned Exercise Calculator - MET Standards",
      description: "Estimate energy burned during sports activities.",
      keywords: ["calories burned", "exercise burn", "met calorie calculator"]
    },
    formula: "\\text{Calories} = \\text{MET} \\times 3.5 \\times \\frac{\\text{Weight (kg)}}{200} \\times \\text{Minutes}",
    explanation: "MET (Metabolic Equivalent of Task) quantifies the intensity of activities, relative to sitting at rest.",
    inputs: [
      { id: "weightKg", label: "Weight (kg)", type: "number", default: 70 },
      { id: "duration", label: "Exercise Duration (Minutes)", type: "number", default: 45 },
      {
        id: "activityType",
        label: "Exercise Type",
        type: "select",
        default: "jogging",
        options: [
          { value: "walking", label: "Walking (MET = 3.5)" },
          { value: "jogging", label: "Jogging (MET = 7.0)" },
          { value: "running", label: "Running Fast (MET = 10.0)" },
          { value: "cycling", label: "Bicycling Moderate (MET = 6.0)" },
          { value: "swimming", label: "Swimming Laps (MET = 8.0)" }
        ]
      }
    ],
    outputs: [
      { id: "caloriesBurned", label: "Calories Burned (kcal)", type: "number" }
    ],
    calculate: (inputs) => {
      const w = parseFloat(inputs.weightKg) || 70;
      const t = parseFloat(inputs.duration) || 0;
      const act = inputs.activityType;

      let met = 7.0;
      if (act === "walking") met = 3.5;
      else if (act === "running") met = 10.0;
      else if (act === "cycling") met = 6.0;
      else if (act === "swimming") met = 8.0;

      const calories = met * 3.5 * (w / 200) * t;
      return { caloriesBurned: Math.round(calories) };
    }
  },
  {
    id: "one-rep-max-calculator",
    name: "One Rep Max Calculator",
    category: "health",
    description: "Determine your maximum lifting capacity from sub-maximal repetitions.",
    seo: {
      title: "One Rep Max (1RM) Calculator - Lifting Estimates",
      description: "Estimate lifting limits using Epley and Brzycki equations.",
      keywords: ["one rep max", "1rm calculator", "weightlifting formula"]
    },
    formula: "\\text{1RM} = w \\left(1 + \\frac{r}{30}\\right)",
    explanation: "One Rep Max (1RM) represents the maximum load you can lift for a single rep.",
    inputs: [
      { id: "weightLifted", label: "Weight Lifted ($ or kg)", type: "number", default: 100 },
      { id: "reps", label: "Reps Completed (1 to 10)", type: "number", default: 5, min: 1, max: 20 }
    ],
    outputs: [
      { id: "oneRepMax", label: "Estimated One Rep Max (1RM)", type: "number", format: "decimal" },
      { id: "intensity80", label: "80% Intensity (8 Rep Target)", type: "number", format: "decimal" }
    ],
    calculate: (inputs) => {
      const w = parseFloat(inputs.weightLifted) || 0;
      const r = parseFloat(inputs.reps) || 1;

      // Epley Formula
      const oneRM = w * (1 + r / 30);
      return {
        oneRepMax: parseFloat(oneRM.toFixed(1)),
        intensity80: parseFloat((oneRM * 0.8).toFixed(1))
      };
    }
  },
  {
    id: "target-heart-rate-calculator",
    name: "Target Heart Rate Calculator",
    category: "health",
    description: "Determine your aerobic exercise target heart rate zones using age metrics.",
    seo: {
      title: "Target Heart Rate Zone Calculator - Aerobic Fitness",
      description: "Find exercise heart rate zones based on age.",
      keywords: ["target heart rate", "cardio zones", "aerobic pulse bounds"]
    },
    formula: "\\text{Max HR} = 220 - \\text{Age}",
    explanation: "Training within specific heart rate zones targets fat burning or cardiovascular endurance.",
    inputs: [
      { id: "age", label: "Age", type: "number", default: 28 },
      { id: "restingHR", label: "Resting Heart Rate (BPM)", type: "number", default: 65 }
    ],
    outputs: [
      { id: "aerobicZone", label: "Aerobic Zone (70%-85%): Target BPM Range", type: "text" },
      { id: "fatBurnZone", label: "Fat Burn Zone (50%-70%): Target BPM Range", type: "text" }
    ],
    calculate: (inputs) => {
      const age = parseFloat(inputs.age) || 28;
      const rest = parseFloat(inputs.restingHR) || 60;

      const maxHR = 220 - age;
      const reserve = maxHR - rest;

      // Karvonen formula
      const minFat = Math.round(rest + reserve * 0.50);
      const maxFat = Math.round(rest + reserve * 0.70);
      const minAero = Math.round(rest + reserve * 0.70);
      const maxAero = Math.round(rest + reserve * 0.85);

      return {
        aerobicZone: `${minAero} - ${maxAero} BPM`,
        fatBurnZone: `${minFat} - ${maxFat} BPM`
      };
    }
  },
  {
    id: "pregnancy-calculator",
    name: "Pregnancy Calculator",
    category: "health",
    description: "Estimate pregnancy progression, current gestational age, and due dates.",
    seo: {
      title: "Pregnancy Due Date & Gestational Age Calculator",
      description: "Determine pregnancy progression from last menstrual dates.",
      keywords: ["pregnancy calculator", "due date calculator", "gestational age check"]
    },
    formula: "\\text{Due Date} = \\text{LMP} + 280\\text{ days}",
    explanation: "A standard human pregnancy lasts approximately 40 weeks (280 days) from the first day of the last menstrual period (LMP).",
    inputs: [
      { id: "lmp", label: "Last Menstrual Period (LMP) Date", type: "date" }
    ],
    outputs: [
      { id: "dueDate", label: "Estimated Due Date", type: "text" },
      { id: "gestationalAge", label: "Gestational Age", type: "text" }
    ],
    calculate: (inputs) => {
      const lmpStr = inputs.lmp;
      if (!lmpStr) return { dueDate: "Select Date", gestationalAge: "-" };

      const parts = lmpStr.split("-");
      const lmpDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      
      const dueTime = lmpDate.getTime() + 280 * 24 * 60 * 60 * 1000;
      const due = new Date(dueTime);

      const today = new Date();
      const diffTime = today.getTime() - lmpDate.getTime();
      const diffDays = Math.floor(diffTime / (24 * 60 * 60 * 1000));
      const weeks = Math.floor(diffDays / 7);
      const days = diffDays % 7;

      const opt = { year: "numeric", month: "long", day: "numeric" };

      return {
        dueDate: due.toLocaleDateString(undefined, opt),
        gestationalAge: `${weeks} weeks, ${days} days`
      };
    }
  },
  {
    id: "pregnancy-weight-gain-calculator",
    name: "Pregnancy Weight Gain Calculator",
    category: "health",
    description: "Recommends healthy pregnancy weight gain targets based on pre-pregnancy BMI levels.",
    seo: {
      title: "Pregnancy Weight Gain Recommender",
      description: "Estimate recommended weight gains during pregnancy stages.",
      keywords: ["pregnancy weight gain", "pregnancy bmi targets", "gestation weight gain"]
    },
    formula: "\\text{ACOG standard gain recommendations}",
    explanation: "Healthy weight gain during pregnancy supports fetal development and reduces gestational complications.",
    inputs: [
      { id: "preBmi", label: "Pre-Pregnancy BMI Score", type: "number", default: 22.5 }
    ],
    outputs: [
      { id: "recommendedGain", label: "Recommended Weight Gain Range", type: "text" }
    ],
    calculate: (inputs) => {
      const bmi = parseFloat(inputs.preBmi) || 22.5;

      let range = "11.5 - 16.0 kg (25 - 35 lbs)";
      if (bmi < 18.5) range = "12.5 - 18.0 kg (28 - 40 lbs)";
      else if (bmi >= 30) range = "5.0 - 9.0 kg (11 - 20 lbs)";
      else if (bmi >= 25) range = "7.0 - 11.5 kg (15 - 25 lbs)";

      return { recommendedGain: range };
    }
  },
  {
    id: "pregnancy-conception-calculator",
    name: "Pregnancy Conception Calculator",
    category: "health",
    description: "Estimate the approximate date range when conception occurred based on due date.",
    seo: {
      title: "Pregnancy Conception Date Calculator",
      description: "Estimate conception date ranges from due date standards.",
      keywords: ["conception date calculator", "when did i conceive", "pregnancy conception"]
    },
    formula: "\\text{Conception} \\approx \\text{Due Date} - 266\\text{ days}",
    explanation: "Conception typically occurs 38 weeks (266 days) before the estimated due date.",
    inputs: [
      { id: "dueDate", label: "Estimated Due Date", type: "date" }
    ],
    outputs: [
      { id: "conceptionRange", label: "Estimated Conception Date Range", type: "text" }
    ],
    calculate: (inputs) => {
      const dueStr = inputs.dueDate;
      if (!dueStr) return { conceptionRange: "Select Due Date" };

      const parts = dueStr.split("-");
      const due = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));

      const startConception = new Date(due.getTime() - 273 * 24 * 60 * 60 * 1000);
      const endConception = new Date(due.getTime() - 259 * 24 * 60 * 60 * 1000);

      const opt = { month: "long", day: "numeric", year: "numeric" };
      return {
        conceptionRange: `${startConception.toLocaleDateString(undefined, opt)} - ${endConception.toLocaleDateString(undefined, opt)}`
      };
    }
  },
  {
    id: "due-date-calculator",
    name: "Due Date Calculator",
    category: "health",
    description: "Determine your estimated due date using standard Naegele's rule calculations.",
    seo: {
      title: "Naegele's Rule Due Date Calculator",
      description: "Find estimated pregnancy due dates using Naegele's Rule.",
      keywords: ["due date calculator", "naegele's rule", "pregnancy milestone"]
    },
    formula: "\\text{Due Date} = \\text{LMP} + 7 \\text{ days} - 3 \\text{ months}",
    explanation: "Naegele's rule is a standard way of calculating the due date for a pregnancy by adding 280 days to the LMP.",
    inputs: [
      { id: "lmp", label: "Last Menstrual Period Date", type: "date" }
    ],
    outputs: [
      { id: "dueDate", label: "Estimated Due Date", type: "text" }
    ],
    calculate: (inputs) => {
      const lmpStr = inputs.lmp;
      if (!lmpStr) return { dueDate: "Select Date" };

      const parts = lmpStr.split("-");
      const lmpDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      
      const due = new Date(lmpDate.getTime() + 280 * 24 * 60 * 60 * 1000);
      const opt = { year: "numeric", month: "long", day: "numeric" };

      return { dueDate: due.toLocaleDateString(undefined, opt) };
    }
  },
  {
    id: "ovulation-calculator",
    name: "Ovulation Calculator",
    category: "health",
    description: "Determine your monthly fertile window and peak ovulation dates based on cycles length.",
    seo: {
      title: "Ovulation Calculator - Fertile Window Estimator",
      description: "Find peak fertile ovulation days based on menstrual cycle lengths.",
      keywords: ["ovulation calculator", "fertile window", "peak fertility dates"]
    },
    formula: "\\text{Ovulation} = \\text{Next Cycle Starts} - 14\\text{ days}",
    explanation: "Ovulation usually occurs in the middle of a menstrual cycle, roughly 14 days before the next period starts.",
    inputs: [
      { id: "lmp", label: "LMP Start Date", type: "date" },
      { id: "cycleDays", label: "Average Cycle Length (Days)", type: "number", default: 28 }
    ],
    outputs: [
      { id: "peakOvulation", label: "Peak Ovulation Date", type: "text" },
      { id: "fertileWindow", label: "Fertile Window Range", type: "text" }
    ],
    calculate: (inputs) => {
      const lmpStr = inputs.lmp;
      const cycle = parseInt(inputs.cycleDays) || 28;

      if (!lmpStr) return { peakOvulation: "Select Date", fertileWindow: "-" };

      const parts = lmpStr.split("-");
      const lmp = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));

      const peakTime = lmp.getTime() + (cycle - 14) * 24 * 60 * 60 * 1000;
      const peak = new Date(peakTime);

      const fStart = new Date(peak.getTime() - 4 * 24 * 60 * 60 * 1000);
      const fEnd = new Date(peak.getTime() + 1 * 24 * 60 * 60 * 1000);

      const opt = { month: "long", day: "numeric", year: "numeric" };
      return {
        peakOvulation: peak.toLocaleDateString(undefined, opt),
        fertileWindow: `${fStart.toLocaleDateString(undefined, opt)} - ${fEnd.toLocaleDateString(undefined, opt)}`
      };
    }
  },
  {
    id: "conception-calculator",
    name: "Conception Calculator",
    category: "health",
    description: "Estimate conception dates based on Last Menstrual Period (LMP) dates.",
    seo: {
      title: "Conception Date Calculator - LMP Estimations",
      description: "Estimate conception dates using last period timing.",
      keywords: ["conception calculator", "pregnancy conception", "lmp conception finder"]
    },
    formula: "\\text{Conception} \\approx \\text{LMP} + 14\\text{ days}",
    explanation: "Conception typically takes place during the ovulation window, which occurs roughly two weeks after the LMP.",
    inputs: [
      { id: "lmp", label: "Last Menstrual Period (LMP) Date", type: "date" }
    ],
    outputs: [
      { id: "conceptionDate", label: "Estimated Conception Date", type: "text" }
    ],
    calculate: (inputs) => {
      const lmpStr = inputs.lmp;
      if (!lmpStr) return { conceptionDate: "Select Date" };

      const parts = lmpStr.split("-");
      const lmp = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));

      const conception = new Date(lmp.getTime() + 14 * 24 * 60 * 60 * 1000);
      const opt = { year: "numeric", month: "long", day: "numeric" };

      return { conceptionDate: conception.toLocaleDateString(undefined, opt) };
    }
  },
  {
    id: "period-calculator",
    name: "Period Calculator",
    category: "health",
    description: "Forecast future menstrual cycle period dates over the next six months.",
    seo: {
      title: "Menstrual Period Cycle Tracker & Forecast",
      description: "Project future period start dates.",
      keywords: ["period calculator", "cycle tracker", "menstrual cycle forecasting"]
    },
    formula: "\\text{Forecast} = \\text{LMP} + (c \\times \\text{cycle})",
    explanation: "Regular tracking helps forecast cycle intervals and monitor changes in biological health.",
    inputs: [
      { id: "lmp", label: "LMP Start Date", type: "date" },
      { id: "cycleDays", label: "Cycle Length (Days)", type: "number", default: 28 }
    ],
    outputs: [
      { id: "nextPeriod", label: "Next Expected Period", type: "text" },
      { id: "followingPeriod", label: "Following Period", type: "text" }
    ],
    calculate: (inputs) => {
      const lmpStr = inputs.lmp;
      const cycle = parseInt(inputs.cycleDays) || 28;

      if (!lmpStr) return { nextPeriod: "Select Date", followingPeriod: "-" };

      const parts = lmpStr.split("-");
      const lmp = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));

      const next1 = new Date(lmp.getTime() + cycle * 24 * 60 * 60 * 1000);
      const next2 = new Date(next1.getTime() + cycle * 24 * 60 * 60 * 1000);

      const opt = { year: "numeric", month: "long", day: "numeric" };
      return {
        nextPeriod: next1.toLocaleDateString(undefined, opt),
        followingPeriod: next2.toLocaleDateString(undefined, opt)
      };
    }
  },
  {
    id: "macro-calculator",
    name: "Macro Calculator",
    category: "health",
    description: "Calculate daily carbohydrate, protein, and fat intake distribution targets.",
    seo: {
      title: "Macronutrient Ratio Calculator - Calorie Splits",
      description: "Split target daily calories into carb, protein, and fat gram limits.",
      keywords: ["macro calculator", "macronutrients", "carb protein fat ratios"]
    },
    formula: "\\text{Carbs (45%), Protein (30%), Fat (25%)}",
    explanation: "Carbohydrates provide 4 kcal/g, proteins 4 kcal/g, and fats 9 kcal/g. Ratios optimize body composition goals.",
    inputs: [
      { id: "calories", label: "Daily Calorie Target (kcal)", type: "number", default: 2000 }
    ],
    outputs: [
      { id: "carbs", label: "Carbohydrates (grams/day)", type: "number" },
      { id: "protein", label: "Protein (grams/day)", type: "number" },
      { id: "fat", label: "Fat (grams/day)", type: "number" }
    ],
    calculate: (inputs) => {
      const cal = parseFloat(inputs.calories) || 2000;

      return {
        carbs: Math.round((cal * 0.45) / 4),
        protein: Math.round((cal * 0.30) / 4),
        fat: Math.round((cal * 0.25) / 9)
      };
    }
  },
  {
    id: "carbohydrate-calculator",
    name: "Carbohydrate Calculator",
    category: "health",
    description: "Recommends daily carbohydrate gram intake targets based on energy expenditures.",
    seo: {
      title: "Daily Carbohydrate Intake Calculator",
      description: "Estimate daily carb requirements in grams.",
      keywords: ["carbohydrate calculator", "daily carbs grams", "energy carbs"]
    },
    formula: "\\text{Carbs} = 55\\% \\text{ of Daily Calories}",
    explanation: "Carbohydrates are the body's primary fuel source, crucial for high intensity exercises.",
    inputs: [
      { id: "calories", label: "Daily Calorie Target (kcal)", type: "number", default: 2200 }
    ],
    outputs: [
      { id: "carbsGrams", label: "Carbohydrate Target (grams)", type: "number" }
    ],
    calculate: (inputs) => {
      const cal = parseFloat(inputs.calories) || 2000;
      return { carbsGrams: Math.round((cal * 0.55) / 4) };
    }
  },
  {
    id: "protein-calculator",
    name: "Protein Calculator",
    category: "health",
    description: "Determine daily protein requirements for muscle maintenance and training goals.",
    seo: {
      title: "Daily Protein Requirement Calculator",
      description: "Calculate daily protein requirements based on weight.",
      keywords: ["protein calculator", "daily protein needs", "muscle building protein"]
    },
    formula: "\\text{Protein Target} = 1.6\\text{g per kg of Body Weight}",
    explanation: "Protein contains amino acids that build and repair muscle tissues. Targets scale with athletic demands.",
    inputs: [
      { id: "weightKg", label: "Body Weight (kg)", type: "number", default: 70 },
      {
        id: "intensity",
        label: "Training Goal",
        type: "select",
        default: "active",
        options: [
          { value: "sedentary", label: "Sedentary (0.8g/kg)" },
          { value: "active", label: "Active/Fitness (1.6g/kg)" },
          { value: "athlete", label: "Athlete/Strength (2.0g/kg)" }
        ]
      }
    ],
    outputs: [
      { id: "proteinGrams", label: "Daily Protein Target (grams)", type: "number" }
    ],
    calculate: (inputs) => {
      const w = parseFloat(inputs.weightKg) || 70;
      const target = inputs.intensity;

      let multiplier = 1.6;
      if (target === "sedentary") multiplier = 0.8;
      else if (target === "athlete") multiplier = 2.0;

      return { proteinGrams: Math.round(w * multiplier) };
    }
  },
  {
    id: "fat-intake-calculator",
    name: "Fat Intake Calculator",
    category: "health",
    description: "Determine healthy daily dietary fat gram limits.",
    seo: {
      title: "Daily Fat Intake Limit Calculator",
      description: "Determine healthy dietary fat limits.",
      keywords: ["fat calculator", "fat grams limit", "dietary fat intake"]
    },
    formula: "\\text{Fats} = 25\\% \\text{ of Daily Calories}",
    explanation: "Healthy fats support hormone production and vitamin absorption, yielding 9 calories per gram.",
    inputs: [
      { id: "calories", label: "Daily Calorie Target (kcal)", type: "number", default: 2000 }
    ],
    outputs: [
      { id: "fatGrams", label: "Recommended Fats (grams)", type: "number" }
    ],
    calculate: (inputs) => {
      const cal = parseFloat(inputs.calories) || 2000;
      return { fatGrams: Math.round((cal * 0.25) / 9) };
    }
  },
  {
    id: "tdee-calculator",
    name: "TDEE Calculator",
    category: "health",
    description: "Calculate your Total Daily Energy Expenditure (TDEE) based on metabolic BMR and activity levels.",
    seo: {
      title: "TDEE Calculator - Total Daily Energy Expenditure",
      description: "Estimate total calories burned daily.",
      keywords: ["tdee calculator", "total daily energy expenditure", "bmr activity"]
    },
    formula: "\\text{TDEE} = \\text{BMR} \\times \\text{Activity Factor}",
    explanation: "TDEE is the total energy spent in a day, key to tracking energy balance targets.",
    inputs: [
      { id: "weight", label: "Weight (kg)", type: "number", default: 70 },
      { id: "height", label: "Height (cm)", type: "number", default: 175 },
      { id: "age", label: "Age (Years)", type: "number", default: 28 },
      {
        id: "gender",
        label: "Biological Sex",
        type: "select",
        default: "male",
        options: [
          { value: "male", label: "Male" },
          { value: "female", label: "Female" }
        ]
      },
      {
        id: "activity",
        label: "Daily Activity Level",
        type: "select",
        default: "moderate",
        options: [
          { value: "sedentary", label: "Sedentary (Little/no exercise)" },
          { value: "light", label: "Light (1-3 days/week)" },
          { value: "moderate", label: "Moderate (3-5 days/week)" },
          { value: "active", label: "Very Active (6-7 days/week)" }
        ]
      }
    ],
    outputs: [
      { id: "tdee", label: "Total Daily Energy Expenditure (TDEE) (kcal/day)", type: "number" }
    ],
    calculate: (inputs) => {
      const w = parseFloat(inputs.weight) || 70;
      const h = parseFloat(inputs.height) || 175;
      const a = parseFloat(inputs.age) || 28;
      const sex = inputs.gender;
      const act = inputs.activity;

      let bmr = 10 * w + 6.25 * h - 5 * a;
      bmr = sex === "male" ? bmr + 5 : bmr - 161;

      let factor = 1.2;
      if (act === "light") factor = 1.375;
      else if (act === "moderate") factor = 1.55;
      else if (act === "active") factor = 1.725;

      return { tdee: Math.round(bmr * factor) };
    }
  },
  {
    id: "gfr-calculator",
    name: "GFR Calculator",
    category: "health",
    description: "Determine kidney health Glomerular Filtration Rates (eGFR) using creatinine and demographic inputs.",
    seo: {
      title: "Glomerular Filtration Rate (eGFR) Kidney Calculator",
      description: "Estimate kidney filter performance values using serum creatinine levels.",
      keywords: ["gfr calculator", "egfr kidney check", "creatinine clearance"]
    },
    formula: "\\text{CKD-EPI Creatinine Equation (2021)}",
    explanation: "eGFR assesses kidney filter function. Values below 60 mL/min/1.73m² suggest potential kidney disease.",
    inputs: [
      { id: "creatinine", label: "Serum Creatinine (mg/dL)", type: "number", default: 0.9, step: "any" },
      { id: "age", label: "Age (Years)", type: "number", default: 45 },
      {
        id: "gender",
        label: "Biological Sex",
        type: "select",
        default: "male",
        options: [
          { value: "male", label: "Male" },
          { value: "female", label: "Female" }
        ]
      }
    ],
    outputs: [
      { id: "egfr", label: "eGFR (mL/min/1.73m²)", type: "number", format: "decimal" },
      { id: "status", label: "Kidney Function Stage", type: "text" }
    ],
    calculate: (inputs) => {
      const cr = parseFloat(inputs.creatinine) || 0.9;
      const age = parseFloat(inputs.age) || 45;
      const sex = inputs.gender;

      // CKD-EPI 2021
      const k = sex === "female" ? 0.7 : 0.9;
      const alpha = sex === "female" ? -0.241 : -0.302;
      const sexMult = sex === "female" ? 1.012 : 1.0;

      const term1 = cr / k;
      const minVal = Math.min(term1, 1);
      const maxVal = Math.max(term1, 1);

      const egfr = 142 * Math.pow(minVal, alpha) * Math.pow(maxVal, -1.2) * Math.pow(0.9938, age) * sexMult;

      let status = "Normal (Stage 1 / >90)";
      if (egfr < 15) status = "Kidney Failure (Stage 5 / <15)";
      else if (egfr < 30) status = "Severe Decrease (Stage 4 / 15-29)";
      else if (egfr < 60) status = "Moderate Decrease (Stage 3 / 30-59)";
      else if (egfr < 90) status = "Mild Decrease (Stage 2 / 60-89)";

      return {
        egfr: parseFloat(egfr.toFixed(1)),
        status
      };
    }
  },
  {
    id: "body-type-calculator",
    name: "Body Type Calculator",
    category: "health",
    description: "Determine your body shape category based on bust, waist, and hip measurements.",
    seo: {
      title: "Body Shape Type Calculator - Hourglass, Pear & Rectangle Check",
      description: "Analyze body profiles from torso measurements.",
      keywords: ["body type calculator", "hourglass shape", "female body shape"]
    },
    formula: "\\text{Anthropometric waist-to-hip ratios}",
    explanation: "Body shape categories are based on bust, waist, and hip ratios to classify skeletal silhouettes.",
    inputs: [
      { id: "bust", label: "Bust Circumference (cm)", type: "number", default: 90 },
      { id: "waist", label: "Waist Circumference (cm)", type: "number", default: 70 },
      { id: "hip", label: "Hip Circumference (cm)", type: "number", default: 95 }
    ],
    outputs: [
      { id: "bodyType", label: "Identified Body Shape", type: "text" },
      { id: "waistHipRatio", label: "Waist-to-Hip Ratio", type: "number", format: "decimal" }
    ],
    calculate: (inputs) => {
      const bust = parseFloat(inputs.bust) || 90;
      const waist = parseFloat(inputs.waist) || 70;
      const hip = parseFloat(inputs.hip) || 95;

      const whr = waist / hip;
      let shape = "Rectangle (Banana)";

      // Simple rules:
      // Hourglass: bust/hips are similar and waist is small
      if ((bust - hip <= 5) && (hip - bust <= 5) && (waist / bust <= 0.75)) {
        shape = "Hourglass";
      } else if (hip - bust > 5) {
        shape = "Pear (Spoons)";
      } else if (bust - hip > 5) {
        shape = "Inverted Triangle (Apple)";
      }

      return {
        bodyType: shape,
        waistHipRatio: parseFloat(whr.toFixed(2))
      };
    }
  },
  {
    id: "body-surface-area-calculator",
    name: "Body Surface Area Calculator",
    category: "health",
    description: "Calculate the total surface area of the human body using the standard Mosteller formula.",
    seo: {
      title: "Body Surface Area (BSA) Calculator - Mosteller Formula",
      description: "Estimate human body surface areas for medical applications.",
      keywords: ["body surface area", "bsa calculator", "mosteller formula"]
    },
    formula: "\\text{BSA} = \\sqrt{\\frac{\\text{Height (cm)} \\times \\text{Weight (kg)}}{3600}}",
    explanation: "BSA is used in clinical medicine to calculate drug dosages and fluid requirements.",
    inputs: [
      { id: "heightCm", label: "Height (cm)", type: "number", default: 175 },
      { id: "weightKg", label: "Weight (kg)", type: "number", default: 70 }
    ],
    outputs: [
      { id: "bsa", label: "Body Surface Area (m²)", type: "number", format: "decimal" }
    ],
    calculate: (inputs) => {
      const h = parseFloat(inputs.heightCm) || 175;
      const w = parseFloat(inputs.weightKg) || 70;

      const bsa = Math.sqrt((h * w) / 3600);
      return { bsa: parseFloat(bsa.toFixed(2)) };
    }
  },
  {
    id: "bac-calculator",
    name: "BAC Calculator",
    category: "health",
    description: "Estimate blood alcohol concentration (BAC) levels over time using the Widmark formula.",
    seo: {
      title: "Blood Alcohol Content (BAC) Calculator",
      description: "Estimate BAC levels from drink logs.",
      keywords: ["bac calculator", "blood alcohol content", "widmark formula"]
    },
    formula: "\\text{BAC} = \\left( \\frac{\\text{Alcohol Consumed (g)}}{\\text{Weight (g)} \\times r} \\right) \\times 100 - (\\beta \\times t)",
    explanation: "BAC estimates blood alcohol concentrations. Rates are affected by biological sex, body weight, and elapsed time.",
    inputs: [
      { id: "drinks", label: "Standard Drinks Consumed (14g alcohol each)", type: "number", default: 3 },
      { id: "weightKg", label: "Weight (kg)", type: "number", default: 75 },
      { id: "hours", label: "Time Elapsed (Hours)", type: "number", default: 2 },
      {
        id: "gender",
        label: "Biological Sex",
        type: "select",
        default: "male",
        options: [
          { value: "male", label: "Male (r = 0.68)" },
          { value: "female", label: "Female (r = 0.55)" }
        ]
      }
    ],
    outputs: [
      { id: "bac", label: "Estimated BAC (%)", type: "number", format: "decimal" },
      { id: "verdict", label: "Driving Status", type: "text" }
    ],
    calculate: (inputs) => {
      const drinks = parseFloat(inputs.drinks) || 0;
      const wKg = parseFloat(inputs.weightKg) || 70;
      const t = parseFloat(inputs.hours) || 0;
      const sex = inputs.gender;

      const alcGrams = drinks * 14;
      const wGrams = wKg * 1000;
      const r = sex === "male" ? 0.68 : 0.55;

      // Widmark
      let bac = (alcGrams / (wGrams * r)) * 100 - (0.015 * t);
      bac = Math.max(0, bac);

      let status = "Under limit (Drive safe)";
      if (bac >= 0.08) status = "LEGAL LIMIT EXCEEDED (Do not drive!)";
      else if (bac > 0) status = "Impaired (Exercise caution)";

      return {
        bac: parseFloat(bac.toFixed(3)),
        verdict: status
      };
    }
  }
];
