import React, { useState } from 'react';
import {
  Activity, Wind, Thermometer, Heart, FileText, User, 
  Clipboard, Stethoscope, ChevronRight, X, Calendar, Pill, 
  CheckCircle2, AlertTriangle, Menu, Clock, Syringe, 
  ShieldAlert, Biohazard, ArrowUpRight, ArrowDownRight,
  BookOpen, Brain, LogOut, Save, Edit3, Printer, 
  Share2, Plus, MoreHorizontal, Search, Filter, Download,
  Layout, Database, Mic, Video, Settings, FolderOpen, Droplet,
  Scale, FileBarChart
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, ComposedChart, Area, Bar, BarChart, Cell
} from 'recharts';

// --- 테마 설정 (Professional Medical Design) ---
const theme = {
  bgMain: 'bg-slate-50',
  sidebar: 'bg-white border-r border-slate-200 shadow-xl z-50',
  header: 'bg-white border-b border-slate-200 sticky top-0 z-40',
  primaryText: 'text-indigo-900',
  secondaryText: 'text-slate-500',
  accentColor: 'indigo', 
  card: 'bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200',
  buttonPrimary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition-colors',
  buttonSecondary: 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 transition-colors',
  badge: 'px-2.5 py-0.5 rounded-full text-xs font-bold'
};

// --- 1. 임상 데이터 ---
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
  { date: '11/25', wbc: 23.92, crp: 28.94, procal: 1.69 },
  { date: '11/26', wbc: 21.48, crp: 28.45, procal: 1.50 },
  { date: '11/27', wbc: 15.20, crp: 26.82, procal: 1.20 },
  { date: '11/28', wbc: 10.17, crp: 11.43, procal: 0.80 },
  { date: '11/30', wbc: 8.10, crp: 5.50, procal: 0.30 },
  { date: '12/01', wbc: 7.80, crp: 1.00, procal: 0.10 },
];

const ioData = [
  { date: '11/25', intake: 2170, output: 1700, balance: 470 },
  { date: '11/26', intake: 2180, output: 2675, balance: -495 },
  { date: '11/29', intake: 1645, output: 2950, balance: -1305 }, // Data missing for 27/28 in source file summary
];

// --- 2. 투약 데이터 (상세) ---
const fullMedicationList = [
  { 
    category: "Antibiotics (항생제)",
    meds: [
      { name: "Ceftriaxone 2g", route: "IV", dose: "2g q24h", status: "STOP (11/28)", note: "초기 경험적 치료 (Sepsis)" },
      { name: "Azitops (Azithromycin) 500mg", route: "IV", dose: "500mg q24h", status: "STOP (11/28)", note: "Atypical Cover, 혈관통 주의" },
      { name: "Levoplus (Levofloxacin) 750mg", route: "IV", dose: "750mg q24h", status: "Active (11/28~)", note: "항생제 변경" },
    ]
  },
  {
    category: "Respiratory (호흡기계)",
    meds: [
      { name: "Ventolin Nebule 2.5mg", route: "Inhal", dose: "PRN/QID", status: "Active", note: "기관지 확장, 빈맥 관찰" },
      { name: "Atrovent UDV", route: "Inhal", dose: "QID", status: "Active", note: "항콜린제" },
      { name: "Pulmican Respule", route: "Inhal", dose: "QD", status: "Active", note: "스테로이드" },
      { name: "Mucomyst 10%", route: "Inhal", dose: "QID", status: "Active", note: "거담제" },
      { name: "Aroxol Inj 15mg", route: "IV", dose: "TID", status: "Active", note: "거담제" },
      { name: "Eldo Cap 300mg", route: "PO", dose: "TID", status: "Active", note: "진해거담제" },
      { name: "Muten Cap 200mg", route: "PO", dose: "TID", status: "Active", note: "아세틸시스테인" },
    ]
  },
  {
    category: "Pain & Fever / Chronic (기타)",
    meds: [
      { name: "Acetphen Premix 1g", route: "IV", dose: "PRN", status: "PRN", note: "해열제" },
      { name: "Celebrex Cap 200mg", route: "PO", dose: "BID", status: "Active", note: "진통소염제" },
      { name: "Methotrexate (MTX)", route: "PO", dose: "Weekly", status: "HOLD", note: "⚠️ 폐렴으로 투약 중단 (류마티스)" },
      { name: "Haloxin 200mg", route: "PO", dose: "QD", status: "Active", note: "자가면역질환" },
      { name: "Plasma Solution A", route: "IV", dose: "Continuous", status: "Stop", note: "수액" },
    ]
  }
];

