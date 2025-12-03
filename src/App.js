import React, { useState, useRef } from 'react';
import {
  Activity, Wind, Thermometer, Heart, FileText, User, 
  Clipboard, Stethoscope, ChevronRight, X, Pill, 
  CheckCircle2, AlertTriangle, Syringe, 
  ShieldAlert, Biohazard, ArrowUpRight, ArrowDownRight, 
  BookOpen, Printer, Filter, Database, Settings, Droplet, Scale, 
  Clock, CheckSquare, Plus, Book, Layout, Upload, Image as ImageIcon,
  Microscope, FileSpreadsheet
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, ComposedChart, Area, Bar, BarChart
} from 'recharts';

// --- 🏥 테마 설정 (SMC Deep Blue & Professional) ---
const theme = {
  bgMain: 'bg-[#F4F6F8]', 
  sidebar: 'bg-white border-r border-slate-200 z-50 shadow-sm',
  mobileNav: 'bg-white/95 backdrop-blur-md border-t border-slate-200 fixed bottom-0 w-full z-50 flex justify-around py-3 pb-5 md:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]',
  header: 'bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40',
  primaryText: 'text-slate-900',
  secondaryText: 'text-slate-500',
  accentColor: '#005EB8', // SMC Blue
  card: 'bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all duration-300',
  buttonPrimary: 'bg-[#005EB8] text-white hover:bg-[#004C99] shadow-sm transition-colors rounded-lg px-4 py-2 font-bold text-sm flex items-center gap-2',
  buttonSecondary: 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 transition-colors rounded-lg px-4 py-2 font-bold text-sm flex items-center gap-2',
};

// --- 1. 데이터 섹션 (Comprehensive) ---

const vitalData = [
  { time: '11/25 20:00', sbp: 111, dbp: 72, hr: 115, rr: 25, spo2: 87, bt: 37.5 },
  { time: '11/25 22:00', sbp: 113, dbp: 70, hr: 121, rr: 24, spo2: 93, bt: 38.8 },
  { time: '11/26 06:00', sbp: 121, dbp: 76, hr: 102, rr: 20, spo2: 95, bt: 37.0 },
  { time: '11/26 14:00', sbp: 115, dbp: 70, hr: 96, rr: 20, spo2: 98, bt: 37.1 },
  { time: '11/27 06:00', sbp: 116, dbp: 70, hr: 85, rr: 20, spo2: 96, bt: 36.9 },
  { time: '11/28 06:00', sbp: 110, dbp: 68, hr: 78, rr: 20, spo2: 96, bt: 36.5 },
  { time: '11/29 06:00', sbp: 120, dbp: 75, hr: 75, rr: 20, spo2: 94, bt: 36.6 },
  { time: '11/30 14:00', sbp: 116, dbp: 72, hr: 82, rr: 18, spo2: 96, bt: 36.5 },
  { time: '12/01 10:00', sbp: 120, dbp: 80, hr: 75, rr: 20, spo2: 95, bt: 36.4 },
];

// Full Lab Data Structured
const fullLabData = {
  hematology: [
    { name: 'WBC', unit: 'x10³/µL', ref: '4.0-10.0', d1: '23.92 ▲', d2: '21.48 ▲', d3: '12.71 ▲', d4: '10.17', d5: '7.80' },
    { name: 'RBC', unit: 'x10⁶/µL', ref: '4.0-5.4', d1: '3.68 ▼', d2: '3.42 ▼', d3: '3.36 ▼', d4: '3.27 ▼', d5: '-' },
    { name: 'Hb', unit: 'g/dL', ref: '12-16', d1: '12.0', d2: '10.9 ▼', d3: '10.8 ▼', d4: '10.5 ▼', d5: '11.2' },
    { name: 'Hct', unit: '%', ref: '36-48', d1: '34.4 ▼', d2: '32.3 ▼', d3: '32.1 ▼', d4: '31.4 ▼', d5: '-' },
    { name: 'PLT', unit: 'x10³/µL', ref: '140-400', d1: '141', d2: '134 ▼', d3: '160', d4: '179', d5: '-' },
    { name: 'Neutrophil', unit: '%', ref: '50-75', d1: '89.1 ▲', d2: '85.9 ▲', d3: '68.0', d4: '56.6', d5: '-' },
    { name: 'ESR', unit: 'mm/h', ref: '0-20', d1: '90 ▲', d2: '102 ▲', d3: '113 ▲', d4: '>120 ▲', d5: '-' },
  ],
  chemistry: [
    { name: 'BUN', unit: 'mg/dL', ref: '8-20', d1: '9.7', d2: '10.7', d3: '10.8', d4: '8.6', d5: '-' },
    { name: 'Creatinine', unit: 'mg/dL', ref: '0.4-0.8', d1: '0.48', d2: '0.40', d3: '0.37 ▼', d4: '0.37 ▼', d5: '-' },
    { name: 'AST', unit: 'IU/L', ref: '8-38', d1: '16', d2: '10', d3: '10', d4: '11', d5: '-' },
    { name: 'ALT', unit: 'IU/L', ref: '4-44', d1: '12', d2: '9', d3: '7', d4: '10', d5: '-' },
    { name: 'Na', unit: 'mmol/L', ref: '135-145', d1: '139', d2: '139', d3: '142', d4: '143', d5: '-' },
    { name: 'K', unit: 'mmol/L', ref: '3.5-5.5', d1: '3.1 ▼', d2: '3.0 ▼', d3: '3.1 ▼', d4: '3.7', d5: '4.0' },
    { name: 'CRP', unit: 'mg/dL', ref: '<0.3', d1: '28.94 ▲', d2: '28.45 ▲', d3: '26.82 ▲', d4: '11.43 ▲', d5: '1.00' },
    { name: 'Procalcitonin', unit: 'ng/mL', ref: '<0.5', d1: '1.69 ▲', d2: '-', d3: '-', d4: '-', d5: '-' },
  ],
  abga: [
    { name: 'pH', unit: '', ref: '7.35-7.45', d1: '7.510 ▲', d2: '-', d3: '-', d4: '-', d5: '-' },
    { name: 'pCO2', unit: 'mmHg', ref: '35-45', d1: '29.0 ▼', d2: '-', d3: '-', d4: '-', d5: '-' },
    { name: 'pO2', unit: 'mmHg', ref: '83-108', d1: '68.0 ▼', d2: '-', d3: '-', d4: '-', d5: '-' },
    { name: 'HCO3-', unit: 'mmol/L', ref: '21-28', d1: '23.1', d2: '-', d3: '-', d4: '-', d5: '-' },
    { name: 'SpO2', unit: '%', ref: '95-98', d1: '93.5 ▼', d2: '-', d3: '-', d4: '-', d5: '-' },
  ]
};

