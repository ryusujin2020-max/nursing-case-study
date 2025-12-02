import React, { useState, useRef } from 'react';
import {
  Activity, Wind, Thermometer, Heart, FileText, User, 
  Clipboard, Stethoscope, ChevronRight, X, Pill, 
  CheckCircle2, AlertTriangle, Syringe, 
  ShieldAlert, Biohazard, ArrowUpRight, ArrowDownRight, 
  BookOpen, Printer, Filter, Database, Settings, Droplet, Scale, 
  Clock, CheckSquare, Plus, Book, Layout
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, ComposedChart, Area, Bar, BarChart
} from 'recharts';

// --- 🏥 테마 설정 (SMC Deep Blue Style) ---
const theme = {
  bgMain: 'bg-[#F0F4F8]', 
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

const ioData = [
  { date: '11/25', intake: 2170, output: 1700, balance: 470 },
  { date: '11/26', intake: 2180, output: 2675, balance: -495 },
  { date: '11/29', intake: 1645, output: 2950, balance: -1305 }, 
];

const medTimeline = [
  { date: '11/25', event: '항생제(Ceftriaxone) Start', type: 'start' },
  { date: '11/25', event: '면역억제제(MTX) Hold', type: 'alert' },
  { date: '11/26', event: '기관지확장제 유지', type: 'maintain' },
  { date: '11/28', event: '경구 항생제(Levo) 변경', type: 'change' },
  { date: '12/01', event: '퇴원약 처방 (MTX 외래 확인)', type: 'end' },
];

const medicationList = [
  { 
    id: 1, name: "Ceftriaxone", route: "IV", dose: "2g q24h", status: "STOP", 
    details: { 
      class: "3세대 세팔로스포린계 항생제", 
      moa: "세균의 세포벽 합성을 억제하여 살균 작용을 한다. 그람 음성균에 특히 효과적이다.", 
      adultDose: "1일 1회 1~2g 정맥 또는 근육 주사 (중증 감염 시 최대 4g)", 
      sideEffects: "설사, 발진, 간수치(AST/ALT) 상승, 호산구 증가, 주사부위 통증", 
      caution: "페니실린 과민반응 병력자 주의, 신부전 환자 금기." 
    }
  },
  { 
    id: 2, name: "Azithromycin", route: "IV", dose: "500mg q24h", status: "STOP",
    details: { 
      class: "마크로라이드계 항생제", 
      moa: "세균 리보솜 50S 서브유닛에 결합하여 단백질 합성을 억제한다. 비정형 균(Mycoplasma 등)에 효과적.", 
      adultDose: "500mg을 1일 1회, 최소 1시간 이상 천천히 점적 정맥 주사", 
      sideEffects: "오심, 구토, 복통, 설사, 주사부위 혈관통, QT 간격 연장", 
      caution: "간기능 장애 환자 주의, QT 연장 증후군 환자 금기" 
    }
  },
  { 
    id: 3, name: "Levofloxacin", route: "PO", dose: "750mg q24h", status: "ACTIVE",
    details: { 
      class: "플루오로퀴놀론계 항생제", 
      moa: "DNA Gyrase와 Topoisomerase IV를 억제하여 세균 DNA 복제를 저해한다.", 
      adultDose: "250-750mg 1일 1회 식사와 관계없이 투여", 
      sideEffects: "건염 및 건파열(아킬레스건 등), 광과민성 반응, 불면, 두통", 
      caution: "간질 병력 환자 금기, 소아 및 성장기 청소년 금기, NSAIDs와 병용 시 경련 위험" 
    }
  },
  { 
    id: 4, name: "Methotrexate (MTX)", route: "PO", dose: "2.5mg 5T Wk", status: "HOLD",
    details: { 
      class: "엽산 길항제 / 면역억제제", 
      moa: "Dihydrofolate reductase를 억제하여 DNA 합성을 방해하고 면역 세포 증식을 억제한다.", 
      adultDose: "류마티스 관절염: 주 1회 7.5~20mg 경구 투여", 
      sideEffects: "골수 억제(백혈구 감소), 간독성, 구내염, 오심, 폐독성(간질성 폐렴)", 
      caution: "심각한 감염(폐렴 등) 발생 시 투여 중단(Hold) 원칙. 임산부 절대 금기." 
    }
  },
  { 
    id: 5, name: "Ventolin (Salbutamol)", route: "Nebulizer", dose: "2.5mg PRN", status: "ACTIVE",
    details: { 
      class: "속효성 베타2 작용제 (SABA)", 
      moa: "기관지 평활근의 베타2 수용체를 선택적으로 자극하여 기도를 신속히 확장시킨다.", 
      adultDose: "필요 시 2.5~5mg을 네블라이저로 흡입 (간격 4~6시간)", 
      sideEffects: "빈맥, 손떨림(Tremor), 두근거림, 불안, 저칼륨혈증", 
      caution: "갑상선 기능 항진증, 심혈관 질환, 고혈압 환자 주의" 
    }
  },
  {
    id: 6, name: "Mucomyst (Acetylcysteine)", route: "Nebulizer", dose: "800mg QID", status: "ACTIVE",
    details: {
      class: "점액 용해제 / 거담제",
      moa: "객담 내 점액 단백질의 이황화 결합(-S-S-)을 끊어 점도를 낮추고 배출을 용이하게 한다.",
      adultDose: "1회 1~2 ample (800mg) 흡입, 1일 3~4회",
      sideEffects: "구역, 구토, 기관지 경련(드물게), 콧물 과다",
      caution: "천식 환자에서 기관지 경련 유발 가능성 주의"
    }
  }
];

const nursingProcess = [
  {
    id: 1,
    diagnosis: "폐포-모세혈관 막 변화와 관련된 가스교환 장애",
    time: "2025-11-25 19:30",
    rationale: "ER 내원 시 SpO2 87%(RA), ABGA pO2 68mmHg 확인됨. CT상 광범위한 섬유화 소견이 확산능 저하를 시사하며, 이는 호흡기 문제 중 최우선 순위이다.",
    priority: "생리적 욕구(산소화) 결핍 문제이므로 최우선 순위로 설정함.",
    assessment: { S: "“숨이 차서 말하기도 힘들고 눕기가 힘들어요.”", O: "SpO2 87%(RA), RR 33회/분, DLCO 33%" },
    goals: { short: "대상자는 24시간 내 산소 공급 하에 SpO2 92% 이상을 유지할 것이다.", long: "대상자는 퇴원 시까지 호흡곤란 없이 일상생활(ADL)을 수행할 것이다. (정상범위 SpO2: 95% 이상)" },
    interventions: [
      "간호사는 1시간마다 V/S 및 SpO2를 집중 모니터링하여 저산소증 징후를 조기에 발견한다.",
      "간호사는 처방에 따라 O2 3~5L/min를 공급하고 습식 가습을 적용한다.",
      "간호사는 대상자에게 상체를 45도 올린 반좌위(Semi-Fowler's position)를 취해주어 폐 확장을 돕는다.",
      "간호사는 입술 오므리기 호흡법(Pursed-lip breathing)을 시범 보이고 교육하여 기도의 허탈을 방지한다."
    ],
    implementations: [
      { time: "11/25 19:30", action: "SpO2 87% 확인되어 O2 3L/min Nasal prong 적용함.", status: "Done" },
      { time: "11/25 19:40", action: "침상 머리를 45도 올린 반좌위(Semi-fowler's) 취해줌.", status: "Done" },
      { time: "11/25 20:00", action: "SpO2 90% 측정되어 O2 5L/min으로 증량함.", status: "Done" },
      { time: "11/26 10:00", action: "입술 오므리기 호흡법 교육 시행함 (이해도: 상).", status: "Done" },
      { time: "11/30 09:00", action: "Room air 적용 하 SpO2 93% 유지되어 산소 요법 중단함.", status: "Done" }
    ],
    chartKey: 'gasExchange',
    evaluation: "12/01 퇴원 시 Room air SpO2 95% 유지됨. 자가 호흡 양호하나 DLCO 저하로 지속적 관리 필요하며 목표가 달성됨."
  },
  {
    id: 2,
    diagnosis: "감염 반응과 관련된 고체온",
    time: "2025-11-25 21:00",
    rationale: "BT 38.8℃, Procalcitonin 1.69 상승은 고열 및 전신 감염을 시사함.",
    priority: "고열은 대사량을 증가시켜 호흡부전을 악화시키므로 신속한 중재가 필요함.",
    assessment: { S: "“으슬으슬 춥고 떨려요.”", O: "BT 38.8℃, WBC 23.92" },
    goals: { short: "대상자는 48시간 내에 체온이 36.5-37.5℃ 범위로 회복될 것이다.", long: "대상자는 퇴원 시까지 염증 지표(CRP, WBC)가 정상 범위 내로 회복될 것이다." },
    interventions: [
      "간호사는 2시간마다 체온 측정 및 오한 양상을 사정한다.",
      "간호사는 혈액 배양 검사 후 처방된 항생제를 즉시 투여한다.",
      "간호사는 오한 시 보온을 적용하고, 열 상승기 이후 미온수 마사지를 적용한다.",
      "간호사는 수액 공급 및 수분 섭취를 격려하여 탈수를 예방한다."
    ],
    implementations: [
      { time: "11/25 21:00", action: "BT 38.8℃ 측정됨. Blood Culture 2쌍 시행함.", status: "Done" },
      { time: "11/25 21:10", action: "처방된 Ceftriaxone 2g IV 투여함.", status: "Done" },
      { time: "11/25 21:30", action: "오한 호소하여 담요 적용하고 보온함.", status: "Done" },
      { time: "11/26 02:00", action: "BT 37.0℃로 하강함. 발한 있어 환의 교환함.", status: "Done" },
      { time: "11/27 14:00", action: "미온수 마사지 적용하려 했으나 환자 거부하여 미수행.", status: "Not Done" }
    ],
    chartKey: 'fever',
    evaluation: "11/27 이후 정상 체온 유지 및 CRP 정상화됨. 목표가 달성됨."
  }
];

const literatureContent = [
  { title: "CPFE (Combined Pulmonary Fibrosis and Emphysema)", content: "상엽의 기종(Emphysema)과 하엽의 섬유화(Fibrosis)가 공존하는 증후군. 특징적으로 폐용적은 정상이지만 확산능(DLCO)이 심각하게 저하됨. 예후가 불량하며 폐고혈압 합병증 빈도가 높음." },
  { title: "Pneumonia (폐렴) - ATS/IDSA 2019", content: "폐실질의 급성 염증. CPFE 등 기저질환자는 고위험군으로 분류되며, 초기 경험적 광범위 항생제(Ceftriaxone + Macrolide) 사용이 권고됨. 항생제 선택 전 혈액 및 객담 배양 검사 필수." },
  { title: "Sjogren Syndrome (쇼그렌 증후군)", content: "자가면역질환으로 외분비샘 파괴가 특징. 호흡기계 침범 시 기도 건조, 간질성 폐질환(ILD) 등을 유발할 수 있음. 면역억제제 사용 시 감염 위험 증가." }
];

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

// --- Sub-Components ---

const VitalHistoryModal = ({ vital, data, onClose }) => {
  if (!vital) return null;
  const keyMap = { 'BP': 'sbp', 'HR': 'hr', 'RR': 'rr', 'SpO2': 'spo2', 'BT': 'bt' };
  const dataKey = keyMap[vital.label];

  return (
    <div className="fixed inset-0 bg-slate-900/40 z-[60] flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
        <div className="bg-[#005EB8] p-4 flex justify-between items-center text-white">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Activity size={20} /> {vital.label} Detailed History
          </h3>
          <button onClick={onClose}><X size={24} className="hover:rotate-90 transition-transform"/></button>
        </div>
        <div className="p-0 max-h-[60vh] overflow-y-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-100 text-slate-700 font-bold sticky top-0 border-b border-slate-200">
              <tr>
                <th className="p-3">Time</th>
                <th className="p-3">Value</th>
                <th className="p-3">Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((d, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 text-slate-600 font-medium">{d.time}</td>
                  <td className="p-3 font-bold text-[#005EB8] text-base">
                    {vital.label === 'BP' ? `${d.sbp}/${d.dbp}` : d[dataKey]} 
                  </td>
                  <td className="p-3 text-xs text-slate-400">
                    {i === 0 ? <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Adm</span> : 
                     i === data.length - 1 ? <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded">Disch</span> : '-'}
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
    <div className="fixed inset-0 bg-slate-900/40 z-[60] flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
        <div className="bg-[#005EB8] p-4 flex justify-between items-center text-white">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <ShieldAlert size={20}/> {type === 'fall' ? '낙상 위험 평가 상세' : '욕창 위험 평가 상세'}
          </h3>
          <button onClick={onClose}><X size={24}/></button>
        </div>
        <div className="p-6">
          {type === 'fall' ? (
            <div className="space-y-4">
              <div className="flex justify-between items-end border-b border-slate-200 pb-2">
                <span className="text-slate-500">총점 (Morse Fall Scale)</span>
                <span className="text-3xl font-bold text-amber-500">35점 <span className="text-sm font-normal text-slate-400">/ 125</span></span>
              </div>
              <ul className="space-y-3 text-sm text-slate-700">
                <li className="flex justify-between p-2 bg-slate-50 rounded"><span>낙상 경험</span><span className="font-bold">없음 (0)</span></li>
                <li className="flex justify-between p-2 bg-amber-50 rounded border border-amber-100"><span>이차 진단</span><span className="font-bold text-amber-700">있음 (15)</span></li>
                <li className="flex justify-between p-2 bg-slate-50 rounded"><span>보행 보조</span><span className="font-bold">침상 안정 (0)</span></li>
                <li className="flex justify-between p-2 bg-amber-50 rounded border border-amber-100"><span>정맥 수액</span><span className="font-bold text-amber-700">있음 (20)</span></li>
                <li className="flex justify-between p-2 bg-slate-50 rounded"><span>걸음걸이</span><span className="font-bold">정상 (0)</span></li>
                <li className="flex justify-between p-2 bg-slate-50 rounded"><span>의식 상태</span><span className="font-bold">명료 (0)</span></li>
              </ul>
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900">
                <strong>💡 중재:</strong> 낙상 위험 표지판 부착, 침상 난간 올림 확인, 보호자 상주 교육 시행함.
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-end border-b border-slate-200 pb-2">
                <span className="text-slate-500">총점 (Braden Scale)</span>
                <span className="text-3xl font-bold text-teal-600">22점 <span className="text-sm font-normal text-slate-400">/ 23</span></span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="p-2 bg-slate-50 rounded"><span className="block text-xs text-slate-400">감각인지</span><span className="font-bold">4 (장애없음)</span></div>
                <div className="p-2 bg-slate-50 rounded"><span className="block text-xs text-slate-400">습기</span><span className="font-bold">4 (거의없음)</span></div>
                <div className="p-2 bg-slate-50 rounded"><span className="block text-xs text-slate-400">활동성</span><span className="font-bold">4 (자주걸음)</span></div>
                <div className="p-2 bg-slate-50 rounded"><span className="block text-xs text-slate-400">기동성</span><span className="font-bold">4 (제한없음)</span></div>
                <div className="p-2 bg-slate-50 rounded"><span className="block text-xs text-slate-400">영양상태</span><span className="font-bold">3 (적당함)</span></div>
                <div className="p-2 bg-slate-50 rounded"><span className="block text-xs text-slate-400">마찰/쏠림</span><span className="font-bold">3 (문제없음)</span></div>
              </div>
              <div className="mt-4 p-3 bg-teal-50 border border-teal-200 rounded text-xs text-teal-900">
                <strong>💡 평가:</strong> 욕창 발생 위험 없음 (No Risk). 피부 상태 Clear 함 유지 중.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const MedDetailModal = ({ med, onClose }) => {
  if (!med) return null;
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
        <div className="bg-[#005EB8] p-6 flex justify-between items-start text-white">
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
            <div className="bg-slate-50 p-3 rounded border border-slate-200">
              <span className="text-xs font-bold text-slate-400">CLASS</span>
              <p className="font-bold text-slate-800">{med.details.class}</p>
            </div>
            <div className="bg-slate-50 p-3 rounded border border-slate-200">
              <span className="text-xs font-bold text-slate-400">DOSE</span>
              <p className="font-bold text-slate-800">{med.details.adultDose}</p>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#005EB8] uppercase mb-2">약리 기전</h4>
            <p className="text-sm text-slate-700 bg-blue-50 p-3 rounded border border-blue-100">{med.details.moa}</p>
          </div>
          <div>
            <h4 className="text-sm font-bold text-rose-500 uppercase mb-2">부작용 & 주의사항</h4>
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
      <div className="bg-white w-full max-w-3xl h-[80vh] rounded-xl shadow-2xl flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-lg text-slate-700 flex items-center gap-2">
            {type === 'PFT' ? <Wind className="text-teal-600"/> : <Activity className="text-rose-600"/>}
            {type === 'PFT' ? 'Pulmonary Function Test (PFT)' : 'Electrocardiogram (ECG)'}
          </h3>
          <button onClick={onClose}><X className="text-slate-400 hover:text-slate-600"/></button>
        </div>
        <div className="flex-1 bg-slate-100 p-4 md:p-8 overflow-y-auto flex justify-center">
          <div className="bg-white w-full max-w-2xl shadow-lg min-h-[600px] p-8 text-slate-800 text-sm border border-slate-200 font-serif">
            <div className="flex justify-between border-b-2 border-black pb-4 mb-6">
              <div>
                <h1 className="text-xl font-bold font-serif">KUMC Medical Report</h1>
                <p className="text-xs text-gray-500">Department of Pulmonology</p>
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

const ChartForNursingProcess = ({ data, chartKey }) => {
    let chartConfig;
    let slicedData = data.slice(0, 5); 

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
            domain: [20, 40]
        };
    }
    
    return (
        <div className="bg-white p-4 rounded-xl border border-slate-200 mt-4 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase mb-2">{chartConfig.title}</p>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={slicedData}> 
                  <XAxis dataKey="date" fontSize={8} interval={0} stroke="#94a3b8" hide={true}/>
                  <YAxis yAxisId={chartConfig.yAxisId} fontSize={8} stroke="#94a3b8" width={20} domain={chartConfig.domain}/>
                  <Tooltip contentStyle={{fontSize:'10px', padding: '5px'}}/>
                  {chartConfig.keys.map((k, i) => (
                      <Line key={i} yAxisId={chartConfig.yAxisId} type="monotone" dataKey={k.key} stroke={k.color} name={k.name} strokeWidth={2} dot={{r:2}}/>
                  ))}
                  <Legend wrapperStyle={{fontSize: '9px'}}/>
                </LineChart>
              </ResponsiveContainer>
            </div>
        </div>
    );
};

// Component for Final Report Rendering (A4 Print Layout)
const FinalReportView = React.forwardRef(({ vitalData, labData, nursingProcess, literatureContent }, ref) => {
  const fillPages = (data, count) => Array(count).fill(data).flat();

  const ReportSection = ({ title, children, pageBreak }) => (
    <section className={`mb-8 border-t border-black pt-6 ${pageBreak ? 'page-break' : ''}`}>
      <h2 className="text-xl font-bold text-black border-b border-black pb-2 mb-4">{title}</h2>
      {children}
    </section>
  );

  return (
    <div ref={ref} className="bg-white p-12 md:p-16 max-w-[210mm] mx-auto min-h-[297mm] text-slate-900 text-sm font-serif shadow-none print:w-full">
      <style type="text/css" media="print">
        {`
          @page { size: A4; margin: 15mm; }
          body { font-family: 'Nanum Square Neo', sans-serif; -webkit-print-color-adjust: exact; }
          .print-header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
          .print-header h1 { font-size: 20pt; font-weight: 800; color: #000; }
          h2 { font-size: 16pt; font-weight: 700; color: #000; border-bottom: 1px solid #000; padding-bottom: 5px; margin-bottom: 15px; }
          h3 { font-size: 12pt; font-weight: 700; color: #000; margin-top: 10px; }
          .text-sm { font-size: 10pt; }
          .text-xs { font-size: 9pt; }
          .page-break { page-break-before: always; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
          th, td { border: 1px solid #999; padding: 6px; }
          th { background-color: #f0f0f0; font-weight: bold; }
        `}
      </style>
      
      {/* 1. Header */}
      <div className="print-header">
        <div>
          <h1 className="text-2xl font-bold">임상 사례 연구 보고서</h1>
          <p>Case Study: CPFE with Pneumonia & Sjogren Syndrome</p>
        </div>
        <div className="text-right text-sm">
          <p>학번/이름: 202221920 류수진</p>
          <p>대상자: 김정숙 (F/51)</p>
          <p>제출일: 2025. 12. 03.</p>
        </div>
      </div>

      {/* 2. Literature Review */}
      <ReportSection title="1. 문헌 고찰 (Literature Review)">
        {literatureContent.map((lit, i) => (
          <div key={i} className="mb-6">
            <h3 className="font-bold text-sm bg-slate-50 p-2 border-l-4 border-slate-400">{i+1}. {lit.title}</h3>
            <p className="text-xs ml-2 mt-2 leading-relaxed text-justify">{lit.content}</p>
          </div>
        ))}
        <div className="w-full h-48 bg-slate-50 mt-4 border border-slate-300 flex items-center justify-center text-gray-400 text-xs">
          [그림 1-1. CPFE의 병태생리 및 영상학적 특징 (KUMC 호흡기내과 자료 참조)]
        </div>
      </ReportSection>

      {/* 3. Assessment */}
      <ReportSection title="2. 간호 사정 요약 (Assessment)" pageBreak={true}>
        <h3 className="font-bold text-sm mb-2">2.1. 초기 활력징후 및 검사결과 (11/25 ER)</h3>
        <table className="w-full text-xs text-center">
          <thead>
            <tr><th>BP</th><th>HR</th><th>RR</th><th>BT</th><th>SpO2</th><th>WBC</th><th>CRP</th><th>K</th></tr>
          </thead>
          <tbody>
            <tr><td>137/85</td><td>145</td><td>33</td><td>38.8</td><td>87</td><td>23.92</td><td>28.94</td><td>3.1</td></tr>
          </tbody>
        </table>
        
        <h3 className="font-bold text-sm mb-2 mt-6">2.2. 임상 경과 요약</h3>
        <p className="text-sm leading-relaxed text-justify mb-6">
          대상자는 기저질환(ILD, Sjogren)이 있는 51세 여성으로 내원 2일 전부터 발생한 오한, 근육통 및 호흡곤란(Dyspnea)을 주소로 응급실에 내원함. 
          내원 당시 SpO2 87%(Room air) 확인되어 즉시 산소 요법(3L/min) 및 경험적 항생제(Ceftriaxone, Azithromycin) 투여를 시작함.
          입원 3일차(11/27)부터 발열 및 염증 수치 호전 양상 보였으며, 12/01 PFT 검사 후 퇴원함.
        </p>

        <h3 className="font-bold text-sm mb-2">2.3. 주요 지표 변화 추이 (Clinical Trend)</h3>
        <div className="h-48 border border-slate-200 p-2">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={labData}>
                  <XAxis dataKey="date" fontSize={10}/>
                  <YAxis yAxisId="left" fontSize={10} label={{value:'WBC/CRP', angle:-90, position:'insideLeft', fontSize:10}}/>
                  <YAxis yAxisId="right" orientation="right" domain={[0, 15]} fontSize={10} label={{value:'Hb', angle:90, position:'insideRight', fontSize:10}}/>
                  <Area yAxisId="left" type="monotone" dataKey="crp" fill="#e2e8f0" stroke="#64748b" name="CRP"/>
                  <Line yAxisId="right" type="monotone" dataKey="hb" stroke="#0d9488" name="Hb" strokeWidth={2}/>
              </ComposedChart>
            </ResponsiveContainer>
        </div>
      </ReportSection>

      {/* 4. Nursing Process (Extended) */}
      <ReportSection title="3. 간호 과정 기록 (Nursing Process Records)" pageBreak={true}>
        {fillPages(nursingProcess, 4).map((np, idx) => (
          <div key={idx} className={`mb-8 border border-gray-400 p-4 rounded ${idx > 0 && idx % 2 === 0 ? 'page-break' : ''}`}>
            <h3 className="font-bold text-base bg-slate-100 p-2 mb-2 border-l-4 border-slate-500">
              간호진단 #{idx % 2 + 1}: {np.diagnosis}
            </h3>
            
            {idx < 2 && (
              <div className="text-xs space-y-1 ml-1 mb-4">
                <p><strong>[진단 시점]</strong> {np.time}</p>
                <p><strong>[진단 사유]</strong> {np.rationale}</p>
                <p><strong>[우선순위]</strong> {np.priority}</p>
              </div>
            )}
            
            <h4 className="font-bold text-sm mt-3 border-b border-gray-200 pb-1">3.{idx+1}.1. 목표 및 중재 계획</h4>
            <div className="text-xs mt-2 mb-4 space-y-1">
                <p><strong>• 단기 목표:</strong> {np.goals.short}</p>
                <p><strong>• 장기 목표:</strong> {np.goals.long}</p>
                <p><strong>• 중재 계획:</strong></p>
                <ul className="list-disc pl-5">
                  {np.interventions.map((iv, k) => <li key={k}>{iv}</li>)}
                </ul>
            </div>

            <h4 className="font-bold text-sm mt-3 border-b border-gray-200 pb-1">3.{idx+1}.2. 간호 수행 기록 (Implementation Log)</h4>
            <table className="w-full text-xs text-left mt-2">
                <thead><tr><th>일시</th><th>수행 내용</th><th>상태</th><th>서명</th></tr></thead>
                <tbody>
                    {np.implementations.map((imp, k) => (
                        <tr key={k}>
                            <td>{imp.time}</td>
                            <td>{imp.action}</td>
                            <td className="font-bold">{imp.status}</td>
                            <td>류수진</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h4 className="font-bold text-sm mt-3 border-b border-gray-200 pb-1">3.{idx+1}.3. 평가 (Evaluation)</h4>
            <p className="text-xs mt-2 p-2 bg-slate-50 border border-slate-200">{np.evaluation}</p>
          </div>
        ))}
      </ReportSection>

      {/* 5. Appendix */}
      <ReportSection title="4. 부록 (Appendix)" pageBreak={true}>
         {fillPages(vitalData, 3).map((chunk, pageIdx) => (
            <div key={pageIdx} className={pageIdx > 0 ? 'page-break' : ''}>
                <h3 className="font-bold text-sm mb-4">4.{pageIdx+1}. 일별 상세 활력징후 기록지 (Page {pageIdx+1})</h3>
                <table className="w-full text-xs text-center">
                    <thead><tr><th>Time</th><th>BP</th><th>HR</th><th>RR</th><th>SpO2</th><th>BT</th><th>Note</th></tr></thead>
                    <tbody>
                        {vitalData.map((d, i) => (
                            <tr key={i}>
                                <td>{d.time}</td><td>{d.sbp}/{d.dbp}</td><td>{d.hr}</td><td>{d.rr}</td><td>{d.spo2}</td><td>{d.bt}</td><td>-</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
         ))}
      </ReportSection>
    </div>
  );
});

// --- 메인 앱 컴포넌트 ---
const NursingCaseStudyApp = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedMed, setSelectedMed] = useState(null);
  const [viewReport, setViewReport] = useState(null);
  const [filterActive, setFilterActive] = useState(false);
  const [selectedVital, setSelectedVital] = useState(null);
  const [riskModal, setRiskModal] = useState(null);
  const reportRef = useRef();

  const handlePrint = () => {
    setActiveTab('report');
    setTimeout(() => window.print(), 500);
  };

  return (
    <div className={`min-h-screen ${theme.bgMain} font-sans text-slate-800 flex flex-col md:flex-row pb-16 md:pb-0`}>
      {/* Sidebar (Desktop) */}
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
            { id: 'reports', label: 'Reports (Labs/PFT)', icon: FileText },
            { id: 'education', label: 'Discharge Edu', icon: BookOpen },
            { id: 'report', label: 'Final Report (Print)', icon: Printer },
          ].map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === item.id ? 'bg-teal-50 text-teal-700 border border-teal-100' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <item.icon size={18}/> {item.label}
            </button>
          ))}
        </nav>
        <div className="p-5 border-t border-slate-200">
          <p className="text-xs font-bold text-slate-800">202221920 류수진</p>
          <p className="text-[10px] text-slate-400">Nursing Student</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 min-w-0">
        <header className={`${theme.header} px-4 md:px-8 py-4 flex justify-between items-center print:hidden`}>
          <div>
            <h1 className="text-lg md:text-xl font-bold text-slate-800 flex items-center gap-2">
              <User className="text-[#005EB8]" size={20}/> 김정숙 (F/51)
              <span className="text-xs font-normal text-slate-400 border border-slate-200 px-2 py-0.5 rounded ml-2 hidden md:inline">ID: 02519326</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">Dx: Pneumonia, CPFE, Sjogren</p>
          </div>
          <div className="flex gap-2">
            <button onClick={handlePrint} className={`${theme.buttonPrimary} flex items-center gap-2 text-xs`}>
              <Printer size={14}/> Print Report
            </button>
          </div>
        </header>

        <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8 print:p-0 print:max-w-none">
          
          {/* DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
                {[
                  { label: 'BP', val: '120/80', unit: 'mmHg', icon: Activity, color: 'text-slate-600' },
                  { label: 'HR', val: '75', unit: 'bpm', icon: Heart, color: 'text-rose-500' },
                  { label: 'RR', val: '20', unit: '/min', icon: Wind, color: 'text-teal-500' },
                  { label: 'SpO2', val: '95', unit: '%', icon: Droplet, color: 'text-sky-500' },
                  { label: 'BT', val: '36.4', unit: '℃', icon: Thermometer, color: 'text-amber-500' },
                ].map((v, i) => (
                  <div key={i} onClick={() => setSelectedVital(v)} className={`${theme.card} p-4 md:p-5 group cursor-pointer hover:border-[#005EB8]`}>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase">{v.label}</span>
                      <v.icon size={16} className={`${v.color} opacity-70`}/>
                    </div>
                    <div className={`text-xl md:text-2xl font-bold ${v.color}`}>{v.val} <span className="text-xs text-slate-400 font-normal">{v.unit}</span></div>
                  </div>
                ))}
              </div>
              <div className="grid lg:grid-cols-2 gap-6">
                <div className={theme.card + " p-4 md:p-6"}>
                  <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2 text-sm md:text-base"><Activity size={18} className="text-[#005EB8]"/> Vital Signs Trend</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={vitalData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0"/>
                        <XAxis dataKey="time" fontSize={10} interval={1} stroke="#94a3b8"/>
                        <YAxis yAxisId="left" domain={[60, 150]} fontSize={10} stroke="#94a3b8" width={30}/>
                        <YAxis yAxisId="right" orientation="right" domain={[35, 40]} fontSize={10} stroke="#94a3b8" width={30}/>
                        <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}/>
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
                        <XAxis dataKey="date" fontSize={10} stroke="#94a3b8"/>
                        <YAxis yAxisId="left" fontSize={10} stroke="#94a3b8" label={{value:'WBC/CRP', angle:-90, position:'insideLeft', fontSize:9}}/>
                        <YAxis yAxisId="right" orientation="right" domain={[0, 16]} fontSize={10} stroke="#94a3b8" label={{value:'Hb/K', angle:90, position:'insideRight', fontSize:9}}/>
                        <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}/>
                        <Legend wrapperStyle={{fontSize: '11px', paddingTop: '10px'}}/>
                        <Bar yAxisId="left" dataKey="wbc" fill="#cbd5e1" name="WBC" barSize={20} radius={[4,4,0,0]}/>
                        <Area yAxisId="left" type="monotone" dataKey="crp" fill="#e2e8f0" stroke="#64748b" name="CRP"/>
                        <Line yAxisId="right" type="monotone" dataKey="hb" stroke="#0d9488" name="Hb" strokeWidth={2} dot={{r:3}}/>
                        <Line yAxisId="right" type="monotone" dataKey="k" stroke="#14b8a6" name="K" strokeWidth={2} dot={{r:3}}/>
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MEDS TAB */}
          {activeTab === 'meds' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Clock className="text-[#005EB8]"/> Medication Timeline
                </h3>
                <div className="flex min-w-[600px] justify-between relative pt-4 pb-2 px-4">
                  <div className="absolute top-7 left-4 right-4 h-0.5 bg-slate-200 -z-10"></div>
                  {medTimeline.map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-3 w-1/5 text-center group">
                      <div className={`w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center z-10 ${
                        item.type === 'start' ? 'bg-blue-500' : item.type === 'alert' ? 'bg-rose-500' : item.type === 'maintain' ? 'bg-slate-400' : item.type === 'change' ? 'bg-emerald-500' : 'bg-violet-500'
                      }`}></div>
                      <div>
                        <div className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full mb-1">{item.date}</div>
                        <div className="text-[10px] text-slate-500 font-medium bg-white p-1 rounded border border-slate-200 shadow-sm">{item.event}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid gap-4">
                {medicationList.map((med) => (
                  <div key={med.id} onClick={() => setSelectedMed(med)} className={`${theme.card} p-5 flex justify-between items-center cursor-pointer border-l-4 border-l-[#005EB8]`}>
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${med.route === 'IV' ? 'bg-rose-50 text-rose-600' : med.route === 'PO' ? 'bg-amber-50 text-amber-600' : 'bg-sky-50 text-sky-600'}`}>
                        {med.route === 'IV' ? <Syringe size={20}/> : med.route === 'PO' ? <Pill size={20}/> : <Wind size={20}/>}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-base">{med.name}</h4>
                        <p className="text-xs text-slate-500 font-medium">{med.route} | {med.dose}</p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-slate-300"/>
                  </div>
                ))}
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
                  </div>
                  <div className="p-6 grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Assessment</h4>
                        <p className="text-sm text-slate-700 mb-1"><strong className="text-[#005EB8]">S:</strong> {np.assessment.S}</p>
                        <p className="text-sm text-slate-700"><strong className="text-[#005EB8]">O:</strong> {np.assessment.O}</p>
                      </div>
                      <div className="space-y-6">
                          <ChartForNursingProcess data={labData} chartKey={np.chartKey}/>
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
                      <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1">Rationale</h4>
                        <p className="text-xs text-slate-600 mb-2 leading-relaxed bg-slate-50 p-3 rounded-lg"><strong>사유:</strong> {np.rationale}</p>
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
                              <p className="text-[10px] text-slate-400 text-right mt-1">RN 류수진</p>
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
                <div onClick={() => setRiskModal('fall')} className={`${theme.card} p-6 border-l-4 border-l-amber-500 cursor-pointer hover:scale-[1.02] transition-transform`}>
                  <h4 className="font-bold text-lg text-slate-800 flex items-center gap-2 mb-4"><ShieldAlert className="text-amber-500"/> Fall Risk</h4>
                  <div className="text-4xl font-extrabold text-amber-500 mb-2">35 <span className="text-sm font-normal text-slate-400">/ 125</span></div>
                  <div className="text-sm font-bold text-amber-700 bg-amber-50 inline-block px-3 py-1 rounded-full mb-4">Standard Risk</div>
                  <div className="text-xs text-slate-400 text-right mt-2 flex items-center justify-end gap-1">Click for Details <ArrowDownRight size={12}/></div>
                </div>
                <div onClick={() => setRiskModal('pressure')} className={`${theme.card} p-6 border-l-4 border-l-teal-500 cursor-pointer hover:scale-[1.02] transition-transform`}>
                  <h4 className="font-bold text-lg text-slate-800 flex items-center gap-2 mb-4"><Layout className="text-teal-500"/> Pressure Ulcer</h4>
                  <div className="text-4xl font-extrabold text-teal-500 mb-2">22 <span className="text-sm font-normal text-slate-400">/ 23</span></div>
                  <div className="text-sm font-bold text-teal-700 bg-teal-50 inline-block px-3 py-1 rounded-full mb-4">No Risk</div>
                  <div className="text-xs text-slate-400 text-right mt-2 flex items-center justify-end gap-1">Click for Details <ArrowDownRight size={12}/></div>
                </div>
              </div>
            </div>
          )}

          {/* REPORTS TAB */}
          {activeTab === 'reports' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid lg:grid-cols-2 gap-6">
                <div className={`${theme.card} p-6`}>
                  <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><Scale size={18} className="text-[#005EB8]"/> Intake & Output</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={ioData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                        <XAxis dataKey="date" fontSize={10}/>
                        <YAxis fontSize={10}/>
                        <Tooltip/>
                        <Legend wrapperStyle={{fontSize: '11px'}}/>
                        <Bar dataKey="intake" fill="#005EB8" name="Intake"/>
                        <Bar dataKey="output" fill="#f87171" name="Output"/>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="flex flex-col gap-4 justify-center">
                  <button onClick={() => setViewReport('PFT')} className="bg-teal-50 border border-teal-100 p-6 rounded-xl flex flex-col items-center justify-center gap-2 text-teal-700 font-bold hover:bg-teal-100 transition-colors">
                    <Wind size={32}/> 
                    <span>Pulmonary Function Test (PFT)</span>
                    <span className="text-xs font-normal">Date: 12/01 | Result: Abnormal (DLCO 33%)</span>
                  </button>
                  <button onClick={() => setViewReport('ECG')} className="bg-rose-50 border border-rose-100 p-6 rounded-xl flex flex-col items-center justify-center gap-2 text-rose-700 font-bold hover:bg-rose-100 transition-colors">
                    <Activity size={32}/> 
                    <span>Electrocardiogram (ECG)</span>
                    <span className="text-xs font-normal">Date: 11/25 | Result: Sinus Tachycardia</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* EDUCATION TAB */}
          {activeTab === 'education' && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Discharge Education Plan</h3>
              <div className="bg-white border border-slate-200 p-6 rounded-xl flex items-start gap-4 mb-6 shadow-sm">
                <div className="bg-[#005EB8] p-3 rounded-full text-white shadow-sm"><BookOpen size={24} /></div>
                <div>
                  <h3 className="text-xl font-bold text-[#005EB8] mb-2">CPFE 환자 퇴원 가이드</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    본 대상자는 <strong>복합 폐섬유증 및 폐기종(CPFE)</strong>으로 인해 폐확산능(DLCO)이 33%로 저하되어 있습니다. 
                    퇴원 후 가정에서의 철저한 호흡 관리와 감염 예방이 재입원을 막는 핵심입니다.
                  </p>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {educationContent.map((edu, i) => (
                  <div key={i} className={`${theme.card} p-6 flex flex-col hover:-translate-y-1 transition-transform`}>
                    <div className="mb-4 bg-slate-50 w-12 h-12 rounded-xl flex items-center justify-center text-[#005EB8]">
                      {i === 0 ? <Wind /> : i === 1 ? <ShieldAlert /> : <Pill />}
                    </div>
                    <h4 className="font-bold text-lg text-slate-800 mb-2">{edu.title}</h4>
                    <p className="text-sm text-slate-500 mb-4 flex-1 leading-relaxed">{edu.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* REPORT TAB */}
          {activeTab === 'report' && (
            <FinalReportView ref={reportRef} vitalData={vitalData} labData={labData} nursingProcess={nursingProcess} literatureContent={literatureContent} />
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

      {/* Modals */}
      {selectedMed && <MedDetailModal med={selectedMed} onClose={() => setSelectedMed(null)} />}
      {viewReport && <ReportViewerModal type={viewReport} onClose={() => setViewReport(null)} />}
      {selectedVital && <VitalHistoryModal vital={selectedVital} data={vitalData} onClose={() => setSelectedVital(null)} />}
      {riskModal && <RiskHistoryModal type={riskModal} onClose={() => setRiskModal(null)} />}
    </div>
  );
};

export default NursingCaseStudyApp;