// --- 3. 간호 과정 ---
const nursingProcessFull = [
  {
    id: 1,
    domain: "영역3. 배설/교환",
    diagnosis: "폐포-모세혈관 막 변화와 관련된 가스교환 장애",
    assessment: {
      S_Data: [
        "\"숨이 차서 눕기가 힘들어요.\"",
        "\"조금만 움직여도 숨이 찹니다.\""
      ],
      O_Data: [
        "Dx: Pneumonia, CPFE",
        "SpO2: 87% (ER) -> 93% (O2 3L)",
        "ABGA: pH 7.51, pCO2 29.0, pO2 68.0",
        "Chest CT: GGO & Consolidation",
        "PFT (12/1): DLCO 33% (확산능 저하)"
      ]
    },
    goals: {
      short: "24시간 이내 산소 공급 하 SpO2 92% 유지",
      long: "퇴원 시 호흡곤란 없이 일상생활 수행"
    },
    interventions: [
      { type: "Diagnosis", text: "1시간마다 V/S 및 SpO2 모니터링", detail: "저산소증 조기 발견" },
      { type: "Therapeutic", text: "O2 3~5L/min (Nasal prong) 공급", detail: "적절한 산소화 유지" },
      { type: "Therapeutic", text: "반좌위(Semi-Fowler's) 체위 유지", detail: "폐 확장 도모" },
      { type: "Educational", text: "입술 오므리기 호흡법 교육", detail: "기도 양압 유지" }
    ],
    evaluation: {
      status: "Achieved",
      text: "퇴원 시 Room air SpO2 95% 유지됨. DLCO 저하로 지속 관리 필요."
    }
  },
  {
    id: 2,
    domain: "영역11. 안전/보호",
    diagnosis: "감염 반응과 관련된 고체온",
    assessment: {
      S_Data: [
        "\"으슬으슬 춥고 온몸이 떨려요.\"",
        "\"열이 나는 것 같아요.\""
      ],
      O_Data: [
        "BT: 38.8℃ (11/25)",
        "WBC 23.92, CRP 28.94, Procalcitonin 1.69"
      ]
    },
    goals: {
      short: "48시간 이내 체온 37.5℃ 이하 유지",
      long: "퇴원 시 염증 지표 정상화"
    },
    interventions: [
      { type: "Diagnosis", text: "2시간마다 체온 측정 및 오한 사정", detail: "발열 양상 파악" },
      { type: "Therapeutic", text: "혈액 배양 검사 후 항생제 투여", detail: "원인균 파악 및 치료" },
      { type: "Therapeutic", text: "미온수 마사지 및 수액 요법", detail: "체온 조절 및 탈수 예방" }
    ],
    evaluation: {
      status: "Achieved",
      text: "11/27 이후 정상 체온 유지. CRP 28.94 -> 1.00 정상화."
    }
  }
];

