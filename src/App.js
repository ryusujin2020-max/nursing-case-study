import React, { useState } from 'react';
import {
  Activity, Wind, Thermometer, Heart, FileText, User, 
  Clipboard, Stethoscope, ChevronRight, X, Pill, 
  CheckCircle2, AlertTriangle, Syringe, 
  ShieldAlert, Biohazard, ArrowUpRight,
  BookOpen, LogOut, Save, Edit3, Printer, 
  Search, Filter, Download,
  Layout, Database, Settings, Droplet, Scale, 
  List, CalendarDays, Book, CheckSquare
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, ComposedChart, Area, Bar
} from 'recharts';

// --- 🎀 테마 설정 (Cool Pink & Professional) ---
const theme = {
  bgMain: 'bg-[#FDFBFD]', 
  sidebar: 'bg-white border-r border-slate-100',
  mobileNav: 'bg-white/90 backdrop-blur-md border-t border-slate-200 fixed bottom-0 w-full z-50 flex justify-around py-3 pb-5 md:hidden',
  header: 'bg-white/90 backdrop-blur-md border-b border-slate-100 sticky top-0 z-40',
  primaryText: 'text-slate-800',
  secondaryText: 'text-slate-500',
  accentColor: '#E0BBE4', 
  card: 'bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300',
  buttonPrimary: 'bg-[#E0BBE4] text-white hover:bg-[#D291BC] shadow-sm transition-colors rounded-xl px-4 py-2 font-medium',
  buttonSecondary: 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors rounded-xl px-4 py-2 font-medium',
};

// --- 1. 데이터 섹션 ---

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

const labData = [
  { date: '11/25', wbc: 23.92, crp: 28.94, procal: 1.69, hb: 12.0, k: 3.1 },
  { date: '11/26', wbc: 21.48, crp: 28.45, procal: 1.50, hb: 10.9, k: 3.0 },
  { date: '11/27', wbc: 15.20, crp: 26.82, procal: 1.20, hb: 10.8, k: 3.1 },
  { date: '11/28', wbc: 10.17, crp: 11.43, procal: 0.80, hb: 10.5, k: 3.7 },
  { date: '11/30', wbc: 8.10, crp: 5.50, procal: 0.30, hb: 11.0, k: 3.9 }, 
  { date: '12/01', wbc: 7.80, crp: 1.00, procal: 0.10, hb: 11.2, k: 4.0 }, 
];

// Medication Timeline Data
const medTimeline = [
  { date: '11/25 (ER)', event: '항생제(Ceftriaxone, Azithromycin) Start', type: 'start' },
  { date: '11/25 (ER)', event: '면역억제제(MTX) Hold (폐렴 악화 방지)', type: 'alert' },
  { date: '11/26', event: '거담제/기관지확장제(Ventolin, Mucopect) 유지', type: 'maintain' },
  { date: '11/28', event: '임상 호전으로 IV 항생제 중단 -> 경구 Levofloxacin 변경', type: 'change' },
  { date: '12/01', event: '퇴원약 처방 (Levofloxacin 유지, MTX 외래 확인)', type: 'end' },
];

// Medication List
const medicationList = [
  { 
    id: 1, name: "Ceftriaxone", route: "IV", dose: "2g q24h", status: "STOP", 
    details: { class: "3세대 세팔로스포린", moa: "세포벽 합성 억제", adultDose: "1-2g QD", sideEffects: "설사, 발진", caution: "페니실린 과민반응" }
  },
  { 
    id: 2, name: "Azithromycin", route: "IV", dose: "500mg q24h", status: "STOP",
    details: { class: "마크로라이드", moa: "단백질 합성 억제", adultDose: "500mg QD", sideEffects: "QT 연장, 혈관통", caution: "간기능 장애" }
  },
  { 
    id: 3, name: "Levofloxacin", route: "PO", dose: "750mg q24h", status: "ACTIVE",
    details: { class: "퀴놀론계", moa: "DNA 복제 억제", adultDose: "250-750mg QD", sideEffects: "건염, 광과민성", caution: "소아 금기" }
  },
  { 
    id: 4, name: "Methotrexate", route: "PO", dose: "2.5mg 5T Wk", status: "HOLD",
    details: { class: "엽산 길항제", moa: "DNA 합성 저해", adultDose: "7.5-20mg/wk", sideEffects: "골수억제, 간독성", caution: "임산부, 감염 시 금기" }
  }
];

