import React, { useState, useRef } from 'react';
import {
  Activity, Wind, Thermometer, Heart, FileText, User, 
  Clipboard, Stethoscope, ChevronRight, X, Pill, 
  CheckCircle2, AlertTriangle, Syringe, 
  ShieldAlert, Biohazard, ArrowUpRight, ArrowDownRight, 
  BookOpen, Printer, Filter, Database, Settings, Droplet, Scale, 
  Clock, CheckSquare, Plus, Book, Layout, Upload, File, Eye, ZoomIn,
  FileSpreadsheet, Microscope
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, ComposedChart, Area, Bar
} from 'recharts';

// --- 🏥 테마 설정 (SMC Deep Blue & Pastel Accents) ---
const theme = {
  bgMain: 'bg-[#F4F6F8]', 
  sidebar: 'bg-white border-r border-slate-200 z-50',
  mobileNav: 'bg-white/95 backdrop-blur-md border-t border-slate-200 fixed bottom-0 w-full z-50 flex justify-around py-3 pb-5 md:hidden',
  header: 'bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40',
  accentColor: '#005EB8', 
  card: 'bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all duration-300',
  buttonPrimary: 'bg-[#005EB8] text-white hover:bg-[#004C99] shadow-sm transition-colors rounded-lg px-4 py-2 font-bold text-sm flex items-center gap-2',
};

// --- 1. 데이터 아카이브 (완전 복구) ---

// Vital Data (BP 포함 전체 데이터)
const vitalData = [
  { time: '11/25 20:00', sbp: 111, dbp: 72, hr: 115, rr: 25, spo2: 87, bt: 38.8 },
  { time: '11/25 22:00', sbp: 113, dbp: 70, hr: 121, rr: 24, spo2: 93, bt: 38.2 },
  { time: '11/26 06:00', sbp: 121, dbp: 76, hr: 102, rr: 20, spo2: 95, bt: 37.0 },
  { time: '11/26 14:00', sbp: 115, dbp: 70, hr: 96, rr: 20, spo2: 98, bt: 37.1 },
  { time: '11/27 06:00', sbp: 116, dbp: 70, hr: 85, rr: 20, spo2: 96, bt: 36.9 },
  { time: '11/28 06:00', sbp: 110, dbp: 68, hr: 78, rr: 20, spo2: 96, bt: 36.5 },
  { time: '11/29 06:00', sbp: 120, dbp: 75, hr: 75, rr: 20, spo2: 94, bt: 36.6 },
  { time: '11/30 14:00', sbp: 116, dbp: 72, hr: 82, rr: 18, spo2: 96, bt: 36.5 },
  { time: '12/01 10:00', sbp: 120, dbp: 80, hr: 75, rr: 20, spo2: 95, bt: 36.4 },
];

// Lab Trend Data (염증 지표)
const inflammationData = [
  { date: '11/25', crp: 28.94, wbc: 23.92, bt: 38.8, procal: 1.69 },
  { date: '11/26', crp: 28.45, wbc: 21.48, bt: 37.0, procal: 1.50 },
  { date: '11/27', crp: 26.82, wbc: 12.71, bt: 36.9, procal: 1.20 },
  { date: '11/28', crp: 11.43, wbc: 10.17, bt: 36.5, procal: 0.80 },
  { date: '12/01', crp: 1.00, wbc: 7.80, bt: 36.4, procal: 0.10 },
];

const ioData = [
  { date: '11/25', intake: 2170, output: 1700, balance: 470 },
  { date: '11/26', intake: 2180, output: 2675, balance: -495 },
  { date: '11/29', intake: 1645, output: 2950, balance: -1305 }, 
];

// Full Lab Data (Detailed)
const fullLabData = {
  hematology: [
    { name: 'WBC', unit: 'x10³/µL', ref: '4.0-10.0', d1: '23.92 ▲', d2: '21.48 ▲', d3: '12.71 ▲', d4: '10.17', d5: '7.80' },
    { name: 'RBC', unit: 'x10⁶/µL', ref: '4.0-5.4', d1: '3.68 ▼', d2: '3.42 ▼', d3: '3.36 ▼', d4: '3.27 ▼', d5: '3.50' },
    { name: 'Hb', unit: 'g/dL', ref: '12-16', d1: '12.0', d2: '10.9 ▼', d3: '10.8 ▼', d4: '10.5 ▼', d5: '11.2' },
    { name: 'PLT', unit: 'x10³/µL', ref: '140-400', d1: '141', d2: '134 ▼', d3: '160', d4: '179', d5: '185' },
    { name: 'Neutrophil', unit: '%', ref: '50-75', d1: '89.1 ▲', d2: '85.9 ▲', d3: '68.0', d4: '56.6', d5: '-' },
  ],
  chemistry: [
    { name: 'BUN/Cr', unit: 'mg/dL', ref: '8-20/0.4-0.8', d1: '9.7 / 0.48', d2: '10.7 / 0.40', d3: '10.8 / 0.37', d4: '8.6 / 0.37', d5: '-' },
    { name: 'CRP', unit: 'mg/dL', ref: '<0.3', d1: '28.94 ▲', d2: '28.45 ▲', d3: '26.82 ▲', d4: '11.43 ▲', d5: '1.00' },
    { name: 'Procalcitonin', unit: 'ng/mL', ref: '<0.5', d1: '1.69 ▲', d2: '-', d3: '-', d4: '-', d5: '-' },
    { name: 'Na/K/Cl', unit: 'mmol/L', ref: '-', d1: '139/3.1/105', d2: '139/3.0/106', d3: '142/3.1/107', d4: '143/3.7/111', d5: '-/4.0/-' },
  ],
  abga: [
    { name: 'pH', unit: '', ref: '7.35-7.45', d1: '7.510 ▲', d2: '-', d3: '-', d4: '-', d5: '-' },
    { name: 'pCO2', unit: 'mmHg', ref: '35-45', d1: '29.0 ▼', d2: '-', d3: '-', d4: '-', d5: '-' },
    { name: 'pO2', unit: 'mmHg', ref: '83-108', d1: '68.0 ▼', d2: '-', d3: '-', d4: '-', d5: '-' },
  ]
};

