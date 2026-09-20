export const defaultTemplates = [
  {
    name: "Complete Blood Count (CBC)",
    fields: [
      { label: "Hemoglobin", key: "hemoglobin", unit: "g/dL", type: "number", normalRange: { min: 13, max: 17 }, referenceNote: "Male: 13–17, Female: 12–15" },
      { label: "Total WBC Count", key: "wbc", unit: "cells/cumm", type: "number", normalRange: { min: 4000, max: 11000 } },
      { label: "RBC Count", key: "rbc", unit: "million/cumm", type: "number", normalRange: { min: 4.5, max: 5.5 }, referenceNote: "Male: 4.5–5.5, Female: 4.0–5.0" },
      { label: "Platelet Count", key: "platelets", unit: "lakhs/cumm", type: "number", normalRange: { min: 1.5, max: 4.5 } },
      { label: "PCV (Hematocrit)", key: "pcv", unit: "%", type: "number", normalRange: { min: 40, max: 50 }, referenceNote: "Male: 40–50, Female: 36–44" },
      { label: "MCV", key: "mcv", unit: "fL", type: "number", normalRange: { min: 83, max: 101 } },
      { label: "MCH", key: "mch", unit: "pg", type: "number", normalRange: { min: 27, max: 32 } },
      { label: "MCHC", key: "mchc", unit: "g/dL", type: "number", normalRange: { min: 31.5, max: 34.5 } },
      { label: "Neutrophils", key: "neutrophils", unit: "%", type: "number", normalRange: { min: 40, max: 80 } },
      { label: "Lymphocytes", key: "lymphocytes", unit: "%", type: "number", normalRange: { min: 20, max: 40 } },
      { label: "Eosinophils", key: "eosinophils", unit: "%", type: "number", normalRange: { min: 1, max: 6 } },
      { label: "Monocytes", key: "monocytes", unit: "%", type: "number", normalRange: { min: 2, max: 10 } },
    ],
  },
  {
    name: "Lipid Profile",
    fields: [
      { label: "Total Cholesterol", key: "totalCholesterol", unit: "mg/dL", type: "number", normalRange: { min: 125, max: 200 } },
      { label: "Triglycerides", key: "triglycerides", unit: "mg/dL", type: "number", normalRange: { min: 25, max: 150 } },
      { label: "HDL Cholesterol", key: "hdl", unit: "mg/dL", type: "number", normalRange: { min: 40, max: 60 }, referenceNote: "Higher is better; Male: >40, Female: >50" },
      { label: "LDL Cholesterol", key: "ldl", unit: "mg/dL", type: "number", normalRange: { min: 0, max: 100 }, referenceNote: "Optimal: <100" },
      { label: "VLDL Cholesterol", key: "vldl", unit: "mg/dL", type: "number", normalRange: { min: 5, max: 40 } },
      { label: "Cholesterol/HDL Ratio", key: "cholesterolHdlRatio", unit: "", type: "number", normalRange: { min: 0, max: 4.5 } },
    ],
  },
  {
    name: "Liver Function Test (LFT)",
    fields: [
      { label: "Total Bilirubin", key: "totalBilirubin", unit: "mg/dL", type: "number", normalRange: { min: 0.3, max: 1.2 } },
      { label: "Direct Bilirubin", key: "directBilirubin", unit: "mg/dL", type: "number", normalRange: { min: 0, max: 0.3 } },
      { label: "Indirect Bilirubin", key: "indirectBilirubin", unit: "mg/dL", type: "number", normalRange: { min: 0.2, max: 0.8 } },
      { label: "SGOT (AST)", key: "sgot", unit: "U/L", type: "number", normalRange: { min: 5, max: 40 } },
      { label: "SGPT (ALT)", key: "sgpt", unit: "U/L", type: "number", normalRange: { min: 7, max: 56 } },
      { label: "Alkaline Phosphatase", key: "alp", unit: "U/L", type: "number", normalRange: { min: 44, max: 147 } },
      { label: "Total Protein", key: "totalProtein", unit: "g/dL", type: "number", normalRange: { min: 6.0, max: 8.3 } },
      { label: "Albumin", key: "albumin", unit: "g/dL", type: "number", normalRange: { min: 3.5, max: 5.0 } },
      { label: "Globulin", key: "globulin", unit: "g/dL", type: "number", normalRange: { min: 2.0, max: 3.5 } },
      { label: "A/G Ratio", key: "agRatio", unit: "", type: "number", normalRange: { min: 1.1, max: 2.5 } },
    ],
  },
  {
    name: "Kidney Function Test (KFT/RFT)",
    fields: [
      { label: "Blood Urea", key: "bloodUrea", unit: "mg/dL", type: "number", normalRange: { min: 15, max: 40 } },
      { label: "Serum Creatinine", key: "creatinine", unit: "mg/dL", type: "number", normalRange: { min: 0.6, max: 1.3 }, referenceNote: "Male: 0.7–1.3, Female: 0.6–1.1" },
      { label: "Uric Acid", key: "uricAcid", unit: "mg/dL", type: "number", normalRange: { min: 2.6, max: 7.2 }, referenceNote: "Male: 3.5–7.2, Female: 2.6–6.0" },
      { label: "Sodium", key: "sodium", unit: "mEq/L", type: "number", normalRange: { min: 135, max: 145 } },
      { label: "Potassium", key: "potassium", unit: "mEq/L", type: "number", normalRange: { min: 3.5, max: 5.1 } },
      { label: "Chloride", key: "chloride", unit: "mEq/L", type: "number", normalRange: { min: 98, max: 107 } },
    ],
  },
  {
    name: "Thyroid Profile (T3 T4 TSH)",
    fields: [
      { label: "T3 (Triiodothyronine)", key: "t3", unit: "ng/dL", type: "number", normalRange: { min: 80, max: 200 } },
      { label: "T4 (Thyroxine)", key: "t4", unit: "µg/dL", type: "number", normalRange: { min: 5.1, max: 14.1 } },
      { label: "TSH", key: "tsh", unit: "µIU/mL", type: "number", normalRange: { min: 0.4, max: 4.0 } },
    ],
  },
  {
    name: "Blood Sugar (Fasting & PP)",
    fields: [
      { label: "Fasting Blood Sugar", key: "fbs", unit: "mg/dL", type: "number", normalRange: { min: 70, max: 100 } },
      { label: "Post Prandial Blood Sugar", key: "ppbs", unit: "mg/dL", type: "number", normalRange: { min: 70, max: 140 } },
    ],
  },
  {
    name: "HbA1c",
    fields: [
      { label: "HbA1c", key: "hba1c", unit: "%", type: "number", normalRange: { min: 4, max: 5.6 } },
      { label: "Estimated Average Glucose", key: "eag", unit: "mg/dL", type: "number", normalRange: { min: 68, max: 114 } },
    ],
  },
  {
    name: "Urine Routine & Microscopy",
    fields: [
      { label: "Colour", key: "colour", unit: "", type: "text", referenceNote: "Pale Yellow" },
      { label: "Appearance", key: "appearance", unit: "", type: "text", referenceNote: "Clear" },
      { label: "pH", key: "ph", unit: "", type: "number", normalRange: { min: 4.5, max: 8.0 } },
      { label: "Specific Gravity", key: "specificGravity", unit: "", type: "number", normalRange: { min: 1.005, max: 1.03 } },
      { label: "Protein", key: "protein", unit: "", type: "text", referenceNote: "Nil / Negative" },
      { label: "Glucose", key: "glucose", unit: "", type: "text", referenceNote: "Nil / Negative" },
      { label: "Pus Cells", key: "pusCells", unit: "/hpf", type: "text", referenceNote: "0–5" },
      { label: "RBCs", key: "rbcs", unit: "/hpf", type: "text", referenceNote: "0–2" },
      { label: "Epithelial Cells", key: "epithelialCells", unit: "/hpf", type: "text", referenceNote: "0–5" },
    ],
  },
  {
    name: "Vitamin D (25-OH)",
    fields: [{ label: "Vitamin D", key: "vitaminD", unit: "ng/mL", type: "number", normalRange: { min: 30, max: 100 }, referenceNote: "Deficiency: <20, Insufficiency: 20–29" }],
  },
  {
    name: "Vitamin B12",
    fields: [{ label: "Vitamin B12", key: "vitaminB12", unit: "pg/mL", type: "number", normalRange: { min: 200, max: 900 } }],
  },
  {
    name: "Electrolytes Panel",
    fields: [
      { label: "Sodium", key: "sodium", unit: "mEq/L", type: "number", normalRange: { min: 135, max: 145 } },
      { label: "Potassium", key: "potassium", unit: "mEq/L", type: "number", normalRange: { min: 3.5, max: 5.1 } },
      { label: "Chloride", key: "chloride", unit: "mEq/L", type: "number", normalRange: { min: 98, max: 107 } },
      { label: "Bicarbonate", key: "bicarbonate", unit: "mEq/L", type: "number", normalRange: { min: 22, max: 29 } },
    ],
  },
  {
    name: "CRP (C-Reactive Protein)",
    fields: [{ label: "CRP", key: "crp", unit: "mg/L", type: "number", normalRange: { min: 0, max: 6 } }],
  },
  {
    name: "ESR (Erythrocyte Sedimentation Rate)",
    fields: [{ label: "ESR", key: "esr", unit: "mm/hr", type: "number", normalRange: { min: 0, max: 20 }, referenceNote: "Male: 0–15, Female: 0–20" }],
  },
  {
    name: "Widal Test",
    fields: [
      { label: "S. Typhi O", key: "typhiO", unit: "titre", type: "text", referenceNote: "Normal: < 1:80" },
      { label: "S. Typhi H", key: "typhiH", unit: "titre", type: "text", referenceNote: "Normal: < 1:80" },
      { label: "S. Paratyphi AH", key: "paratyphiAH", unit: "titre", type: "text", referenceNote: "Normal: < 1:80" },
      { label: "S. Paratyphi BH", key: "paratyphiBH", unit: "titre", type: "text", referenceNote: "Normal: < 1:80" },
    ],
  },
  {
    name: "Dengue Profile",
    fields: [
      { label: "NS1 Antigen", key: "ns1", unit: "", type: "text", referenceNote: "Negative" },
      { label: "IgM Antibody", key: "igm", unit: "", type: "text", referenceNote: "Negative" },
      { label: "IgG Antibody", key: "igg", unit: "", type: "text", referenceNote: "Negative" },
    ],
  },
  {
    name: "Malaria Parasite Test",
    fields: [
      { label: "MP Smear", key: "mpSmear", unit: "", type: "text", referenceNote: "Negative" },
      { label: "Rapid Antigen (Pf/Pv)", key: "rapidAntigen", unit: "", type: "text", referenceNote: "Negative" },
    ],
  },
  {
    name: "Blood Grouping & Rh Typing",
    fields: [
      { label: "Blood Group", key: "bloodGroup", unit: "", type: "text" },
      { label: "Rh Factor", key: "rhFactor", unit: "", type: "text" },
    ],
  },
  {
    name: "PT/INR (Coagulation Profile)",
    fields: [
      { label: "PT (Patient)", key: "ptPatient", unit: "sec", type: "number", normalRange: { min: 11, max: 13.5 } },
      { label: "PT (Control)", key: "ptControl", unit: "sec", type: "number", normalRange: { min: 11, max: 14 } },
      { label: "INR", key: "inr", unit: "", type: "number", normalRange: { min: 0.8, max: 1.1 } },
    ],
  },
  {
    name: "Iron Studies",
    fields: [
      { label: "Serum Iron", key: "serumIron", unit: "µg/dL", type: "number", normalRange: { min: 60, max: 170 } },
      { label: "TIBC", key: "tibc", unit: "µg/dL", type: "number", normalRange: { min: 240, max: 450 } },
      { label: "Ferritin", key: "ferritin", unit: "ng/mL", type: "number", normalRange: { min: 11, max: 336 }, referenceNote: "Male: 24–336, Female: 11–307" },
      { label: "% Saturation", key: "percentSaturation", unit: "%", type: "number", normalRange: { min: 20, max: 50 } },
    ],
  },
  {
    name: "Cardiac Risk Marker (Troponin I)",
    fields: [{ label: "Troponin I", key: "troponinI", unit: "ng/mL", type: "number", normalRange: { min: 0, max: 0.04 }, referenceNote: "Normal: <0.04" }],
  },
];