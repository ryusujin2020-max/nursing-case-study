import React, { useState, useRef } from 'react';
import {
  Activity, Wind, Thermometer, Heart, FileText, User, 
  Clipboard, Stethoscope, ChevronRight, X, Calendar, Pill, 
  CheckCircle2, AlertTriangle, Menu, Clock, Syringe, 
  ShieldAlert, Biohazard, ArrowUpRight, ArrowDownRight,
  BookOpen, Brain, LogOut, Save, Edit3, Printer, 
  Share2, Plus, MoreHorizontal, Search, Filter, Download,
  Layout, Database, Settings, Droplet, Scale, Eye
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, ComposedChart, Area, Bar
} from 'recharts';

// --- 🎀 테마 설정 (Cool Pink & Korilakkuma Style) ---
const theme = {
  bgMain: 'bg-[#FDFBFD]', // 아주 연한 쿨톤 화이트
  sidebar: 'bg-white border-r border-slate-100',
  header: 'bg-white/90 backdrop-blur-md border-b border-slate-100 sticky top-0 z-40',
  primaryText: 'text-slate-800',
  secondaryText: 'text-slate-500',
  accentColor: '#E0BBE4', // Cool Lavender Pink
  highlight: '#FFD1DC', // Pastel Cool Pink
  card: 'bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300',
  buttonPrimary: 'bg-[#E0BBE4] text-white hover:bg-[#D291BC] shadow-sm transition-colors rounded-xl px-4 py-2 font-medium',
  buttonSecondary: 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors rounded-xl px-4 py-2 font-medium',
};

// --- 1. 데이터 섹션 ---

// V/S Data with BP split for charting [cite: 154, 468-470]
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

// Lab Data with Hb & K [cite: 228-232, 249, 330-332, 353, 410-412, 431, 471]
const labData = [
  { date: '11/25', wbc: 23.92, crp: 28.94, procal: 1.69, hb: 12.0, k: 3.1 },
  { date: '11/26', wbc: 21.48, crp: 28.45, procal: 1.50, hb: 10.9, k: 3.0 },
  { date: '11/27', wbc: 15.20, crp: 26.82, procal: 1.20, hb: 10.8, k: 3.1 },
  { date: '11/28', wbc: 10.17, crp: 11.43, procal: 0.80, hb: 10.5, k: 3.7 },
  { date: '11/30', wbc: 8.10, crp: 5.50, procal: 0.30, hb: 11.0, k: 3.9 }, // Estimated recovery
  { date: '12/01', wbc: 7.80, crp: 1.00, procal: 0.10, hb: 11.2, k: 4.0 }, // Discharge
];

// Detailed Medication List [cite: 560-565, 428-467]
const medicationList = [
  { 
    id: 1, name: "Ceftriaxone", route: "IV", dose: "2g q24h", status: "STOP", 
    details: {
      class: "3세대 세팔로스포린계 항생제",
      moa: "세균의 세포벽 합성을 억제하여 살균 작용을 함.",
      adultDose: "보통 1~2g을 1일 1회 정맥 또는 근육 주사.",
      sideEffects: "설사, 발진, 간수치 상승, 호산구 증가 등.",
      caution: "페니실린 과민반응 병력 환자, 신부전 환자 주의."
    }
  },
  { 
    id: 2, name: "Azithromycin", route: "IV", dose: "500mg q24h", status: "STOP",
    details: {
      class: "마크로라이드계 항생제",
      moa: "세균의 리보솜 50S 서브유닛에 결합하여 단백질 합성을 억제.",
      adultDose: "500mg을 1일 1회, 최소 1시간 이상 천천히 점적 정맥 주사.",
      sideEffects: "오심, 구토, 복통, 설사, 주사부위 통증(혈관통), QT 연장.",
      caution: "간기능 장애 환자, QT 연장 증후군 환자 금기."
    }
  },
  { 
    id: 3, name: "Levofloxacin", route: "IV/PO", dose: "750mg q24h", status: "ACTIVE",
    details: {
      class: "플루오로퀴놀론계 항생제",
      moa: "DNA Gyrase와 Topoisomerase IV를 억제하여 세균 DNA 복제 저해.",
      adultDose: "250~750mg을 1일 1회 투여.",
      sideEffects: "건염/건파열, 광과민성, 불면, 두통, 오심.",
      caution: "간질 병력 환자, 소아 및 성장기 청소년 금기."
    }
  },
  { 
    id: 4, name: "Methotrexate (MTX)", route: "PO", dose: "2.5mg 5T Weekly", status: "HOLD",
    details: {
      class: "항대사성 항암제 / DMARDs",
      moa: "Dihydrofolate reductase를 억제하여 DNA 합성을 방해하고 면역 세포 증식 억제.",
      adultDose: "류마티스 관절염 시 주 1회 7.5~20mg 경구 투여.",
      sideEffects: "골수 억제(백혈구/혈소판 감소), 간독성, 구내염, 폐독성(간질성 폐렴).",
      caution: "심각한 감염(폐렴 등) 발생 시 투여 중단(Hold) 원칙. 임산부 금기."
    }
  },
  { 
    id: 5, name: "Ventolin (Salbutamol)", route: "Nebulizer", dose: "2.5mg PRN", status: "ACTIVE",
    details: {
      class: "SABA (속효성 베타2 작용제)",
      moa: "기관지 평활근의 베타2 수용체를 자극하여 기관지를 신속히 확장.",
      adultDose: "필요 시 2.5~5mg을 네블라이저로 흡입.",
      sideEffects: "빈맥, 손떨림(Tremor), 두근거림, 불안.",
      caution: "갑상선 기능 항진증, 심혈관 질환 환자 주의."
    }
  }
];

