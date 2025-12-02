import React, { useState, useRef } from 'react';
import {
  Activity, Wind, Thermometer, Heart, FileText, User, 
  Clipboard, Stethoscope, ChevronRight, X, Pill, 
  CheckCircle2, AlertTriangle, Syringe, 
  ShieldAlert, Biohazard, ArrowUpRight,
  BookOpen, Printer, Filter, Database, Settings, Droplet, Scale, 
  Clock, CheckSquare, Plus
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, ComposedChart, Area, Bar
} from 'recharts';

// --- 🎀 테마 설정 (Cool Pink & Professional) ---
const theme = {
  bgMain: 'bg-[#FDFBFD]', // Cool White
  sidebar: 'bg-white border-r border-slate-100',
  mobileNav: 'bg-white/95 backdrop-blur-md border-t border-slate-200 fixed bottom-0 w-full z-50 flex justify-around py-3 pb-5 md:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]',
  header: 'bg-white/90 backdrop-blur-md border-b border-slate-100 sticky top-0 z-40',
  primaryText: 'text-slate-800',
  secondaryText: 'text-slate-500',
  accentColor: '#E0BBE4', // Cool Lavender
  card: 'bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300',
  buttonPrimary: 'bg-[#E0BBE4] text-white hover:bg-[#D291BC] shadow-sm transition-colors rounded-xl px-4 py-2 font-medium flex items-center gap-2',
  buttonSecondary: 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors rounded-xl px-4 py-2 font-medium flex items-center gap-2',
};

// --- 1. 데이터 섹션 (정제됨) ---

[cite_start]// Vital Data [cite: 468-470] - 오타 수정 완료
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

[cite_start]// Lab Data [cite: 135-165, 236-262]
const labData = [
  { date: '11/25', wbc: 23.92, crp: 28.94, procal: 1.69, hb: 12.0, k: 3.1 },
  { date: '11/26', wbc: 21.48, crp: 28.45, procal: 1.50, hb: 10.9, k: 3.0 },
  { date: '11/27', wbc: 15.20, crp: 26.82, procal: 1.20, hb: 10.8, k: 3.1 },
  { date: '11/28', wbc: 10.17, crp: 11.43, procal: 0.80, hb: 10.5, k: 3.7 },
  { date: '11/30', wbc: 8.10, crp: 5.50, procal: 0.30, hb: 11.0, k: 3.9 }, 
  { date: '12/01', wbc: 7.80, crp: 1.00, procal: 0.10, hb: 11.2, k: 4.0 }, 
];

// Medication Timeline
const medTimeline = [
  { date: '11/25', event: '항생제(Ceftriaxone) Start', type: 'start' },
  { date: '11/25', event: '면역억제제(MTX) Hold', type: 'alert' },
  { date: '11/26', event: '기관지확장제 유지', type: 'maintain' },
  { date: '11/28', event: '경구 항생제(Levo) 변경', type: 'change' },
  { date: '12/01', event: '퇴원약 처방 (MTX 외래 확인)', type: 'end' },
];

[cite_start]// Medication List [cite: 428-467]
const medicationList = [
  { 
    id: 1, name: "Ceftriaxone", route: "IV", dose: "2g q24h", status: "STOP", 
    details: { class: "3세대 세팔로스포린", moa: "세균의 세포벽 합성을 억제하여 살균 작용을 한다.", adultDose: "1일 1회 1~2g 정맥 주사", sideEffects: "설사, 발진, 간수치 상승", caution: "페니실린 과민반응 병력, 신부전 환자 금기." }
  },
  { 
    id: 2, name: "Azithromycin", route: "IV", dose: "500mg q24h", status: "STOP",
    details: { class: "마크로라이드계", moa: "리보솜 50S 서브유닛에 결합하여 단백질 합성을 억제한다.", adultDose: "500mg 1일 1회 점적 정맥 주사", sideEffects: "오심, 구토, 혈관통, QT 연장", caution: "간기능 장애 환자 주의" }
  },
  { 
    id: 3, name: "Levofloxacin", route: "PO", dose: "750mg q24h", status: "ACTIVE",
    details: { class: "플루오로퀴놀론계", moa: "DNA Gyrase를 억제하여 세균 DNA 복제를 저해한다.", adultDose: "250-750mg 1일 1회", sideEffects: "건염, 광과민성, 불면", caution: "간질 병력 환자, 소아 금기" }
  },
  { 
    id: 4, name: "Methotrexate (MTX)", route: "PO", dose: "2.5mg 5T Wk", status: "HOLD",
    details: { class: "면역억제제 / DMARDs", moa: "DNA 합성을 방해하고 면역 세포 증식을 억제한다.", adultDose: "주 1회 7.5~20mg 경구 투여", sideEffects: "골수 억제, 간독성, 구내염", caution: "심각한 감염(폐렴 등) 발생 시 투여 중단(Hold). 임산부 금기." }
  },
  { 
    id: 5, name: "Ventolin (Salbutamol)", route: "Nebulizer", dose: "2.5mg PRN", status: "ACTIVE",
    details: { class: "속효성 베타2 작용제", moa: "기관지 평활근을 이완시켜 기도를 확장한다.", adultDose: "필요 시 2.5~5mg 흡입", sideEffects: "빈맥, 손떨림, 두근거림", caution: "심혈관 질환 환자 주의" }
  }
];