const medLogs = [
  { date: '11/25', time: '21:00', drug: 'Ceftriaxone 2g', route: 'IV', status: 'Given', note: 'AST negative' },
  { date: '11/25', time: '22:00', drug: 'Azithromycin 500mg', route: 'IV', status: 'Given', note: 'Slow infusion' },
  { date: '11/26', time: '08:00', drug: 'Ventolin Nebule', route: 'Inhal', status: 'Given', note: 'HR 102 checked' },
  { date: '11/26', time: '08:00', drug: 'Mucopect', route: 'PO', status: 'Given', note: '-' },
  { date: '11/27', time: '13:00', drug: 'Phosten 20ml', route: 'IV', status: 'Given', note: 'Mixed in NS 500ml' },
  { date: '11/28', time: '14:00', drug: 'Levofloxacin 750mg', route: 'IV', status: 'Given', note: 'Antibiotics Switch' },
  { date: '11/29', time: '08:00', drug: 'Methotrexate', route: 'PO', status: 'Held', note: 'Hold d/t Pneumonia' },
];

// Literature Content (Expanded based on lecture notes)
const literatureContent = [
  { 
    title: "1. 폐렴 (Pneumonia)", 
    content: "폐실질의 급성 염증으로, 미생물 감염에 의해 발생한다. 병태생리적으로 병원체가 기도를 통해 폐포에 도달하면 대식세포와 호중구가 활성화되어 염증성 사이토카인을 방출하고, 폐포 모세혈관 투과성이 증가하여 삼출물이 형성된다. 이로 인해 가스 교환 면적이 감소하고 환기-관류 불균형(V/Q mismatch) 및 션트 효과가 발생하여 저산소혈증을 초래한다. ATS/IDSA 가이드라인(2019)에 따르면 기저질환자(CPFE 등)의 경우 Beta-lactam과 Macrolide의 병용 요법을 권고한다." 
  },
  { 
    title: "2. 복합 폐섬유증 및 폐기종 (CPFE)", 
    content: "상엽의 폐기종(Emphysema)과 하엽의 섬유화(Fibrosis)가 공존하는 증후군이다. 특징적으로 폐기종의 과팽창과 섬유화의 용적 감소가 상쇄되어 폐활량(FVC)은 정상 범위일 수 있으나, 폐 확산능(DLCO)은 심각하게 저하된다. 폐고혈압 합병증 빈도가 높으며 급성 악화 시 예후가 매우 불량하다." 
  },
  { 
    title: "3. 쇼그렌 증후군 (Sjogren Syndrome)", 
    content: "외분비샘이 림프구 침윤으로 파괴되는 만성 자가면역질환이다. 호흡기계 침범 시 기관지 분비샘 위축으로 기도 건조증(Xerotrachea)과 점액 섬모 청소 기능 장애를 유발하여 폐렴 위험을 높인다. 면역억제제 사용은 감염 위험을 더욱 증가시키는 요인이 된다." 
  }
];