// Nursing Process [cite: 731-929]
const nursingProcess = [
  {
    id: 1,
    diagnosis: "폐포-모세혈관 막 변화와 관련된 가스교환 장애",
    time: "2025-11-25 19:30",
    rationale: "ER 내원 시 SpO2 87%(RA), ABGA상 pO2 68mmHg로 저산소혈증 확인됨. CT상 광범위한 섬유화 및 폐렴 소견은 확산능 저하를 시사함.",
    priority: "생명 유지에 필수적인 산소화 문제이므로 최우선 순위로 설정함.",
    assessment: { S: "“숨이 차서 눕기가 힘들어요.”", O: "SpO2 87%(RA), RR 33회/분, PFT DLCO 33%" },
    goals: {
      short: "대상자는 24시간 이내에 산소 공급 하에 SpO2 92% 이상을 유지한다.",
      long: "대상자는 퇴원 시까지 호흡곤란(Dyspnea) 없이 일상생활(ADL)을 수행한다."
    },
    interventions: [
      "간호사는 1시간마다 활력징후(V/S) 및 산소포화도(SpO2)를 집중 모니터링한다.",
      "처방에 따라 O2 3~5L/min(Nasal prong)를 공급하고 가습을 적용한다.",
      "대상자에게 반좌위(Semi-Fowler's position)를 취해주어 횡격막 하강을 돕는다.",
      "간호사는 입술 오므리기 호흡법(Pursed-lip breathing)을 시범 보이고 교육한다."
    ],
    evaluation: "12/01 퇴원 시 Room air 상태에서 SpO2 95% 유지됨. 자가 호흡 양호하나 DLCO 저하로 주의 요망."
  },
  {
    id: 2,
    diagnosis: "감염 반응 및 염증 물질 방출과 관련된 고체온",
    time: "2025-11-25 21:00",
    rationale: "BT 38.8도의 고열과 Procalcitonin(1.69) 상승은 급성 세균성 감염을 의미함.",
    priority: "고열은 산소 소모량을 증가시켜 호흡 부전을 악화시키므로 신속한 중재 필요.",
    assessment: { S: "“으슬으슬 춥고 온몸이 떨려요.”", O: "BT 38.8℃, WBC 23.92, CRP 28.94" },
    goals: {
      short: "대상자는 48시간 이내에 체온이 정상 범위(36.5-37.5℃)로 회복된다.",
      long: "대상자는 퇴원 시까지 감염 지표(CRP, WBC)가 정상 범위 내로 감소한다."
    },
    interventions: [
      "간호사는 2시간마다 체온을 측정하고 오한 및 발한 양상을 사정한다.",
      "혈액 배양 검사(Blood Culture)를 실시하고 처방된 항생제를 즉시 투여한다.",
      "오한 시에는 담요를 덮어주고, 열 상승기 이후에는 미온수 마사지를 적용한다.",
      "수액(Plasma sol)을 공급하여 고열로 인한 탈수를 예방한다."
    ],
    evaluation: "11/27 이후 체온 36.5~37.0℃ 유지됨. CRP 28.94 -> 1.00 으로 정상화됨."
  }
];

