import React, { useState } from 'react';
import {
  Activity, Wind, Thermometer, Heart, FileText, User, 
  Clipboard, Stethoscope, ChevronRight, X, Calendar, Pill, 
  CheckCircle2, AlertTriangle, Menu, Clock, Syringe, 
  ShieldAlert, Biohazard, ArrowUpRight, ArrowDownRight,
  BookOpen, Brain, LogOut, Save, Edit3, Printer, 
  Share2, Plus, MoreHorizontal, Search, Filter, Download,
  Layout, Database, Settings, Droplet, Scale
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, ComposedChart, Area, Bar, BarChart
} from 'recharts';

// --- 🌸 테마 설정 (Baby Pink, White, Ivory) ---
const theme = {
  bgMain: 'bg-[#FFF5F7]', // 연한 베이비 핑크 배경
  sidebar: 'bg-white border-r border-rose-100',
  header: 'bg-white/80 backdrop-blur-md border-b border-rose-100 sticky top-0 z-40',
  primaryText: 'text-rose-950',
  secondaryText: 'text-rose-400',
  accentColor: 'rose', 
  card: 'bg-white rounded-2xl shadow-sm border border-rose-50 hover:shadow-md hover:border-rose-200 transition-all duration-300',
  buttonPrimary: 'bg-rose-400 text-white hover:bg-rose-500 shadow-sm transition-colors rounded-xl',
  buttonSecondary: 'bg-[#FFFAF0] text-rose-700 border border-rose-100 hover:bg-white transition-colors rounded-xl', // Ivory tone button
  badge: 'px-2.5 py-0.5 rounded-full text-xs font-bold'
};

// --- 1. 임상 데이터 (V/S) ---
[cite_start]// Source: [cite: 468-470]
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

[cite_start]// Source: [cite: 135-165, 236-262, 357-380]
const labData = [
  { date: '11/25', wbc: 23.92, crp: 28.94, procal: 1.69 },
  { date: '11/26', wbc: 21.48, crp: 28.45, procal: 1.50 },
  { date: '11/27', wbc: 15.20, crp: 26.82, procal: 1.20 },
  { date: '11/28', wbc: 10.17, crp: 11.43, procal: 0.80 },
  { date: '11/30', wbc: 8.10, crp: 5.50, procal: 0.30 },
  { date: '12/01', wbc: 7.80, crp: 1.00, procal: 0.10 },
];

// --- 2. 투약 데이터 ---
[cite_start]// Source: [cite: 428-467]
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