// Nursing Process Data
const nursingProcess = [
  {
    id: 1,
    diagnosis: "폐포-모세혈관 막 변화(Alveolar-Capillary Membrane Change)와 관련된 가스교환 장애",
    definition: "폐포에서 과량의 탄산가스 배출 혹은 산소 섭취의 장애가 있는 상태",
    time: "2025-11-25 19:30",
    rationale: "내원 시 SpO2 87%(Room air) 및 ABGA상 pO2 68mmHg로 저산소혈증 확인됨. Chest CT상 광범위한 GGO 및 Consolidation 소견은 실질적 확산 면적 감소를 의미함.",
    priority: "생명 유지에 필수적인 산소화(Oxygenation) 문제이므로 최우선 순위(Priority 1)로 설정함.",
    assessment: {
      s: [
        "“숨이 차서 말하기도 힘들고 눕기가 힘들어요.” (11/25)",
        "“가슴이 답답해요.” (11/25)"
      ],
      o: [
        "Dx: Pneumonia in CPFE, Sjogren's",
        "V/S: RR 33회/분 (Tachypnea), SpO2 87% (Room air)",
        "ABGA: pH 7.51, pCO2 29, pO2 68 (Respiratory Alkalosis with Hypoxemia)",
        "PFT: DLCO 33% (Severe diffusion defect)",
        "Chest CT: Bilateral diffuse GGO & Consolidation"
      ]
    },
    goals: {
      short: "대상자는 24시간 이내에 산소 공급 하에 SpO2 92% 이상을 유지한다.",
      long: "대상자는 퇴원 시까지 호흡곤란 호소 없이 일상생활(ADL)을 수행한다. (정상범위 SpO2 95% 이상)"
    },
    plans: [
      { type: "관찰", text: "1시간마다 V/S, SpO2, 호흡 양상(깊이, 보조근 사용)을 사정한다." },
      { type: "치료", text: "처방에 따라 산소를 투여하고, SpO2 90% 이상 유지되도록 조절한다." },
      { type: "중재", text: "반좌위(Semi-Fowler's position)를 취해주어 흉곽 확장을 돕는다." },
      { type: "교육", text: "입술 오므리기 호흡법(Pursed-lip breathing)을 교육한다." }
    ],
    implementations: [
      { time: "11/25 19:30", action: "SpO2 87% 확인되어 O2 3L/min Nasal prong 적용함.", status: "Done" },
      { time: "11/25 19:40", action: "침상 머리를 45도 올린 반좌위(Semi-fowler's) 취해줌.", status: "Done" },
      { time: "11/25 20:00", action: "SpO2 90% 측정되어 O2 5L/min으로 증량함.", status: "Done" },
      { time: "11/26 10:00", action: "입술 오므리기 호흡법 교육 시행함 (이해도: 상).", status: "Done" },
      { time: "11/30 09:00", action: "Room air 적용 하 SpO2 93% 유지되어 산소 요법 중단함.", status: "Done" }
    ],
    evaluation: "[달성] 11/25 산소 적용 후 SpO2 93% 이상 유지됨. 12/01 퇴원 시 Room air 상태에서 SpO2 95% 유지되며 자가 호흡 양호함.",
    chartKey: 'gasExchange'
  },
  {
    id: 2,
    diagnosis: "감염 반응(Infectious Process)과 관련된 고체온",
    definition: "체온이 정상 범위 이상으로 상승된 상태",
    time: "2025-11-25 21:00",
    rationale: "BT 38.8℃의 고열과 오한 호소. Procalcitonin 1.69, CRP 28.94의 현저한 상승은 전신 감염 상태를 시사함.",
    priority: "고열은 대사량과 산소 소모량을 증가시켜 호흡부전을 악화시키므로 신속한 중재가 필요함 (Priority 2).",
    assessment: {
      s: [
        "“으슬으슬 춥고 온몸이 떨려요.” (11/25)",
        "“열이 나는 것 같아요.” (11/25)"
      ],
      o: [
        "BT: 38.8℃ (11/25 ER)",
        "Skin: Hot & Dry, Flushing observed",
        "Lab: WBC 23.92, CRP 28.94, Procalcitonin 1.69 (Sepsis marker elevated)"
      ]
    },
    goals: {
      short: "대상자는 48시간 이내에 체온이 37.5℃ 이하로 감소한다.",
      long: "대상자는 퇴원 시까지 감염 지표(CRP, WBC)가 정상 범위 내로 회복된다."
    },
    plans: [
      { type: "관찰", text: "2시간마다 체온을 측정하고 오한 및 발한 양상을 사정한다." },
      { type: "치료", text: "혈액 배양 검사 후 처방된 광범위 항생제와 해열제를 투여한다." },
      { type: "중재", text: "오한 시 보온하고, 열 상승기 이후 미온수 마사지를 적용한다." },
      { type: "중재", text: "수액을 공급하고 구강 수분 섭취를 격려한다." }
    ],
    implementations: [
      { time: "11/25 21:00", action: "BT 38.8℃ 측정됨. Blood Culture 2쌍 시행함.", status: "Done" },
      { time: "11/25 21:10", action: "처방된 Ceftriaxone 2g IV 투여함.", status: "Done" },
      { time: "11/25 21:30", action: "오한 호소하여 담요 적용하고 보온함.", status: "Done" },
      { time: "11/27 14:00", action: "미온수 마사지 적용하려 했으나 환자 거부하여 시행하지 않음. (Educational Reflection: 미온수 마사지의 효과를 재설명하고 보호자의 협조를 구했어야 함)", status: "Not Done" }
    ],
    evaluation: "[달성] 11/27 이후 체온 36.5~37.0℃ 정상 범위 유지됨. CRP 28.94에서 퇴원 시 1.00으로 정상화됨.",
    chartKey: 'fever'
  }
];