// Medication List (Restored Colors & Details)
const medicationList = [
  { 
    id: 1, name: "Ceftriaxone 2g", type: "Antibiotics", route: "IV", dose: "2g q24h", status: "STOP", color: "bg-rose-50 text-rose-700 border-rose-100",
    details: { class: "3세대 세팔로스포린", moa: "세균의 세포벽 합성을 억제하여 살균 작용. 그람 음성균에 강력.", adultDose: "1일 1회 1~2g 정맥 주사", sideEffects: "설사, 발진, 간수치 상승, 호산구 증가", caution: "페니실린 과민반응 병력, 신부전 환자" }
  },
  { 
    id: 2, name: "Azithromycin 500mg", type: "Antibiotics", route: "IV", dose: "500mg q24h", status: "STOP", color: "bg-rose-50 text-rose-700 border-rose-100",
    details: { class: "마크로라이드계", moa: "리보솜 50S 서브유닛 결합, 단백질 합성 억제.", adultDose: "500mg 1일 1회 점적 정맥 주사 (1시간 이상)", sideEffects: "오심, 구토, 혈관통, QT 연장", caution: "간기능 장애 주의" }
  },
  { 
    id: 3, name: "Levofloxacin 750mg", type: "Antibiotics", route: "PO", dose: "750mg q24h", status: "ACTIVE", color: "bg-rose-50 text-rose-700 border-rose-100",
    details: { class: "퀴놀론계", moa: "DNA Gyrase 억제, DNA 복제 저해.", adultDose: "250-750mg 1일 1회", sideEffects: "건염, 광과민성, 불면", caution: "간질 병력, 소아 금기" }
  },
  { 
    id: 4, name: "Methotrexate (MTX)", type: "Immuno", route: "PO", dose: "2.5mg 5T Wk", status: "HOLD", color: "bg-amber-50 text-amber-700 border-amber-100",
    details: { class: "면역억제제", moa: "DNA 합성 방해, 면역 세포 증식 억제.", adultDose: "주 1회 7.5~20mg", sideEffects: "골수 억제, 간독성, 폐독성(간질성 폐렴)", caution: "감염 시 투여 중단. 임산부 금기." }
  },
  { 
    id: 5, name: "Ventolin Nebule", type: "Respiratory", route: "Nebulizer", dose: "2.5mg PRN", status: "ACTIVE", color: "bg-sky-50 text-sky-700 border-sky-100",
    details: { class: "SABA", moa: "기관지 평활근 이완.", adultDose: "필요 시 2.5~5mg 흡입", sideEffects: "빈맥, 손떨림", caution: "심혈관 질환 주의" }
  },
  {
    id: 6, name: "Mucomyst", type: "Respiratory", route: "Nebulizer", dose: "800mg QID", status: "ACTIVE", color: "bg-sky-50 text-sky-700 border-sky-100",
    details: { class: "거담제", moa: "객담 점도 저하.", adultDose: "1회 1~2 ample 흡입", sideEffects: "구역, 기관지 경련", caution: "천식 환자 주의" }
  }
];

const medTimeline = [
  { date: '11/25', event: '항생제(Ceftriaxone) Start', type: 'start' },
  { date: '11/25', event: '면역억제제(MTX) Hold', type: 'alert' },
  { date: '11/26', event: '기관지확장제 유지', type: 'maintain' },
  { date: '11/28', event: '경구 항생제(Levo) 변경', type: 'change' },
  { date: '12/01', event: '퇴원약 처방 (MTX 외래 확인)', type: 'end' },
];

const medLogs = [
  { date: '11/25 21:00', drug: 'Ceftriaxone 2g', route: 'IV', status: 'Given', note: 'AST(-)' },
  { date: '11/25 22:00', drug: 'Azithromycin 500mg', route: 'IV', status: 'Given', note: 'Slow infusion' },
  { date: '11/26 08:00', drug: 'Ventolin Nebule', route: 'Inhal', status: 'Given', note: 'HR 102' },
  { date: '11/27 13:00', drug: 'Phosten 20ml', route: 'IV', status: 'Given', note: 'in NS 500' },
  { date: '11/28 14:00', drug: 'Levofloxacin 750mg', route: 'IV', status: 'Given', note: 'Switch' },
  { date: '12/01 10:00', drug: 'Discharge Meds', route: 'PO', status: 'Given', note: 'Edu Done' },
];

