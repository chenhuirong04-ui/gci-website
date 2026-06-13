import React, { useState, useEffect } from "react";
import { LanguagePack } from "../data/corporateData";
import { Globe, Video, FileText, Compass, AlertCircle, VideoOff, Layers } from "lucide-react";

interface NotionOverlay {
  key: string;
  youtubeUrl: string | null;
  coverImage: string | null;
  descEN: string;
  descZH: string;
  descAR: string;
  tagsEN: string[];
  tagsZH: string[];
}

function getYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
  return m ? m[1] : null;
}

interface CommercialNetworkProps {
  lang: "EN" | "ZH" | "AR";
  pack: LanguagePack;
}

interface CountryRecord {
  key: string;
  nameEN: string;
  nameZH: string;
  nameAR: string;
  descEN: string;
  descZH: string;
  descAR: string;
  tagsEN: string[];
  tagsZH: string[];
  tagsAR: string[];
  image: string | null;
}

const COUNTRIES_DATA: CountryRecord[] = [
  {
    key: "uae",
    nameEN: "UAE / Dubai",
    nameZH: "阿联酋 / 迪拜",
    nameAR: "الإمارات / دبي",
    descEN: "Dubai headquarters, showroom, warehousing resources, business development and project coordination.",
    descZH: "迪拜总部、样品展示间、仓储资源、业务开发与项目协调。",
    descAR: "المقر الرئيسي في دبي، صالة العرض، موارد المستودعات، تطوير الأعمال وتنسيق المشاريع.",
    tagsEN: ["Showroom", "Warehouse", "Business Center", "Project Coordination"],
    tagsZH: ["样机展厅", "海外仓储", "商务中心", "项目协调"],
    tagsAR: ["صالة العرض", "المستودعات", "المركز التجاري", "تنسيق المشاريع"],
    image: "/src/assets/images/case_robotics_dubai_1780768291268.png"
  },
  {
    key: "saudi",
    nameEN: "Saudi Arabia",
    nameZH: "沙特阿拉伯",
    nameAR: "المملكة العربية السعودية",
    descEN: "Commercial partners, client visits, project opportunities and local execution support.",
    descZH: "商业合作伙伴、客户拜访、项目机遇及本地执行支持。",
    descAR: "الشركاء التجاريون، زيارات العملاء، فرص المشاريع ودعم التنفيذ المحلي.",
    tagsEN: ["Partners", "Client Visits", "Projects", "Market Development"],
    tagsZH: ["商务伙伴", "客户随访", "项目对接", "市场拓展"],
    tagsAR: ["الشركاء", "زيارات العملاء", "المشاريع", "تطوير السوق"],
    image: "/src/assets/images/case_solar_riyadh_1780768308627.png"
  },
  {
    key: "bahrain",
    nameEN: "Bahrain",
    nameZH: "巴林",
    nameAR: "البحرين",
    descEN: "Regional trade connections, partner network and regional business support.",
    descZH: "区域贸易关系、合作伙伴网络及区域内业务支持。",
    descAR: "العلاقات التجارية الإقليمية، شبكة الشركاء والدعم الإقليمي للأعمال.",
    tagsEN: ["Partner Network", "Trade Support", "Regional Access"],
    tagsZH: ["伙伴网络", "贸易支持", "区域通道"],
    tagsAR: ["شبكة الشركاء", "الدعم التجاري", "الدخول الإقليمي"],
    image: null
  },
  {
    key: "oman",
    nameEN: "Oman",
    nameZH: "阿曼",
    nameAR: "سلطنة عمان",
    descEN: "Regional market access, trade coordination and local partner support.",
    descZH: "区域市场准入、贸易协调及本地合作伙伴支持。",
    descAR: "الدخول إلى الأسواق الإقليمية، التنسيق التجاري ودعم الشركاء المحليين.",
    tagsEN: ["Market Access", "Trade Coordination", "Local Partners"],
    tagsZH: ["市场准入", "贸易协调", "本地伙伴"],
    tagsAR: ["دخول الأسواق", "التنسيق التجاري", "الشركاء المحليون"],
    image: null
  },
  {
    key: "kenya",
    nameEN: "Kenya",
    nameZH: "肯尼亚",
    nameAR: "كينيا",
    descEN: "East Africa market gateway, warehousing resources, distribution support and local business network.",
    descZH: "东非市场门户、仓储资源、分销支持及本地商业网络。",
    descAR: "بوابة أسواق شرق إفريقيا، موارد المستودعات، دعم التوزيع والشبكة التجارية المحلية.",
    tagsEN: ["East Africa", "Warehouse", "Distribution", "Local Network"],
    tagsZH: ["东非门户", "海外干仓", "分销支持", "本地网络"],
    tagsAR: ["شرق إفريقيا", "المستودعات", "التوزيع", "الشبكة المحلية"],
    image: "/src/assets/images/case_medical_mombasa_1780768328334.png"
  },
  {
    key: "china",
    nameEN: "China",
    nameZH: "中国",
    nameAR: "الصين",
    descEN: "Manufacturing resources, supplier network, sourcing coordination and export support.",
    descZH: "制造资源、供应商网络、采购协调及出口支持。",
    descAR: "موارد التصنيع، شبكة الموردين، تنسيق المصادر ودعم التصدير.",
    tagsEN: ["Suppliers", "Factories", "Sourcing", "Export"],
    tagsZH: ["供应资源", "先进工厂", "采购协调", "出口支持"],
    tagsAR: ["الموردون", "المصانع", "تأمين المصادر", "التصدير"],
    image: "/src/assets/images/case_port_shenzhen_1780768345006.png"
  },
  {
    key: "vietnam",
    nameEN: "Vietnam",
    nameZH: "越南",
    nameAR: "فيتنام",
    descEN: "Regional market network, manufacturing resources and business development opportunities.",
    descZH: "区域市场网络、制造资源及业务开发机遇。",
    descAR: "شبكة الأسواق الإقليمية، موارد التصنيع وفرص تطوير الأعمال.",
    tagsEN: ["Market Network", "Manufacturing", "Business Development"],
    tagsZH: ["区域网络", "制造资源", "业务开发"],
    tagsAR: ["شبكة السوق", "التصنيع", "تطوير الأعمال"],
    image: null
  },
  {
    key: "cambodia",
    nameEN: "Cambodia",
    nameZH: "柬埔寨",
    nameAR: "كمبوديا",
    descEN: "Emerging market network, sourcing resources and regional partner connections.",
    descZH: "新兴市场网络、采购资源及区域合作伙伴关系。",
    descAR: "شبكة الأسواق الناشئة، موارد المشتريات وعلاقات الشركاء الإقليميين.",
    tagsEN: ["Emerging Market", "Sourcing", "Partners"],
    tagsZH: ["新兴市场", "采购网络", "伙伴合作"],
    tagsAR: ["الأسواق الناشئة", "المشتريات", "الشركاء"],
    image: null
  },
  {
    key: "indonesia",
    nameEN: "Indonesia",
    nameZH: "印度尼西亚",
    nameAR: "إندونيسيا",
    descEN: "Market access, regional business network and commercial partnership development.",
    descZH: "市场准入、区域商业网络及商业合作伙伴关系开发。",
    descAR: "دخول الأسواق، الشبكة التجارية الإقليمية وتطوير الشراكات التجارية.",
    tagsEN: ["Market Access", "Partners", "Distribution"],
    tagsZH: ["市场准入", "商业网络", "分销伙伴"],
    tagsAR: ["دخول الأسواق", "الشركاء", "التوزيع"],
    image: null
  },
  {
    key: "morocco",
    nameEN: "Morocco",
    nameZH: "摩洛哥",
    nameAR: "المغرب",
    descEN: "Strategic expansion market for North Africa and regional trade opportunities.",
    descZH: "北非战略拓展市场及区域贸易机遇。",
    descAR: "سوق التوسع الاستراتيجي لشمال إفريقيا والفرص التجارية الإقليمية.",
    tagsEN: ["Expansion Market", "North Africa", "Trade Opportunities"],
    tagsZH: ["拓展市场", "北非枢纽", "贸易机遇"],
    tagsAR: ["سوق التوسع", "شمال إفريقيا", "فرص التجارة"],
    image: null
  },
  {
    key: "brazil",
    nameEN: "Brazil",
    nameZH: "巴西",
    nameAR: "البرازيل",
    descEN: "Strategic expansion market for Latin America and future commercial corridors.",
    descZH: "拉丁美洲战略拓展市场及未来商业廊道。",
    descAR: "سوق التوسع الاستراتيجي لأمريكا اللاتينية والممرات التجارية المستقبلية.",
    tagsEN: ["Expansion Market", "Latin America", "Future Corridor"],
    tagsZH: ["拓展市场", "拉美网络", "未来廊道"],
    tagsAR: ["سوق التوسع", "أمريكا اللاتينية", "ممرات المستقبل"],
    image: null
  }
];