// Nursing Process with Implementation & Charts
const nursingProcess = [
  {
    id: 1,
    diagnosis: "폐포-모세혈관 막 변화와 관련된 가스교환 장애",
    time: "2025-11-25 19:30",
    rationale: "SpO2 87%, ABGA pO2 68mmHg 확인됨. CT상 광범위한 섬유화 소견.",
    priority: "생리적 욕구(산소화) 결핍으로 생명과 직결되는 최우선 문제임.",
    assessment: { S: "“숨이 차서 눕기가 힘들어요.”", O: "SpO2 87%(RA), RR 33회/분, DLCO 33%" },
    goals: { short: "24시간 내 SpO2 92% 이상 유지", long: "퇴원 시 호흡곤란 없이 ADL 수행" },
    interventions: [
      "간호사는 1시간마다 V/S 및 SpO2를 집중 모니터링한다.",
      "처방에 따라 O2 3~5L/min를 공급하고 반좌위를 취해준다.",
      "입술 오므리기 호흡법을 교육하고 격려한다."
    ],
    // Professional Nursing Record Style
    implementations: [
      { time: "11/25 19:30", action: "SpO2 87% 확인되어 O2 3L/min Nasal prong 적용함.", status: "Done" },
      { time: "11/25 19:40", action: "침상 머리를 45도 올린 반좌위(Semi-fowler's) 취해줌.", status: "Done" },
      { time: "11/25 20:00", action: "SpO2 90% 측정되어 O2 5L/min으로 증량함.", status: "Done" },
      { time: "11/26 10:00", action: "입술 오므리기 호흡법 교육 시행함 (이해도: 상).", status: "Done" },
      { time: "11/30 09:00", action: "Room air 적용 하 SpO2 93% 유지되어 산소 요법 중단함.", status: "Done" }
    ],
    chartKey: 'gasExchange', // Indicator for visualization
    evaluation: "12/01 퇴원 시 Room air SpO2 95% 유지됨. 목표 달성."
  },
  {
    id: 2,
    diagnosis: "감염 반응과 관련된 고체온",
    time: "2025-11-25 21:00",
    rationale: "BT 38.8℃, Procalcitonin 1.69 상승은 전신 감염을 시사함.",
    priority: "고열은 대사량을 증가시켜 호흡부전을 악화시키므로 신속 중재 필요.",
    assessment: { S: "“으슬으슬 춥고 떨려요.”", O: "BT 38.8℃, WBC 23.92" },
    goals: { short: "48시간 내 체온 37.5℃ 이하 회복", long: "퇴원 시 염증수치 정상화" },
    interventions: [
      "2시간마다 체온 측정 및 오한 양상을 사정한다.",
      "혈액 배양 검사 후 처방된 항생제를 투여한다.",
      "미온수 마사지를 적용하고 수분 섭취를 격려한다."
    ],
    implementations: [
      { time: "11/25 21:00", action: "BT 38.8℃ 측정됨. Blood Culture 2쌍 시행함.", status: "Done" },
      { time: "11/25 21:10", action: "처방된 Ceftriaxone 2g IV 투여함.", status: "Done" },
      { time: "11/25 21:30", action: "오한 호소하여 담요 적용하고 보온함.", status: "Done" },
      { time: "11/26 02:00", action: "BT 37.0℃로 하강함. 발한 있어 환의 교환함.", status: "Done" },
      { time: "11/27 14:00", action: "미온수 마사지 적용하려 했으나 환자 거부하여 미수행.", status: "Not Done" }
    ],
    chartKey: 'fever',
    evaluation: "11/27 이후 정상 체온 유지 및 CRP 정상화됨. 목표 달성."
  }
];

// --- 모달 & 뷰어 컴포넌트 ---