// Literature Content (Expanded)
const literatureContent = [
  { 
    title: "1. 폐렴 (Pneumonia) - 심층 고찰", 
    content: `(1) 정의 및 역학: 폐실질의 급성 염증으로, 지역사회 획득 폐렴(CAP)의 주 원인균은 Streptococcus pneumoniae이다. 기저질환자(ILD)에게 치명적이다. \n\n(2) 병태생리 (Pathophysiology): 병원체가 기도를 통해 폐포에 도달하면, 숙주의 면역 반응으로 폐포 대식세포와 호중구가 활성화된다. 이 과정에서 IL-1, IL-6, TNF-a 등의 염증성 사이토카인이 방출되어 발열과 전신 증상을 유발한다. 또한, 폐포 모세혈관의 투과성 증가로 인해 혈장 성분과 혈구들이 폐포 내로 유출되어 삼출물(Exudate)을 형성한다. [cite_start]이로 인해 가스 교환 면적이 감소하고 환기-관류 불균형(V/Q mismatch) 및 션트(Shunt) 효과가 발생하여 저산소혈증(Hypoxemia)을 초래한다 [cite: 910-929].\n\n(3) 증상: 발열, 오한, 화농성 객담, 호흡곤란, 흉통이 주 증상이다. 특히 고령이나 면역저하자에서는 발열이 뚜렷하지 않을 수 있어 주의가 필요하다. 청진 시 수포음(Crackles)이나 천명음(Wheezing)이 들릴 수 있으며, 타진 시 탁음(Dullness)이 관찰된다.\n\n(4) 치료 가이드라인 (ATS/IDSA 2019): 기저질환이 있는 환자의 경우, 내성균 및 비정형균 감염 가능성을 고려하여 B-lactam(예: Ceftriaxone)과 Macrolide(예: Azithromycin)의 병용 요법 또는 Respiratory Fluoroquinolone 단독 요법을 권고한다.` 
  },
  { 
    title: "2. 복합 폐섬유증 및 폐기종 (CPFE)", 
    content: `(1) 정의 및 특성: CPFE(Combined Pulmonary Fibrosis and Emphysema)는 흡연과 밀접한 관련이 있는 증후군으로, 영상학적으로 상엽의 기종(Emphysema)과 하엽의 섬유화(Fibrosis)가 동시에 관찰된다. \n\n(2) 생리학적 특징: 폐기종에 의한 과팽창(Hyperinflation)과 섬유화에 의한 용적 감소(Volume loss)가 상쇄되어 폐활량(FVC)이나 총폐용량(TLC)은 정상 범위에 가까울 수 있으나, 폐 확산능(DLCO)은 현저히 감소하는 '해리 현상'을 보인다. 이는 폐포-모세혈관 막의 광범위한 파괴를 의미한다.\n\n(3) 임상적 의의: 운동 시 심한 저산소혈증(Desaturation)이 특징적이며, 폐동맥 고혈압(Pulmonary Hypertension)의 발생 빈도가 높아 우심부전(Cor Pulmonale)으로 이어질 위험이 크다. 급성 악화(Acute Exacerbation) 시 사망률이 매우 높으므로 감염 예방과 조기 치료가 필수적이다.` 
  },
  { 
    title: "3. 쇼그렌 증후군 (Sjogren Syndrome)과 호흡기", 
    content: `(1) 병태생리: 림프구의 침윤으로 외분비샘이 파괴되는 만성 자가면역질환이다. 호흡기계에서는 기관지 분비샘의 위축으로 인해 기도 건조증(Xerotrachea)과 점액 섬모 청소 기능(Mucociliary clearance) 장애를 일으킨다. 이는 병원체 배출 능력을 떨어뜨려 폐렴의 재발 위험을 높인다.\n\n(2) 치료 및 간호: 건조한 기도로 인해 가래의 점도가 높아져 배출이 어려우므로 적극적인 가습과 수분 공급이 필요하다. 또한, 면역억제제(Methotrexate, Leflunomide 등) 사용으로 인한 기회감염 징후를 면밀히 관찰해야 한다.` 
  }
];

const nursingProcess = [
  {
    id: 1,
    diagnosis: "폐포-모세혈관 막 변화와 관련된 가스교환 장애",
    definition: "폐포에서 과량의 탄산가스 배출 혹은 산소 섭취의 장애가 있는 상태",
    time: "11/25 19:30",
    rationale: "SpO2 87%, ABGA pO2 68mmHg(Hypoxemia), DLCO 33% (확산능 저하)",
    assessment: { s: ["“숨이 차요.”", "“가슴이 답답해요.”"], o: ["SpO2 87% (RA)", "RR 33회/분", "Crackles"] },
    goals: { short: "대상자는 2시간 내 SpO2 92% 이상 유지한다.", short2: "대상자는 3일 내 호흡수가 20회/분 이하로 안정된다." },
    plans: [ { type: "치료", text: "O2 3~5L/min 공급" }, { type: "교육", text: "입술 오므리기 호흡법 교육" } ],
    implementations: [
        { time: "11/25 19:30", type: "Data", text: "SpO2 87%, 호흡수 33회/분 확인됨." },
        { time: "11/25 19:35", type: "Action", text: "O2 3L/min Nasal prong 적용 및 반좌위 취해줌." },
        { time: "11/30 09:00", type: "Response", text: "SpO2 93% 유지되어 산소 중단함." }
    ],
    chartKey: 'gasExchange',
    evaluation: "12/01 퇴원 시 SpO2 95% 유지됨."
  },
  {
    id: 2,
    diagnosis: "감염 반응과 관련된 고체온",
    definition: "체온이 정상 범위 이상으로 상승된 상태",
    time: "11/25 21:00",
    rationale: "BT 38.8℃, Procalcitonin 1.69, CRP 28.94 (Sepsis)",
    assessment: { s: ["“으슬으슬 추워요.”"], o: ["BT 38.8℃", "WBC 23.92"] },
    goals: { short: "대상자는 24시간 내 체온 37.5℃ 이하로 감소한다.", short2: "감염 지표가 감소한다." },
    plans: [ { type: "치료", text: "항생제 및 해열제 투여" }, { type: "중재", text: "미온수 마사지" } ],
    implementations: [
        { time: "11/25 21:00", type: "Data", text: "BT 38.8℃, 오한 호소." },
        { time: "11/25 21:10", type: "Action", text: "Blood Culture 후 Ceftriaxone 투여." },
        { time: "11/27 14:00", type: "Action", text: "미온수 마사지 적용하려 했으나 환자 거부하여 대상자의 의사를 존중하여 보류함." }
    ],
    chartKey: 'fever',
    evaluation: "11/27 이후 정상 체온 유지됨."
  }
];
// --- 2. 서브 컴포넌트 ---