export default function CommercialNetwork({ lang, pack }: CommercialNetworkProps) {
  const [selectedKey, setSelectedKey] = useState<string>("uae");
  const [overlays, setOverlays] = useState<Record<string, NotionOverlay>>({});
  const isRtl = lang === "AR";

  useEffect(() => {
    fetch("/api/network")
      .then((r) => r.json())
      .then((data: NotionOverlay[]) => {
        const map: Record<string, NotionOverlay> = {};
        data.forEach((o) => { map[o.key] = o; });
        setOverlays(map);
      })
      .catch(() => {});
  }, []);

  const activeCountry = COUNTRIES_DATA.find((c) => c.key === selectedKey) || COUNTRIES_DATA[0];
  const overlay = overlays[selectedKey];
  const youtubeId = overlay?.youtubeUrl ? getYouTubeId(overlay.youtubeUrl) : null;
  const activeImage = overlay?.coverImage || activeCountry.image;
  const activeDescEN = overlay?.descEN || activeCountry.descEN;
  const activeDescZH = overlay?.descZH || activeCountry.descZH;
  const activeDescAR = overlay?.descAR || activeCountry.descAR;
  const activeTagsEN = (overlay?.tagsEN?.length ? overlay.tagsEN : activeCountry.tagsEN);
  const activeTagsZH = (overlay?.tagsZH?.length ? overlay.tagsZH : activeCountry.tagsZH);

  // Helper translations for UI labels
  const labelText = {
    EN: "Global Footprint",
    ZH: "环球网点",
    AR: "خطوط العمل الإقليمية"
  }[lang];

  const titleText = "COMMERCIAL NETWORK";

  const subtitleText = {
    EN: "A regional business network built through local partnerships, commercial resources and years of market execution across regional and global markets.",
    ZH: "由本地合作伙伴、商业资源及多年市场执行经验共同构筑的区域及全球商业网络。",
    AR: "شبكة تجارية إقليمية مبنية من خلال الشراكات المحلية، والموارد التجارية، وسنوات من التنفيذ في الأسواق الإقليمية والعالمية."
  }[lang];

  const placeholderText = {
    EN: "Video / images to be updated",
    ZH: "视频与图片正待更新",
    AR: "الفيديو والصور في طور التحديث"
  }[lang];

  const liveFeedText = {
    EN: "Live Connectivity Feed",
    ZH: "实时在岸连接图像",
    AR: "لقطات الربط الميداني الحية"
  }[lang];

  const tagsLabel = {
    EN: "Core Capabilities",
    ZH: "核心资源标签",
    AR: "القدرات العقدية"
  }[lang];

  return (
    <section id="media-section" className="py-20 md:py-24 bg-[#050a15] border-b border-brand-gold-500/10 relative overflow-hidden">
      {/* Decorative corporate laser light beams or spot glow */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-brand-gold-500/5 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-brand-navy-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10" dir={isRtl ? "rtl" : "ltr"}>
        
        {/* Modern Corporate Header Block */}
        <div className={`max-w-4xl mb-12 ${isRtl ? "text-right" : "text-left"}`}>
          <div className="flex items-center gap-2 mb-4 justify-start">
            <span className="h-[1px] w-8 bg-brand-gold-500" />
            <span className={`text-sm font-sans text-brand-gold-400 font-medium uppercase font-mono ${lang === "EN" ? "tracking-widest" : "tracking-normal"}`}>
              {labelText}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-sans font-extrabold text-brand-gold-100 tracking-tight leading-none uppercase">
            {titleText}
          </h2>
          <p className="mt-4 text-base md:text-lg text-brand-gold-200/80 font-light leading-relaxed">
            {subtitleText}
          </p>
        </div>

        {/* Premium Executive Selector Controls */}
        <div className="mb-10">
          <div className="flex flex-wrap items-center justify-start gap-2 sm:gap-3 bg-[#030611]/50 border border-brand-gold-500/10 p-2 sm:p-3 rounded-2xl backdrop-blur-md">
            {COUNTRIES_DATA.map((country) => {
              const isActive = country.key === selectedKey;
              const countryName = {
                EN: country.nameEN,
                ZH: country.nameZH,
                AR: country.nameAR
              }[lang];

              return (
                <button
                  key={country.key}
                  id={`btn-network-${country.key}`}
                  onClick={() => setSelectedKey(country.key)}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-sans font-semibold tracking-wide transition-all duration-300 cursor-pointer active:scale-98 flex items-center gap-2 border ${
                    isActive
                      ? "bg-brand-gold-500 text-[#030611] border-brand-gold-400 font-bold shadow-md shadow-brand-gold-500/10"
                      : "bg-[#030611]/60 text-slate-300 border-brand-gold-500/5 hover:border-brand-gold-500/20 hover:text-brand-gold-300"
                  }`}
                >
                  <Globe className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-[#030611]" : "text-brand-gold-500/60"}`} />
                  <span>{countryName}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Landscape Cinematic Media Area & Information Sub-Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Main Large-scale Video/Image Showcase (Visual Center) - cols 7 */}
          <div className="lg:col-span-8 flex flex-col justify-between">
            <div className="relative aspect-video md:aspect-[21/10] w-full rounded-2xl overflow-hidden border border-brand-gold-500/15 bg-[#030611] flex items-center justify-center group shadow-2xl transition-all duration-300">

              {youtubeId ? (
                <iframe
                  key={youtubeId}
                  src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`}
                  title={activeCountry.nameEN}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : activeImage ? (
                <>
                  {/* High Quality On-ground Real Evidence Image representation */}
                  <img
                    src={activeImage}
                    alt={{ EN: activeCountry.nameEN, ZH: activeCountry.nameZH, AR: activeCountry.nameAR }[lang]}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-700 pointer-events-none select-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#030611]/90 via-[#030611]/30 to-transparent pointer-events-none" />

                  {/* Visual Indicator of a stream/evidence */}
                  <div className={`absolute top-4 left-4 z-20 flex items-center gap-2 bg-[#030611]/80 backdrop-blur px-3 py-1.5 rounded-full border border-brand-gold-500/20 text-[10px] font-mono font-bold text-brand-gold-400 uppercase ${lang === "EN" ? "tracking-widest" : "tracking-normal"}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{liveFeedText}</span>
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                    <div className="w-14 h-14 rounded-full bg-brand-gold-500/10 border border-brand-gold-500/30 flex items-center justify-center backdrop-blur text-brand-gold-400 group-hover:scale-110 group-hover:bg-brand-gold-500/15 group-hover:border-brand-gold-500/50 transition-all duration-300">
                      <Video className="w-6 h-6 stroke-[1.8]" />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Stylish Modern Premium Placeholder with Glowing Design Grid */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0c1426] to-[#040813] flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden">
                    <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#C59B3F_1px,transparent_1px)] [background-size:16px_16px]" />
                    <div className="absolute w-[200px] h-[200px] bg-brand-gold-500/5 blur-[50px] rounded-full" />

                    <div className="p-4 rounded-full bg-[#030611]/80 border border-brand-gold-500/10 text-brand-gold-400/40 mb-4 shadow-xl">
                      <VideoOff className="w-8 h-8 stroke-[1.5]" />
                    </div>

                    <span className={`text-xs sm:text-sm font-mono text-[#DFBA6B] uppercase font-bold animate-pulse ${lang === "EN" ? "tracking-widest" : "tracking-normal"}`}>
                      {placeholderText}
                    </span>
                    <span className="text-[10px] uppercase font-sans text-brand-gold-500/30 tracking-wider mt-1 block font-medium">
                      GCI Commercial Network Asset Deck
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Details & Information Context Panel - cols 4 */}
          <div className="lg:col-span-4 flex flex-col justify-between p-6 sm:p-8 bg-[#070e20] rounded-2xl border border-brand-gold-500/10 shadow-xl relative overflow-hidden backdrop-blur-md">
            {/* Fine decorative outline grid */}
            <div className="absolute top-0 right-0 w-32 h-32 border-r border-t border-brand-gold-500/5 pointer-events-none rounded-tr-2xl" />
            
            <div className="text-left flex flex-col justify-between h-full" dir={isRtl ? "rtl" : "ltr"}>
              <div>
                {/* Selected Country Flag Icon watermark & title */}
                <span className="text-[10px] font-mono text-brand-gold-400 uppercase tracking-widest bg-brand-gold-500/5 border border-brand-gold-500/15 px-3 py-1 rounded-lg font-bold mb-4 inline-block">
                  {lang === "EN" ? activeCountry.nameEN : lang === "ZH" ? activeCountry.nameZH : activeCountry.nameAR}
                </span>

                <h3 className="text-2xl font-serif text-brand-gold-100 font-extrabold tracking-tight mt-1 mb-4 leading-snug">
                  {lang === "EN" ? activeCountry.nameEN : lang === "ZH" ? activeCountry.nameZH : activeCountry.nameAR}
                </h3>
                
                <p className="text-sm text-brand-gold-200/95 font-light leading-relaxed font-sans mb-6 min-h-[6rem] border-l-2 border-brand-gold-500/20 pl-4">
                  {lang === "EN" ? activeDescEN : lang === "ZH" ? activeDescZH : activeDescAR}
                </p>
              </div>

              {/* Resource Tags Block */}
              <div className="border-t border-brand-gold-500/10 pt-5">
                <span className="text-[10px] uppercase font-mono tracking-wider text-brand-gold-400 block mb-3 font-semibold">
                  {tagsLabel}
                </span>
                <div className="flex flex-wrap gap-2">
                  {({
                    EN: activeTagsEN,
                    ZH: activeTagsZH,
                    AR: activeCountry.tagsAR
                  }[lang]).map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] font-sans text-brand-gold-200 hover:text-brand-gold-100 font-semibold bg-brand-gold-500/5 hover:bg-brand-gold-500/10 border border-brand-gold-500/12 hover:border-brand-gold-500/20 rounded-lg px-2.5 py-1.5 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
          </div>

        </div>

      </div>
    </section>
  );
}