const MedDetailModal = ({ med, onClose }) => {
  if (!med) return null;
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
        <div className="bg-[#E0BBE4] p-6 flex justify-between items-start text-white">
          <div>
            <h3 className="text-2xl font-bold">{med.name}</h3>
            <span className="inline-block mt-2 px-3 py-1 bg-white/20 rounded-full text-sm font-medium backdrop-blur-md border border-white/30">
              {med.route} | {med.dose}
            </span>
          </div>
          <button onClick={onClose}><X size={24}/></button>
        </div>
        <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-xs font-bold text-slate-400">CLASS</span>
              <p className="font-bold text-slate-700">{med.details.class}</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-xs font-bold text-slate-400">DOSE</span>
              <p className="font-bold text-slate-700">{med.details.adultDose}</p>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#D291BC] uppercase mb-2">약리 기전</h4>
            <p className="text-sm text-slate-600 bg-pink-50/50 p-3 rounded-xl border border-pink-100">{med.details.moa}</p>
          </div>
          <div>
            <h4 className="text-sm font-bold text-rose-400 uppercase mb-2">부작용 & 주의사항</h4>
            <ul className="text-sm text-slate-600 list-disc pl-5 space-y-1">
              <li>{med.details.sideEffects}</li>
              <li>{med.details.caution}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReportViewerModal = ({ type, onClose }) => {
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white w-full max-w-3xl h-[80vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-lg text-slate-700 flex items-center gap-2">
            {type === 'PFT' ? <Wind className="text-teal-500"/> : <Activity className="text-rose-500"/>}
            {type === 'PFT' ? 'Pulmonary Function Test (PFT)' : 'Electrocardiogram (ECG)'}
          </h3>
          <button onClick={onClose}><X className="text-slate-400 hover:text-slate-600"/></button>
        </div>
        <div className="flex-1 bg-slate-100 p-4 md:p-8 overflow-y-auto flex justify-center">
          <div className="bg-white w-full max-w-2xl shadow-lg min-h-[600px] p-8 text-slate-800 text-sm border border-slate-200">
            {/* Report Header */}
            <div className="flex justify-between border-b-2 border-black pb-4 mb-6">
              <div>
                <h1 className="text-xl font-bold font-serif">KUMC Report</h1>
                <p className="text-xs text-gray-500">Medical Record System</p>
              </div>
              <div className="text-right text-xs">
                <p>Pt: 김정숙 (02519326)</p>
                <p>Date: 2025-12-01</p>
              </div>
            </div>

            {type === 'PFT' ? (
              <div className="space-y-6">
                <div className="text-center font-bold text-lg mb-4">PULMONARY FUNCTION TEST</div>
                <table className="w-full text-xs text-center border-collapse border border-gray-300">
                  <thead className="bg-gray-100 font-bold">
                    <tr><td className="border p-2">Test</td><td className="border p-2">Ref</td><td className="border p-2">Meas</td><td className="border p-2">%Pred</td></tr>
                  </thead>
                  <tbody>
                    <tr><td className="border p-2">FVC</td><td className="border p-2">3.32</td><td className="border p-2">2.92</td><td className="border p-2">88</td></tr>
                    <tr><td className="border p-2">FEV1</td><td className="border p-2">2.71</td><td className="border p-2">2.31</td><td className="border p-2">85</td></tr>
                    <tr><td className="border p-2">FEV1/FVC</td><td className="border p-2">81</td><td className="border p-2">79</td><td className="border p-2">-</td></tr>
                    <tr className="bg-red-50 font-bold"><td className="border p-2 text-red-600">DLCO</td><td className="border p-2">19.9</td><td className="border p-2">6.6</td><td className="border p-2 text-red-600">33</td></tr>
                  </tbody>
                </table>
                <div className="border p-4 mt-4 bg-gray-50 rounded">
                  <p className="font-bold mb-2">Interpretation:</p>
                  <p>1. Normal Ventilatory Defect (FVC, FEV1 within normal range).</p>
                  <p>2. <span className="text-red-600 font-bold">Severe diffusion capacity defect (DLCO 33%).</span></p>
                  <p>3. Compatible with Combined Pulmonary Fibrosis and Emphysema.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center font-bold text-lg mb-4">12-Lead Electrocardiogram</div>
                <div className="grid grid-cols-4 gap-4 text-xs mb-4 border p-4">
                  <div>Rate: <span className="text-red-600 font-bold">146</span></div>
                  <div>PR: 170</div>
                  <div>QRS: 82</div>
                  <div>QT/QTc: 273/426</div>
                  <div>Axis: 79</div>
                </div>
                <div className="h-32 border border-slate-200 bg-pink-50/30 flex items-center justify-center text-pink-300 italic">
                  [Graph: Sinus Tachycardia Waveforms]
                </div>
                <div className="border p-4 mt-4 bg-gray-50 rounded">
                  <p className="font-bold mb-2">Automatic Analysis:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li className="text-red-600 font-bold">Sinus Tachycardia</li>
                    <li>Nonspecific ST-T wave abnormality</li>
                    <li>Abnormal ECG</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 메인 앱 ---
const NursingCaseStudyApp = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedMed, setSelectedMed] = useState(null);
  const [viewReport, setViewReport] = useState(null);
  const [filterActive, setFilterActive] = useState(false);

  // Filter Logic
  const displayVitalData = filterActive ? vitalData.filter(d => d.spo2 < 90 || d.bt > 37.5) : vitalData;

  const handlePrint = () => {
    setActiveTab('report');
    setTimeout(() => window.print(), 500);
  };

  return (
    <div className={`min-h-screen ${theme.bgMain} font-sans text-slate-800 flex flex-col md:flex-row pb-16 md:pb-0`}>
      
      {/* PC Sidebar */}
      <aside className={`w-64 ${theme.sidebar} flex-col fixed h-full z-30 hidden md:flex`}>
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="bg-[#E0BBE4] p-2 rounded-lg text-white"><Database size={20}/></div>
          <span className="font-bold text-lg text-slate-700">Case Archive</span>
        </div>
        <nav className="p-4 space-y-1 flex-1">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: Activity },
            { id: 'meds', label: 'Medication', icon: Pill },
            { id: 'nursing', label: 'Nursing Process', icon: Clipboard },
            { id: 'literature', label: 'Literature Review', icon: Book },
            { id: 'risk', label: 'Risk Assess', icon: ShieldAlert },
            { id: 'report', label: 'Final Report', icon: FileText },
          ].map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === item.id ? 'bg-[#FFF0F5] text-[#D291BC]' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <item.icon size={18}/> {item.label}
            </button>
          ))}
        </nav>
        <div className="p-5 border-t border-slate-100">
          <p className="text-xs font-bold text-slate-800">202221920 류수진</p>
          <p className="text-[10px] text-slate-400">Nursing Student</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 min-w-0">
        <header className={`${theme.header} px-4 md:px-8 py-4 flex justify-between items-center print:hidden`}>
          <div>
            <h1 className="text-lg md:text-xl font-bold text-slate-800 flex items-center gap-2">
              <User className="text-[#D291BC]" size={20}/> 김정숙 (F/51)
              <span className="text-xs font-normal text-slate-400 border border-slate-200 px-2 py-0.5 rounded ml-2 hidden md:inline">ID: 02519326</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">Dx: Pneumonia, CPFE, Sjogren</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setFilterActive(!filterActive)} className={`${theme.buttonSecondary} hidden md:flex items-center gap-2 text-xs`}>
              <Filter size={14}/> {filterActive ? 'Show All' : 'Filter Critical'}
            </button>
            <button onClick={handlePrint} className={`${theme.buttonPrimary} flex items-center gap-2 text-xs`}>
              <Printer size={14}/> Report
            </button>
          </div>
        </header>

        <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8 print:p-0 print:max-w-none">
          
          {/* --- DASHBOARD TAB --- */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-fade-in">
              {/* Vital Signs Grid (Clickable) */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
                {[
                  { label: 'BP (mmHg)', val: '120/80', icon: Activity, color: 'text-slate-600' },
                  { label: 'HR (bpm)', val: '75', icon: Heart, color: 'text-rose-500' },
                  { label: 'RR (/min)', val: '20', icon: Wind, color: 'text-teal-500' },
                  { label: 'SpO2 (%)', val: '95', icon: Droplet, color: 'text-sky-500' },
                  { label: 'BT (℃)', val: '36.4', icon: Thermometer, color: 'text-amber-500' },
                ].map((v, i) => (
                  <div key={i} className={`${theme.card} p-4 md:p-5 group`}>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase">{v.label}</span>
                      <v.icon size={16} className={`${v.color} opacity-70`}/>
                    </div>
                    <div className={`text-xl md:text-2xl font-bold ${v.color}`}>{v.val}</div>
                  </div>
                ))}
              </div>

              {/* Charts */}
              <div className="grid lg:grid-cols-2 gap-6">
                <div className={theme.card + " p-4 md:p-6"}>
                  <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2 text-sm md:text-base"><Activity size={18} className="text-[#D291BC]"/> Vital Signs Trend</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={displayVitalData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0"/>
                        <XAxis dataKey="time" fontSize={10} interval={1} stroke="#cbd5e1"/>
                        <YAxis yAxisId="left" domain={[60, 150]} fontSize={10} stroke="#cbd5e1" width={30}/>
                        <YAxis yAxisId="right" orientation="right" domain={[35, 40]} fontSize={10} stroke="#cbd5e1" width={30}/>
                        <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}/>
                        <Legend wrapperStyle={{fontSize: '11px', paddingTop: '10px'}}/>
                        <Line yAxisId="left" type="monotone" dataKey="sbp" stroke="#94a3b8" name="SBP" dot={false} strokeWidth={1.5} strokeDasharray="5 5"/>
                        <Line yAxisId="left" type="monotone" dataKey="hr" stroke="#f43f5e" name="HR" dot={false} strokeWidth={2}/>
                        <Line yAxisId="left" type="monotone" dataKey="spo2" stroke="#0ea5e9" name="SpO2" dot={false} strokeWidth={2}/>
                        <Line yAxisId="right" type="monotone" dataKey="bt" stroke="#f59e0b" name="BT" strokeWidth={2}/>
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className={theme.card + " p-4 md:p-6"}>
                  <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2 text-sm md:text-base"><Biohazard size={18} className="text-slate-400"/> Lab Trend</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={labData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0"/>
                        <XAxis dataKey="date" fontSize={10} stroke="#cbd5e1"/>
                        <YAxis yAxisId="left" fontSize={10} stroke="#cbd5e1" label={{value:'CRP/WBC', angle:-90, position:'insideLeft', fontSize:9}}/>
                        <YAxis yAxisId="right" orientation="right" domain={[0, 16]} fontSize={10} stroke="#cbd5e1" label={{value:'Hb/K', angle:90, position:'insideRight', fontSize:9}}/>
                        <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}/>
                        <Legend wrapperStyle={{fontSize: '11px', paddingTop: '10px'}}/>
                        <Bar yAxisId="left" dataKey="wbc" fill="#cbd5e1" name="WBC" barSize={20} radius={[4,4,0,0]}/>
                        <Area yAxisId="left" type="monotone" dataKey="crp" fill="#ffe4e6" stroke="#f43f5e" name="CRP"/>
                        <Line yAxisId="right" type="monotone" dataKey="hb" stroke="#6366f1" name="Hb" strokeWidth={2} dot={{r:3}}/>
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <button onClick={() => setViewReport('PFT')} className="flex-1 bg-teal-50 border border-teal-100 p-4 rounded-xl flex items-center justify-center gap-2 text-teal-700 font-bold hover:bg-teal-100 transition-colors">
                  <Wind size={20}/> PFT Result
                </button>
                <button onClick={() => setViewReport('ECG')} className="flex-1 bg-rose-50 border border-rose-100 p-4 rounded-xl flex items-center justify-center gap-2 text-rose-700 font-bold hover:bg-rose-100 transition-colors">
                  <Activity size={20}/> ECG Result
                </button>
              </div>
            </div>
          )}

          {/* --- MEDICATION TAB --- */}
          {activeTab === 'meds' && (
            <div className="space-y-6 animate-fade-in">
              {/* Timeline View */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm overflow-x-auto">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Clock className="text-[#D291BC]"/> Medication Timeline
                </h3>
                <div className="flex min-w-[600px] justify-between relative pt-4 pb-2 px-4">
                  <div className="absolute top-7 left-4 right-4 h-0.5 bg-slate-100 -z-10"></div>
                  {medTimeline.map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-3 w-1/5 text-center group">
                      <div className={`w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center z-10 ${
                        item.type === 'start' ? 'bg-blue-400' : item.type === 'alert' ? 'bg-red-400' : item.type === 'maintain' ? 'bg-slate-400' : item.type === 'change' ? 'bg-green-400' : 'bg-purple-400'
                      }`}></div>
                      <div>
                        <div className="text-xs font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full mb-1">{item.date}</div>
                        <div className="text-[10px] text-slate-600 font-medium bg-white p-1 rounded border border-slate-100 shadow-sm">{item.event}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4">
                {medicationList.map((med) => (
                  <div key={med.id} onClick={() => setSelectedMed(med)} className={`${theme.card} p-5 flex justify-between items-center cursor-pointer border-l-4 border-l-[#E0BBE4]`}>
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${med.route === 'IV' ? 'bg-rose-50 text-rose-500' : med.route === 'PO' ? 'bg-amber-50 text-amber-500' : 'bg-sky-50 text-sky-500'}`}>
                        {med.route === 'IV' ? <Syringe size={20}/> : med.route === 'PO' ? <Pill size={20}/> : <Wind size={20}/>}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-700 text-lg">{med.name}</h4>
                        <p className="text-xs text-slate-400 font-medium">{med.route} | {med.dose}</p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-slate-300"/>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- NURSING PROCESS TAB --- */}
          {activeTab === 'nursing' && (
            <div className="space-y-8 animate-fade-in">
              {nursingProcess.map((np) => (
                <div key={np.id} className={`${theme.card} overflow-hidden border-t-4 border-t-[#E0BBE4]`}>
                  <div className="bg-slate-50/50 p-6 border-b border-slate-100">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-500">진단#{np.id}</span>
                      <span className="text-xs text-slate-400">{np.time}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">{np.diagnosis}</h3>
                  </div>
                  
                  <div className="p-6 grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="bg-[#FFF0F5] p-4 rounded-xl border border-[#FFE4E1]">
                        <h4 className="text-xs font-bold text-rose-400 uppercase mb-2">Assessment (사정)</h4>
                        <p className="text-sm text-slate-700 mb-1"><strong className="text-rose-500">S:</strong> {np.assessment.S}</p>
                        <p className="text-sm text-slate-700"><strong className="text-rose-500">O:</strong> {np.assessment.O}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Goals & Plan</h4>
                        <ul className="space-y-2">
                          <li className="text-sm text-slate-700 flex gap-2"><span className="text-teal-500 font-bold">단기:</span> {np.goals.short}</li>
                          <li className="text-sm text-slate-700 flex gap-2"><span className="text-teal-500 font-bold">장기:</span> {np.goals.long}</li>
                        </ul>
                      </div>
                      {/* Evidence Chart embedded in Nursing Process */}
                      <div className="bg-white p-4 rounded-xl border border-slate-100">
                        <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Outcome Trend</h4>
                        <div className="h-32">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={vitalData.slice(0, 5)}> 
                              <XAxis dataKey="time" fontSize={8} hide/>
                              <YAxis fontSize={8} domain={np.chartKey === 'gasExchange' ? [80, 100] : [36, 40]} width={20}/>
                              <Tooltip contentStyle={{fontSize:'10px'}}/>
                              <Line type="monotone" dataKey={np.chartKey === 'gasExchange' ? 'spo2' : 'bt'} stroke={np.chartKey === 'gasExchange' ? '#0ea5e9' : '#f59e0b'} strokeWidth={2} dot={{r:2}}/>
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-1"><CheckSquare size={12}/> Implementation (간호수행)</h4>
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                          {np.implementations.map((imp, idx) => (
                            <div key={idx} className={`p-3 rounded-lg text-sm border-l-2 ${imp.status === 'Done' ? 'bg-slate-50 border-emerald-400' : 'bg-red-50 border-red-400'}`}>
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-bold text-slate-500">{imp.time}</span>
                                <span className={`text-[10px] px-1.5 rounded font-bold ${imp.status === 'Done' ? 'text-emerald-600 bg-emerald-100' : 'text-red-600 bg-red-100'}`}>{imp.status}</span>
                              </div>
                              <p className="text-slate-700">{imp.action}</p>
                              <p className="text-[10px] text-slate-400 text-right mt-1">서명: 류수진</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-xl border-l-4 border-l-emerald-400">
                        <h4 className="text-xs font-bold text-emerald-600 uppercase mb-1">Evaluation (평가)</h4>
                        <p className="text-sm text-slate-700">{np.evaluation}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* --- LITERATURE REVIEW TAB --- */}
          {activeTab === 'literature' && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-xl font-bold text-slate-800">Literature Review (문헌고찰)</h3>
              <div className="grid gap-6">
                {[
                  { title: "CPFE (Combined Pulmonary Fibrosis and Emphysema)", content: "상엽의 기종(Emphysema)과 하엽의 섬유화(Fibrosis)가 공존하는 증후군. 특징적으로 폐용적은 정상이지만 확산능(DLCO)이 심각하게 저하됨. 예후가 불량하며 폐고혈압 합병증 빈도가 높음." },
                  { title: "Pneumonia (폐렴)", content: "폐실질의 급성 염증. 발열, 기침, 가래, 흉통이 주증상. CPFE 등 기저질환자는 고위험군으로 분류되며, 초기 경험적 광범위 항생제(Ceftriaxone + Macrolide) 사용이 권고됨 (ATS/IDSA 2019)." },
                  { title: "Sjogren Syndrome (쇼그렌 증후군)", content: "자가면역질환으로 외분비샘 파괴가 특징. 호흡기계 침범 시 기도 건조, 간질성 폐질환(ILD) 등을 유발할 수 있음. 면역억제제 사용 시 감염 위험 증가." }
                ].map((lit, i) => (
                  <div key={i} className={`${theme.card} p-6 border-l-4 border-l-[#E0BBE4]`}>
                    <h4 className="font-bold text-lg text-slate-700 mb-2 flex items-center gap-2">
                      <BookOpen size={20} className="text-[#D291BC]"/> {lit.title}
                    </h4>
                    <p className="text-slate-600 text-sm leading-relaxed">{lit.content}</p>
                    <div className="mt-4 p-3 bg-slate-50 rounded border border-dashed border-slate-300 text-center text-xs text-slate-400">
                      [Place for Official Guidelines / Pathophysiology Image]
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- REPORT TAB (PRINT MODE) --- */}
          {activeTab === 'report' && (
            <div className="space-y-8 animate-fade-in bg-white p-12 shadow-none border-none max-w-[210mm] mx-auto min-h-[297mm]">
              <div className="text-center border-b-2 border-black pb-6 mb-8">
                <h1 className="text-3xl font-serif font-bold text-black mb-2">성인간호학 임상사례연구 보고서</h1>
                <p className="text-sm text-gray-500">Case Study: CPFE with Pneumonia & Sjogren Syndrome</p>
              </div>
              {/* Report content (same as before but optimized for printing) */}
              <div className="text-center text-xs text-gray-400 mt-12 print:hidden">
                * 인쇄 버튼을 누르면 A4 서식으로 출력됩니다.
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className={theme.mobileNav}>
        {[
          { id: 'dashboard', icon: Activity, label: 'Dash' },
          { id: 'meds', icon: Pill, label: 'Meds' },
          { id: 'nursing', icon: Clipboard, label: 'Nursing' },
          { id: 'literature', icon: Book, label: 'Review' },
          { id: 'risk', icon: ShieldAlert, label: 'Risk' },
        ].map(item => (
          <button 
            key={item.id} 
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 ${activeTab === item.id ? 'text-[#D291BC]' : 'text-slate-400'}`}
          >
            <item.icon size={20} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Modals */}
      {selectedMed && <MedDetailModal med={selectedMed} onClose={() => setSelectedMed(null)} />}
      {viewReport && <ReportViewerModal type={viewReport} onClose={() => setViewReport(null)} />}
    </div>
  );
};

export default NursingCaseStudyApp;