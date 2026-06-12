import React, { useState } from "react";
import { LanguagePack } from "../data/corporateData";
import { ArrowRight, Globe } from "lucide-react";
import gciLogo from "../assets/gci-logo-header-transparent.png";

interface HeroProps {
  lang: "EN" | "ZH" | "AR";
  pack: LanguagePack;
}

export default function Hero({ lang, pack }: HeroProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const isRtl = lang === "AR";

  // Coordinates data for Dubai Junction and associated world corridor nodes
  const nodes = [
    { 
      name: "Saudi Arabia", 
      x: 210, 
      y: 280, 
      label: lang === "ZH" ? "沙特阿拉伯 / 利雅得" : lang === "AR" ? "السعودية" : "Saudi Arabia", 
      curveX: 290, 
      curveY: 265, 
      info: lang === "ZH" ? "利雅得在岸运营办公室：直接跑腿承办在岸商用牌照、本地实力批发商对接及通港代码登记。" : lang === "AR" ? "مكتب الرياض التشغيلي لتسليم التراخيص المحلية ومطابقة المنتجات بجمعيات الشراء." : "Riyadh direct commercial hub facilitating in-country municipal setups, dealer clearance, and large-scale wholesale procurement contracts." 
    },
    { 
      name: "Bahrain", 
      x: 295, 
      y: 215, 
      label: lang === "ZH" ? "巴林" : lang === "AR" ? "البحرين" : "Bahrain", 
      curveX: 332, 
      curveY: 232, 
      info: lang === "ZH" ? "巴林关税及前置物流分拨节点：缩短高能重工机械与绿色基配在波斯湾海港的滞港盘存时间。" : lang === "AR" ? "منفذ البحرين لتسهيل التخليص واستخلاص الشهادات جمركياً لقطاع التوريد." : "Customs classification clearing gate. Minimizes transit holds for heavy machinery and solar parts shipping into upper GCC regions." 
    },
    { 
      name: "Oman", 
      x: 440, 
      y: 320, 
      label: lang === "ZH" ? "阿曼 / 苏哈尔港" : lang === "AR" ? "عُمان" : "Oman", 
      curveX: 405, 
      curveY: 285, 
      info: lang === "ZH" ? "阿曼苏哈尔及马斯喀特节点：配合 COOLHOME GCC 调配阿曼湾海运集散，缩短印大洋过境物料放行周期。" : lang === "AR" ? "منفذ عُمان اللوجستي لربط دفعات التوريد المائي عبر بحر العرب والخليج." : "Oman Muscat/Sohar node coordinates maritime feeds with COOLHOME GCC, streamlining transit holds across Indian Ocean channels." 
    },
    { 
      name: "Kenya", 
      x: 290, 
      y: 410, 
      label: lang === "ZH" ? "肯尼亚 / 蒙巴萨" : lang === "AR" ? "كينيا" : "Kenya", 
      curveX: 330, 
      curveY: 330, 
      info: lang === "ZH" ? "东非出海干线：连接蒙巴萨保税港口与内陆多式联运大件运输，服务东非国家重点厂房和基配交付。" : lang === "AR" ? "بوابة شرق إفريقيا عبر مومباسا ونيروبي لربط السلع الصينية بالوكلاء والمتاجر." : "East African port terminal connecting Chinese industrial tools and machinery directly to local retailers and rail logistics lines in East Africa." 
    },
    { 
      name: "China", 
      x: 640, 
      y: 110, 
      label: lang === "ZH" ? "中国 / 产业链源头" : lang === "AR" ? "الصين" : "China", 
      curveX: 505, 
      curveY: 180, 
      info: lang === "ZH" ? "中国先进产能集结与起运极速节点：在深莞、长三角产地前置对齐 GCC 双边合规参数与 HS 税目审计。" : lang === "AR" ? "مركز تجميع وإمداد الصناعات المتقدمة من المصانع الصينية مباشرة وتأمين الشحن." : "Aligns qualified factories in Shenzhen, Ningbo, and Yiwu with GCI pre-clearance standards, delivering outbound products to GCC channels." 
    },
    { 
      name: "Vietnam", 
      x: 620, 
      y: 210, 
      label: lang === "ZH" ? "越南 / 拼箱转船" : lang === "AR" ? "فيتنام" : "Vietnam", 
      curveX: 495, 
      curveY: 230, 
      info: lang === "ZH" ? "东南亚中专集拼商道：协同东南亚二级制造货品，实现多国散装拼箱前置清关，顺畅汇流迪拜大盘。" : lang === "AR" ? "إعادة توجيه وتسييل دفعات المنتجات المصنعة في جنوب شرق آسيا لموانئ الخليج." : "Handles cross-border trade flow originating from Southeast Asian secondary manufacturing hubs directly into Gulf wholesale corridors." 
    },
    { 
      name: "Cambodia", 
      x: 610, 
      y: 290, 
      label: lang === "ZH" ? "柬埔寨 / 零部件" : lang === "AR" ? "كمبوديا" : "Cambodia", 
      curveX: 490, 
      curveY: 270, 
      info: lang === "ZH" ? "轻工拼货与装配辅件支线：拼装货栈快速发运至迪拜综合样机陈列中心，现场提供区域行家及代理看样。" : lang === "AR" ? "ممر شحن وتجميع قطع ومكونات الصناعات الخفيفة إلى مراكز التوزيع دبي." : "Funnels light manufacturing goods and industrial components to Dubai visual showrooms for rapid Gulf distribution." 
    },
    { 
      name: "Indonesia", 
      x: 650, 
      y: 390, 
      label: lang === "ZH" ? "印尼 / 航海重箱" : lang === "AR" ? "إندونيسيا" : "Indonesia", 
      curveX: 510, 
      curveY: 320, 
      info: lang === "ZH" ? "海运大宗重工及矿产配套：协同 GCC 重大基建承销网，调配海港重箱散货堆存及常态极速卸货。" : lang === "AR" ? "تأمين ونقل المواد اللوجستية الثقيلة للخليج والموافقة عليها جمركيا بالتنسيق." : "Coordinates raw mineral components and high-demand maritime supplies with GCC project bidders and infrastructure developers." 
    },
    { 
      name: "Morocco", 
      x: 90, 
      y: 150, 
      label: lang === "ZH" ? "摩洛哥 / 非洲门户" : lang === "AR" ? "المغرب" : "Morocco", 
      curveX: 230, 
      curveY: 200, 
      info: lang === "ZH" ? "北非地中海中转前哨：整合北非核心经贸及关税减免代码通道，经迪拜枢纽辐射欧非两栖多式联运网。" : lang === "AR" ? "ربط ممرات شمال إفريقيا اللوجستية بشبكات الخليج لتسهيل التصنيع وتخفيض الرسوم." : "Connects North African trade corridors directly to GCC logistics channels, streamlining customs for industrial component re-export." 
    },
    { 
      name: "Brazil", 
      x: 60, 
      y: 410, 
      label: lang === "ZH" ? "巴西 / 远洋大宗" : lang === "AR" ? "البرازيل" : "Brazil", 
      curveX: 210, 
      curveY: 330, 
      info: lang === "ZH" ? "南美远洋机械与大宗集物：协调农业特机与精密传感器散柜，无缝并入 GCI 低税仓配大盘。" : lang === "AR" ? "إدارة وتوجيه المعدات الثقيلة والمحركات الزراعية وتأمين عبورها دبي والرياض." : "Facilitates long-range agricultural machinery and critical raw material logistics straight into Dubai-managed storage hubs." 
    }
  ];

  const handleCtaClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 85;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  return (
    <section className="relative pt-8 pb-20 md:py-24 bg-gradient-to-b from-[#030611] to-[#070b18] overflow-hidden border-b border-brand-gold-500/10">
      
      {/* Decorative Atmosphere glow arcs */}
      <div className="absolute top-0 left-[20%] w-[500px] h-[500px] rounded-full bg-brand-gold-500/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 right-[10%] w-[400px] h-[400px] rounded-full bg-brand-navy-600/10 blur-[130px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10" dir={isRtl ? "rtl" : "ltr"}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Side: Editorial positioning and CTAs */}
          <div className="lg:col-span-5 text-left flex flex-col justify-center">
            
            {/* Platform Badge */}
            <div className="inline-flex items-center gap-4 mb-8 px-5 py-4 bg-[#050a15]/90 border border-brand-gold-500/20 rounded-2xl shadow-2xl backdrop-blur-md select-none">
              {/* Door icon extracted from GCI logo */}
              <svg viewBox="0 0 54 70" className="w-9 h-11 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="badge-gold-bright" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#9E782F" />
                    <stop offset="20%" stopColor="#DFBB6B" />
                    <stop offset="55%" stopColor="#FFF2D1" />
                    <stop offset="85%" stopColor="#EAD292" />
                    <stop offset="100%" stopColor="#C59B3F" />
                  </linearGradient>
                  <linearGradient id="badge-gold-mid" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#A88232" />
                    <stop offset="50%" stopColor="#DFBB6B" />
                    <stop offset="100%" stopColor="#8A6A24" />
                  </linearGradient>
                  <linearGradient id="badge-gold-dark" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3C2A08" />
                    <stop offset="40%" stopColor="#5E4311" />
                    <stop offset="100%" stopColor="#3C2A08" />
                  </linearGradient>
                </defs>
                {/* Left outer face */}
                <path d="M 2,8 L 14,12 L 14,58 L 2,54 Z" fill="url(#badge-gold-bright)" />
                {/* Left inner turn */}
                <path d="M 14,12 L 22,16 L 22,52 L 14,58 Z" fill="url(#badge-gold-dark)" />
                {/* Top lintel */}
                <path d="M 2,8 L 46,16 L 36,20 L 22,16 Z" fill="url(#badge-gold-mid)" />
                {/* Right leaf */}
                <path d="M 46,16 L 46,56 L 32,64 L 32,24 Z" fill="url(#badge-gold-bright)" />
                {/* Right inner depth */}
                <path d="M 32,24 L 32,64 L 22,52 L 22,16 Z" fill="url(#badge-gold-dark)" />
              </svg>
              {/* Platform text */}
              <div className="flex flex-col">
                <span className="text-[11px] font-sans font-bold tracking-[0.18em] text-brand-gold-200 uppercase leading-tight">
                  Global Market
                </span>
                <span className="text-[11px] font-sans font-bold tracking-[0.18em] text-brand-gold-200 uppercase leading-tight">
                  Execution Platform
                </span>
              </div>
            </div>

            {/* Elegant Corporate Tagbadge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-brand-gold-500/10 border border-brand-gold-500/20 rounded-full mr-auto mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-gold-500 animate-pulse" />
              <span className="text-xs font-sans text-brand-gold-300 font-medium tracking-wide">
                {pack.heroBadge}
              </span>
            </div>

            {/* Main Headline with prestigious Cinzel font with gold ivory coloration */}
            <h1 className="text-4xl sm:text-5xl lg:text-5xl font-display font-medium leading-snug text-brand-gold-100 tracking-wide whitespace-pre-line">
              {pack.heroTitle}
            </h1>

            {/* Supporting line */}
            <h2 className="text-lg sm:text-xl font-serif text-brand-gold-300 font-light italic tracking-wide mt-4 mb-6 leading-relaxed">
              {pack.heroSubtitle}
            </h2>

            {/* Clear, straightforward paragraphs without stacking Jargons - warm ivory text */}
            <p className="text-base text-brand-gold-100/90 font-light leading-relaxed mb-10">
              {pack.heroDesc}
            </p>

            {/* High-end CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <a
                onClick={(e) => handleCtaClick(e, "contact-section")}
                href="#contact-section"
                className="w-full sm:w-auto text-center inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-gold-500 to-brand-gold-600 hover:from-brand-gold-400 hover:to-brand-gold-500 text-[#030611] text-sm font-sans font-bold tracking-wide py-3.5 px-8 rounded-lg shadow-xl shadow-brand-gold-500/15 transition-all duration-300 cursor-pointer active:scale-95"
              >
                <span>{pack.heroCtaPrimary}</span>
                <ArrowRight className={`w-4 h-4 stroke-[2.5] ${isRtl ? "rotate-180" : ""}`} />
              </a>

              <a
                onClick={(e) => handleCtaClick(e, "where-we-operate")}
                href="#where-we-operate"
                className="w-full sm:w-auto text-center inline-flex items-center justify-center gap-2 bg-[#090f20]/90 hover:bg-[#0c152e] border border-brand-gold-500/30 text-[#fdfaf2] text-sm font-sans font-semibold tracking-wide py-3.5 px-8 rounded-lg transition-all duration-300 cursor-pointer active:scale-95"
              >
                <span>{pack.heroCtaSecondary}</span>
              </a>
            </div>

          </div>

          {/* Right Side: Earth Globe & Dubai hub junctions SVG */}
          <div className="lg:col-span-7 w-full relative flex flex-col items-center">
            
            {/* Visual Header bar */}
            <div className="w-full max-w-2xl mx-auto flex items-center justify-between border-b border-brand-gold-500/15 pb-3 mb-5 text-xs font-sans text-brand-gold-300 select-none">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-medium tracking-wide">Global Connectivity Model (11 Ground Desks)</span>
              </div>
              <span>
                {hoveredNode ? (
                  <span className="text-brand-gold-400 font-semibold">{hoveredNode} Node</span>
                ) : (
                  <span className="text-brand-gold-300/60 font-light font-mono">Dubai Junction Active</span>
                )}
              </span>
            </div>

            {/* Earth Drawing Plate */}
            <div className="relative w-full max-w-3xl aspect-[1.38/1] flex items-center justify-center overflow-hidden rounded-2xl border border-brand-gold-500/15 bg-[#02040c] shadow-2xl">
              
              {/* Atmospheric Background Art */}
              <div className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none">
                <img 
                  src="/src/assets/images/gci_global_hub_connection_1780768265492.png" 
                  alt="Corporate Connection Globe Map" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#02040c] via-transparent to-[#02040c] opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#02040c] via-transparent to-[#02040c] opacity-80" />
              </div>

              <svg viewBox="0 0 740 500" className="w-full h-full relative z-10 overflow-visible">
                <defs>
                  <radialGradient id="ringglow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#c5a059" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#02040c" stopOpacity="0" />
                  </radialGradient>
                  
                  <radialGradient id="globeSphere" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#0a132c" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#010206" stopOpacity="0.9" />
                  </radialGradient>

                  <linearGradient id="activeArc" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1e40af" />
                    <stop offset="50%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#d97706" />
                  </linearGradient>
                </defs>

                {/* Atmosphere visual ring */}
                <circle cx="370" cy="250" r="320" fill="none" stroke="rgba(197,160,89,0.06)" strokeWidth="1" />
                <circle cx="370" cy="250" r="280" fill="url(#ringglow)" />

                {/* Globe Sphere Base */}
                <circle cx="370" cy="250" r="260" fill="url(#globeSphere)" stroke="rgba(197,160,89,0.14)" strokeWidth="1.2" />

                {/* Grid Gridlines (Latitude/Longitude overlay scaled to match enlarged 740x500 box) */}
                <g className="opacity-25 pointer-events-none">
                  <path d="M 370 10 A 260 260 0 0 1 370 490" fill="none" stroke="rgba(197,160,89, 0.08)" strokeWidth="0.6" />
                  <path d="M 370 10 A 150 260 0 0 1 370 490" fill="none" stroke="rgba(197,160,89, 0.05)" strokeWidth="0.6" />
                  <path d="M 370 10 A 150 260 0 0 0 370 490" fill="none" stroke="rgba(197,160,89, 0.05)" strokeWidth="0.6" />
                  <path d="M 370 10 A 260 260 0 0 0 370 490" fill="none" stroke="rgba(197,160,89, 0.08)" strokeWidth="0.6" />
                  <line x1="110" y1="250" x2="630" y2="250" stroke="rgba(197,160,89, 0.1)" strokeWidth="0.6" />
                </g>

                {/* Connecting Arcs with pulse animation from Dubai Core (370, 250) */}
                {nodes.map((node, idx) => {
                  const isHovered = hoveredNode === node.name;
                  const pulseDuration = `${(idx % 4) * 0.7 + 2.1}s`;
                  return (
                    <g key={node.name}>
                      {/* Secondary large stroke for easy mouse detection */}
                      <path 
                        d={`M 370 250 Q ${node.curveX} ${node.curveY} ${node.x} ${node.y}`}
                        fill="none"
                        stroke="transparent"
                        strokeWidth="24"
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredNode(node.name)}
                        onMouseLeave={() => setHoveredNode(null)}
                      />

                      {/* Ground line static */}
                      <path 
                        d={`M 370 250 Q ${node.curveX} ${node.curveY} ${node.x} ${node.y}`}
                        fill="none"
                        stroke={isHovered ? "url(#activeArc)" : "rgba(223, 178, 86, 0.35)"}
                        strokeWidth={isHovered ? "3.2" : "1.2"}
                        className="transition-all duration-300"
                      />

                      {/* Moving pulse dot animation */}
                      <circle r="3.5" fill="#FFF4DB" className="pointer-events-none filter drop-shadow-[0_0_3px_#DFBA6B]">
                        <animateMotion 
                          path={`M 370 250 Q ${node.curveX} ${node.curveY} ${node.x} ${node.y}`}
                          dur={pulseDuration} 
                          repeatCount="indefinite" 
                        />
                      </circle>
                    </g>
                  );
                })}

                {/* CENTRAL DUBAI CORE GATEWAY (370, 250) */}
                <g 
                  className="cursor-pointer font-sans"
                  onMouseEnter={() => setHoveredNode("Dubai")}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  <circle cx="370" cy="250" r="24" fill="rgba(245, 158, 11, 0.18)" stroke="rgba(245, 158, 11, 0.4)" strokeWidth="1.2" />
                  <circle cx="370" cy="250" r="8" fill="#F59E0B" />
                  <circle cx="370" cy="250" r="4" fill="#030611" />
                  
                  <text x="370" y="292" textAnchor="middle" className="fill-[#FFF4DB] font-sans font-bold text-[11px] tracking-wide filter drop-shadow-[0_1.5px_4px_rgba(0,0,0,0.95)]">
                    {lang === "ZH" ? "迪拜管理总部 (阿联酋旗舰)" : lang === "AR" ? "مقر دبي الرئيسي (الإمارات)" : "Dubai HQ / UAE Corporate Core"}
                  </text>
                </g>

                {/* Node Points circles */}
                {nodes.map((node) => {
                  const isHovered = hoveredNode === node.name;
                  return (
                    <g 
                      key={node.name}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredNode(node.name)}
                      onMouseLeave={() => setHoveredNode(null)}
                    >
                      <circle cx={node.x} cy={node.y} r="16" fill="transparent" />
                      
                      <circle 
                        cx={node.x} 
                        cy={node.y} 
                        r={isHovered ? "7" : "5"} 
                        fill="#030611" 
                        stroke={isHovered ? "#FFF" : "#DFBA6B"} 
                        strokeWidth={isHovered ? "3" : "1.5"}
                        className="transition-all duration-300"
                      />
                      <circle cx={node.x} cy={node.y} r="2" fill={isHovered ? "#DFBA6B" : "transparent"} className="transition-all" />

                      <text 
                        x={
                          node.x < 150 
                            ? node.x + 12 
                            : (node.x > 590 ? node.x - 12 : (node.x < 370 ? node.x - 12 : node.x + 12))
                        } 
                        y={node.y + 4} 
                        className={`text-[10px] font-sans font-medium tracking-wide select-none filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] ${isHovered ? "fill-brand-gold-300 font-bold" : "fill-brand-gold-100"}`}
                        textAnchor={
                          node.x < 150 
                            ? "start" 
                            : (node.x > 590 ? "end" : (node.x < 370 ? "end" : "start"))
                        }
                      >
                        {node.label}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Float Information Panel inside the Map Canvas */}
              {hoveredNode && (
                <div className="absolute bottom-6 left-6 right-6 bg-[#030611]/95 border border-brand-gold-500/25 p-4 rounded-lg backdrop-blur-md transition-all duration-300 z-30 select-none animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex items-center gap-1.5 border-b border-brand-gold-500/10 pb-2 mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-gold-500" />
                    <span className="text-xs font-sans text-brand-gold-300 font-semibold">
                      {hoveredNode} Region Strategic Access
                    </span>
                  </div>
                  <p className="text-sm text-brand-gold-200 font-light leading-relaxed">
                    {hoveredNode === "Dubai" 
                      ? (lang === "ZH" ? "GCI 迪拜管理总部 - 托管大厅现场、实装样机物料现场展示及商会买家直签约" : lang === "AR" ? "مقر إدارة GCI دبي الرئيسي - صالات العرض الميدانية لتوطين المنتجات وتنسيق المشترين" : "GCI Dubai Operational Management HQ - Hosts custom sample display halls and handles bilateral legal execution.")
                      : (nodes.find(n => n.name === hoveredNode)?.info || "")
                    }
                  </p>
                </div>
              )}

            </div>

            {/* Instruction footnote */}
            <p className="text-xs font-sans text-brand-gold-300/60 mt-4 tracking-wide text-center select-none">
              {pack.heroHoverTip}
            </p>

          </div>

        </div>
      </div>
    </section>
  );
}