// --- 3. 간호 과정 (Ultra Detailed) ---
const nursingProcessFull = [
  {
    id: 1,
    domain: "영역3. 배설/교환",
    diagnosis: "폐포-모세혈관 막 변화와 관련된 가스교환 장애",
    diagnosisTime: "2025. 11. 25. 19:30 (응급실 내원 직후)",
    rationale: `내원 시 SpO2 87%(Room air)의 심각한 저산소증 확인. ABGA상 pO2 68mmHg, pCO2 29mmHg로 과호흡 동반된 가스교환 불균형 확인됨. Chest CT상 광범위한 염증 및 GGO 소견은 확산 면적 감소를 의미함.`,
    priorityReason: `매슬로우 욕구 단계 중 최하위인 '생리적 욕구' 중에서도 생명 유지와 직결된 산소화(Oxygenation) 문제로 최우선 순위 설정.`,
    assessment: {
      S_Data: [
        `"숨이 차서 눕기가 힘들어요."`,
        `"조금만 움직여도 숨이 찹니다."`
      ],
      O_Data: [
        "Dx: Pneumonia in CPFE",
        "SpO2: 87% (ER) -> 93% (O2 3L)",
        "ABGA: pH 7.51, pCO2 29.0, pO2 68.0",
        "Chest CT: Bilateral diffuse GGO & Consolidation"
      ]
    },
    goals: {
      short: "24시간 이내 산소 공급 하 SpO2 92% 이상 유지",
      long: "퇴원 시 호흡곤란 없이 일상생활 수행 및 ABGA 정상화"
    },
    interventions: [
      { type: "Diagnosis", text: "1시간마다 V/S 및 SpO2 집중 모니터링", detail: "급성 호흡부전(ARDS) 진행 여부 및 저산소증 징후(청색증, 빈맥 등)를 조기에 발견하기 위함." },
      { type: "Therapeutic", text: "처방에 따라 O2 3~5L/min (Nasal prong) 공급 및 가습 적용", detail: "FiO2를 증가시켜 폐포 내 산소 분압을 높이고 확산을 촉진함. 가습은 기도 점막 건조를 방지하여 섬모 운동을 도움." },
      { type: "Therapeutic", text: "반좌위(Semi-Fowler's position) 체위 유지", detail: "중력에 의해 횡격막을 하강시켜 흉곽 공간을 넓히고 폐 확장을 최대화하여 환기량을 증가시킴." },
      { type: "Therapeutic", text: "처방된 기관지 확장제(Ventolin, Atrovent) 및 거담제 투여", detail: "기도 저항을 감소시키고 분비물 배출을 용이하게 하여 환기-관류 불균형을 개선함." },
      { type: "Educational", text: "입술 오므리기 호흡법(Pursed-lip breathing) 교육", detail: "호기 시 입술을 오므려 기도 내 양압을 형성함으로써 소기도 허탈을 방지하고 가스 교환 시간을 늘림." }
    ],
    evaluation: {
      status: "Achieved",
      text: "퇴원 시(12/01) Room air 상태에서 SpO2 95% 유지됨. 자가 호흡 시 호흡곤란 호소 없음. 단, PFT상 DLCO 저하(33%) 확인되어 지속적 호흡 재활 필요."
    }
  },
  {
    id: 2,
    domain: "영역11. 안전/보호",
    diagnosis: "감염 반응 및 염증 물질 방출과 관련된 고체온",
    diagnosisTime: "2025. 11. 25. 21:00 (혈액검사 결과 확인 시)",
    rationale: `체온 38.8도의 고열과 오한. Procalcitonin(1.69), CRP(28.94), WBC(23.92)의 현저한 상승은 전신 감염 상태(Systemic Infection)를 강력히 시사함.`,
    priorityReason: `고열은 대사율과 산소 소모량을 증가시켜, 이미 손상된 폐기능을 가진 환자의 호흡 부전을 더욱 악화시킬 수 있으므로 즉각적인 중재가 필요함.`,
    assessment: {
      S_Data: [
        `"으슬으슬 춥고 온몸이 떨려요."`,
        `"열이 나는 것 같아요."`
      ],
      O_Data: [
        "BT: 38.8℃ (11/25)",
        "WBC 23.92, CRP 28.94, Procalcitonin 1.69",
        "Skin: Hot & Dry, Flushing"
      ]
    },
    goals: {
      short: "48시간 이내 체온 37.5℃ 이하 유지",
      long: "퇴원 시까지 염증 지표(CRP, WBC) 정상 범위 회복"
    },
    interventions: [
      { type: "Diagnosis", text: "2시간마다 체온 측정 및 오한 양상 사정", detail: "해열제 투여 효과를 확인하고 발열 패턴을 파악하여 감염의 호전 여부를 판단함." },
      { type: "Therapeutic", text: "혈액 배양 검사(Blood Culture) 시행 후 항생제 투여", detail: "원인균 파악 전 경험적 항생제(Ceftriaxone, Azithromycin)를 즉시 투여하여 패혈증 진행을 차단함." },
      { type: "Therapeutic", text: "오한 시 보온 적용, 열 상승기 이후 미온수 마사지", detail: "오한 시에는 근육 떨림으로 인한 열 생산을 막기 위해 보온하고, 이후 전도/증발을 통해 열 소실을 유도함." },
      { type: "Therapeutic", text: "수액(Plasma sol) 공급 및 수분 섭취 격려", detail: "고열로 인한 불감성 수분 손실을 보충하여 탈수를 예방하고, 가래를 묽게 만듦." }
    ],
    evaluation: {
      status: "Achieved",
      text: "11/27 이후 정상 체온(36.5~37.0℃) 유지됨. CRP 28.94 -> 1.00, WBC 23.92 -> 7.80 으로 정상화됨."
    }
  }
];

// --- 4. 교육 자료 ---
const educationContent = [
  {
    title: "CPFE 환자의 호흡 재활 가이드",
    content: "환자분은 폐기종과 폐섬유증이 동반된 CPFE 상태입니다. 평소 폐활량은 정상처럼 보일 수 있으나, 가스 교환 능력(DLCO 33%)이 심각하게 떨어져 있어 운동 시 산소포화도가 급격히 떨어질 수 있습니다.",
    points: ["숨이 찰 정도의 격렬한 운동 금지", "매일 아침/운동 후 산소포화도 체크 (목표 > 92%)", "평지 걷기 위주로 운동하되, 계단은 천천히"]
  },
  {
    title: "감염 예방 및 면역 관리",
    content: "면역억제제(MTX) 복용 및 기저 폐질환으로 인해 감염에 매우 취약합니다. 폐렴 재발은 치명적일 수 있으므로 철저한 예방이 필요합니다.",
    points: ["독감(인플루엔자) 및 폐렴구균 예방접종 필수", "사람 많은 곳 마스크 착용 생활화", "외출 후 반드시 손 씻기 및 가글"]
  },
  {
    title: "퇴원 후 약물 복용 수칙",
    content: "퇴원 후 경구 항생제(Levofloxacin)를 처방일수까지 정확히 복용해야 내성균 발생을 막을 수 있습니다. 류마티스 약물(MTX)은 12/09 외래 진료 시 재개 여부를 결정합니다.",
    points: ["항생제는 증상이 없어도 끝까지 복용", "MTX는 의사 지시 전까지 자의적 복용 금지", "관절 통증 시 NSAIDs 대신 타이레놀 우선 복용"]
  }
];