// --- 4. 교육 자료 ---
const educationContent = [
  {
    title: "CPFE 환자의 호흡 재활",
    content: "환자분은 폐기종과 폐섬유증이 동반되어 있습니다. 평소 폐활량은 정상처럼 보일 수 있으나, 가스 교환 능력(DLCO 33%)이 떨어져 있어 운동 시 산소포화도가 급격히 떨어질 수 있습니다.",
    points: ["무리한 운동 피하기", "매일 산소포화도 체크", "계단 오를 때 천천히"]
  },
  {
    title: "감염 예방 수칙",
    content: "면역억제제 복용 및 기저 폐질환으로 인해 감염에 매우 취약합니다. 폐렴은 치명적일 수 있으므로 예방이 최우선입니다.",
    points: ["독감/폐렴구균 예방접종 필수", "사람 많은 곳 마스크 착용", "외출 후 손 씻기"]
  },
  {
    title: "약물 복용 주의사항",
    content: "퇴원 후 경구 항생제(Levofloxacin)를 유지합니다. 류마티스 약물(MTX)은 12/09 외래 진료 후 재개 여부를 결정합니다.",
    points: ["항생제 끝까지 복용", "MTX 자의적 복용 금지", "관절 통증 시 타이레놀 복용"]
  }
];

// --- Sub-Components ---