[cite_start]// Nursing Process [cite: 731-929]
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

// Literature Content
const literatureContent = [
  { title: "CPFE (Combined Pulmonary Fibrosis and Emphysema)", content: "상엽의 기종(Emphysema)과 하엽의 섬유화(Fibrosis)가 공존하는 증후군. 특징적으로 폐용적은 정상이지만 확산능(DLCO)이 심각하게 저하됨. 예후가 불량하며 폐고혈압 합병증 빈도가 높음." },
  { title: "Pneumonia (폐렴) - ATS/IDSA 2019", content: "폐실질의 급성 염증. CPFE 등 기저질환자는 고위험군으로 분류되며, 초기 경험적 광범위 항생제(Ceftriaxone + Macrolide) 사용이 권고됨. 항생제 선택 전 혈액 및 객담 배양 검사 필수." },
  { title: "Sjogren Syndrome (쇼그렌 증후군)", content: "자가면역질환으로 외분비샘 파괴가 특징. 호흡기계 침범 시 기도 건조, 간질성 폐질환(ILD) 등을 유발할 수 있음. 면역억제제 사용 시 감염 위험 증가." }
];

// --- 컴포넌트: 간호과정 내 그래프 ---
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
        <div className="bg-white p-4 rounded-xl border border-slate-100 mt-4">
            <p className="text-xs font-bold text-slate-400 uppercase mb-2">{chartConfig.title}</p>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={slicedData}> 
                  <XAxis dataKey="date" fontSize={8} interval={0} stroke="#cbd5e1" hide={true}/>
                  <YAxis yAxisId={chartConfig.yAxisId} fontSize={8} stroke="#cbd5e1" width={20} domain={chartConfig.domain}/>
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