const FileUploader = ({ label }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showViewer, setShowViewer] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      const url = URL.createObjectURL(selected);
      setPreview(url);
    }
  };

  return (
    <>
      <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:border-[#005EB8] transition-colors bg-slate-50 print:hidden">
        <input type="file" accept="image/*,application/pdf" onChange={handleFileChange} className="hidden" id={`upload-${label}`} />
        {file ? (
          <div className="relative flex flex-col items-center">
            <div className="h-32 w-full flex items-center justify-center bg-slate-200 rounded mb-2 cursor-pointer" onClick={() => setShowViewer(true)}>
                {file.type.includes('image') ? <img src={preview} className="h-full object-contain" alt="prev"/> : <FileText size={48} className="text-slate-400"/>}
            </div>
            <p className="text-xs font-bold text-slate-700 truncate max-w-[150px]">{file.name}</p>
            <button onClick={() => setShowViewer(true)} className="mt-2 text-xs bg-[#005EB8] text-white px-3 py-1 rounded flex items-center gap-1"><ZoomIn size={12}/> View</button>
            <button onClick={() => {setFile(null); setPreview(null);}} className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"><X size={10}/></button>
          </div>
        ) : (
          <label htmlFor={`upload-${label}`} className="cursor-pointer flex flex-col items-center gap-2 text-slate-500 hover:text-[#005EB8]">
            <div className="bg-white p-2 rounded-full shadow-sm"><Upload size={20} /></div>
            <span className="text-xs font-medium">Upload {label}</span>
          </label>
        )}
      </div>

      {showViewer && file && (
        <div className="fixed inset-0 bg-black/80 z-[70] flex items-center justify-center p-4" onClick={() => setShowViewer(false)}>
          <div className="bg-white w-full max-w-5xl h-[90vh] rounded-xl flex flex-col relative" onClick={e => e.stopPropagation()}>
             <div className="p-3 border-b flex justify-between items-center"><h3 className="font-bold">{file.name}</h3><button onClick={() => setShowViewer(false)}><X/></button></div>
             <div className="flex-1 bg-slate-100 p-4 overflow-auto flex justify-center items-center">
                {file.type.includes('image') ? <img src={preview} alt="Full View" className="max-w-full max-h-full shadow-lg" /> : <iframe src={preview} title="PDF Viewer" className="w-full h-full rounded shadow-lg" />}
             </div>
          </div>
        </div>
      )}
    </>
  );
};

const MedDetailModal = ({ med, onClose }) => {
  if (!med) return null;
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className={`p-6 text-white flex justify-between items-start ${med.color.replace('bg-', 'bg-').split(' ')[0].replace('50', '500')}`}>
          <div><h3 className="text-2xl font-bold">{med.name}</h3><p className="text-sm opacity-90 mt-1">{med.route} | {med.dose}</p></div>
          <button onClick={onClose}><X size={24}/></button>
        </div>
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto text-sm">
           <div className="bg-slate-50 p-3 rounded border"><strong>분류:</strong> {med.details.class}</div>
           <div><strong className="text-[#005EB8]">약리 기전:</strong> <p className="text-slate-600">{med.details.moa}</p></div>
           <div><strong>성인 용량:</strong> <p className="text-slate-600">{med.details.adultDose}</p></div>
           <div className="bg-red-50 p-3 rounded border border-red-100 text-red-700"><strong className="block mb-1 flex items-center gap-1"><AlertTriangle size={12}/> 부작용 및 주의</strong>{med.details.sideEffects} / {med.details.caution}</div>
        </div>
      </div>
    </div>
  );
};