const VitalHistoryModal = ({ vital, data, onClose }) => {
  if (!vital) return null;
  const keyMap = { 'Blood Pressure': 'sbp', 'Heart Rate': 'hr', 'Respiration': 'rr', 'SpO2': 'spo2', 'Body Temp': 'bt' };
  const dataKey = keyMap[vital.label];

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up" onClick={e => e.stopPropagation()}>
        <div className="bg-indigo-600 p-4 flex justify-between items-center text-white">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Activity size={20}/> {vital.label} History
          </h3>
          <button onClick={onClose}><X size={20}/></button>
        </div>
        <div className="p-0 max-h-[60vh] overflow-y-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-bold sticky top-0">
              <tr>
                <th className="p-3 border-b">Time</th>
                <th className="p-3 border-b">Value</th>
                <th className="p-3 border-b">Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((d, i) => (
                <tr key={i} className="hover:bg-indigo-50 transition-colors">
                  <td className="p-3 text-slate-600">{d.time}</td>
                  <td className="p-3 font-bold text-indigo-700">
                    {vital.label === 'Blood Pressure' ? `${d.sbp}/${d.dbp}` : d[dataKey]} 
                    <span className="text-xs font-normal text-slate-400 ml-1">{vital.unit}</span>
                  </td>
                  <td className="p-3 text-xs text-slate-400">
                    {i === 0 ? 'Admission' : i === data.length - 1 ? 'Discharge' : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- Main App Component ---
const NursingCaseStudyApp = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedVital, setSelectedVital] = useState(null);

  // Common Button Style
  const ActionButton = ({ icon: Icon, label, primary = false, onClick }) => (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all active:scale-95 ${
      primary ? theme.buttonPrimary : theme.buttonSecondary
    }`}>
      <Icon size={14} />
      {label}
    </button>
  );

  return (
    <div className={`min-h-screen ${theme.bgMain} font-sans text-slate-800 flex flex-row`}>
      
      {/* Sidebar Navigation */}
      <aside className={`w-64 ${theme.sidebar} flex flex-col fixed h-full transition-all duration-300`}>
        <div className="p-6 flex items-center gap-3 border-b border-slate-100">
          <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-md">
            <Database size={24} />
          </div>
          <div>
            <h1 className="font-extrabold text-lg text-indigo-900 leading-tight">Case Study<br/><span className="text-indigo-600">Archive</span></h1>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {[
            { id: 'dashboard', label: 'Clinical Dashboard', icon: Activity },
            { id: 'meds', label: 'Medication Record', icon: Syringe },
            { id: 'nursing', label: 'Nursing Process', icon: Clipboard },
            { id: 'reports', label: 'Reports (PFT/ECG/IO)', icon: FileText }, // Combined Reports
            { id: 'risk', label: 'Risk Assessment', icon: ShieldAlert },
            { id: 'education', label: 'Discharge Edu', icon: BookOpen },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                activeTab === item.id 
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100 translate-x-1' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              <item.icon size={18} className={activeTab === item.id ? 'text-indigo-600' : 'text-slate-400'} />
              <span>{item.label}</span>
              {activeTab === item.id && <ChevronRight size={16} className="ml-auto opacity-50"/>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs border border-indigo-200">류</div>
            <div className="flex-1">
              <p className="text-xs font-bold text-slate-700">류수진 연구원</p>
              <p className="text-[10px] text-slate-400">RN / Researcher</p>
            </div>
            <Settings size={14} className="text-slate-400 cursor-pointer hover:text-indigo-600"/>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 transition-all duration-300 min-w-0">
        {/* Top Header */}
        <header className={`${theme.header} px-8 py-4 flex items-center justify-between shadow-sm`}>
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <User size={20} className="text-indigo-500"/>
                김정숙 (F/51)
                <span className="text-xs font-normal text-slate-400 ml-2">ID: 02519326</span>
              </h2>
              <div className="flex gap-2 text-xs font-medium text-slate-500 mt-1">
                <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">Pneumonia</span>
                <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">CPFE</span>
                <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">Sjogren Syndrome</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ActionButton icon={Search} label="Search" />
            <ActionButton icon={Printer} label="Print" />
            <ActionButton icon={Save} label="Save Case" primary />
          </div>
        </header>

        <div className="p-8 max-w-[1600px] mx-auto space-y-8">
          
          {/* --- DASHBOARD TAB --- */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-fade-in">
              {/* Vital Signs Grid - 5 Parameters */}
              <div className="grid grid-cols-5 gap-4">
                {[
                  { label: 'Blood Pressure', val: '120/80', unit: 'mmHg', icon: Activity, color: 'text-slate-700', bg: 'bg-slate-100' },
                  { label: 'Heart Rate', val: '75', unit: 'bpm', icon: Heart, color: 'text-rose-600', bg: 'bg-rose-100' },
                  { label: 'Respiration', val: '20', unit: 'min', icon: Wind, color: 'text-teal-600', bg: 'bg-teal-100' },
                  { label: 'SpO2', val: '95', unit: '%', icon: Droplet, color: 'text-blue-600', bg: 'bg-blue-100' },
                  { label: 'Body Temp', val: '36.4', unit: '℃', icon: Thermometer, color: 'text-amber-600', bg: 'bg-amber-100' },
                ].map((v, i) => (
                  <div 
                    key={i} 
                    onClick={() => setSelectedVital(v)}
                    className={`${theme.card} p-5 flex flex-col justify-between cursor-pointer hover:ring-2 hover:ring-indigo-100 group`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wide group-hover:text-indigo-600 transition-colors">{v.label}</span>
                      <div className={`p-1.5 rounded-lg ${v.bg} ${v.color}`}>
                        <v.icon size={16} />
                      </div>
                    </div>
                    <div>
                      <span className={`text-2xl font-extrabold ${v.color}`}>{v.val}</span>
                      <span className="text-xs text-slate-400 ml-1 font-bold">{v.unit}</span>
                    </div>
                    <div className="mt-3 flex justify-end">
                      <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        View History <ChevronRight size={10} />
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Vital Signs Chart */}
                <div className={`${theme.card} p-6`}>
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                      <Activity className="text-indigo-500" size={20}/> Vital Signs Trend
                    </h4>
                    <div className="flex gap-2">
                      <ActionButton icon={Filter} label="All" />
                    </div>
                  </div>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={vitalData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="time" tick={{fontSize: 10}} interval={1} />
                        <YAxis yAxisId="left" domain={[60, 140]} tick={{fontSize: 10}} width={30} />
                        <YAxis yAxisId="right" orientation="right" domain={[35, 40]} tick={{fontSize: 10}} width={30} />
                        <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                        <Legend wrapperStyle={{fontSize: '12px', paddingTop: '10px'}}/>
                        <Line yAxisId="left" type="monotone" dataKey="hr" stroke="#e11d48" name="HR (bpm)" dot={false} strokeWidth={2} />
                        <Line yAxisId="left" type="monotone" dataKey="spo2" stroke="#2563eb" name="SpO2 (%)" dot={false} strokeWidth={2} />
                        <Line yAxisId="right" type="monotone" dataKey="bt" stroke="#d97706" name="BT (℃)" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Inflammatory Markers (Improved Colors) */}
                <div className={`${theme.card} p-6`}>
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                      <Biohazard className="text-rose-500" size={20}/> Inflammatory Markers
                    </h4>
                    <ActionButton icon={FileText} label="Lab Details" />
                  </div>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={labData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="date" tick={{fontSize: 11}} />
                        <YAxis yAxisId="left" tick={{fontSize: 11}} label={{ value: 'WBC / CRP', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#94a3b8' }} />
                        <YAxis yAxisId="right" orientation="right" domain={[0, 2]} tick={{fontSize: 11}} label={{ value: 'Procalcitonin', angle: 90, position: 'insideRight', fontSize: 10, fill: '#94a3b8' }} />
                        <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                        <Legend wrapperStyle={{fontSize: '12px', paddingTop: '10px'}}/>
                        {/* Changed WBC color from gray to Violet */}
                        <Bar yAxisId="left" dataKey="wbc" fill="#8b5cf6" name="WBC" barSize={24} radius={[4, 4, 0, 0]} />
                        <Area yAxisId="left" type="monotone" dataKey="crp" fill="#fecdd3" stroke="#e11d48" name="CRP" fillOpacity={0.2} />
                        <Line yAxisId="right" type="monotone" dataKey="procal" stroke="#ea580c" name="Procalcitonin" strokeWidth={2} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --- MEDICATION TAB --- */}
          {activeTab === 'meds' && (
            <div className="space-y-6 animate-fade-in">
               <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-slate-800">Medication Administration Record (MAR)</h3>
                  <p className="text-slate-500 text-sm mt-1">Detailed record including IV, PO, and Inhalers</p>
                </div>
                <div className="flex gap-2">
                  <ActionButton icon={Plus} label="Add Med" />
                  <ActionButton icon={CheckCircle2} label="Sign Off" primary />
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {fullMedicationList.map((cat, idx) => (
                  <div key={idx} className={`${theme.card} overflow-hidden`}>
                    <div className="bg-slate-50 px-5 py-4 border-b border-slate-200 flex justify-between items-center">
                      <h4 className="font-bold text-slate-700 flex items-center gap-2">
                        {idx === 0 ? <Biohazard size={18} className="text-rose-500"/> : 
                         idx === 1 ? <Wind size={18} className="text-blue-500"/> :
                         <Pill size={18} className="text-amber-500"/>}
                        {cat.category}
                      </h4>
                      <button className="text-slate-400 hover:text-indigo-600"><MoreHorizontal size={20}/></button>
                    </div>
                    <div className="divide-y divide-slate-100">
                      {cat.meds.map((med, mIdx) => (
                        <div key={mIdx} className="p-4 hover:bg-slate-50 transition-colors flex justify-between items-center group">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-slate-800 text-sm">{med.name}</span>
                              <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${
                                med.route === 'IV' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                med.route === 'Inhal' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                'bg-slate-50 text-slate-600 border-slate-200'
                              }`}>{med.route}</span>
                            </div>
                            <p className="text-xs text-slate-500 flex items-center gap-2">
                              <span className="flex items-center gap-1 bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-medium">
                                <Clock size={10} /> {med.dose}
                              </span>
                              <span>{med.note}</span>
                            </p>
                          </div>
                          <div className="text-right">
                             <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                               med.status.includes('Active') ? 'bg-green-100 text-green-700' :
                               med.status.includes('STOP') ? 'bg-slate-100 text-slate-500' :
                               med.status.includes('HOLD') ? 'bg-rose-100 text-rose-700' :
                               'bg-amber-100 text-amber-700'
                             }`}>
                               {med.status}
                             </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- NURSING PROCESS TAB --- */}
          {activeTab === 'nursing' && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-slate-800">Nursing Process (SOAPIE)</h3>
                  <p className="text-slate-500 text-sm">Professional documentation based on NANDA-I</p>
                </div>
                <div className="flex gap-2">
                  <ActionButton icon={Layout} label="Load Template" />
                  <ActionButton icon={Plus} label="New Diagnosis" primary />
                </div>
              </div>

              {nursingProcessFull.map((np) => (
                <div key={np.id} className={`${theme.card} overflow-hidden border-l-4 border-l-indigo-500`}>
                  <div className="bg-slate-50 p-5 border-b border-slate-200 flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                      <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-1 block">{np.domain}</span>
                      <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <span className="bg-indigo-600 text-white w-6 h-6 rounded flex items-center justify-center text-xs shadow-sm">#{np.id}</span>
                        {np.diagnosis}
                      </h4>
                    </div>
                    <div className="flex gap-2">
                       <ActionButton icon={Edit3} label="Edit" />
                       <ActionButton icon={Printer} label="Print" />
                    </div>
                  </div>

                  <div className="p-6 grid lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <h5 className="flex items-center gap-2 font-bold text-slate-700 mb-3 border-b pb-2 border-slate-100">
                          <Clipboard size={18} className="text-blue-500"/> Assessment (사정)
                        </h5>
                        <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 space-y-3">
                          <div>
                            <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Subjective Data</span>
                            <ul className="list-disc list-inside text-sm text-slate-700 mt-1 pl-1">
                              {np.assessment.S_Data.map((s, i) => <li key={i}>{s}</li>)}
                            </ul>
                          </div>
                          <div>
                            <span className="text-xs font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">Objective Data</span>
                             <ul className="list-disc list-inside text-sm text-slate-700 mt-1 pl-1">
                              {np.assessment.O_Data.map((o, i) => <li key={i}>{o}</li>)}
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div>
                         <h5 className="flex items-center gap-2 font-bold text-slate-700 mb-3 border-b pb-2 border-slate-100">
                          <ArrowUpRight size={18} className="text-emerald-500"/> Goals (목표)
                        </h5>
                        <div className="space-y-2 text-sm text-slate-700 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                          <p><strong className="text-emerald-700">단기:</strong> {np.goals.short}</p>
                          <p><strong className="text-emerald-700">장기:</strong> {np.goals.long}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h5 className="flex items-center gap-2 font-bold text-slate-700 mb-3 border-b pb-2 border-slate-100">
                          <Stethoscope size={18} className="text-amber-500"/> Interventions (중재)
                        </h5>
                        <div className="space-y-2">
                          {np.interventions.map((iv, i) => (
                            <div key={i} className="flex items-start gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors group">
                               <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${
                                 iv.type === 'Diagnosis' ? 'bg-blue-400' : 
                                 iv.type === 'Therapeutic' ? 'bg-amber-400' : 'bg-green-400'
                               }`} />
                               <div>
                                 <p className="text-sm font-medium text-slate-800">{iv.text}</p>
                                 <p className="text-xs text-slate-500">{iv.detail}</p>
                               </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                         <h5 className="flex items-center gap-2 font-bold text-slate-700 mb-3 border-b pb-2 border-slate-100">
                          <CheckCircle2 size={18} className="text-indigo-500"/> Evaluation (평가)
                        </h5>
                        <div className="bg-slate-800 text-slate-200 p-4 rounded-xl shadow-sm">
                           <div className="flex items-center gap-2 mb-2">
                             <span className="text-xs font-bold bg-green-500 text-white px-2 py-0.5 rounded">{np.evaluation.status}</span>
                             <span className="text-xs text-slate-400">Last updated: 12/01 10:00</span>
                           </div>
                           <p className="text-sm leading-relaxed opacity-90">{np.evaluation.text}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* --- REPORTS TAB (PFT / ECG / IO) --- */}
          {activeTab === 'reports' && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Diagnostic Reports & I/O</h3>
              
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* 1. I/O Chart */}
                <div className={`${theme.card} p-6`}>
                  <h4 className="font-bold text-lg text-slate-800 flex items-center gap-2 mb-6">
                    <Scale className="text-indigo-600" size={20}/> Intake & Output Balance
                  </h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={ioData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="date" fontSize={12} />
                        <YAxis fontSize={12} />
                        <Tooltip cursor={{fill: 'transparent'}} />
                        <Legend />
                        <Bar dataKey="intake" fill="#3b82f6" name="Intake (cc)" />
                        <Bar dataKey="output" fill="#ef4444" name="Output (cc)" />
                        <Line type="monotone" dataKey="balance" stroke="#10b981" strokeWidth={2} name="Balance" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                    {ioData.map((d, i) => (
                      <div key={i} className="bg-slate-50 p-2 rounded">
                        <div className="font-bold text-slate-600">{d.date}</div>
                        <div className={`font-bold ${d.balance > 0 ? 'text-blue-600' : 'text-red-600'}`}>
                          {d.balance > 0 ? '+' : ''}{d.balance}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. PFT Report Visualization */}
                <div className={`${theme.card} p-6`}>
                  <div className="flex justify-between mb-4">
                    <h4 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                      <Wind className="text-teal-600" size={20}/> Pulmonary Function Test (12/01)
                    </h4>
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded font-bold">Abnormal</span>
                  </div>
                  <table className="w-full text-sm text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-600">
                        <th className="p-2 rounded-l-lg">Parameter</th>
                        <th className="p-2">Ref</th>
                        <th className="p-2">Meas</th>
                        <th className="p-2 rounded-r-lg">% Ref</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr><td className="p-2 font-medium">FVC (L)</td><td className="p-2">3.32</td><td className="p-2">2.92</td><td className="p-2 font-bold text-blue-600">88%</td></tr>
                      <tr><td className="p-2 font-medium">FEV1 (L)</td><td className="p-2">2.71</td><td className="p-2">2.31</td><td className="p-2 font-bold text-blue-600">85%</td></tr>
                      <tr><td className="p-2 font-medium">FEV1/FVC</td><td className="p-2">81</td><td className="p-2">79</td><td className="p-2 text-slate-500">-</td></tr>
                      <tr className="bg-red-50/50">
                        <td className="p-2 font-bold text-red-700">DLCO</td>
                        <td className="p-2">19.9</td>
                        <td className="p-2 text-red-700 font-bold">6.6</td>
                        <td className="p-2 font-extrabold text-red-600">33% ▼</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="mt-4 text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <strong>Interpretation:</strong> Normal Spirometry (Volumes preserved) but Severe Diffusion Defect. Consistent with CPFE diagnosis.
                  </div>
                </div>

                {/* 3. ECG Report Visualization */}
                <div className={`${theme.card} p-6 col-span-1 xl:col-span-2`}>
                  <div className="flex justify-between mb-4">
                    <h4 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                      <Activity className="text-rose-600" size={20}/> ECG Report (11/25 ER)
                    </h4>
                    <span className="text-xs bg-rose-100 text-rose-700 px-2 py-1 rounded font-bold">Sinus Tachycardia</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between border-b border-slate-100 pb-1">
                        <span className="text-slate-500">Rate</span>
                        <span className="font-bold text-rose-600">146 bpm</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1">
                        <span className="text-slate-500">PR Interval</span>
                        <span className="font-medium">170 ms</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1">
                        <span className="text-slate-500">QRS Duration</span>
                        <span className="font-medium">82 ms</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1">
                        <span className="text-slate-500">QT / QTc</span>
                        <span className="font-medium">273 / 426 ms</span>
                      </div>
                    </div>
                    <div className="md:col-span-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <div className="font-bold text-slate-700 mb-2">Diagnosis & Findings</div>
                      <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                        <li><strong>Sinus Tachycardia</strong> (Rate &gt; 100)</li>
                        <li>Nonspecific Repolarization Abnormality</li>
                        <li>Consider: Fever, Hypoxia, Stress Response</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --- RISK ASSESSMENT TAB --- */}
          {activeTab === 'risk' && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Patient Safety Risk Assessment</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`${theme.card} p-6 border-l-4 border-l-amber-500`}>
                  <h4 className="font-bold text-lg text-slate-800 flex items-center gap-2 mb-4">
                    <ShieldAlert className="text-amber-500" size={24}/> Fall Risk (낙상 위험)
                  </h4>
                  <div className="text-4xl font-extrabold text-amber-500 mb-2">35 <span className="text-sm font-normal text-slate-400">/ 125</span></div>
                  <div className="text-sm font-bold text-amber-700 bg-amber-50 inline-block px-3 py-1 rounded-full mb-4">Standard Risk</div>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex justify-between"><span>Secondary Diagnosis</span><span className="font-bold">+15</span></li>
                    <li className="flex justify-between"><span>IV Therapy</span><span className="font-bold">+20</span></li>
                    <li className="flex justify-between"><span>Gait / Transfer</span><span className="font-bold">Normal (0)</span></li>
                  </ul>
                </div>

                <div className={`${theme.card} p-6 border-l-4 border-l-emerald-500`}>
                  <h4 className="font-bold text-lg text-slate-800 flex items-center gap-2 mb-4">
                    <Layout className="text-emerald-500" size={24}/> Pressure Ulcer (욕창 위험)
                  </h4>
                  <div className="text-4xl font-extrabold text-emerald-500 mb-2">22 <span className="text-sm font-normal text-slate-400">/ 23</span></div>
                  <div className="text-sm font-bold text-emerald-700 bg-emerald-50 inline-block px-3 py-1 rounded-full mb-4">No Risk</div>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex justify-between"><span>Sensory Perception</span><span className="font-bold">4 (No Impairment)</span></li>
                    <li className="flex justify-between"><span>Moisture</span><span className="font-bold">4 (Rarely Moist)</span></li>
                    <li className="flex justify-between"><span>Activity</span><span className="font-bold">4 (Walks Freq)</span></li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* --- EDUCATION TAB --- */}
          {activeTab === 'education' && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Discharge Education Plan</h3>
              <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl flex items-start gap-4 mb-6">
                <div className="bg-white p-3 rounded-full text-indigo-600 shadow-sm"><BookOpen size={24} /></div>
                <div>
                  <h3 className="text-xl font-bold text-indigo-900 mb-2">CPFE 환자 퇴원 가이드</h3>
                  <p className="text-indigo-700 text-sm leading-relaxed">
                    본 대상자는 <strong>복합 폐섬유증 및 폐기종(CPFE)</strong>으로 인해 폐확산능(DLCO)이 33%로 저하되어 있습니다. 
                    퇴원 후 가정에서의 철저한 호흡 관리와 감염 예방이 재입원을 막는 핵심입니다.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {educationContent.map((edu, i) => (
                  <div key={i} className={`${theme.card} p-6 flex flex-col`}>
                    <div className="mb-4 bg-slate-50 w-12 h-12 rounded-xl flex items-center justify-center text-indigo-600">
                      {i === 0 ? <Wind /> : i === 1 ? <ShieldAlert /> : <Pill />}
                    </div>
                    <h4 className="font-bold text-lg text-slate-800 mb-2">{edu.title}</h4>
                    <p className="text-sm text-slate-500 mb-4 flex-1 leading-relaxed">{edu.content}</p>
                    <ul className="space-y-2">
                      {edu.points.map((pt, j) => (
                        <li key={j} className="text-xs font-bold text-slate-700 flex items-center gap-2">
                          <CheckCircle2 size={12} className="text-green-500"/> {pt}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Modals */}
      {selectedVital && (
        <VitalHistoryModal vital={selectedVital} data={vitalData} onClose={() => setSelectedVital(null)} />
      )}
    </div>
  );
};

export default NursingCaseStudyApp;