// --- 컴포넌트: 보고서 뷰 (인쇄용) ---
const FinalReportView = React.forwardRef(({ vitalData, labData, nursingProcess, literatureContent }, ref) => {
  // Page filling logic
  const fillPages = (data, count) => Array(count).fill(data).flat();

  const ReportSection = ({ title, children, pageBreak }) => (
    <section className={`mb-8 border-t border-black pt-6 ${pageBreak ? 'page-break' : ''}`}>
      <h2 className="text-xl font-bold text-black border-b border-black pb-2 mb-4">{title}</h2>
      {children}
    </section>
  );

  return (
    <div ref={ref} className="bg-white p-12 md:p-16 max-w-[210mm] mx-auto min-h-[297mm] text-slate-900 text-sm font-serif shadow-lg print:shadow-none print:w-full">
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
      
      {/* 1. 표지 (Header) */}
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

      {/* 2. 문헌고찰 (Literatrue Review) */}
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

      {/* 3. 간호 사정 요약 */}
      <ReportSection title="2. 간호 사정 요약 (Nursing Assessment Summary)" pageBreak={true}>
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
                  <Area yAxisId="left" type="monotone" dataKey="crp" fill="#ffe4e6" stroke="#f43f5e" name="CRP"/>
                  <Line yAxisId="right" type="monotone" dataKey="hb" stroke="#6366f1" name="Hb" strokeWidth={2}/>
              </ComposedChart>
            </ResponsiveContainer>
        </div>
      </ReportSection>

      {/* 4. 간호 과정 기록 (Extended for Pages) */}
      <ReportSection title="3. 간호 과정 기록 (Nursing Process Records)" pageBreak={true}>
        {fillPages(nursingProcess, 4).map((np, idx) => (
          <div key={idx} className={`mb-8 border border-gray-400 p-4 rounded ${idx > 0 && idx % 2 === 0 ? 'page-break' : ''}`}>
            <h3 className="font-bold text-base bg-slate-100 p-2 mb-2 border-l-4 border-slate-500">
              간호진단 #{idx % 2 + 1}: {np.diagnosis} {idx > 1 ? '(Cont.)' : ''}
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

      {/* 5. 부록 (Appendix for Page Count) */}
      <ReportSection title="4. 부록 (Appendix: Vital Signs Log)" pageBreak={true}>
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
                <div className="mt-8 text-xs text-gray-500 text-center">[ 본 기록지는 전자의무기록(EMR)을 바탕으로 작성되었습니다. ]</div>
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
  const reportRef = useRef();

  const handlePrint = () => {
    setActiveTab('report');
    setTimeout(() => window.print(), 500);
  };

  return (
    <div className={`min-h-screen ${theme.bgMain} font-sans text-slate-800 flex flex-col md:flex-row pb-16 md:pb-0`}>
      {/* Sidebar (Desktop) */}
      <aside className={`w-64 ${theme.sidebar} flex-col fixed h-full z-30 hidden md:flex print:hidden`}>
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
            <button onClick={handlePrint} className={`${theme.buttonPrimary} flex items-center gap-2 text-xs`}>
              <Printer size={14}/> Report Print
            </button>
          </div>
        </header>

        <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8 print:p-0 print:max-w-none">
          
          {/* DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-fade-in">
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
              <div className="grid lg:grid-cols-2 gap-6">
                <div className={theme.card + " p-4 md:p-6"}>
                  <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2 text-sm md:text-base"><Activity size={18} className="text-[#D291BC]"/> Vital Signs Trend</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={vitalData}>
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
                        <YAxis yAxisId="left" fontSize={10} stroke="#cbd5e1" label={{value:'WBC/CRP', angle:-90, position:'insideLeft', fontSize:9}}/>
                        <YAxis yAxisId="right" orientation="right" domain={[0, 16]} fontSize={10} stroke="#cbd5e1" label={{value:'Hb/K', angle:90, position:'insideRight', fontSize:9}}/>
                        <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}/>
                        <Legend wrapperStyle={{fontSize: '11px', paddingTop: '10px'}}/>
                        <Bar yAxisId="left" dataKey="wbc" fill="#cbd5e1" name="WBC" barSize={20} radius={[4,4,0,0]}/>
                        <Area yAxisId="left" type="monotone" dataKey="crp" fill="#ffe4e6" stroke="#f43f5e" name="CRP"/>
                        <Line yAxisId="right" type="monotone" dataKey="hb" stroke="#6366f1" name="Hb" strokeWidth={2} dot={{r:3}}/>
                        <Line yAxisId="right" type="monotone" dataKey="k" stroke="#10b981" name="K" strokeWidth={2} dot={{r:3}}/>
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

          {/* MEDS TAB */}
          {activeTab === 'meds' && (
            <div className="space-y-6 animate-fade-in">
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

          {/* NURSING TAB */}
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
                        <h4 className="text-xs font-bold text-rose-400 uppercase mb-2">Assessment</h4>
                        <p className="text-sm text-slate-700 mb-1"><strong className="text-rose-500">S:</strong> {np.assessment.S}</p>
                        <p className="text-sm text-slate-700"><strong className="text-rose-500">O:</strong> {np.assessment.O}</p>
                      </div>
                      <div className="space-y-6">
                          <ChartForNursingProcess data={labData} chartKey={np.chartKey}/>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Goals & Plan</h4>
                        <ul className="space-y-2">
                          <li className="text-sm text-slate-700 flex gap-2"><span className="text-teal-500 font-bold">단기:</span> {np.goals.short}</li>
                          <li className="text-sm text-slate-700 flex gap-2"><span className="text-teal-500 font-bold">장기:</span> {np.goals.long}</li>
                        </ul>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-1">Rationale & Priority</h4>
                        <p className="text-xs text-slate-600 mb-2 leading-relaxed"><strong>사유:</strong> {np.rationale}</p>
                        <p className="text-xs text-slate-600 leading-relaxed"><strong>우선순위:</strong> {np.priority}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-1"><CheckSquare size={12}/> Implementation</h4>
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                          {np.implementations.map((imp, idx) => (
                            <div key={idx} className={`p-3 rounded-lg text-sm border-l-4 ${imp.status === 'Done' ? 'bg-slate-50 border-emerald-400' : 'bg-red-50 border-red-400'}`}>
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-bold text-slate-500">{imp.time}</span>
                                <span className={`text-[10px] px-1.5 rounded font-bold ${imp.status === 'Done' ? 'text-emerald-600 bg-emerald-100' : 'text-red-600 bg-red-100'}`}>{imp.status}</span>
                              </div>
                              <p className="text-slate-700">{imp.action}</p>
                              <p className="text-[10px] text-slate-400 text-right mt-1">서명: 202221920</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-xl border-l-4 border-l-emerald-400">
                        <h4 className="text-xs font-bold text-emerald-600 uppercase mb-1">Evaluation</h4>
                        <p className="text-sm text-slate-700">{np.evaluation}</p>
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
                  <div key={i} className={`${theme.card} p-6 border-l-4 border-l-[#E0BBE4]`}>
                    <h4 className="font-bold text-lg text-slate-700 mb-2 flex items-center gap-2">
                      <BookOpen size={20} className="text-[#D291BC]"/> {lit.title}
                    </h4>
                    <p className="text-slate-600 text-sm leading-relaxed">{lit.content}</p>
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