const VitalHistoryModal = ({ vital, data, onClose }) => (
    <div className="fixed inset-0 bg-slate-900/40 z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="bg-[#005EB8] p-4 flex justify-between items-center text-white">
          <h3 className="font-bold text-lg">{vital.label} History</h3>
          <button onClick={onClose}><X size={24}/></button>
        </div>
        <div className="p-0 max-h-[60vh] overflow-y-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-100 font-bold sticky top-0"><tr><th className="p-3">Time</th><th className="p-3">Value</th></tr></thead>
            <tbody className="divide-y">{data.map((d, i) => <tr key={i}><td className="p-3">{d.time}</td><td className="p-3 font-bold text-[#005EB8]">{vital.label === 'BP' ? `${d.sbp}/${d.dbp}` : d[vital.label === 'HR' ? 'hr' : vital.label === 'RR' ? 'rr' : vital.label === 'SpO2' ? 'spo2' : 'bt']}</td></tr>)}</tbody>
          </table>
        </div>
      </div>
    </div>
);

const RiskHistoryModal = ({ type, onClose }) => (
    <div className="fixed inset-0 bg-slate-900/40 z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-xl flex items-center gap-2"><ShieldAlert className={type === 'fall' ? "text-amber-500" : "text-teal-500"}/> {type === 'fall' ? 'Fall Risk (Morse)' : 'Pressure Ulcer (Braden)'}</h3>
            <button onClick={onClose}><X/></button>
        </div>
        <div className="space-y-4 text-sm">
            <div className="flex justify-between border-b pb-2"><span className="text-slate-500">Total Score</span><span className="text-2xl font-bold">{type === 'fall' ? '35 (Standard)' : '22 (No Risk)'}</span></div>
            {type === 'fall' ? (
                <ul className="space-y-2"><li>History: No (0)</li><li>Secondary Dx: Yes (15)</li><li>Aid: Bed rest (0)</li><li>IV Therapy: Yes (20)</li><li>Gait: Normal (0)</li><li>Mental: Alert (0)</li></ul>
            ) : (
                <ul className="space-y-2"><li>Sensory: 4</li><li>Moisture: 4</li><li>Activity: 4</li><li>Mobility: 4</li><li>Nutrition: 3</li><li>Friction: 3</li></ul>
            )}
            <div className={`mt-4 p-3 rounded border ${type === 'fall' ? 'bg-amber-50 border-amber-100 text-amber-800' : 'bg-teal-50 border-teal-100 text-teal-800'}`}><strong>💡 중재:</strong> {type === 'fall' ? '낙상 고위험 표지판 부착, 침상 난간 올림, 보호자 교육' : '피부 상태 건조하게 유지, 2시간마다 체위 변경, 영양 공급'}</div>
        </div>
      </div>
    </div>
);

const LitReviewModal = ({ lit, onClose }) => (
  <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4" onClick={onClose}>
    <div className="bg-white w-full max-w-2xl max-h-[80vh] rounded-xl shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
       <div className="p-5 border-b flex justify-between items-center">
         <h3 className="font-bold text-lg text-[#005EB8] flex items-center gap-2"><BookOpen size={20}/> {lit.title}</h3>
         <button onClick={onClose}><X/></button>
       </div>
       <div className="p-6 overflow-y-auto text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
         {lit.content}
       </div>
    </div>
  </div>
);

const ChartForNursingProcess = ({ data, chartKey }) => {
    const validData = data && data.length > 0 ? data : [];
    let chartConfig;
    if (chartKey === 'gasExchange') {
        chartConfig = { title: 'SpO2 & RR Trend', keys: [{ key: 'spo2', color: '#0ea5e9', name: 'SpO2' }, { key: 'rr', color: '#14b8a6', name: 'RR' }], yAxisId: 'left', domain: [80, 100] };
    } else {
        chartConfig = { title: 'BT & WBC Trend', keys: [{ key: 'bt', color: '#f59e0b', name: 'BT' }, { key: 'wbc', color: '#a5b4fc', name: 'WBC' }], yAxisId: 'right', domain: [35, 40] };
    }
    return (
        <div className="bg-white p-4 rounded-xl border border-slate-200 mt-4 shadow-sm print:border-black">
            <p className="text-xs font-bold text-slate-400 uppercase mb-2 print:text-black">{chartConfig.title}</p>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={validData}> 
                  <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                  <XAxis dataKey={chartKey === 'gasExchange' ? 'time' : 'date'} fontSize={10}/>
                  <YAxis yAxisId={chartConfig.yAxisId} fontSize={10} domain={chartConfig.domain}/>
                  <Tooltip contentStyle={{fontSize:'12px'}}/>
                  <Legend wrapperStyle={{fontSize: '10px'}}/>
                  {chartConfig.keys.map((k, i) => (<Line key={i} yAxisId={chartConfig.yAxisId} type="monotone" dataKey={k.key} stroke={k.color} name={k.name} strokeWidth={2} dot={{r:3}}/>))}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
        </div>
    );
};

const FinalReportView = React.forwardRef(({ fullLabData, medLogs, nursingProcess, literatureContent }, ref) => {
  const ReportSection = ({ title, children, pageBreak }) => (
    <section className={`mb-8 border-t-2 border-black pt-4 ${pageBreak ? 'page-break' : ''}`}><h2 className="text-lg font-bold text-black border-b border-gray-400 pb-1 mb-3 uppercase tracking-wide">{title}</h2>{children}</section>
  );
  return (
    <div ref={ref} className="bg-white p-10 max-w-[210mm] mx-auto min-h-[297mm] text-black text-sm font-serif leading-relaxed print:w-full">
      <style type="text/css" media="print">{`@page { size: A4; margin: 15mm; counter-increment: page; @bottom-center { content: "Page " counter(page); } } body { -webkit-print-color-adjust: exact; } .page-break { page-break-before: always; } table { width: 100%; border-collapse: collapse; margin-bottom: 10px; font-size: 9pt; } th, td { border: 1px solid #000; padding: 4px; text-align: center; } th { background-color: #f0f0f0; font-weight: bold; } .text-left { text-align: left; }`}</style>
      <div className="text-center mb-10 border-b-4 border-black pb-4">
        <h1 className="text-3xl font-bold mb-2">성인간호학실습3 사례 연구 보고서</h1>
        <p className="text-base">Case Study: CPFE with Pneumonia & Sjogren Syndrome</p>
        <div className="flex justify-between mt-6 text-sm font-bold"><span>실습기관: 건국대학교병원(KUH) 102W</span><span>지도교수: 최진이 교수님</span><span>학번/이름: 202221920 류수진</span></div>
      </div>
      <ReportSection title="1. 문헌고찰">{literatureContent.map((lit, i) => (<div key={i} className="mb-6"><h3 className="font-bold text-base mb-1">1.{i+1}. {lit.title}</h3><p className="text-xs text-justify whitespace-pre-wrap">{lit.content}</p></div>))}</ReportSection>
      <ReportSection title="2. 간호 사정" pageBreak={true}>
        <div className="grid grid-cols-2 gap-4 mb-4 text-xs"><div className="border p-2"><strong>대상자:</strong> 김정* (F/51)</div><div className="border p-2"><strong>입원일:</strong> 2025-11-25</div></div>
        <h3 className="font-bold text-sm mb-2">2.1. 진단검사 결과</h3>
        <div className="space-y-6">
            <div><h4 className="font-bold text-xs mb-1">1) 혈액학 검사</h4><table><thead><tr><th>항목</th><th>참고치</th><th>11/25</th><th>11/26</th><th>11/27</th><th>11/28</th><th>12/01</th></tr></thead><tbody>{fullLabData.hematology.map((r,i)=><tr key={i}><td>{r.name}</td><td>{r.ref}</td><td>{r.d1}</td><td>{r.d2}</td><td>{r.d3}</td><td>{r.d4}</td><td>{r.d5}</td></tr>)}</tbody></table></div>
            <div><h4 className="font-bold text-xs mb-1">2) 일반화학 검사</h4><table><thead><tr><th>항목</th><th>참고치</th><th>11/25</th><th>11/26</th><th>11/27</th><th>11/28</th><th>12/01</th></tr></thead><tbody>{fullLabData.chemistry.map((r,i)=><tr key={i}><td>{r.name}</td><td>{r.ref}</td><td>{r.d1}</td><td>{r.d2}</td><td>{r.d3}</td><td>{r.d4}</td><td>{r.d5}</td></tr>)}</tbody></table></div>
        </div>
      </ReportSection>
      <ReportSection title="3. 약물 치료" pageBreak={true}><table><thead><tr><th>일시</th><th>약명</th><th>경로</th><th>상태</th><th>비고</th></tr></thead><tbody>{medLogs.map((l,i)=><tr key={i}><td>{l.date}</td><td className="text-left">{l.drug}</td><td>{l.route}</td><td>{l.status}</td><td>{l.note}</td></tr>)}</tbody></table></ReportSection>
      <ReportSection title="4. 간호 과정" pageBreak={true}>
        {nursingProcess.map((np, idx) => (
          <div key={idx} className={`mb-8 ${idx > 0 ? 'page-break' : ''}`}>
            <div className="border border-black p-4">
                <h3 className="font-bold text-base mb-2 bg-gray-100 p-1">간호진단 #{idx + 1}: {np.diagnosis}</h3>
                <div className="text-xs mb-4 space-y-1"><p><strong>• 진단 시점:</strong> {np.time}</p><p><strong>• 사유:</strong> {np.rationale}</p></div>
                <h4 className="font-bold text-sm border-b border-gray-300 mb-2">4.{idx+1}.3. 간호 계획</h4><ul className="list-decimal pl-5 text-xs mb-4">{np.plans.map((p, i) => <li key={i}>[{p.type}] {p.text}</li>)}</ul>
                <h4 className="font-bold text-sm border-b border-gray-300 mb-2">4.{idx+1}.4. 간호 수행 (DAR)</h4><table className="mb-4"><thead><tr><th>일시</th><th>구분</th><th>수행 내용</th></tr></thead><tbody>{np.implementations.map((imp, k) => <tr key={k}><td>{imp.time}</td><td>{imp.type}</td><td className="text-left">{imp.text}</td></tr>)}</tbody></table>
                <h4 className="font-bold text-sm border-b border-gray-300 mb-2">4.{idx+1}.5. 평가</h4><p className="text-xs p-2 bg-gray-50">{np.evaluation}</p>
            </div>
          </div>
        ))}
      </ReportSection>
    </div>
  );
});

