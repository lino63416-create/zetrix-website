/**
 * ZETRIX product catalogue for the online order page.
 *
 * HOW TO SET PRICES
 * - `price` is in Saudi riyals (SAR), excluding VAT, per `unit`.
 * - Leave `price: null` to show "Price on request"; the item can still be ordered
 *   and the team sends a quote for it.
 * - Example: price: 4850   ->  4,850 SAR per ton
 */

export type Unit = "ton" | "m" | "m2" | "piece" | "kg";

export type Product = {
  id: string;
  category: CategoryId;
  name: { ar: string; en: string };
  desc: { ar: string; en: string };
  unit: Unit;
  price: number | null;
  minQty?: number;
  image: string;
};

export type CategoryId = "steel" | "cable" | "aluminum" | "metalwork" | "finishing" | "prefab";

export const VAT_RATE = 0.15;

export const categories: { id: CategoryId; ar: string; en: string }[] = [
  { id: "steel", ar: "الهياكل المعدنية", en: "Steel Structures" },
  { id: "cable", ar: "مجاري الكابلات", en: "Cable Trays" },
  { id: "aluminum", ar: "الألمنيوم والزجاج", en: "Aluminum & Glazing" },
  { id: "metalwork", ar: "الأعمال المعدنية", en: "Metal Works" },
  { id: "finishing", ar: "الجلفنة والدهان", en: "Galvanizing & Coating" },
  { id: "prefab", ar: "التصنيع المسبق", en: "Prefabricated" },
];

export const units: Record<Unit, { ar: string; en: string }> = {
  ton: { ar: "طن", en: "ton" },
  m: { ar: "متر طولي", en: "linear m" },
  m2: { ar: "متر مربع", en: "m²" },
  piece: { ar: "قطعة", en: "piece" },
  kg: { ar: "كجم", en: "kg" },
};