// --- 모달 컴포넌트 ---

const MedDetailModal = ({ med, onClose }) => {
  if (!med) return null;
  return (
    <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
        <div className="bg-[#E0BBE4] p-6 flex justify-between items-start text-white">
          <div>
            <h3 className="text-2xl font-bold">{med.name}</h3>
            <span className="inline-block mt-2 px-3 py-1 bg-white/20 rounded-full text-sm font-medium backdrop-blur-md border border-white/30">
              {med.route} | {med.dose}
            </span>
          </div>
          <button onClick={onClose}><X size={24} className="hover:rotate-90 transition-transform"/></button>
        </div>
        <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
          <div>
            <h4 className="text-sm font-bold text-slate-400 uppercase mb-1">약효 분류 (Class)</h4>
            <p className="text-slate-700 font-medium">{med.details.class}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <h4 className="text-sm font-bold text-[#D291BC] uppercase mb-2 flex items-center gap-2"><Brain size={14}/> 약리 기전 (MOA)</h4>
            <p className="text-sm text-slate-600 leading-relaxed">{med.details.moa}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <h4 className="text-xs font-bold text-blue-500 uppercase mb-2">성인 용량</h4>
              <p className="text-xs text-slate-600">{med.details.adultDose}</p>
            </div>
            <div className="bg-rose-50 p-4 rounded-xl border border-rose-100">
              <h4 className="text-xs font-bold text-rose-500 uppercase mb-2">부작용</h4>
              <p className="text-xs text-slate-600">{med.details.sideEffects}</p>
            </div>
          </div>
          <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
            <h4 className="text-sm font-bold text-amber-600 uppercase mb-1 flex items-center gap-2"><AlertTriangle size={14}/> 주의/금기</h4>
            <p className="text-sm text-amber-800">{med.details.caution}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReportViewerModal = ({ type, onClose }) => {
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white w-full max-w-3xl h-[80vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-lg text-slate-700 flex items-center gap-2">
            {type === 'PFT' ? <Wind className="text-teal-500"/> : <Activity className="text-rose-500"/>}
            {type === 'PFT' ? 'Pulmonary Function Test Report' : 'Electrocardiogram (ECG) Report'}
          </h3>
          <button onClick={onClose}><X className="text-slate-400 hover:text-slate-600"/></button>
        </div>
        <div className="flex-1 bg-slate-100 p-8 overflow-y-auto flex justify-center">
          {/* Mock Document UI */}
          <div className="bg-white w-full max-w-2xl shadow-lg min-h-[800px] p-10 text-slate-800 text-sm font-serif">
            <div className="text-center border-b-2 border-black pb-4 mb-6">
              <h1 className="text-2xl font-bold">Konkuk University Medical Center</h1>
              <p className="text-gray-500 uppercase tracking-widest mt-1">Department of Pulmonology</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6 border-b border-gray-200 pb-4">
              <div><strong>Name:</strong> 김정숙 (F/51)</div>
              <div><strong>ID:</strong> 02519326</div>
              <div><strong>Date:</strong> 2025-12-01</div>
              <div><strong>Physician:</strong> Prof. Yoo</div>
            </div>

            {type === 'PFT' ? (
              <div className="space-y-6">
                <h2 className="text-lg font-bold bg-gray-100 p-2">Spirometry & DLCO</h2>
                <table className="w-full text-left border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border p-2">Parameter</th>
                      <th className="border p-2">Pred</th>
                      <th className="border p-2">Meas</th>
                      <th className="border p-2">%Pred</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td className="border p-2">FVC (L)</td><td className="border p-2">3.32</td><td className="border p-2">2.92</td><td className="border p-2">88%</td></tr>
                    <tr><td className="border p-2">FEV1 (L)</td><td className="border p-2">2.71</td><td className="border p-2">2.31</td><td className="border p-2">85%</td></tr>
                    <tr className="bg-yellow-50"><td className="border p-2 font-bold">DLCO</td><td className="border p-2">19.9</td><td className="border p-2">6.6</td><td className="border p-2 font-bold text-red-600">33% (L)</td></tr>
                  </tbody>
                </table>
                <div className="mt-4 p-4 border border-gray-300 rounded">
                  <strong>Interpretation:</strong> <br/>
                  Normal spirometry mechanics (preserved volumes). <br/>
                  <span className="text-red-600 font-bold">Severe reduction in diffusion capacity (DLCO 33%).</span> <br/>
                  Consistent with Combined Pulmonary Fibrosis and Emphysema (CPFE).
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <h2 className="text-lg font-bold bg-gray-100 p-2">12-Lead ECG Analysis</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>HR: <span className="text-red-600 font-bold">146 bpm</span></div>
                  <div>PR Int: 170 ms</div>
                  <div>QRS Dur: 82 ms</div>
                  <div>QT/QTc: 273/426 ms</div>
                </div>
                <div className="border-t border-gray-300 pt-4 mt-2">
                  <p className="font-bold text-red-600">!! ABNORMAL ECG !!</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Sinus Tachycardia</li>
                    <li>Nonspecific ST-T wave abnormalities</li>
                    <li>Possible causes: Fever, Hypoxia, Stress, Electrolyte Imbalance</li>
                  </ul>
                </div>
                {/* SVG Mock for ECG waves */}
                <div className="h-40 bg-pink-50 mt-4 rounded border border-pink-100 flex items-center justify-center text-pink-300">
                  [ECG Waveform Graphic Visualization]
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
  const [viewReport, setViewReport] = useState(null); // 'PFT' or 'ECG'
  const [filterActive, setFilterActive] = useState(false);

  // Filter Logic
  const displayVitalData = filterActive ? vitalData.filter(d => d.spo2 < 90 || d.bt > 37.5) : vitalData;

  // Print Handler
  const handlePrint = () => {
    setActiveTab('report'); // Switch to Report View
    setTimeout(() => window.print(), 500); // Allow render then print
  };

  return (
    <div className={`min-h-screen ${theme.bgMain} font-sans text-slate-800 flex flex-row`}>
      {/* Sidebar */}
      <aside className={`w-64 ${theme.sidebar} flex flex-col fixed h-full z-30 hidden print:hidden md:flex`}>
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="bg-[#E0BBE4] p-2 rounded-lg text-white"><Database size={20}/></div>
          <span className="font-bold text-lg text-slate-700">Case Archive</span>
        </div>
        <nav className="p-4 space-y-1 flex-1">
          {[
            { id: 'dashboard', label: 'Clinical Dashboard', icon: Activity },
            { id: 'meds', label: 'Medication', icon: Pill },
            { id: 'nursing', label: 'Nursing Process', icon: Clipboard },
            { id: 'risk', label: 'Risk Assessment', icon: ShieldAlert },
            { id: 'report', label: 'Final Report (Print)', icon: FileText },
          ].map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === item.id ? 'bg-[#FFF0F5] text-[#D291BC]' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <item.icon size={18}/> {item.label}
            </button>
          ))}
          <div className="pt-4 mt-4 border-t border-slate-100">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-50 border border-dashed border-slate-200">
              <Plus size={18}/> New Case
            </button>
          </div>
        </nav>
        <div className="p-5 border-t border-slate-100">
          <p className="text-xs font-bold text-slate-800">202221920 류수진</p>
          <p className="text-[10px] text-slate-400">Nursing Student</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 print:ml-0 min-w-0">
        <header className={`${theme.header} px-8 py-4 flex justify-between items-center print:hidden`}>
          <div>
            <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <User className="text-[#D291BC]" size={20}/> 김정숙 (F/51)
              <span className="text-xs font-normal text-slate-400 border border-slate-200 px-2 py-0.5 rounded ml-2">ID: 02519326</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">Dx: Pneumonia, CPFE, Sjogren Syndrome</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setFilterActive(!filterActive)} className={`${theme.buttonSecondary} flex items-center gap-2 text-xs`}>
              <Filter size={14}/> {filterActive ? 'Show All' : 'Filter Critical'}
            </button>
            <button onClick={handlePrint} className={`${theme.buttonPrimary} flex items-center gap-2 text-xs`}>
              <Printer size={14}/> Print Report
            </button>
          </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto space-y-8 print:p-0 print:max-w-none">
          
          {/* --- DASHBOARD TAB --- */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-fade-in">
              {/* Vital Signs Grid (Clickable) */}
              <div className="grid grid-cols-5 gap-4">
                {[
                  { label: 'BP (mmHg)', val: '120/80', icon: Activity, color: 'text-slate-600' },
                  { label: 'HR (bpm)', val: '75', icon: Heart, color: 'text-rose-500' },
                  { label: 'RR (/min)', val: '20', icon: Wind, color: 'text-teal-500' },
                  { label: 'SpO2 (%)', val: '95', icon: Droplet, color: 'text-sky-500' },
                  { label: 'BT (℃)', val: '36.4', icon: Thermometer, color: 'text-amber-500' },
                ].map((v, i) => (
                  <div key={i} className={`${theme.card} p-5 cursor-pointer hover:border-[#E0BBE4] group`}>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold text-slate-400 uppercase">{v.label}</span>
                      <v.icon size={16} className={`${v.color} opacity-70 group-hover:opacity-100`}/>
                    </div>
                    <div className={`text-2xl font-bold ${v.color}`}>{v.val}</div>
                  </div>
                ))}
              </div>

              {/* Charts */}
              <div className="grid lg:grid-cols-2 gap-6">
                <div className={theme.card + " p-6"}>
                  <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><Activity size={18} className="text-[#D291BC]"/> Vital Signs Trend</h3>
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

                <div className={theme.card + " p-6"}>
                  <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><Biohazard size={18} className="text-slate-400"/> Lab Trend (Infection & Anemia)</h3>
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
                        <Line yAxisId="right" type="monotone" dataKey="hb" stroke="#6366f1" name="Hb (g/dL)" strokeWidth={2} dot={{r:3}}/>
                        <Line yAxisId="right" type="monotone" dataKey="k" stroke="#10b981" name="K (mEq/L)" strokeWidth={2} dot={{r:3}}/>
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Reports Buttons */}
              <div className="flex gap-4">
                <button onClick={() => setViewReport('PFT')} className="flex-1 bg-teal-50 border border-teal-100 p-4 rounded-xl flex items-center justify-center gap-2 text-teal-700 font-bold hover:bg-teal-100 transition-colors">
                  <Wind size={20}/> View PFT Result (12/01)
                </button>
                <button onClick={() => setViewReport('ECG')} className="flex-1 bg-rose-50 border border-rose-100 p-4 rounded-xl flex items-center justify-center gap-2 text-rose-700 font-bold hover:bg-rose-100 transition-colors">
                  <Activity size={20}/> View ECG Result (11/25)
                </button>
              </div>
            </div>
          )}

          {/* --- MEDICATION TAB --- */}
          {activeTab === 'meds' && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-xl font-bold text-slate-800">Medication Orders</h3>
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
                    <div className="flex items-center gap-4">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${med.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : med.status === 'HOLD' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>
                        {med.status}
                      </span>
                      <ChevronRight size={16} className="text-slate-300"/>
                    </div>
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
                  <div className="bg-slate-50/50 p-6 border-b border-slate-100 flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-500">진단#{np.id}</span>
                        <span className="text-xs text-slate-400">{np.time}</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-800">{np.diagnosis}</h3>
                    </div>
                    <button className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><Edit3 size={16}/></button>
                  </div>
                  
                  <div className="p-6 grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="bg-[#FFF0F5] p-4 rounded-xl border border-[#FFE4E1]">
                        <h4 className="text-xs font-bold text-rose-400 uppercase mb-2">Assessment (사정)</h4>
                        <p className="text-sm text-slate-700 mb-1"><strong className="text-rose-500">S:</strong> {np.assessment.S}</p>
                        <p className="text-sm text-slate-700"><strong className="text-rose-500">O:</strong> {np.assessment.O}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Rationale & Priority</h4>
                        <p className="text-xs text-slate-600 mb-2 leading-relaxed"><strong>사유:</strong> {np.rationale}</p>
                        <p className="text-xs text-slate-600 leading-relaxed"><strong>우선순위:</strong> {np.priority}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Goals & Plan</h4>
                        <ul className="space-y-2">
                          <li className="text-sm text-slate-700 flex gap-2"><span className="text-teal-500 font-bold">단기:</span> {np.goals.short}</li>
                          <li className="text-sm text-slate-700 flex gap-2"><span className="text-teal-500 font-bold">장기:</span> {np.goals.long}</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Interventions (중재)</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {np.interventions.map((iv, k) => (
                            <li key={k} className="text-sm text-slate-600 pl-1 marker:text-[#E0BBE4]">{iv}</li>
                          ))}
                        </ul>
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

          {/* --- REPORT TAB (PRINT MODE) --- */}
          {activeTab === 'report' && (
            <div className="space-y-8 animate-fade-in bg-white p-8 md:p-12 shadow-none border-none max-w-[210mm] mx-auto min-h-[297mm]">
              <div className="text-center border-b-2 border-black pb-6 mb-8">
                <h1 className="text-3xl font-serif font-bold text-black mb-2">성인간호학 임상사례연구 보고서</h1>
                <p className="text-sm text-gray-500">Case Study: CPFE with Pneumonia & Sjogren Syndrome</p>
              </div>

              <div className="grid grid-cols-2 gap-x-12 gap-y-4 text-sm mb-8 border-b border-gray-200 pb-8">
                <div className="flex justify-between border-b border-gray-100 pb-1"><span>학번/이름:</span> <strong>202221920 류수진</strong></div>
                <div className="flex justify-between border-b border-gray-100 pb-1"><span>제출일:</span> <strong>2025. 12. 03</strong></div>
                <div className="flex justify-between border-b border-gray-100 pb-1"><span>실습기관:</span> <strong>건국대학교병원 (KUH)</strong></div>
                <div className="flex justify-between border-b border-gray-100 pb-1"><span>대상자:</span> <strong>김정숙 (F/51)</strong></div>
              </div>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-black border-b border-black pb-2 mb-4">1. 간호사정 (Assessment)</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-sm mb-1">1) 주호소 및 현병력</h3>
                    <p className="text-sm text-gray-700 leading-relaxed text-justify">
                      대상자는 기저질환(ILD, Sjogren)이 있는 51세 여성으로 내원 2일 전부터 발생한 오한, 근육통 및 호흡곤란(Dyspnea)을 주소로 응급실에 내원함. 
                      내원 당시 SpO2 87% 확인되어 산소 요법 및 항생제 치료를 시작함.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm mb-2">2) 임상 검사 결과 추이</h3>
                    <table className="w-full text-xs text-center border-collapse border border-gray-300">
                      <thead className="bg-gray-100">
                        <tr><th className="border p-1">Date</th><th className="border p-1">WBC</th><th className="border p-1">CRP</th><th className="border p-1">Procalcitonin</th><th className="border p-1">K</th></tr>
                      </thead>
                      <tbody>
                        {labData.map((d, i) => (
                          <tr key={i}>
                            <td className="border p-1">{d.date}</td>
                            <td className="border p-1">{d.wbc}</td>
                            <td className="border p-1">{d.crp}</td>
                            <td className="border p-1">{d.procal}</td>
                            <td className="border p-1">{d.k}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-black border-b border-black pb-2 mb-4">2. 간호과정 (Nursing Process)</h2>
                <div className="space-y-6">
                  {nursingProcess.map((np, idx) => (
                    <div key={idx} className="border border-gray-300 p-4 rounded">
                      <h3 className="font-bold text-base mb-2">간호진단 #{np.id}: {np.diagnosis}</h3>
                      <div className="text-sm space-y-2">
                        <p><strong>[사정]</strong> S: {np.assessment.S} / O: {np.assessment.O}</p>
                        <p><strong>[목표]</strong> {np.goals.short}</p>
                        <div>
                          <strong>[중재]</strong>
                          <ul className="list-disc pl-5 mt-1">
                            {np.interventions.map((iv, k) => <li key={k}>{iv}</li>)}
                          </ul>
                        </div>
                        <p><strong>[평가]</strong> {np.evaluation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
              
              <div className="text-center text-xs text-gray-400 mt-12 print:hidden">
                * 위 내용은 인쇄 시 A4 서식에 맞춰 출력됩니다. (Ctrl + P)
              </div>
            </div>
          )}

        </div>
      </main>

      {/* --- Modals --- */}
      {selectedMed && <MedDetailModal med={selectedMed} onClose={() => setSelectedMed(null)} />}
      {viewReport && <ReportViewerModal type={viewReport} onClose={() => setViewReport(null)} />}
    </div>
  );
};

export default NursingCaseStudyApp;