// --- Modals Components ---

const VitalHistoryModal = ({ vital, data, onClose }) => {
  if (!vital) return null;
  const keyMap = { 'Blood Pressure': 'sbp', 'Heart Rate': 'hr', 'Respiration': 'rr', 'SpO2': 'spo2', 'Body Temp': 'bt' };
  const dataKey = keyMap[vital.label];

  return (
    <div className="fixed inset-0 bg-rose-900/20 z-[60] flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden border border-rose-100" onClick={e => e.stopPropagation()}>
        <div className="bg-[#FFF0F5] p-5 flex justify-between items-center border-b border-rose-100">
          <h3 className="font-bold text-lg flex items-center gap-2 text-rose-900">
            <Activity size={20} className="text-rose-500"/> {vital.label} Detailed History
          </h3>
          <button onClick={onClose}><X size={20} className="text-rose-400 hover:text-rose-600"/></button>
        </div>
        <div className="p-0 max-h-[60vh] overflow-y-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-white text-rose-400 font-bold sticky top-0 border-b border-rose-50">
              <tr>
                <th className="p-4">Time</th>
                <th className="p-4">Value</th>
                <th className="p-4">Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rose-50">
              {data.map((d, i) => (
                <tr key={i} className="hover:bg-rose-50/50 transition-colors">
                  <td className="p-4 text-slate-600 font-medium">{d.time}</td>
                  <td className="p-4 font-bold text-rose-700 text-lg">
                    {vital.label === 'Blood Pressure' ? `${d.sbp}/${d.dbp}` : d[dataKey]} 
                    <span className="text-xs font-normal text-rose-400 ml-1">{vital.unit}</span>
                  </td>
                  <td className="p-4 text-xs text-slate-400">
                    {i === 0 ? <span className="bg-rose-100 text-rose-600 px-2 py-1 rounded-full">Adm</span> : 
                     i === data.length - 1 ? <span className="bg-rose-100 text-rose-600 px-2 py-1 rounded-full">Disch</span> : '-'}
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

const RiskHistoryModal = ({ type, onClose }) => {
  return (
    <div className="fixed inset-0 bg-rose-900/20 z-[60] flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden border border-rose-100" onClick={e => e.stopPropagation()}>
        <div className="bg-[#FFF0F5] p-5 flex justify-between items-center border-b border-rose-100">
          <h3 className="font-bold text-lg flex items-center gap-2 text-rose-900">
            <ShieldAlert size={20} className="text-rose-500"/> {type === 'fall' ? '낙상 위험 평가 상세' : '욕창 위험 평가 상세'}
          </h3>
          <button onClick={onClose}><X size={20} className="text-rose-400 hover:text-rose-600"/></button>
        </div>
        <div className="p-6">
          {type === 'fall' ? (
            <div className="space-y-4">
              <div className="flex justify-between items-end border-b border-rose-100 pb-2">
                <span className="text-slate-500">총점 (Morse Fall Scale)</span>
                <span className="text-3xl font-bold text-rose-600">35점 <span className="text-sm font-normal text-slate-400">/ 125</span></span>
              </div>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex justify-between p-2 bg-rose-50/50 rounded-lg"><span>낙상 경험 (History)</span><span className="font-bold">없음 (0)</span></li>
                <li className="flex justify-between p-2 bg-rose-50 rounded-lg border border-rose-100"><span>이차 진단 (Secondary Dx)</span><span className="font-bold text-rose-600">있음 (15)</span></li>
                <li className="flex justify-between p-2 bg-rose-50/50 rounded-lg"><span>보행 보조 (Aid)</span><span className="font-bold">침상 안정 (0)</span></li>
                <li className="flex justify-between p-2 bg-rose-50 rounded-lg border border-rose-100"><span>정맥 수액 (IV Therapy)</span><span className="font-bold text-rose-600">있음 (20)</span></li>
                <li className="flex justify-between p-2 bg-rose-50/50 rounded-lg"><span>걸음걸이 (Gait)</span><span className="font-bold">정상 (0)</span></li>
                <li className="flex justify-between p-2 bg-rose-50/50 rounded-lg"><span>의식 상태 (Mental)</span><span className="font-bold">명료 (0)</span></li>
              </ul>
              <div className="mt-4 p-3 bg-[#FFFAF0] border border-orange-100 rounded-xl text-xs text-orange-800">
                <strong>💡 중재:</strong> 낙상 위험 표지판 부착, 침상 난간 올림 확인, 보호자 상주 교육 시행함.
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-end border-b border-rose-100 pb-2">
                <span className="text-slate-500">총점 (Braden Scale)</span>
                <span className="text-3xl font-bold text-teal-600">22점 <span className="text-sm font-normal text-slate-400">/ 23</span></span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="p-2 bg-slate-50 rounded-lg"><span className="block text-xs text-slate-400">감각인지</span><span className="font-bold">4 (장애없음)</span></div>
                <div className="p-2 bg-slate-50 rounded-lg"><span className="block text-xs text-slate-400">습기</span><span className="font-bold">4 (거의없음)</span></div>
                <div className="p-2 bg-slate-50 rounded-lg"><span className="block text-xs text-slate-400">활동성</span><span className="font-bold">4 (자주걸음)</span></div>
                <div className="p-2 bg-slate-50 rounded-lg"><span className="block text-xs text-slate-400">기동성</span><span className="font-bold">4 (제한없음)</span></div>
                <div className="p-2 bg-slate-50 rounded-lg"><span className="block text-xs text-slate-400">영양상태</span><span className="font-bold">3 (적당함)</span></div>
                <div className="p-2 bg-slate-50 rounded-lg"><span className="block text-xs text-slate-400">마찰/쏠림</span><span className="font-bold">3 (문제없음)</span></div>
              </div>
              <div className="mt-4 p-3 bg-teal-50 border border-teal-100 rounded-xl text-xs text-teal-800">
                <strong>💡 평가:</strong> 욕창 발생 위험 없음 (No Risk). 피부 상태 Clear 함 유지 중.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const LabDetailsModal = ({ data, onClose }) => {
  return (
    <div className="fixed inset-0 bg-rose-900/20 z-[60] flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-4xl overflow-hidden border border-rose-100" onClick={e => e.stopPropagation()}>
        <div className="bg-[#FFF0F5] p-5 flex justify-between items-center border-b border-rose-100">
          <h3 className="font-bold text-lg flex items-center gap-2 text-rose-900">
            <Biohazard size={20} className="text-rose-500"/> Laboratory Results Details
          </h3>
          <button onClick={onClose}><X size={20} className="text-rose-400 hover:text-rose-600"/></button>
        </div>
        <div className="p-0 overflow-x-auto">
          <table className="w-full text-sm text-center">
            <thead className="bg-white text-rose-500 font-bold border-b border-rose-100">
              <tr>
                <th className="p-3 text-left">Test Item</th>
                <th className="p-3">Ref. Range</th>
                {data.map((d, i) => <th key={i} className="p-3 bg-rose-50/30">{d.date}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-rose-50">
              <tr className="hover:bg-rose-50/50">
                <td className="p-3 text-left font-bold text-slate-700">WBC (x10³)</td>
                <td className="p-3 text-slate-400 text-xs">4.0-10.0</td>
                {data.map((d, i) => <td key={i} className={`p-3 ${d.wbc > 10 ? 'text-red-500 font-bold' : 'text-slate-600'}`}>{d.wbc}</td>)}
              </tr>
              <tr className="hover:bg-rose-50/50">
                <td className="p-3 text-left font-bold text-slate-700">Hb (g/dL)</td>
                <td className="p-3 text-slate-400 text-xs">12-16</td>
                {/* Simulated Data based on report context */}
                <td className="p-3 text-slate-600">12.0</td><td className="p-3 text-slate-600">10.9</td><td className="p-3 text-slate-600">10.8</td><td className="p-3 text-slate-600">10.5</td><td className="p-3">-</td><td className="p-3">-</td>
              </tr>
              <tr className="hover:bg-rose-50/50 bg-[#FFFAF0]">
                <td className="p-3 text-left font-bold text-rose-700">CRP (mg/dL)</td>
                <td className="p-3 text-slate-400 text-xs">&lt; 0.3</td>
                {data.map((d, i) => <td key={i} className={`p-3 ${d.crp > 0.3 ? 'text-red-600 font-extrabold' : 'text-blue-600 font-bold'}`}>{d.crp}</td>)}
              </tr>
              <tr className="hover:bg-rose-50/50">
                <td className="p-3 text-left font-bold text-slate-700">Procalcitonin</td>
                <td className="p-3 text-slate-400 text-xs">&lt; 0.5</td>
                {data.map((d, i) => <td key={i} className={`p-3 ${d.procal > 0.5 ? 'text-red-500 font-bold' : 'text-slate-600'}`}>{d.procal}</td>)}
              </tr>
              <tr className="hover:bg-rose-50/50">
                <td className="p-3 text-left font-bold text-slate-700">K (Potassium)</td>
                <td className="p-3 text-slate-400 text-xs">3.5-5.5</td>
                <td className="p-3 text-blue-500 font-bold">3.1 ▼</td><td className="p-3 text-blue-500 font-bold">3.0 ▼</td><td className="p-3 text-blue-500 font-bold">3.1 ▼</td><td className="p-3 text-green-600">3.7</td><td className="p-3">-</td><td className="p-3">-</td>
              </tr>
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
  const [riskModal, setRiskModal] = useState(null); // 'fall' or 'pressure'
  const [showLabModal, setShowLabModal] = useState(false);

  // Common Button Style
  const ActionButton = ({ icon: Icon, label, primary = false, onClick }) => (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-all active:scale-95 ${
      primary ? theme.buttonPrimary : theme.buttonSecondary
    }`}>
      <Icon size={14} />
      {label}
    </button>
  );

  return (
    <div className={`min-h-screen ${theme.bgMain} font-sans text-slate-800 flex flex-row`}>
      
      {/* Sidebar Navigation */}
      <aside className={`w-64 ${theme.sidebar} flex flex-col fixed h-full transition-all duration-300 z-50`}>
        <div className="p-6 flex items-center gap-3 border-b border-rose-100">
          <div className="bg-rose-400 p-2.5 rounded-xl text-white shadow-lg shadow-rose-200">
            <Database size={22} />
          </div>
          <div>
            <h1 className="font-extrabold text-lg text-rose-950 leading-tight">Case Study<br/><span className="text-rose-500">Archive</span></h1>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {[
            { id: 'dashboard', label: 'Clinical Dashboard', icon: Activity },
            { id: 'meds', label: 'Medication Record', icon: Syringe },
            { id: 'nursing', label: 'Nursing Process', icon: Clipboard },
            { id: 'reports', label: 'Reports (PFT/ECG)', icon: FileText }, 
            { id: 'risk', label: 'Risk Assessment', icon: ShieldAlert },
            { id: 'education', label: 'Discharge Edu', icon: BookOpen },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all ${
                activeTab === item.id 
                  ? 'bg-[#FFFAF0] text-rose-600 shadow-sm border border-rose-100 translate-x-1' 
                  : 'text-slate-400 hover:bg-white hover:text-rose-500'
              }`}
            >
              <item.icon size={18} className={activeTab === item.id ? 'text-rose-500' : 'text-slate-400'} />
              <span>{item.label}</span>
              {activeTab === item.id && <ChevronRight size={16} className="ml-auto opacity-50"/>}
            </button>
          ))}
        </nav>

        <div className="p-5 border-t border-rose-100 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-xs border border-rose-200 shadow-sm">류</div>
            <div className="flex-1">
              <p className="text-xs font-bold text-rose-900">류수진 연구원</p>
              <p className="text-[10px] text-rose-400">RN / Researcher</p>
            </div>
            <Settings size={16} className="text-slate-300 cursor-pointer hover:text-rose-500"/>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 transition-all duration-300 min-w-0">
        {/* Top Header */}
        <header className={`${theme.header} px-8 py-4 flex items-center justify-between shadow-sm`}>
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <h2 className="text-xl font-bold text-rose-950 flex items-center gap-2">
                <User size={20} className="text-rose-500"/>
                김정숙 (F/51)
                <span className="text-xs font-normal text-slate-400 ml-2 bg-white px-2 py-0.5 rounded border border-slate-100">ID: 02519326</span>
              </h2>
              <div className="flex gap-2 text-xs font-medium text-slate-500 mt-1">
                <span className="bg-white px-2 py-0.5 rounded border border-rose-100 text-rose-700">Pneumonia</span>
                <span className="bg-white px-2 py-0.5 rounded border border-rose-100 text-rose-700">CPFE</span>
                <span className="bg-white px-2 py-0.5 rounded border border-rose-100 text-rose-700">Sjogren</span>
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
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="text-2xl font-bold text-rose-950">Clinical Dashboard</h3>
                  <p className="text-rose-400 text-sm">Real-time Vital Signs & Lab Trend Analysis</p>
                </div>
                <div className="flex gap-2">
                  <ActionButton icon={Filter} label="Filter Date" />
                  <ActionButton icon={Download} label="Export CSV" />
                </div>
              </div>

              {/* 1. Vital Signs Grid (5 Parameters) */}
              <div className="grid grid-cols-5 gap-4">
                {[
                  { label: 'Blood Pressure', val: '120/80', unit: 'mmHg', icon: Activity, color: 'text-slate-700', bg: 'bg-white' },
                  { label: 'Heart Rate', val: '75', unit: 'bpm', icon: Heart, color: 'text-rose-500', bg: 'bg-[#FFF0F5]' },
                  { label: 'Respiration', val: '20', unit: 'min', icon: Wind, color: 'text-teal-600', bg: 'bg-teal-50' },
                  { label: 'SpO2', val: '95', unit: '%', icon: Droplet, color: 'text-sky-600', bg: 'bg-sky-50' },
                  { label: 'Body Temp', val: '36.4', unit: '℃', icon: Thermometer, color: 'text-amber-500', bg: 'bg-amber-50' },
                ].map((v, i) => (
                  <div 
                    key={i} 
                    onClick={() => setSelectedVital(v)}
                    className={`${theme.card} p-5 flex flex-col justify-between cursor-pointer group border-b-4 ${i===1 ? 'border-b-rose-300' : 'border-b-transparent'}`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wide group-hover:text-rose-500 transition-colors">{v.label}</span>
                      <div className={`p-2 rounded-xl ${v.bg} ${v.color} shadow-sm`}>
                        <v.icon size={18} />
                      </div>
                    </div>
                    <div>
                      <span className={`text-3xl font-extrabold ${v.color}`}>{v.val}</span>
                      <span className="text-xs text-slate-400 ml-1 font-bold">{v.unit}</span>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform group-hover:text-rose-400">
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
                    <h4 className="font-bold text-lg text-rose-900 flex items-center gap-2">
                      <Activity className="text-rose-500" size={20}/> Vital Signs Trend
                    </h4>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 text-xs bg-rose-50 text-rose-600 rounded-lg font-bold border border-rose-100">All</button>
                    </div>
                  </div>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={vitalData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis dataKey="time" tick={{fontSize: 10, fill: '#94a3b8'}} interval={1} />
                        <YAxis yAxisId="left" domain={[60, 140]} tick={{fontSize: 10, fill: '#94a3b8'}} width={30} />
                        <YAxis yAxisId="right" orientation="right" domain={[35, 40]} tick={{fontSize: 10, fill: '#94a3b8'}} width={30} />
                        <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                        <Legend wrapperStyle={{fontSize: '12px', paddingTop: '10px'}}/>
                        <Line yAxisId="left" type="monotone" dataKey="hr" stroke="#f43f5e" name="HR (bpm)" dot={false} strokeWidth={2} />
                        <Line yAxisId="left" type="monotone" dataKey="spo2" stroke="#0ea5e9" name="SpO2 (%)" dot={false} strokeWidth={2} />
                        <Line yAxisId="right" type="monotone" dataKey="bt" stroke="#f59e0b" name="BT (℃)" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Inflammatory Markers (Improved Colors) */}
                <div className={`${theme.card} p-6`}>
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="font-bold text-lg text-rose-900 flex items-center gap-2">
                      <Biohazard className="text-amber-500" size={20}/> Inflammatory Markers
                    </h4>
                    <ActionButton icon={FileText} label="Lab Details" onClick={() => setShowLabModal(true)} />
                  </div>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={labData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis dataKey="date" tick={{fontSize: 11, fill: '#94a3b8'}} />
                        <YAxis yAxisId="left" tick={{fontSize: 11, fill: '#94a3b8'}} label={{ value: 'WBC / CRP', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#cbd5e1' }} />
                        <YAxis yAxisId="right" orientation="right" domain={[0, 2]} tick={{fontSize: 11, fill: '#94a3b8'}} label={{ value: 'Procalcitonin', angle: 90, position: 'insideRight', fontSize: 10, fill: '#cbd5e1' }} />
                        <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                        <Legend wrapperStyle={{fontSize: '12px', paddingTop: '10px'}}/>
                        <Bar yAxisId="left" dataKey="wbc" fill="#a5b4fc" name="WBC" barSize={24} radius={[4, 4, 0, 0]} />
                        <Area yAxisId="left" type="monotone" dataKey="crp" fill="#fecdd3" stroke="#e11d48" name="CRP" fillOpacity={0.2} />
                        <Line yAxisId="right" type="monotone" dataKey="procal" stroke="#7c3aed" name="Procalcitonin" strokeWidth={2} />
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
                  <h3 className="text-2xl font-bold text-rose-950">Medication Administration Record</h3>
                  <p className="text-rose-400 text-sm mt-1">Detailed record including IV, PO, and Inhalers</p>
                </div>
                <div className="flex gap-2">
                  <ActionButton icon={Plus} label="Add Med" />
                  <ActionButton icon={CheckCircle2} label="Sign Off" primary />
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {fullMedicationList.map((cat, idx) => (
                  <div key={idx} className={`${theme.card} overflow-hidden border-t-4 border-t-rose-300`}>
                    <div className="bg-[#FFFAF0] px-5 py-4 border-b border-rose-100 flex justify-between items-center">
                      <h4 className="font-bold text-rose-800 flex items-center gap-2">
                        {idx === 0 ? <Biohazard size={18} className="text-rose-500"/> : 
                         idx === 1 ? <Wind size={18} className="text-teal-500"/> :
                         <Pill size={18} className="text-amber-500"/>}
                        {cat.category}
                      </h4>
                      <button className="text-slate-400 hover:text-rose-500"><MoreHorizontal size={20}/></button>
                    </div>
                    <div className="divide-y divide-rose-50">
                      {cat.meds.map((med, mIdx) => (
                        <div key={mIdx} className="p-4 hover:bg-rose-50/50 transition-colors flex justify-between items-center group">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-slate-700 text-sm">{med.name}</span>
                              <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${
                                med.route === 'IV' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                med.route === 'Inhal' ? 'bg-sky-50 text-sky-600 border-sky-100' :
                                'bg-slate-50 text-slate-600 border-slate-200'
                              }`}>{med.route}</span>
                            </div>
                            <p className="text-xs text-slate-500 flex items-center gap-2">
                              <span className="flex items-center gap-1 bg-white border border-rose-100 px-1.5 py-0.5 rounded text-slate-500 font-medium shadow-sm">
                                <Clock size={10} /> {med.dose}
                              </span>
                              <span>{med.note}</span>
                            </p>
                          </div>
                          <div className="text-right">
                             <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                               med.status.includes('Active') ? 'bg-teal-50 text-teal-700 border border-teal-100' :
                               med.status.includes('STOP') ? 'bg-slate-100 text-slate-500 border border-slate-200' :
                               med.status.includes('HOLD') ? 'bg-rose-100 text-rose-700 border border-rose-200' :
                               'bg-amber-50 text-amber-700 border border-amber-100'
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

          {/* --- NURSING PROCESS TAB (Detailed) --- */}
          {activeTab === 'nursing' && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-rose-950">Nursing Process (SOAPIE)</h3>
                  <p className="text-rose-400 text-sm">Comprehensive documentation based on NANDA-I</p>
                </div>
                <div className="flex gap-2">
                  <ActionButton icon={Layout} label="Template" />
                  <ActionButton icon={Plus} label="New Diagnosis" primary />
                </div>
              </div>

              {nursingProcessFull.map((np) => (
                <div key={np.id} className={`${theme.card} overflow-hidden border-l-4 border-l-rose-400`}>
                  <div className="bg-[#FFFAF0] p-6 border-b border-rose-100 flex flex-col md:flex-row justify-between md:items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-bold text-rose-500 uppercase tracking-wider bg-rose-50 px-2 py-1 rounded border border-rose-100">{np.domain}</span>
                        <span className="text-xs text-slate-400 flex items-center gap-1"><Clock size={12}/> 진단 시점: {np.diagnosisTime}</span>
                      </div>
                      <h4 className="text-xl font-extrabold text-slate-800 flex items-center gap-2 mb-3">
                        <span className="bg-rose-500 text-white w-7 h-7 rounded flex items-center justify-center text-sm shadow-md">#{np.id}</span>
                        {np.diagnosis}
                      </h4>
                      <div className="bg-white p-4 rounded-xl border border-rose-100 text-sm space-y-2">
                        <p className="flex gap-2"><strong className="text-rose-700 shrink-0">진단 사유:</strong> <span className="text-slate-600">{np.rationale}</span></p>
                        <p className="flex gap-2"><strong className="text-rose-700 shrink-0">우선순위:</strong> <span className="text-slate-600">{np.priorityReason}</span></p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                       <ActionButton icon={Edit3} label="Edit" />
                    </div>
                  </div>

                  <div className="p-8 grid lg:grid-cols-2 gap-10">
                    <div className="space-y-8">
                      <div>
                        <h5 className="flex items-center gap-2 font-bold text-slate-700 mb-4 pb-2 border-b border-rose-100">
                          <Clipboard size={20} className="text-rose-500"/> Assessment (사정)
                        </h5>
                        <div className="bg-[#FFF5F7] p-5 rounded-2xl border border-rose-100 space-y-4">
                          <div>
                            <span className="text-xs font-bold bg-white text-rose-500 px-3 py-1 rounded-full shadow-sm border border-rose-100">Subjective Data</span>
                            <ul className="list-disc list-inside text-sm text-slate-700 mt-3 pl-2 space-y-1">
                              {np.assessment.S_Data.map((s, i) => <li key={i}>{s}</li>)}
                            </ul>
                          </div>
                          <div>
                            <span className="text-xs font-bold bg-white text-rose-500 px-3 py-1 rounded-full shadow-sm border border-rose-100">Objective Data</span>
                             <ul className="list-disc list-inside text-sm text-slate-700 mt-3 pl-2 space-y-1">
                              {np.assessment.O_Data.map((o, i) => <li key={i}>{o}</li>)}
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div>
                         <h5 className="flex items-center gap-2 font-bold text-slate-700 mb-4 pb-2 border-b border-rose-100">
                          <ArrowUpRight size={20} className="text-teal-500"/> Goals (목표)
                        </h5>
                        <div className="space-y-3 text-sm text-slate-700 bg-teal-50/50 p-5 rounded-2xl border border-teal-100">
                          <p><strong className="text-teal-700">단기:</strong> {np.goals.short}</p>
                          <p><strong className="text-teal-700">장기:</strong> {np.goals.long}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-8">
                      <div>
                        <h5 className="flex items-center gap-2 font-bold text-slate-700 mb-4 pb-2 border-b border-rose-100">
                          <Stethoscope size={20} className="text-amber-500"/> Interventions (중재)
                        </h5>
                        <div className="space-y-3">
                          {np.interventions.map((iv, i) => (
                            <div key={i} className="flex items-start gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100">
                               <div className={`mt-1.5 w-2.5 h-2.5 rounded-full shrink-0 shadow-sm ${
                                 iv.type === 'Diagnosis' ? 'bg-blue-400' : 
                                 iv.type === 'Therapeutic' ? 'bg-amber-400' : 'bg-green-400'
                               }`} />
                               <div>
                                 <p className="text-sm font-bold text-slate-800 mb-1">{iv.text}</p>
                                 <p className="text-xs text-slate-500 leading-relaxed bg-slate-50 p-2 rounded-lg">{iv.detail}</p>
                               </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                         <h5 className="flex items-center gap-2 font-bold text-slate-700 mb-4 pb-2 border-b border-rose-100">
                          <CheckCircle2 size={20} className="text-indigo-500"/> Evaluation (평가)
                        </h5>
                        <div className="bg-slate-800 text-slate-200 p-5 rounded-2xl shadow-lg">
                           <div className="flex items-center gap-2 mb-3">
                             <span className="text-xs font-bold bg-green-500 text-white px-3 py-1 rounded-full">{np.evaluation.status}</span>
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

          {/* --- REPORTS TAB --- */}
          {activeTab === 'reports' && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-2xl font-bold text-rose-950 mb-4">Diagnostic Reports & I/O Balance</h3>
              
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* 1. I/O Chart (Added) */}
                <div className={`${theme.card} p-6`}>
                  <h4 className="font-bold text-lg text-slate-800 flex items-center gap-2 mb-6">
                    <Scale className="text-indigo-600" size={20}/> Intake & Output
                  </h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { date: '11/25', intake: 2170, output: 1700 },
                        { date: '11/26', intake: 2180, output: 2675 },
                        { date: '11/29', intake: 1645, output: 2950 },
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="date" fontSize={12} />
                        <YAxis fontSize={12} />
                        <Tooltip cursor={{fill: 'transparent'}} />
                        <Legend />
                        <Bar dataKey="intake" fill="#60a5fa" name="Intake (cc)" barSize={40} radius={[4,4,0,0]} />
                        <Bar dataKey="output" fill="#f87171" name="Output (cc)" barSize={40} radius={[4,4,0,0]} />
                      </BarChart>
                    </ResponsiveContainer>
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
              <h3 className="text-2xl font-bold text-rose-950 mb-4">Patient Safety Risk Assessment</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div 
                  onClick={() => setRiskModal('fall')}
                  className={`${theme.card} p-6 border-l-4 border-l-amber-500 cursor-pointer hover:scale-[1.02] active:scale-95 transition-transform`}
                >
                  <h4 className="font-bold text-lg text-slate-800 flex items-center gap-2 mb-4">
                    <ShieldAlert className="text-amber-500" size={24}/> Fall Risk (낙상 위험)
                  </h4>
                  <div className="text-4xl font-extrabold text-amber-500 mb-2">35 <span className="text-sm font-normal text-slate-400">/ 125</span></div>
                  <div className="text-sm font-bold text-amber-700 bg-amber-50 inline-block px-3 py-1 rounded-full mb-4">Standard Risk</div>
                  <div className="text-xs text-slate-400 text-right mt-2 flex items-center justify-end gap-1">Click for Details <ArrowDownRight size={12}/></div>
                </div>

                <div 
                  onClick={() => setRiskModal('pressure')}
                  className={`${theme.card} p-6 border-l-4 border-l-teal-500 cursor-pointer hover:scale-[1.02] active:scale-95 transition-transform`}
                >
                  <h4 className="font-bold text-lg text-slate-800 flex items-center gap-2 mb-4">
                    <Layout className="text-teal-500" size={24}/> Pressure Ulcer (욕창 위험)
                  </h4>
                  <div className="text-4xl font-extrabold text-teal-500 mb-2">22 <span className="text-sm font-normal text-slate-400">/ 23</span></div>
                  <div className="text-sm font-bold text-teal-700 bg-teal-50 inline-block px-3 py-1 rounded-full mb-4">No Risk</div>
                  <div className="text-xs text-slate-400 text-right mt-2 flex items-center justify-end gap-1">Click for Details <ArrowDownRight size={12}/></div>
                </div>
              </div>
            </div>
          )}

          {/* --- EDUCATION TAB --- */}
          {activeTab === 'education' && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-2xl font-bold text-rose-950 mb-4">Discharge Education Plan</h3>
              <div className="bg-white border border-rose-100 p-6 rounded-3xl flex items-start gap-4 mb-6 shadow-sm">
                <div className="bg-rose-50 p-3 rounded-full text-rose-500 shadow-sm"><BookOpen size={24} /></div>
                <div>
                  <h3 className="text-xl font-bold text-rose-900 mb-2">CPFE 환자 퇴원 가이드</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    본 대상자는 <strong>복합 폐섬유증 및 폐기종(CPFE)</strong>으로 인해 폐확산능(DLCO)이 33%로 저하되어 있습니다. 
                    퇴원 후 가정에서의 철저한 호흡 관리와 감염 예방이 재입원을 막는 핵심입니다.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {educationContent.map((edu, i) => (
                  <div key={i} className={`${theme.card} p-6 flex flex-col hover:-translate-y-1 transition-transform`}>
                    <div className="mb-4 bg-rose-50 w-12 h-12 rounded-2xl flex items-center justify-center text-rose-500">
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
      {riskModal && (
        <RiskHistoryModal type={riskModal} onClose={() => setRiskModal(null)} />
      )}
      {showLabModal && (
        <LabDetailsModal data={labData} onClose={() => setShowLabModal(false)} />
      )}
    </div>
  );
};

export default NursingCaseStudyApp;