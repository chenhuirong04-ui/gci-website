import React, { useState } from "react";
import { LanguagePack } from "../data/corporateData";
import { 
  Users, 
  Landmark, 
  Factory, 
  Award, 
  Briefcase, 
  TrendingUp, 
  Coins, 
  Handshake, 
  Globe, 
  Compass, 
  ChevronRight,
  Zap,
  CheckCircle2,
  GitPullRequest
} from "lucide-react";

interface WhoWeAreProps {
  lang: "EN" | "ZH" | "AR";
  pack: LanguagePack;
}

export default function WhoWeAre({ lang, pack }: WhoWeAreProps) {
  const isRtl = lang === "AR";
  
  // Hover tracking for interactive corridors
  const [activeCorridor, setActiveCorridor] = useState<"ALL" | "CHINA" | "GCC" | "ASEAN" | "AFRICA">("ALL");

  // Multi-lingual details for GCI's 6 Service Targets (matching Image 2 design)
  const serviceDetails = {
    ZH: [
      { 
        title: "制造商", 
        desc: "源头大厂与定制供应商，协助获取准入护城河", 
        detail: "在岸资质核验 · 生产标准对接" 
      },
      { 
        title: "品牌商", 
        desc: "拓展海湾全渠道、打造在册及在岸品牌长远声誉", 
        detail: "渠道体系建设 · 品牌心智构建" 
      },
      { 
        title: "项目开发商", 
        desc: "大宗基建、新能源及重点工业园项目合规常设协同", 
        detail: "政商资源协调 · 实地落地交付" 
      },
      { 
        title: "贸易公司", 
        desc: "理顺跨境大宗采购物流与海关，常态化资金闭环", 
        detail: "通关履约保障 · 供应链常态化" 
      },
      { 
        title: "投资者", 
        desc: "研判在岸实体商机，协助开展安全稳妥的财务投资", 
        detail: "实体项目甄别 · 资产风险管理" 
      },
      { 
        title: "战略合作伙伴", 
        desc: "对接双边商会及行协，构建长期在岸发展网络", 
        detail: "双边网络支撑 · 跨国政商互信" 
      }
    ],
    EN: [
      { 
        title: "Manufacturers", 
        desc: "Factory-direct sources seeking on-ground GCC compliance", 
        detail: "Access Compliance · Spec Alignment" 
      },
      { 
        title: "Brand Owners", 
        desc: "Building lasting brand equity and local retail footprints", 
        detail: "Channel Setup · Trust Cultivation" 
      },
      { 
        title: "Project Developers", 
        desc: "Coordinating physical delivery for energy and infrastructure", 
        detail: "Onshore Coordination · Resource Support" 
      },
      { 
        title: "Trading Companies", 
        desc: "Securing stable cross-border supply chains and commodities", 
        detail: "Logistics Clearance · Secure Cleared Path" 
      },
      { 
        title: "Investors", 
        desc: "Sourcing verified operational assets and joint ventures", 
        detail: "Deal Screening · Executive Evaluation" 
      },
      { 
        title: "Strategic Partners", 
        desc: "Establishing strong multi-lateral ties with chambers", 
        detail: "State & Chamber Links · Hub Trust" 
      }
    ],
    AR: [
      { 
        title: "الشركات المصنعة", 
        desc: "المصادر الصناعية الساعية لتجاوز العقبات التنظيمية", 
        detail: "المطابقة الفنية · التوطين المعتمد" 
      },
      { 
        title: "أصحاب العلامات التجارية", 
        desc: "تأسيس شبكات مبيعات مستدامة ورفع القيمة التجارية", 
        detail: "تطوير القنوات · ترسيخ الثقة" 
      },
      { 
        title: "مطورو المشاريع", 
        desc: "توصيل وتنفيذ مشاريع الطاقة والبنية التحتية والمناطق الصناعية", 
        detail: "التمثيل المادي · تنسيق الشراكات" 
      },
      { 
        title: "شركات التجارة", 
        desc: "ضمان انسيابية الإمداد والمشتريات وتحصيل الحقوق بأمان", 
        detail: "حماية العقود · الجمارك والتحصيل" 
      },
      { 
        title: "المستثمرون", 
        desc: "توجيه رؤوس الأموال بكفاءة عبر أصول حقيقية ومفحوصة", 
        detail: "تقييم المشروعات · تقليص المخاطر" 
      },
      { 
        title: "الشركاء الاستراتيجيون", 
        desc: "توطيد شبكة تعاون وثيقة مع الهيئات والصناديق الإقليمية", 
        detail: "روابط حكومية · تفويضات ثنائية" 
      }
    ]
  };

  const getTargetIcon = (idx: number) => {
    switch (idx) {
      case 0: return <Factory className="w-5 h-5 text-brand-gold-400" />;
      case 1: return <Award className="w-5 h-5 text-brand-gold-400" />;
      case 2: return <Briefcase className="w-5 h-5 text-brand-gold-400" />;
      case 3: return <TrendingUp className="w-5 h-5 text-brand-gold-400" />;
      case 4: return <Coins className="w-5 h-5 text-brand-gold-400" />;
      case 5: return <Handshake className="w-5 h-5 text-brand-gold-400" />;
      default: return <Users className="w-5 h-5 text-brand-gold-400" />;
    }
  };

  // Get current active details based on language
  const activeServices = serviceDetails[lang] || serviceDetails.EN;

  // Language translated strings for Where We Operate Dashboard content
  const dashboardTrans = {
    ZH: {
      mapLabel: "双边执行走廊与枢纽分布 (点击或悬停切换廊道亮点)",
      allTitle: "GCI 环球双边在岸执网",
      allDesc: "以迪拜总部为协调中枢，连接中国单一源头供应，深度下沉辐射 GCC、东南亚、东非、北非及南美等 11 大在岸执行市场与供应链节点。",
      chinaTitle: "中国供应侧总源 (Supply Origin)",
      chinaDesc: "GCI 坚守的唯一战略供应大盘与制造腹地。承引大国顶尖资源、设备与产品，保障海量且标准统一的供应链源泉。",
      gccTitle: "GCC 海湾核心市场 (Core Markets)",
      gccDesc: "深耕阿联酋、沙特阿拉伯、巴林、阿曼。建置本地持牌实体、保税调配与实地谈判代表，常态承托项目落地与常态交易闭环。",
      aseanTitle: "东南亚核心市场 (Core Markets)",
      aseanDesc: "深度下沉越南、柬埔寨、印度尼西亚。依托其蓬勃的中游产能与商贸基座，协助建立地缘弹性的常态运营通路。",
      africaTitle: "高潜新兴及非洲门户 (Africa & Emerging)",
      africaDesc: "以肯尼亚为关键门户，并包含摩洛哥、巴西业务接口，统合跨非与大西洋两岸多式联运和大宗分销。",
      coreMarketsHeader: "11 在岸执行市场及制造节点",
      supplyHeader: "1 唯一供应源头轴心",
      hoverPlaceholder: "提示：鼠标悬停任意网络区域，亮起特定双边通路..."
    },
    EN: {
      mapLabel: "Bilateral Corridor & Operational Nodes (Hover/Click to highlight)",
      allTitle: "GCI Global Execution Web",
      allDesc: "With Dubai Headquarter coordinate deck, GCI maps China's single-origin supply to 11 active market & supply nodes spanning GCC, Southeast Asia, East Africa, North Africa, and South America.",
      chinaTitle: "China (The Sole Supply Origin)",
      chinaDesc: "GCI's defining origin node and logistics bedrock. Anchoring manufacturing plants, technology and standardized resources to supply global projects.",
      gccTitle: "GCC (Central Execution Markets)",
      gccDesc: "Active operations across UAE, Saudi Arabia, Bahrain, and Oman. We deploy onshore staff, physical delivery hubs, and regulatory access.",
      aseanTitle: "Southeast Asia (Growth Execution Markets)",
      aseanDesc: "On-ground operations in Vietnam, Cambodia, and Indonesia. Integrating growing middle-markets and manufacturing centers directly.",
      africaTitle: "Africa & Emerging Markets",
      africaDesc: "Centering Kenya as our main gateway. Includes Casablanca (Morocco) and São Paulo (Brazil) cargo flow channels directly into our network.",
      coreMarketsHeader: "11 Market & Supply Nodes",
      supplyHeader: "1 Sole Supply Backbone",
      hoverPlaceholder: "Tip: Hover on regions to preview bilateral corridors and operational metrics..."
    },
    AR: {
      mapLabel: "ممرات التنفيذ الثنائية وتوزيع العقد (مرر أو انقر للتسليط)",
      allTitle: "شبكة عمليات GCI العالمية",
      allDesc: "من خلال مقرنا الرئيسي في دبي، نربط الصين كعصب إمداد وحيد بـ 11 من الممرات اللوجستية والأسواق التشغيلية في الخليج العربي وجنوب شرق آسيا وشرق إفريقيا والمغرب والبرازيل.",
      chinaTitle: "الصين (مصدر الإمداد الوحيد)",
      chinaDesc: "قاعدة التوريد والدعم اللوجستي الإستراتيجية لـ GCI. تأمين تدفق السلع والمعدات القياسية لخدمة كافة المشاريع الإقليمية.",
      gccTitle: "الخليج العربي (الأسواق التشغيلية الرئيسية)",
      gccDesc: "حضور كامل في الإمارات، السعودية، البحرين، وعُمان. نوفر موظفين على الأرض، ومخازن، وننسق العقود التجارية.",
      aseanTitle: "جنوب شرق آسيا (الأسواق التشغيلية الصاعدة)",
      aseanDesc: "عمليات مباشرة في فيتنام، كمبوديا، وإندونيسيا. ندمج هذه الأسواق الحيوية في ممرات التجارة والتوريد مباشرة.",
      africaTitle: "إفريقيا والأسواق الصاعدة",
      africaDesc: "بوابة كينيا اللوجستية، وحضور فاعل في الدار البيضاء (المغرب) وساو باولو (البرازيل) لربط ممرات الجنوب.",
      coreMarketsHeader: "11 عقود لوجستية وأسواق تشغيلية",
      supplyHeader: "1 مصدر الإمداد الوحيد والعصب المشترك",
      hoverPlaceholder: "تلميح: مرر المؤشر لاستكشاف البيانات المباشرة للممرات..."
    }
  };

  const dbTrans = dashboardTrans[lang] || dashboardTrans.EN;

  return (
    <section id="who-we-are" className="py-20 md:py-24 bg-[#050a15] border-b border-brand-gold-500/10">
      <div className="max-w-7xl mx-auto px-6" dir={isRtl ? "rtl" : "ltr"}>
        
        {/* Upper Title Block */}
        <div id="about-gci-header" className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="h-[1px] w-6 bg-brand-gold-500" />
            <span className="text-sm tracking-wide font-sans text-brand-gold-400 font-medium uppercase">
              {pack.whoWeAreLabel}
            </span>
            <span className="h-[1px] w-6 bg-brand-gold-500" />
          </div>
          <h2 id="whoweare-title" className="text-3xl md:text-5xl font-display font-semibold text-brand-gold-100 tracking-wide leading-tight whitespace-pre-line">
            {pack.whoWeAreTitle}
          </h2>
        </div>

        {/* Story Text Layout with editorial column dividers */}
        <div id="about-gci-narrative" className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-start max-w-5xl mx-auto mb-20 text-brand-gold-200/90 font-light text-base leading-relaxed">
          <div className={`p-1 ${isRtl ? "text-right" : "text-left"}`}>
            <p className="text-lg sm:text-xl font-serif italic text-brand-gold-300 leading-relaxed mb-4 whitespace-pre-line">
              {pack.whoWeAreDesc1}
            </p>
          </div>
          <div className={`p-1 border-l-0 md:border-l border-brand-gold-500/15 ${isRtl ? "md:pr-10 md:border-r md:border-l-0 text-right" : "md:pl-10 text-left"}`}>
            <p className="text-base text-brand-gold-200/80 leading-relaxed whitespace-pre-line">
              {pack.whoWeAreDesc2}
            </p>
          </div>
        </div>

        {/* Section 1: Who We Serve (制造商, 品牌商, etc.) - Compact row layout similar to Image 2 */}
        <div id="about-gci-serve" className="mb-20">
          <div className="flex items-center gap-3 mb-8 justify-center md:justify-start">
            <div className="p-2 bg-brand-gold-500/5 rounded-lg border border-brand-gold-500/10">
              <Users className="w-5 h-5 text-brand-gold-400" />
            </div>
            <h3 id="whoweare-assist-title" className="text-xl md:text-2xl font-serif font-medium text-brand-gold-300">
              {pack.whoWeAreTargetTitle}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {pack.whoWeAreTargets.map((item, idx) => {
              const itemDetails = activeServices[idx] || { desc: "", detail: "" };
              return (
                <div 
                  key={idx} 
                  id={`serve-card-${idx}`}
                  className="group relative p-5 bg-[#070c19]/80 border border-brand-gold-500/10 hover:border-brand-gold-500/35 rounded-xl transition-all duration-300 flex flex-col justify-between hover:shadow-[0_4px_25px_rgba(223,186,107,0.04)]"
                >
                  <div>
                    {/* Top Icon Block in box wrapper */}
                    <div className="mb-4 p-2.5 bg-brand-gold-500/5 border border-brand-gold-500/10 rounded-lg w-fit group-hover:bg-brand-gold-500/10 group-hover:border-brand-gold-500/20 transition-all">
                      {getTargetIcon(idx)}
                    </div>
                    {/* Main Label */}
                    <h4 className="text-[#f9f5eb] font-sans font-bold text-base mb-2 group-hover:text-brand-gold-300 transition-colors">
                      {item}
                    </h4>
                    {/* Supportive Description */}
                    <p className="text-brand-gold-200/70 text-xs leading-relaxed font-light mb-4">
                      {itemDetails.desc}
                    </p>
                  </div>
                  
                  {/* Subtle link marker line (like Image 2 "了解更多") */}
                  <div className="mt-2 pt-2.5 border-t border-brand-gold-500/5 flex items-center justify-between text-[10px] tracking-wider font-mono text-brand-gold-400 font-bold group-hover:text-brand-gold-300 transition-colors uppercase">
                    <span>{itemDetails.detail}</span>
                    <ChevronRight className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Where We Operate (业务区域) - Compact Dashboard & Network Flow (Replacing old tall list) */}
        <div id="about-gci-operate">
          <div className="flex items-center gap-3 mb-8 justify-center md:justify-start">
            <div className="p-2 bg-brand-gold-500/5 rounded-lg border border-brand-gold-500/10">
              <Landmark className="w-5 h-5 text-brand-gold-400" />
            </div>
            <h3 id="whoweare-lead-title" className="text-xl md:text-2xl font-serif font-medium text-brand-gold-300">
              {pack.whoWeAreMarketTitle}
            </h3>
          </div>

          <div className="bg-[#070c19]/60 border border-brand-gold-500/10 rounded-2xl p-6 lg:p-8 hover:border-brand-gold-500/20 transition-all">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column (Interactive SVG Network Map & Corridors Selector) */}
              <div className="lg:col-span-6 flex flex-col items-center justify-center p-4 bg-[#040812]/80 border border-brand-gold-500/10 rounded-xl relative overflow-hidden min-h-[300px]">
                
                {/* Visual Label overlay */}
                <div className="absolute top-3 left-3 right-3 text-center lg:text-left z-10">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-brand-gold-400 font-bold">
                    {dbTrans.mapLabel}
                  </span>
                </div>

                {/* Network Nodes Vector Flow Graph */}
                <svg className="w-full max-w-[420px] h-[240px]" viewBox="0 0 400 240">
                  {/* Outer circle layout coordinates */}
                  {/* UAE: (280, 50), Saudi: (300, 110), Vietnam: (260, 180), Cambodia: (190, 200), Indonesia: (120, 190), Oman: (320, 150), Bahrain: (340, 80), Kenya: (60, 150) */}
                  {/* Center Node (Dubai Coordination): (200, 110) */}
                  {/* China (Supply Source): (60, 70) */}

                  {/* Radiating Radar pulses around China & Dubai when hovered */}
                  {activeCorridor === "CHINA" && (
                    <circle cx="60" cy="70" r="25" fill="none" stroke="#DFBA6B" strokeWidth="1" className="animate-ping" style={{ transformOrigin: '60px 70px', animationDuration: '3s' }} />
                  )}
                  {activeCorridor === "GCC" && (
                    <circle cx="200" cy="110" r="35" fill="none" stroke="#DFBA6B" strokeWidth="1" className="animate-ping" style={{ transformOrigin: '200px 110px', animationDuration: '4s' }} />
                  )}

                  {/* Core Corridor Connective Lines */}
                  {/* Route 1: China to Dubai Hub */}
                  <line 
                    x1="60" y1="70" x2="200" y2="110" 
                    stroke={activeCorridor === "CHINA" || activeCorridor === "ALL" ? "#DFBA6B" : "#1a243d"} 
                    strokeWidth={activeCorridor === "CHINA" ? "3" : "1.5"} 
                    strokeDasharray={activeCorridor === "CHINA" ? "none" : "3 3"}
                    className="transition-all duration-300"
                  />
                  {/* Active flow animations on GCI Corridor */}
                  {(activeCorridor === "CHINA" || activeCorridor === "ALL") && (
                    <circle r="4" fill="#f9f5eb" className="animate-[pulse_1.5s_infinite]">
                      <animateMotion dur="4s" repeatCount="indefinite" path="M 60 70 L 200 110" />
                    </circle>
                  )}

                  {/* Connected outbound veins from Dubai HUB (Center) to Core Markets orbits */}
                  {/* To UAE */}
                  <line x1="200" y1="110" x2="280" y2="50" stroke={activeCorridor === "GCC" || activeCorridor === "ALL" ? "#DFBA6B" : "#121b2d"} strokeWidth={activeCorridor === "GCC" ? "2.5" : "1"} className="transition-all duration-300" />
                  {/* To Saudi */}
                  <line x1="200" y1="110" x2="300" y2="110" stroke={activeCorridor === "GCC" || activeCorridor === "ALL" ? "#DFBA6B" : "#121b2d"} strokeWidth={activeCorridor === "GCC" ? "2.5" : "1"} className="transition-all duration-300" />
                  {/* To Bahrain */}
                  <line x1="200" y1="110" x2="340" y2="80" stroke={activeCorridor === "GCC" || activeCorridor === "ALL" ? "#DFBA6B" : "#121b2d"} strokeWidth={activeCorridor === "GCC" ? "2" : "1"} className="transition-all duration-300" />
                  {/* To Oman */}
                  <line x1="200" y1="110" x2="320" y2="150" stroke={activeCorridor === "GCC" || activeCorridor === "ALL" ? "#DFBA6B" : "#121b2d"} strokeWidth={activeCorridor === "GCC" ? "2" : "1"} className="transition-all duration-300" />

                  {/* To SE Asia (Vietnam, Cambodia, Indonesia) */}
                  <line x1="200" y1="110" x2="260" y2="180" stroke={activeCorridor === "ASEAN" || activeCorridor === "ALL" ? "#DFBA6B" : "#121b2d"} strokeWidth={activeCorridor === "ASEAN" ? "2.5" : "1"} className="transition-all duration-300" />
                  <line x1="200" y1="110" x2="190" y2="200" stroke={activeCorridor === "ASEAN" || activeCorridor === "ALL" ? "#DFBA6B" : "#121b2d"} strokeWidth={activeCorridor === "ASEAN" ? "2.5" : "1"} className="transition-all duration-300" />
                  <line x1="200" y1="110" x2="120" y2="190" stroke={activeCorridor === "ASEAN" || activeCorridor === "ALL" ? "#DFBA6B" : "#121b2d"} strokeWidth={activeCorridor === "ASEAN" ? "2.5" : "1"} className="transition-all duration-300" />

                  {/* To Kenya (Africa) */}
                  <line x1="200" y1="110" x2="60" y2="150" stroke={activeCorridor === "AFRICA" || activeCorridor === "ALL" ? "#DFBA6B" : "#121b2d"} strokeWidth={activeCorridor === "AFRICA" ? "2.5" : "1"} className="transition-all duration-300" />
                  {/* To Morocco */}
                  <line x1="200" y1="110" x2="80" y2="140" stroke={activeCorridor === "AFRICA" || activeCorridor === "ALL" ? "#DFBA6B" : "#121b2d"} strokeWidth={activeCorridor === "AFRICA" ? "1.8" : "1"} className="transition-all duration-300" />
                  {/* To Brazil */}
                  <line x1="200" y1="110" x2="50" y2="180" stroke={activeCorridor === "AFRICA" || activeCorridor === "ALL" ? "#DFBA6B" : "#121b2d"} strokeWidth={activeCorridor === "AFRICA" ? "1.8" : "1"} className="transition-all duration-300" />

                  {/* China (Sole Connection Out) */}
                  <line x1="60" y1="70" x2="120" y2="190" stroke="#0f1626" strokeWidth="1" />

                  {/* Nodes & Interactive Hotkeys */}
                  
                  {/* China (Sole Anchor Node) */}
                  <g 
                    className="cursor-pointer group/node"
                    onMouseEnter={() => setActiveCorridor("CHINA")}
                    onMouseLeave={() => setActiveCorridor("ALL")}
                  >
                    <circle cx="60" cy="70" r="14" fill="#0c152a" stroke="#DFBA6B" strokeWidth="2.5" />
                    <circle cx="60" cy="70" r="6" fill="#DFBA6B" className="animate-pulse" />
                    <text x="60" y="52" textAnchor="middle" className="text-[10px] font-sans font-bold fill-brand-gold-300">CN</text>
                  </g>

                  {/* GCI Dubai Coordination HQ Node */}
                  <g 
                    className="cursor-pointer"
                    onMouseEnter={() => setActiveCorridor("ALL")}
                  >
                    <rect x="182" y="94" width="36" height="32" rx="4" fill="#050a15" stroke="#DFBA6B" strokeWidth="2" className="drop-shadow-[0_0_8px_rgba(223,186,107,0.3)]" />
                    <text x="200" y="113" textAnchor="middle" className="text-[10px] font-sans font-bold fill-[#f9f5eb]">GCI</text>
                    <text x="200" y="121" textAnchor="middle" className="text-[7px] font-mono fill-brand-gold-300">DXB</text>
                  </g>

                  {/* Core GCC Markets Cluster */}
                  <g 
                    className="cursor-pointer group/node"
                    onMouseEnter={() => setActiveCorridor("GCC")}
                    onMouseLeave={() => setActiveCorridor("ALL")}
                  >
                    {/* UAE */}
                    <circle cx="280" cy="50" r="9" fill={activeCorridor === "GCC" ? "#DFBA6B" : "#0c152a"} stroke="#DFBA6B" strokeWidth="1.5" className="transition-all" />
                    <text x="280" y="53" textAnchor="middle" className={`text-[8px] font-mono leading-none ${activeCorridor === "GCC" ? "fill-[#050a15] font-bold" : "fill-brand-gold-100"}`}>AE</text>
                    
                    {/* Saudi */}
                    <circle cx="300" cy="110" r="9" fill={activeCorridor === "GCC" ? "#DFBA6B" : "#0c152a"} stroke="#DFBA6B" strokeWidth="1.5" className="transition-all" />
                    <text x="300" y="113" textAnchor="middle" className={`text-[8px] font-mono leading-none ${activeCorridor === "GCC" ? "fill-[#050a15] font-bold" : "fill-brand-gold-100"}`}>SA</text>

                    {/* Bahrain */}
                    <circle cx="340" cy="80" r="7" fill={activeCorridor === "GCC" ? "#DFBA6B" : "#0c152a"} stroke="#DFBA6B" strokeWidth="1" className="transition-all" />
                    <text x="340" y="83" textAnchor="middle" className={`text-[7px] font-mono ${activeCorridor === "GCC" ? "fill-[#050a15] font-bold" : "fill-brand-gold-200"}`}>BH</text>

                    {/* Oman */}
                    <circle cx="320" cy="150" r="7" fill={activeCorridor === "GCC" ? "#DFBA6B" : "#0c152a"} stroke="#DFBA6B" strokeWidth="1" className="transition-all" />
                    <text x="320" y="153" textAnchor="middle" className={`text-[7px] font-mono ${activeCorridor === "GCC" ? "fill-[#050a15] font-bold" : "fill-brand-gold-200"}`}>OM</text>
                    <text x="342" y="114" textAnchor="start" className="text-[8px] font-sans fill-brand-gold-300 font-bold opacity-0 group-hover/node:opacity-100 transition-opacity">GCC</text>
                  </g>

                  {/* Southeast Asia Core Markets Cluster */}
                  <g 
                    className="cursor-pointer group/node"
                    onMouseEnter={() => setActiveCorridor("ASEAN")}
                    onMouseLeave={() => setActiveCorridor("ALL")}
                  >
                    {/* Vietnam */}
                    <circle cx="260" cy="180" r="8" fill={activeCorridor === "ASEAN" ? "#DFBA6B" : "#0c152a"} stroke="#DFBA6B" strokeWidth="1.5" className="transition-all" />
                    <text x="260" y="183" textAnchor="middle" className={`text-[7px] font-mono ${activeCorridor === "ASEAN" ? "fill-[#050a15] font-bold" : "fill-brand-gold-100"}`}>VN</text>

                    {/* Cambodia */}
                    <circle cx="190" cy="200" r="8" fill={activeCorridor === "ASEAN" ? "#DFBA6B" : "#0c152a"} stroke="#DFBA6B" strokeWidth="1.5" className="transition-all" />
                    <text x="190" y="203" textAnchor="middle" className={`text-[7px] font-mono ${activeCorridor === "ASEAN" ? "fill-[#050a15] font-bold" : "fill-brand-gold-100"}`}>KH</text>

                    {/* Indonesia */}
                    <circle cx="120" cy="190" r="8" fill={activeCorridor === "ASEAN" ? "#DFBA6B" : "#0c152a"} stroke="#DFBA6B" strokeWidth="1.5" className="transition-all" />
                    <text x="120" y="193" textAnchor="middle" className={`text-[7px] font-mono ${activeCorridor === "ASEAN" ? "fill-[#050a15] font-bold" : "fill-brand-gold-100"}`}>ID</text>
                    <text x="195" y="218" textAnchor="middle" className="text-[8px] font-sans fill-brand-gold-300 font-bold opacity-0 group-hover/node:opacity-100 transition-opacity">SE Asia</text>
                  </g>

                  {/* Africa & South-South Gateway Nodes */}
                  <g 
                    className="cursor-pointer group/node"
                    onMouseEnter={() => setActiveCorridor("AFRICA")}
                    onMouseLeave={() => setActiveCorridor("ALL")}
                  >
                    {/* Kenya */}
                    <circle cx="60" cy="150" r="9" fill={activeCorridor === "AFRICA" ? "#DFBA6B" : "#0c152a"} stroke="#DFBA6B" strokeWidth="1.5" className="transition-all" />
                    <text x="60" y="153" textAnchor="middle" className={`text-[8px] font-mono leading-none ${activeCorridor === "AFRICA" ? "fill-[#050a15] font-bold" : "fill-brand-gold-100"}`}>KE</text>

                    {/* Morocco */}
                    <circle cx="80" cy="140" r="7" fill={activeCorridor === "AFRICA" ? "#DFBA6B" : "#0c152a"} stroke="#DFBA6B" strokeWidth="1.2" className="transition-all" />
                    <text x="80" y="143" textAnchor="middle" className={`text-[7px] font-mono ${activeCorridor === "AFRICA" ? "fill-[#050a15] font-bold" : "fill-brand-gold-200"}`}>MA</text>

                    {/* Brazil */}
                    <circle cx="50" cy="180" r="7" fill={activeCorridor === "AFRICA" ? "#DFBA6B" : "#0c152a"} stroke="#DFBA6B" strokeWidth="1.2" className="transition-all" />
                    <text x="50" y="183" textAnchor="middle" className={`text-[7px] font-mono ${activeCorridor === "AFRICA" ? "fill-[#050a15] font-bold" : "fill-brand-gold-200"}`}>BR</text>

                    <text x="65" y="112" textAnchor="middle" className="text-[8px] font-sans fill-brand-gold-300 font-bold opacity-0 group-hover/node:opacity-100 transition-opacity">Emerging</text>
                  </g>
                </svg>

                {/* Micro legend triggers in horizontal block */}
                <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2 justify-center">
                  <button 
                    onMouseEnter={() => setActiveCorridor("ALL")}
                    className={`px-2 py-0.5 text-[9px] font-sans rounded-full border transition-all ${activeCorridor === "ALL" ? "bg-brand-gold-500/15 text-brand-gold-300 border-brand-gold-500/30 font-bold" : "bg-transparent text-brand-gold-200/50 border-brand-gold-500/5"}`}
                  >
                    ALL
                  </button>
                  <button 
                    onMouseEnter={() => setActiveCorridor("CHINA")}
                    className={`px-2 py-0.5 text-[9px] font-sans rounded-full border transition-all ${activeCorridor === "CHINA" ? "bg-brand-gold-500/15 text-brand-gold-300 border-brand-gold-500/30 font-bold" : "bg-transparent text-brand-gold-200/50 border-brand-gold-500/5"}`}
                  >
                    CHINA (Supply)
                  </button>
                  <button 
                    onMouseEnter={() => setActiveCorridor("GCC")}
                    className={`px-2 py-0.5 text-[9px] font-sans rounded-full border transition-all ${activeCorridor === "GCC" ? "bg-brand-gold-500/15 text-brand-gold-300 border-brand-gold-500/30 font-bold" : "bg-transparent text-brand-gold-200/50 border-brand-gold-500/5"}`}
                  >
                    GCC (Core Market)
                  </button>
                  <button 
                    onMouseEnter={() => setActiveCorridor("ASEAN")}
                    className={`px-2 py-0.5 text-[9px] font-sans rounded-full border transition-all ${activeCorridor === "ASEAN" ? "bg-brand-gold-500/15 text-brand-gold-300 border-brand-gold-500/30 font-bold" : "bg-transparent text-brand-gold-200/50 border-brand-gold-500/5"}`}
                  >
                    SE ASIA (Core Market)
                  </button>
                  <button 
                    onMouseEnter={() => setActiveCorridor("AFRICA")}
                    className={`px-2 py-0.5 text-[9px] font-sans rounded-full border transition-all ${activeCorridor === "AFRICA" ? "bg-brand-gold-500/15 text-brand-gold-300 border-brand-gold-500/30 font-bold" : "bg-transparent text-brand-gold-200/50 border-brand-gold-500/5"}`}
                  >
                    AFRICA & GLOBAL (Core)
                  </button>
                </div>
              </div>

              {/* Right Column (Focus Detail Window / Interactive Card Display) */}
              <div className="lg:col-span-6 flex flex-col justify-between h-full min-h-[300px]">
                
                {/* Dynamically active panel details based on GCI current highlighting state */}
                <div className="p-6 bg-[#040812]/50 border border-brand-gold-500/5 rounded-2xl flex flex-col gap-4 grow">
                  
                  {activeCorridor === "ALL" && (
                    <div className="flex flex-col gap-3 animate-[fadeIn_0.3s_ease-out]">
                      <div className="flex items-center gap-2">
                        <Globe className="w-5 h-5 text-brand-gold-300" />
                        <h4 className="text-lg font-serif font-medium text-brand-gold-100">{dbTrans.allTitle}</h4>
                      </div>
                      <p className="text-sm text-brand-gold-200/80 leading-relaxed font-light">{dbTrans.allDesc}</p>
                      
                      {/* Interactive Metrics Table */}
                      <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-brand-gold-500/10">
                        <div>
                          <span className="text-[10px] uppercase font-mono text-brand-gold-400 font-bold block">{dbTrans.supplyHeader}</span>
                          <span className="text-sm font-sans font-bold text-[#f9f5eb]">China (中国)</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-mono text-brand-gold-400 font-bold block">{dbTrans.coreMarketsHeader}</span>
                          <span className="text-xs font-sans font-semibold text-[#f9f5eb] leading-tight block mt-1">
                            UAE · SA · BH · OM · KE · VN · KH · ID · MA · BR
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeCorridor === "CHINA" && (
                    <div className="flex flex-col gap-3 animate-[fadeIn_0.3s_ease-out]">
                      <div className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-[#DFBA6B]" />
                        <h4 className="text-lg font-serif font-medium text-[#DFBA6B]">{dbTrans.chinaTitle}</h4>
                      </div>
                      <p className="text-sm text-brand-gold-200/80 leading-relaxed font-light">{dbTrans.chinaDesc}</p>
                      
                      <div className="mt-4 p-3 bg-brand-gold-500/5 border border-brand-gold-500/10 rounded-lg flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-brand-gold-400 shrink-0" />
                        <span className="text-xs text-brand-gold-300 font-mono">Corridor Anchor: Originating Supply Backplane</span>
                      </div>
                    </div>
                  )}

                  {activeCorridor === "GCC" && (
                    <div className="flex flex-col gap-3 animate-[fadeIn_0.3s_ease-out]">
                      <div className="flex items-center gap-2">
                        <Compass className="w-5 h-5 text-brand-gold-300" />
                        <h4 className="text-lg font-serif font-medium text-[#f9f5eb]">{dbTrans.gccTitle}</h4>
                      </div>
                      <p className="text-sm text-brand-gold-200/80 leading-relaxed font-light">{dbTrans.gccDesc}</p>
                      
                      <div className="grid grid-cols-4 gap-2 mt-2">
                        {["UAE", "Saudi Arabia", "Bahrain", "Oman"].map((c, i) => (
                          <span key={i} className="text-[11px] font-sans text-brand-gold-100 font-semibold bg-brand-gold-500/5 border border-brand-gold-500/10 rounded px-2 py-1 text-center">{c}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeCorridor === "ASEAN" && (
                    <div className="flex flex-col gap-3 animate-[fadeIn_0.3s_ease-out]">
                      <div className="flex items-center gap-2">
                        <Compass className="w-5 h-5 text-brand-gold-300" />
                        <h4 className="text-lg font-serif font-medium text-[#f9f5eb]">{dbTrans.aseanTitle}</h4>
                      </div>
                      <p className="text-sm text-brand-gold-200/80 leading-relaxed font-light">{dbTrans.aseanDesc}</p>
                      
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {["Vietnam", "Cambodia", "Indonesia"].map((c, i) => (
                          <span key={i} className="text-[11px] font-sans text-brand-gold-100 font-semibold bg-brand-gold-500/5 border border-brand-gold-500/10 rounded px-2 py-1 text-center">{c}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeCorridor === "AFRICA" && (
                    <div className="flex flex-col gap-3 animate-[fadeIn_0.3s_ease-out]">
                      <div className="flex items-center gap-2">
                        <Compass className="w-5 h-5 text-brand-gold-300" />
                        <h4 className="text-lg font-serif font-medium text-[#f9f5eb]">{dbTrans.africaTitle}</h4>
                      </div>
                      <p className="text-sm text-brand-gold-200/80 leading-relaxed font-light">{dbTrans.africaDesc}</p>
                      
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {["Kenya", "Morocco", "Brazil"].map((c, i) => (
                          <span key={i} className="text-[11px] font-sans text-brand-gold-100 font-semibold bg-brand-gold-500/5 border border-brand-gold-500/10 rounded px-2 py-1 text-center">{c}</span>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

                {/* Inline advice helper on hover indicator */}
                <span className="text-[10px] font-sans text-brand-gold-200/40 text-center lg:text-left mt-3 block pl-2 italic">
                  {dbTrans.hoverPlaceholder}
                </span>

              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