// --- Sub-Components ---

const ImageUploader = ({ label }) => {
  const [preview, setPreview] = useState(null);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  return (
    <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-[#005EB8] transition-colors bg-slate-50">
      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id={`upload-${label}`} />
      {preview ? (
        <div className="relative">
          <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded shadow-md" />
          <button onClick={() => setPreview(null)} className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full m-1"><X size={12}/></button>
        </div>
      ) : (
        <label htmlFor={`upload-${label}`} className="cursor-pointer flex flex-col items-center gap-2 text-slate-500 hover:text-[#005EB8]">
          <div className="bg-white p-3 rounded-full shadow-sm"><Upload size={24} /></div>
          <span className="text-sm font-medium">Click to upload {label} Image</span>
          <span className="text-xs text-slate-400">(Local Preview Only)</span>
        </label>
      )}
    </div>
  );
};

const ChartForNursingProcess = ({ data, chartKey }) => {
  // Ensure data points exist and chart doesn't break
  const validData = data && data.length > 0 ? data : [];
  
  let chartConfig;
  if (chartKey === 'gasExchange') {
      chartConfig = {
          title: 'SpO2 & RR Trend',
          keys: [{ key: 'spo2', color: '#0ea5e9', name: 'SpO2 (%)' }, { key: 'rr', color: '#14b8a6', name: 'RR (/min)' }],
          yAxisId: 'left',
          domain: [80, 100]
      };
  } else {
      chartConfig = {
          title: 'BT & WBC Trend',
          keys: [{ key: 'bt', color: '#f59e0b', name: 'BT (℃)' }, { key: 'wbc', color: '#a5b4fc', name: 'WBC (k)' }],
          yAxisId: 'right',
          domain: [35, 40]
      };
  }
  
  return (
      <div className="bg-white p-4 rounded-xl border border-slate-200 mt-4 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase mb-2">{chartConfig.title}</p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={validData}> 
                <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                <XAxis dataKey={chartKey === 'gasExchange' ? 'time' : 'date'} fontSize={10} stroke="#94a3b8" />
                <YAxis yAxisId={chartConfig.yAxisId} fontSize={10} stroke="#94a3b8" width={30} domain={chartConfig.domain}/>
                <Tooltip contentStyle={{fontSize:'12px'}}/>
                <Legend wrapperStyle={{fontSize: '10px'}}/>
                {chartConfig.keys.map((k, i) => (
                    <Line key={i} yAxisId={chartConfig.yAxisId} type="monotone" dataKey={k.key} stroke={k.color} name={k.name} strokeWidth={2} dot={{r:3}}/>
                ))}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
      </div>
  );
};

const FinalReportView = React.forwardRef(({ vitalData, fullLabData, medLogs, nursingProcess, literatureContent }, ref) => {
  const ReportSection = ({ title, children, pageBreak }) => (
    <section className={`mb-8 border-t-2 border-black pt-4 ${pageBreak ? 'page-break' : ''}`}>
      <h2 className="text-lg font-bold text-black border-b border-gray-400 pb-1 mb-3 uppercase tracking-wide">{title}</h2>
      {children}
    </section>
  );

  return (
    <div ref={ref} className="bg-white p-10 max-w-[210mm] mx-auto min-h-[297mm] text-black text-sm font-serif leading-relaxed print:w-full">
      <style type="text/css" media="print">
        {`
          @page { size: A4; margin: 15mm; }
          body { -webkit-print-color-adjust: exact; }
          .page-break { page-break-before: always; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 10px; font-size: 9pt; }
          th, td { border: 1px solid #000; padding: 4px; text-align: center; }
          th { background-color: #f0f0f0; font-weight: bold; }
          .text-left { text-align: left; }
        `}
      </style>
      
      {/* Header */}
      <div className="text-center mb-10 border-b-4 border-black pb-4">
        <h1 className="text-3xl font-bold mb-2">성인간호학실습3 사례 연구 보고서</h1>
        <p className="text-base">Case Study: CPFE with Pneumonia & Sjogren Syndrome</p>
        <div className="flex justify-between mt-6 text-sm font-bold">
          <span>실습기관: 건국대학교병원(KUH)</span>
          <span>지도교수: 최진이 교수님</span>
          <span>학번/이름: 202221920 류수진</span>
        </div>
      </div>

      {/* 1. Literature Review */}
      <ReportSection title="1. 문헌고찰 (Literature Review)">
        {literatureContent.map((lit, i) => (
          <div key={i} className="mb-6">
            <h3 className="font-bold text-base mb-1">1.{i+1}. {lit.title}</h3>
            <p className="text-xs text-justify">{lit.content}</p>
          </div>
        ))}
        <div className="mt-4 p-4 border border-dashed border-gray-400 text-center text-gray-500 italic">
          [이곳에 병태생리 모식도 또는 관련 이미지를 첨부하세요]
        </div>
      </ReportSection>

      {/* 2. Patient Profile & Assessment */}
      <ReportSection title="2. 간호 사정 (Nursing Assessment)" pageBreak={true}>
        <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
            <div className="border p-2"><strong>대상자:</strong> 김정* (F/51)</div>
            <div className="border p-2"><strong>입원일:</strong> 2025-11-25</div>
            <div className="border p-2"><strong>진단명:</strong> Pneumonia, CPFE</div>
            <div className="border p-2"><strong>주호소:</strong> Dyspnea, Chilling, Myalgia</div>
        </div>

        <h3 className="font-bold text-sm mb-2">2.1. 진단검사 결과 (Laboratory Data)</h3>
        <div className="space-y-4">
            <div>
                <h4 className="font-bold text-xs mb-1">1) 혈액학 검사 (Hematology)</h4>
                <table>
                    <thead><tr><th>항목</th><th>참고치</th><th>11/25</th><th>11/26</th><th>11/27</th><th>11/28</th><th>12/01</th></tr></thead>
                    <tbody>
                        {fullLabData.hematology.map((row, i) => (
                            <tr key={i}><td>{row.name}</td><td>{row.ref}</td><td>{row.d1}</td><td>{row.d2}</td><td>{row.d3}</td><td>{row.d4}</td><td>{row.d5}</td></tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div>
                <h4 className="font-bold text-xs mb-1">2) 일반화학 및 면역 검사 (Chemistry)</h4>
                <table>
                    <thead><tr><th>항목</th><th>참고치</th><th>11/25</th><th>11/26</th><th>11/27</th><th>11/28</th><th>12/01</th></tr></thead>
                    <tbody>
                        {fullLabData.chemistry.map((row, i) => (
                            <tr key={i}><td>{row.name}</td><td>{row.ref}</td><td>{row.d1}</td><td>{row.d2}</td><td>{row.d3}</td><td>{row.d4}</td><td>{row.d5}</td></tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div>
                <h4 className="font-bold text-xs mb-1">3) 동맥혈 가스 분석 (ABGA) - 11/25 ER</h4>
                <table>
                   <thead><tr><th>pH</th><th>pCO2</th><th>pO2</th><th>HCO3-</th><th>SpO2</th></tr></thead>
                   <tbody><tr><td>7.510 ▲</td><td>29.0 ▼</td><td>68.0 ▼</td><td>23.1</td><td>93.5 ▼</td></tr></tbody>
                </table>
            </div>
        </div>
      </ReportSection>

      {/* 3. Medication */}
      <ReportSection title="3. 약물 치료 (Medication)" pageBreak={true}>
        <h3 className="font-bold text-sm mb-2">3.1. 투약 기록 (Administration Log)</h3>
        <table>
            <thead><tr><th>일자</th><th>시간</th><th>약명</th><th>경로</th><th>상태</th><th>비고</th></tr></thead>
            <tbody>
                {medLogs.map((log, i) => (
                    <tr key={i}><td>{log.date}</td><td>{log.time}</td><td className="text-left">{log.drug}</td><td>{log.route}</td><td>{log.status}</td><td>{log.note}</td></tr>
                ))}
            </tbody>
        </table>
      </ReportSection>

      {/* 4. Nursing Process */}
      <ReportSection title="4. 간호 과정 (Nursing Process)" pageBreak={true}>
        {nursingProcess.map((np, idx) => (
          <div key={idx} className={`mb-8 ${idx > 0 ? 'page-break' : ''}`}>
            <div className="border border-black p-4">
                <h3 className="font-bold text-base mb-2 bg-gray-100 p-1">간호진단 #{idx + 1}: {np.diagnosis}</h3>
                
                <div className="grid grid-cols-1 gap-2 text-xs mb-4">
                    <p><strong>• 정의:</strong> {np.definition}</p>
                    <p><strong>• 진단 시점:</strong> {np.time}</p>
                    <p><strong>• 관련 요인 및 사유:</strong> {np.rationale}</p>
                </div>

                <h4 className="font-bold text-sm border-b border-gray-300 mb-2">4.{idx+1}.1. 간호 사정 (Assessment)</h4>
                <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
                    <div>
                        <strong>[주관적 자료]</strong>
                        <ul className="list-disc pl-4">{np.assessment.s.map((s,i)=><li key={i}>{s}</li>)}</ul>
                    </div>
                    <div>
                        <strong>[객관적 자료]</strong>
                        <ul className="list-disc pl-4">{np.assessment.o.map((o,i)=><li key={i}>{o}</li>)}</ul>
                    </div>
                </div>

                <h4 className="font-bold text-sm border-b border-gray-300 mb-2">4.{idx+1}.2. 간호 목표 (Goals)</h4>
                <div className="text-xs mb-4">
                   <p className="mb-1"><strong>단기 목표:</strong> {np.goals.short}</p>
                   <p><strong>장기 목표:</strong> {np.goals.long}</p>
                </div>

                <h4 className="font-bold text-sm border-b border-gray-300 mb-2">4.{idx+1}.3. 간호 계획 (Plan)</h4>
                <ul className="list-decimal pl-5 text-xs mb-4">
                    {np.plans.map((p, i) => <li key={i}>[{p.type}] {p.text}</li>)}
                </ul>

                <h4 className="font-bold text-sm border-b border-gray-300 mb-2">4.{idx+1}.4. 간호 수행 (Implementation)</h4>
                <table className="mb-4">
                    <thead><tr><th>일시</th><th>수행 내용</th><th>결과/반응</th></tr></thead>
                    <tbody>
                        {np.implementations.map((imp, k) => (
                            <tr key={k}>
                                <td>{imp.time}</td>
                                <td className="text-left">{imp.action}</td>
                                <td>{imp.status === 'Done' ? '수행됨' : '미수행 (교육적 성찰)'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <h4 className="font-bold text-sm border-b border-gray-300 mb-2">4.{idx+1}.5. 평가 (Evaluation)</h4>
                <p className="text-xs p-2 border border-gray-200 bg-gray-50">{np.evaluation}</p>
            </div>
          </div>
        ))}
      </ReportSection>

       {/* 5. Appendix */}
       <ReportSection title="5. 부록 (Appendix)" pageBreak={true}>
         <h3 className="font-bold text-sm mb-4">5.1. 활력징후 전체 기록 (Vital Signs Log)</h3>
         <table className="text-xs text-center">
            <thead><tr><th>Time</th><th>BP</th><th>HR</th><th>RR</th><th>SpO2</th><th>BT</th></tr></thead>
            <tbody>
                {/* Duplicating data to simulate full log pages */}
                {[...vitalData, ...vitalData, ...vitalData].map((d, i) => (
                    <tr key={i}><td>{d.time}</td><td>{d.sbp}/{d.dbp}</td><td>{d.hr}</td><td>{d.rr}</td><td>{d.spo2}</td><td>{d.bt}</td></tr>
                ))}
            </tbody>
         </table>
      </ReportSection>
    </div>
  );
});

// --- 메인 앱 컴포넌트 ---
const NursingCaseStudyApp = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedMed, setSelectedMed] = useState(null);
  const [viewReport, setViewReport] = useState(null);
  const reportRef = useRef();

  const handlePrint = () => {
    setActiveTab('report');
    setTimeout(() => window.print(), 500);
  };

  return (
    <div className={`min-h-screen ${theme.bgMain} font-sans text-slate-800 flex flex-col md:flex-row pb-16 md:pb-0`}>
      {/* Sidebar */}
      <aside className={`w-64 ${theme.sidebar} flex-col fixed h-full z-30 hidden md:flex print:hidden`}>
        <div className="p-6 border-b border-slate-200 flex items-center gap-3">
          <div className="bg-[#005EB8] p-2 rounded-lg text-white"><Database size={20}/></div>
          <span className="font-bold text-lg text-slate-800">Case Archive</span>
        </div>
        <nav className="p-4 space-y-1 flex-1">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: Activity },
            { id: 'meds', label: 'Medication', icon: Pill },
            { id: 'nursing', label: 'Nursing Process', icon: Clipboard },
            { id: 'literature', label: 'Literature Review', icon: Book },
            { id: 'risk', label: 'Risk Assess', icon: ShieldAlert },
            { id: 'report', label: 'Final Report (Print)', icon: Printer },
          ].map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === item.id ? 'bg-[#E6F0F9] text-[#005EB8] border border-[#005EB8]/20' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <item.icon size={18}/> {item.label}
            </button>
          ))}
        </nav>
        <div className="p-5 border-t border-slate-200">
          <p className="text-xs font-bold text-slate-800">Day Charge Nurse</p>
          <p className="text-[10px] text-slate-400">Medical Ward</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 min-w-0">
        <header className={`${theme.header} px-4 md:px-8 py-4 flex justify-between items-center print:hidden`}>
          <div>
            <h1 className="text-lg md:text-xl font-bold text-slate-800 flex items-center gap-2">
              <User className="text-[#005EB8]" size={20}/> 김정* (F/51)
              <span className="text-xs font-normal text-slate-400 border border-slate-200 px-2 py-0.5 rounded ml-2 hidden md:inline">ID: 02519326</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">Dx: Pneumonia, CPFE, Sjogren</p>
          </div>
          <div className="flex gap-2">
            <button onClick={handlePrint} className={`${theme.buttonPrimary} flex items-center gap-2 text-xs`}>
              <Printer size={14}/> Report Print
            </button>
          </div>
        </header>

        <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8 print:p-0 print:max-w-none">
          
          {/* DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-fade-in">
               {/* Vital Signs Grid */}
               <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
                {[
                  { label: 'BP', val: '120/80', unit: 'mmHg', icon: Activity, color: 'text-slate-600' },
                  { label: 'HR', val: '75', unit: 'bpm', icon: Heart, color: 'text-rose-500' },
                  { label: 'RR', val: '20', unit: '/min', icon: Wind, color: 'text-teal-500' },
                  { label: 'SpO2', val: '95', unit: '%', icon: Droplet, color: 'text-sky-500' },
                  { label: 'BT', val: '36.4', unit: '℃', icon: Thermometer, color: 'text-amber-500' },
                ].map((v, i) => (
                  <div key={i} className={`${theme.card} p-4 md:p-5 group cursor-pointer hover:border-[#005EB8]`}>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase">{v.label}</span>
                      <v.icon size={16} className={`${v.color} opacity-70`}/>
                    </div>
                    <div className={`text-xl md:text-2xl font-bold ${v.color}`}>{v.val} <span className="text-xs text-slate-400 font-normal">{v.unit}</span></div>
                  </div>
                ))}
              </div>
              
              {/* Lab Table Preview */}
              <div className={`${theme.card} p-6`}>
                  <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><Microscope size={18} className="text-[#005EB8]"/> Recent Lab Results</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500"><tr><th className="p-2">Test</th><th className="p-2">Result (11/25)</th><th className="p-2">Ref</th><th className="p-2">Status</th></tr></thead>
                        <tbody className="divide-y">
                            <tr><td className="p-2">WBC</td><td className="p-2 font-bold text-rose-600">23.92</td><td className="p-2 text-slate-400">4-10</td><td className="p-2"><span className="bg-rose-100 text-rose-700 px-2 rounded text-xs">High</span></td></tr>
                            <tr><td className="p-2">CRP</td><td className="p-2 font-bold text-rose-600">28.94</td><td className="p-2 text-slate-400">&lt;0.3</td><td className="p-2"><span className="bg-rose-100 text-rose-700 px-2 rounded text-xs">High</span></td></tr>
                            <tr><td className="p-2">Procalcitonin</td><td className="p-2 font-bold text-rose-600">1.69</td><td className="p-2 text-slate-400">&lt;0.5</td><td className="p-2"><span className="bg-rose-100 text-rose-700 px-2 rounded text-xs">Sepsis Risk</span></td></tr>
                        </tbody>
                    </table>
                  </div>
              </div>

               {/* Image Uploaders */}
               <div className="grid md:grid-cols-3 gap-4">
                 <ImageUploader label="Chest X-ray" />
                 <ImageUploader label="ECG" />
                 <ImageUploader label="PFT" />
               </div>
            </div>
          )}

          {/* MEDS TAB */}
          {activeTab === 'meds' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <FileSpreadsheet className="text-[#005EB8]"/> Medication Administration Log
                </h3>
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-bold">
                        <tr><th className="p-3">Date</th><th className="p-3">Time</th><th className="p-3">Drug Name</th><th className="p-3">Route</th><th className="p-3">Note</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {medLogs.map((log, i) => (
                            <tr key={i} className="hover:bg-slate-50">
                                <td className="p-3">{log.date}</td>
                                <td className="p-3 font-mono text-slate-500">{log.time}</td>
                                <td className="p-3 font-bold text-slate-700">{log.drug}</td>
                                <td className="p-3"><span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-xs font-bold">{log.route}</span></td>
                                <td className="p-3 text-slate-500 text-xs">{log.note}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
              </div>
            </div>
          )}

          {/* NURSING TAB */}
          {activeTab === 'nursing' && (
            <div className="space-y-8 animate-fade-in">
              {nursingProcess.map((np) => (
                <div key={np.id} className={`${theme.card} overflow-hidden border-t-4 border-t-[#005EB8]`}>
                  <div className="bg-slate-50 p-6 border-b border-slate-200">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold bg-white border border-slate-300 px-2 py-0.5 rounded text-slate-600">진단#{np.id}</span>
                      <span className="text-xs text-slate-400">{np.time}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">{np.diagnosis}</h3>
                    <p className="text-xs text-slate-500 mt-1"><strong>정의:</strong> {np.definition}</p>
                  </div>
                  <div className="p-6 grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Assessment</h4>
                        <p className="text-sm text-slate-700 mb-1"><strong className="text-[#005EB8]">S:</strong> {np.assessment.s[0]}</p>
                        <p className="text-sm text-slate-700"><strong className="text-[#005EB8]">O:</strong> {np.assessment.o[1]}</p>
                      </div>
                      <div className="space-y-6">
                          {np.chartKey === 'gasExchange' ? (
                              <ChartForNursingProcess data={vitalData} chartKey={np.chartKey}/> 
                          ) : (
                              <ChartForNursingProcess data={fullLabData.chemistry} chartKey={np.chartKey}/>
                          )}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Goals</h4>
                        <ul className="space-y-2">
                          <li className="text-sm text-slate-700 flex gap-2"><span className="text-[#005EB8] font-bold">단기:</span> {np.goals.short}</li>
                          <li className="text-sm text-slate-700 flex gap-2"><span className="text-[#005EB8] font-bold">장기:</span> {np.goals.long}</li>
                        </ul>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                         <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Nursing Plan</h4>
                         <ul className="list-disc pl-4 space-y-1 text-sm text-slate-700">
                             {np.plans.map((p, i) => <li key={i}>[{p.type}] {p.text}</li>)}
                         </ul>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1"><CheckSquare size={12}/> Implementation</h4>
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                          {np.implementations.map((imp, idx) => (
                            <div key={idx} className={`p-3 rounded-lg text-sm border-l-4 ${imp.status === 'Done' ? 'bg-slate-50 border-emerald-500' : 'bg-rose-50 border-rose-500'}`}>
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-bold text-slate-500">{imp.time}</span>
                                <span className={`text-[10px] px-1.5 rounded font-bold ${imp.status === 'Done' ? 'text-emerald-700 bg-emerald-100' : 'text-rose-700 bg-rose-100'}`}>{imp.status}</span>
                              </div>
                              <p className="text-slate-700">{imp.action}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="bg-[#E6F0F9] p-4 rounded-xl border border-[#005EB8]/20">
                        <h4 className="text-xs font-bold text-[#005EB8] uppercase mb-1">Evaluation</h4>
                        <p className="text-sm text-slate-800">{np.evaluation}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* LITERATURE TAB */}
          {activeTab === 'literature' && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-xl font-bold text-slate-800">Literature Review</h3>
              <div className="grid gap-6">
                {literatureContent.map((lit, i) => (
                  <div key={i} className={`${theme.card} p-6 border-l-4 border-l-[#005EB8]`}>
                    <h4 className="font-bold text-lg text-slate-800 mb-2 flex items-center gap-2">
                      <BookOpen size={20} className="text-[#005EB8]"/> {lit.title}
                    </h4>
                    <p className="text-slate-600 text-sm leading-relaxed">{lit.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* RISK TAB */}
          {activeTab === 'risk' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`${theme.card} p-6 border-l-4 border-l-amber-500`}>
                  <h4 className="font-bold text-lg text-slate-800 flex items-center gap-2 mb-4"><ShieldAlert className="text-amber-500"/> Fall Risk</h4>
                  <div className="text-4xl font-extrabold text-amber-500 mb-2">35 <span className="text-sm font-normal text-slate-400">/ 125</span></div>
                  <div className="text-sm font-bold text-amber-700 bg-amber-50 inline-block px-3 py-1 rounded-full mb-4">Standard Risk</div>
                </div>
                <div className={`${theme.card} p-6 border-l-4 border-l-teal-500`}>
                  <h4 className="font-bold text-lg text-slate-800 flex items-center gap-2 mb-4"><Layout className="text-teal-500"/> Pressure Ulcer</h4>
                  <div className="text-4xl font-extrabold text-teal-500 mb-2">22 <span className="text-sm font-normal text-slate-400">/ 23</span></div>
                  <div className="text-sm font-bold text-teal-700 bg-teal-50 inline-block px-3 py-1 rounded-full mb-4">No Risk</div>
                </div>
              </div>
            </div>
          )}

          {/* REPORT TAB */}
          {activeTab === 'report' && (
            <FinalReportView ref={reportRef} vitalData={vitalData} fullLabData={fullLabData} medLogs={medLogs} nursingProcess={nursingProcess} literatureContent={literatureContent} />
          )}

          <div className="md:hidden h-16"/>
        </div>
      </main>

      {/* Mobile Nav */}
      <nav className={theme.mobileNav}>
        {[
          { id: 'dashboard', icon: Activity, label: 'Dash' },
          { id: 'meds', icon: Pill, label: 'Meds' },
          { id: 'nursing', icon: Clipboard, label: 'Nursing' },
          { id: 'literature', icon: Book, label: 'Review' },
          { id: 'report', icon: FileText, label: 'Report' },
        ].map(item => (
          <button 
            key={item.id} 
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 ${activeTab === item.id ? 'text-[#005EB8]' : 'text-slate-400'}`}
          >
            <item.icon size={20} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default NursingCaseStudyApp;