// --- Main App Component ---
const NursingCaseStudyApp = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedMed, setSelectedMed] = useState(null);
  const [selectedVital, setSelectedVital] = useState(null);
  const [selectedLit, setSelectedLit] = useState(null);
  const [riskModal, setRiskModal] = useState(null);
  const [labModal, setLabModal] = useState(null);
  const reportRef = useRef();

  const handlePrint = () => { setActiveTab('report'); setTimeout(() => window.print(), 500); };

  return (
    <div className={`min-h-screen ${theme.bgMain} font-sans text-slate-800 flex flex-col md:flex-row pb-16 md:pb-0`}>
      <aside className={`w-64 ${theme.sidebar} flex-col fixed h-full z-30 hidden md:flex print:hidden`}>
        <div className="p-6 border-b border-slate-200 flex items-center gap-3"><div className="bg-[#005EB8] p-2 rounded-lg text-white"><Database size={20}/></div><span className="font-bold text-lg text-slate-800">Case Archive</span></div>
        <nav className="p-4 space-y-1 flex-1">
          {[{ id: 'dashboard', label: 'Dashboard', icon: Activity }, { id: 'meds', label: 'Medication', icon: Pill }, { id: 'nursing', label: 'Nursing Process', icon: Clipboard }, { id: 'literature', label: 'Literature Review', icon: Book }, { id: 'risk', label: 'Risk Assess', icon: ShieldAlert }, { id: 'reports', label: 'Reports (Labs/IO)', icon: FileText }, { id: 'report', label: 'Final Report (Print)', icon: Printer }].map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === item.id ? 'bg-[#E6F0F9] text-[#005EB8] border border-[#005EB8]/20' : 'text-slate-500 hover:bg-slate-50'}`}><item.icon size={18}/> {item.label}</button>
          ))}
        </nav>
        <div className="p-5 border-t border-slate-200"><p className="text-xs font-bold text-slate-800">202221920 류수진</p><p className="text-[10px] text-slate-400">102W (Pulmonology)</p></div>
      </aside>

      <main className="flex-1 md:ml-64 min-w-0">
        <header className={`${theme.header} px-4 md:px-8 py-4 flex justify-between items-center print:hidden`}>
          <div className="flex items-center gap-2"><User className="text-[#005EB8]"/><h1 className="text-lg font-bold">김정* (F/51)</h1></div>
          <button onClick={handlePrint} className={`${theme.buttonPrimary} text-xs`}><Printer size={14}/> Print Report</button>
        </header>

        <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8 print:p-0 print:max-w-none">
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-fade-in">
               <div className="grid grid-cols-5 gap-4">{[{ label: 'BP', val: '120/80', color: 'text-slate-700', icon: Activity }, { label: 'HR', val: '75', color: 'text-rose-600', icon: Heart }, { label: 'RR', val: '20', color: 'text-emerald-600', icon: Wind }, { label: 'SpO2', val: '95', color: 'text-blue-600', icon: Droplet }, { label: 'BT', val: '36.4', color: 'text-amber-500', icon: Thermometer }].map((v, i) => (<div key={i} onClick={() => setSelectedVital(v)} className={`${theme.card} p-4 cursor-pointer border-l-4 border-l-slate-400 flex flex-col justify-between`}><div className="flex justify-between items-start mb-2"><span className="text-xs text-slate-400 font-bold">{v.label}</span><v.icon size={16} className={v.color}/></div><div className={`text-xl font-bold ${v.color}`}>{v.val}</div></div>))}</div>
               <div className="grid lg:grid-cols-2 gap-6">
                  <div className={`${theme.card} p-4 h-64`}><h3 className="font-bold text-slate-700 mb-2 text-sm">Vital Signs Trend</h3><ResponsiveContainer width="100%" height="100%"><LineChart data={vitalData}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="time" fontSize={10} hide/><YAxis domain={[30, 150]} fontSize={10} width={30}/><Tooltip/><Legend/><Line type="monotone" dataKey="sbp" stroke="#334155" strokeWidth={1} dot={false} name="BP"/><Line type="monotone" dataKey="hr" stroke="#f43f5e" strokeWidth={2} dot={false} name="HR"/><Line type="monotone" dataKey="spo2" stroke="#0ea5e9" strokeWidth={2} dot={false} name="SpO2"/><Line type="monotone" dataKey="bt" stroke="#f59e0b" strokeWidth={2} dot={false} name="BT"/></LineChart></ResponsiveContainer></div>
                  <div className={`${theme.card} p-4 h-64`}><h3 className="font-bold text-slate-700 mb-2 text-sm">Lab Trend (Inflammation)</h3><ResponsiveContainer width="100%" height="100%"><ComposedChart data={inflammationData}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="date" fontSize={10}/><YAxis yAxisId="left" fontSize={10} width={30}/><YAxis yAxisId="right" orientation="right" fontSize={10} width={30} domain={[36, 40]} /><Tooltip/><Bar yAxisId="left" dataKey="wbc" fill="#cbd5e1" barSize={20}/><Line yAxisId="left" type="monotone" dataKey="crp" stroke="#f43f5e" strokeWidth={2}/><Line yAxisId="right" type="monotone" dataKey="bt" stroke="#f59e0b" strokeWidth={2}/></ComposedChart></ResponsiveContainer></div>
               </div>
               <div className={`${theme.card} p-6 cursor-pointer hover:border-[#005EB8]`} onClick={() => setLabModal(true)}><div className="flex justify-between items-center mb-4"><h3 className="font-bold text-slate-700 flex items-center gap-2"><Microscope size={18} className="text-[#005EB8]"/> Recent Lab Results (Click for All)</h3><ChevronRight size={18} className="text-slate-400"/></div><div className="overflow-x-auto"><table className="w-full text-sm text-left"><thead className="bg-slate-50 text-slate-500"><tr><th className="p-2">Test</th><th className="p-2">Result</th><th className="p-2">Ref</th><th className="p-2">Status</th></tr></thead><tbody className="divide-y"><tr><td>WBC</td><td className="text-rose-600 font-bold">23.92</td><td>4-10</td><td>High</td></tr><tr><td>CRP</td><td className="text-rose-600 font-bold">28.94</td><td>&lt;0.3</td><td>High</td></tr></tbody></table></div></div>
               <div className="grid md:grid-cols-3 gap-4"><FileUploader label="Chest X-ray" /><FileUploader label="ECG" /><FileUploader label="PFT" /></div>
            </div>
          )}

          {activeTab === 'meds' && (
            <div className="space-y-6 animate-fade-in">
               <div className="bg-white p-6 rounded-xl border border-slate-200 overflow-x-auto"><h3 className="font-bold mb-4 flex items-center gap-2 text-slate-700"><Clock className="text-[#005EB8]"/> Medication Timeline</h3><div className="flex min-w-[600px] justify-between relative pt-4 px-4"><div className="absolute top-6 left-4 right-4 h-0.5 bg-slate-200 -z-10"></div>{medTimeline.map((t, i) => (<div key={i} className="flex flex-col items-center gap-2 w-1/5 text-center"><div className={`w-4 h-4 rounded-full border-2 border-white shadow ${t.type==='start'?'bg-blue-500':'bg-slate-400'}`}></div><div><div className="text-xs font-bold bg-slate-100 px-2 rounded">{t.date}</div><div className="text-[10px] text-slate-500 mt-1">{t.event}</div></div></div>))}</div></div>
               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">{medicationList.map((med, i) => (<div key={i} onClick={() => setSelectedMed(med)} className={`bg-white p-4 rounded-xl border shadow-sm cursor-pointer hover:shadow-md transition flex justify-between items-center ${med.color}`}><div><div className="flex items-center gap-2 mb-1"><span className="p-1.5 rounded text-xs font-bold bg-white/50">{med.route}</span><span className="font-bold text-slate-800">{med.name}</span></div><p className="text-xs text-slate-600 pl-1">{med.dose}</p></div><ChevronRight size={16} className="text-slate-400"/></div>))}</div>
            </div>
          )}

          {activeTab === 'reports' && <div className="space-y-6 animate-fade-in"><div className="grid lg:grid-cols-2 gap-6"><div className={`${theme.card} p-6`}><h3 className="font-bold mb-4 flex gap-2"><Scale className="text-[#005EB8]"/> I/O Balance</h3><div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={ioData}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="date" fontSize={10}/><YAxis fontSize={10}/><Tooltip/><Legend/><Bar dataKey="intake" fill="#3b82f6" name="Intake"/><Bar dataKey="output" fill="#ef4444" name="Output"/></BarChart></ResponsiveContainer></div></div><div className={`${theme.card} p-6 overflow-y-auto h-80`}><h3 className="font-bold mb-4 flex gap-2"><FileSpreadsheet className="text-[#005EB8]"/> Lab Summary</h3><table className="w-full text-xs text-left"><thead className="bg-slate-50"><tr><th className="p-2">Test</th><th className="p-2">11/25</th><th className="p-2">11/28</th></tr></thead><tbody className="divide-y"><tr><td>WBC</td><td className="text-rose-600 font-bold">23.92</td><td>10.17</td></tr><tr><td>CRP</td><td className="text-rose-600 font-bold">28.94</td><td>11.43</td></tr></tbody></table></div></div></div>}
          {activeTab === 'nursing' && <div className="space-y-8 animate-fade-in">{nursingProcess.map((np, idx) => <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200"><h3 className="font-bold text-lg text-[#005EB8] mb-2">#{idx+1} {np.diagnosis}</h3><div className="text-xs text-slate-500 mb-4 bg-slate-50 p-2 rounded"><strong>사유:</strong> {np.rationale}</div><div className="grid md:grid-cols-2 gap-6"><div><h4 className="font-bold text-sm mb-2">Assessment</h4><p className="text-xs">S: {np.assessment.s[0]}</p><p className="text-xs">O: {np.assessment.o[0]}</p></div><div className="h-40 border rounded p-2">{np.chartKey === 'gasExchange' ? <ChartForNursingProcess data={vitalData} chartKey={np.chartKey}/> : <ChartForNursingProcess data={inflammationData} chartKey={np.chartKey}/>}</div></div><div className="mt-4"><h4 className="font-bold text-sm mb-2">Implementation (DAR)</h4><div className="space-y-1 text-xs">{np.implementations.map((imp,k)=><div key={k} className="flex gap-2"><span className="text-slate-400 w-24">{imp.time}</span><span>[{imp.type}] {imp.text}</span></div>)}</div></div></div>)}</div>}
          {activeTab === 'risk' && <div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div onClick={() => setRiskModal('fall')} className={`${theme.card} p-6 border-l-4 border-l-amber-500 cursor-pointer`}><h4 className="font-bold text-lg mb-2">Fall Risk</h4><p>35 (Standard)</p></div><div onClick={() => setRiskModal('pressure')} className={`${theme.card} p-6 border-l-4 border-l-teal-500 cursor-pointer`}><h4 className="font-bold text-lg mb-2">Pressure Ulcer</h4><p>22 (No Risk)</p></div></div>}
          {activeTab === 'literature' && <div className="space-y-4">{literatureContent.map((l, i) => <div key={i} onClick={() => setSelectedLit(l)} className={`${theme.card} p-6 border-l-4 border-l-[#005EB8] cursor-pointer hover:bg-slate-50`}><h3 className="font-bold text-lg mb-2 flex items-center gap-2"><BookOpen size={20}/> {l.title}</h3><p className="text-sm text-slate-600 line-clamp-2">{l.content}</p></div>)}</div>}
          {activeTab === 'report' && <FinalReportView ref={reportRef} vitalData={vitalData} fullLabData={fullLabData} medLogs={medLogs} nursingProcess={nursingProcess} literatureContent={literatureContent} inflammationData={inflammationData} />}
        
        </div>
      </main>
      
      {selectedMed && <MedDetailModal med={selectedMed} onClose={() => setSelectedMed(null)} />}
      {selectedVital && <VitalHistoryModal vital={selectedVital} data={vitalData} onClose={() => setSelectedVital(null)} />}
      {riskModal && <RiskHistoryModal type={riskModal} onClose={() => setRiskModal(null)} />}
      {selectedLit && <LitReviewModal lit={selectedLit} onClose={() => setSelectedLit(null)} />}
      {labModal && <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4" onClick={() => setLabModal(null)}><div className="bg-white w-full max-w-4xl h-[80vh] rounded-xl overflow-y-auto p-8" onClick={e => e.stopPropagation()}><h2 className="text-xl font-bold mb-4">Full Laboratory Data</h2><div className="space-y-6">{Object.entries(fullLabData).map(([key, rows]) => (<div key={key}><h3 className="font-bold capitalize mb-2 border-b">{key}</h3><table className="w-full text-sm text-left"><thead className="bg-gray-100"><tr><th>Test</th><th>Ref</th><th>11/25</th><th>11/26</th><th>11/27</th><th>11/28</th><th>12/01</th></tr></thead><tbody>{rows.map((r, i) => <tr key={i} className="border-b"><td>{r.name}</td><td>{r.ref}</td><td>{r.d1}</td><td>{r.d2}</td><td>{r.d3}</td><td>{r.d4}</td><td>{r.d5}</td></tr>)}</tbody></table></div>))}</div><button className="mt-4 bg-slate-800 text-white px-4 py-2 rounded" onClick={() => setLabModal(null)}>Close</button></div></div>}
    </div>
  );
};

export default NursingCaseStudyApp;