import { StockHolding } from "@/types";

const holdings: StockHolding[] = [
  { id: 1,  name: "HDFC Bank",          purchasePrice: 1490, qty: 50,   sector: "Financial", nseCode: "HDFCBANK" },
  { id: 2,  name: "Bajaj Finance",      purchasePrice: 6466, qty: 15,   sector: "Financial", nseCode: "BAJFINANCE" },
  { id: 3,  name: "ICICI Bank",         purchasePrice: 780,  qty: 84,   sector: "Financial", nseCode: "ICICIBANK" },
  { id: 4,  name: "Bajaj Housing",      purchasePrice: 130,  qty: 504,  sector: "Financial", nseCode: "BAJAJHFL" },
  { id: 5,  name: "Savani Financials",  purchasePrice: 24,   qty: 1080, sector: "Financial", nseCode: "SAVANIFIN" },

  { id: 6,  name: "Affle India",    purchasePrice: 1151, qty: 50,  sector: "Tech", nseCode: "AFFLE" },
  { id: 7,  name: "LTI Mindtree",   purchasePrice: 4775, qty: 16,  sector: "Tech", nseCode: "LTIM" },
  { id: 8,  name: "KPIT Tech",      purchasePrice: 672,  qty: 61,  sector: "Tech", nseCode: "KPITTECH" },
  { id: 9,  name: "Tata Tech",      purchasePrice: 1072, qty: 63,  sector: "Tech", nseCode: "TATATECH" },
  { id: 10, name: "BLS E-Services", purchasePrice: 232,  qty: 191, sector: "Tech", nseCode: "BLSE" },
  { id: 11, name: "Tanla",          purchasePrice: 1134, qty: 45,  sector: "Tech", nseCode: "TANLA" },

  { id: 12, name: "DMart",          purchasePrice: 3777, qty: 27, sector: "Consumer", nseCode: "DMART" },
  { id: 13, name: "Tata Consumer",  purchasePrice: 845,  qty: 90, sector: "Consumer", nseCode: "TATACONSUM" },
  { id: 14, name: "Pidilite",       purchasePrice: 2376, qty: 36, sector: "Consumer", nseCode: "PIDILITIND" },

  { id: 15, name: "Tata Power", purchasePrice: 224,  qty: 225, sector: "Power", nseCode: "TATAPOWER" },
  { id: 16, name: "KPI Green",  purchasePrice: 875,  qty: 50,  sector: "Power", nseCode: "KPIGREEN" },
  { id: 17, name: "Suzlon",     purchasePrice: 44,   qty: 450, sector: "Power", nseCode: "SUZLON" },
  { id: 18, name: "Gensol",     purchasePrice: 998,  qty: 45,  sector: "Power", nseCode: "GENSOL" },

  { id: 19, name: "Hariom Pipes", purchasePrice: 580,  qty: 60, sector: "Pipe", nseCode: "HARIOMPIPE" },
  { id: 20, name: "Astral",       purchasePrice: 1517, qty: 56, sector: "Pipe", nseCode: "ASTRAL" },
  { id: 21, name: "Polycab",      purchasePrice: 2818, qty: 28, sector: "Pipe", nseCode: "POLYCAB" },

  { id: 22, name: "Clean Science",  purchasePrice: 1610, qty: 32, sector: "Others", nseCode: "CLEAN" },
  { id: 23, name: "Deepak Nitrite", purchasePrice: 2248, qty: 27, sector: "Others", nseCode: "DEEPAKNTR" },
  { id: 24, name: "Fine Organic",   purchasePrice: 4284, qty: 16, sector: "Others", nseCode: "FINEORG" },
  { id: 25, name: "Gravita",        purchasePrice: 2037, qty: 8,  sector: "Others", nseCode: "GRAVITA" },
  { id: 26, name: "SBI Life",       purchasePrice: 1197, qty: 49, sector: "Others", nseCode: "SBILIFE" },
];

export default holdings;