export const products: Product[] = [
  {
    id: "steel-heavy",
    category: "steel",
    name: { ar: "هيكل معدني ثقيل", en: "Heavy Steel Structure" },
    desc: { ar: "للمصانع والمستودعات والمنشآت الكبيرة، مصنّع حسب المخططات الإنشائية.", en: "For factories, warehouses and large facilities, built to structural drawings." },
    unit: "ton",
    price: null,
    minQty: 1,
    image: "/images/steel-1.jpg",
  },
  {
    id: "steel-light",
    category: "steel",
    name: { ar: "هيكل معدني خفيف", en: "Light Steel Structure" },
    desc: { ar: "للملاحق والمظلات والإنشاءات الخفيفة.", en: "For annexes, canopies and light construction." },
    unit: "ton",
    price: null,
    minQty: 1,
    image: "/images/steel-2.jpg",
  },
  {
    id: "car-shade",
    category: "steel",
    name: { ar: "مظلات سيارات معدنية", en: "Steel Car Park Shades" },
    desc: { ar: "هيكل معدني مجلفن مع غطاء حسب الطلب.", en: "Galvanized steel frame with cover of your choice." },
    unit: "m2",
    price: null,
    minQty: 20,
    image: "/images/prefab-2.jpg",
  },
  {
    id: "tray-perforated",
    category: "cable",
    name: { ar: "مجرى كابلات مثقّب", en: "Perforated Cable Tray" },
    desc: { ar: "مقاسات من 100 إلى 600 مم، مجلفن أو مدهون.", en: "Widths 100 to 600 mm, galvanized or powder coated." },
    unit: "m",
    price: null,
    minQty: 10,
    image: "/images/cable-1.jpg",
  },
  {
    id: "tray-ladder",
    category: "cable",
    name: { ar: "سلّم كابلات", en: "Cable Ladder" },
    desc: { ar: "للأحمال الثقيلة والمسافات الطويلة بين الدعامات.", en: "For heavy loads and long spans between supports." },
    unit: "m",
    price: null,
    minQty: 10,
    image: "/images/cable-2.jpg",
  },
  {
    id: "alu-window",
    category: "aluminum",
    name: { ar: "نوافذ ألمنيوم", en: "Aluminum Windows" },
    desc: { ar: "سحاب أو مفصلي، مع زجاج مفرد أو مزدوج.", en: "Sliding or casement, single or double glazed." },
    unit: "m2",
    price: null,
    image: "/images/alu-1.jpg",
  },
  {
    id: "alu-door",
    category: "aluminum",
    name: { ar: "أبواب ألمنيوم", en: "Aluminum Doors" },
    desc: { ar: "أبواب مداخل وأبواب داخلية بمقاسات خاصة.", en: "Entrance and interior doors in custom sizes." },
    unit: "piece",
    price: null,
    image: "/images/alu-2.jpg",
  },
  {
    id: "curtain-wall",
    category: "aluminum",
    name: { ar: "واجهات زجاجية (كرتن وول)", en: "Curtain Wall Facade" },
    desc: { ar: "واجهات ألمنيوم وزجاج للمباني التجارية والإدارية.", en: "Aluminum and glass facades for commercial buildings." },
    unit: "m2",
    price: null,
    minQty: 10,
    image: "/images/curtain-1.jpg",
  },
  {
    id: "railing-steel",
    category: "metalwork",
    name: { ar: "درابزين معدني", en: "Steel Railing" },
    desc: { ar: "للسلالم والبلكونات والأسطح، بتصاميم متعددة.", en: "For stairs, balconies and roofs, in several designs." },
    unit: "m",
    price: null,
    image: "/images/railing-1.jpg",
  },
  {
    id: "railing-glass",
    category: "metalwork",
    name: { ar: "درابزين زجاج وألمنيوم", en: "Glass & Aluminum Railing" },
    desc: { ar: "زجاج سيكوريت مع قوائم ألمنيوم أو ستانلس.", en: "Tempered glass with aluminum or stainless posts." },
    unit: "m",
    price: null,
    image: "/images/railing-2.jpg",
  },
  {
    id: "steel-door",
    category: "metalwork",
    name: { ar: "أبواب وبوابات حديد", en: "Steel Doors & Gates" },
    desc: { ar: "بوابات خارجية وأبواب مستودعات وأبواب طوارئ.", en: "Outdoor gates, warehouse doors and emergency doors." },
    unit: "piece",
    price: null,
    image: "/images/weld-3.jpg",
  },
  {
    id: "laser-cutting",
    category: "metalwork",
    name: { ar: "قص بالليزر حسب المخطط", en: "Laser Cutting to Drawing" },
    desc: { ar: "قص دقيق للحديد والألمنيوم حسب ملفاتك (DWG / DXF).", en: "Precision cutting of steel and aluminum from your DWG/DXF files." },
    unit: "piece",
    price: null,
    image: "/images/laser-2.jpg",
  },
  {
    id: "galvanizing",
    category: "finishing",
    name: { ar: "جلفنة على الساخن", en: "Hot-Dip Galvanizing" },
    desc: { ar: "حماية من الصدأ لعمر أطول للحديد.", en: "Rust protection for a longer steel lifespan." },
    unit: "kg",
    price: null,
    minQty: 100,
    image: "/images/galv-1.jpg",
  },
  {
    id: "powder-coating",
    category: "finishing",
    name: { ar: "دهان بودرة (باودر كوتنج)", en: "Powder Coating" },
    desc: { ar: "تشطيب متين بألوان متعددة يقاوم الخدش والبهتان.", en: "Durable multi-color finish that resists scratches and fading." },
    unit: "m2",
    price: null,
    minQty: 10,
    image: "/images/laser-1.jpg",
  },
  {
    id: "prefab-room",
    category: "prefab",
    name: { ar: "غرف ومباني جاهزة", en: "Prefabricated Rooms & Buildings" },
    desc: { ar: "مكاتب مواقع وسكن عمال ومستودعات صغيرة.", en: "Site offices, staff housing and small stores." },
    unit: "m2",
    price: null,
    minQty: 12,
    image: "/images/prefab-1.jpg",
  },
];
