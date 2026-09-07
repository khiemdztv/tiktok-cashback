export type Category =
  | "Mua sắm"
  | "Du lịch"
  | "Thời trang"
  | "Công nghệ"
  | "Phần mềm"
  | "Dịch vụ";

export type CashbackTier = { label: string; rate: number };

export type Store = {
  slug: string;
  name: string;
  short: string;
  category: Category;
  maxRate: number;
  color: string;
  website: string;
  description: string;
  popularity: number;
  updated: string;
  tiers: CashbackTier[];
  conditions: string[];
};

export const LAST_UPDATED = "01/09/2026";

export const stores: Store[] = [
  {
    slug: "shopee",
    name: "Shopee",
    short: "SP",
    category: "Mua sắm",
    maxRate: 5,
    color: "oklch(0.68 0.19 40)",
    website: "https://shopee.vn",
    description:
      "Sàn thương mại điện tử lớn nhất Việt Nam với hàng triệu sản phẩm, freeship và flash sale mỗi ngày.",
    popularity: 100,
    updated: "Hôm nay",
    tiers: [
      { label: "Thời trang", rate: 5 },
      { label: "Điện tử", rate: 2 },
      { label: "Làm đẹp", rate: 4 },
      { label: "Khác", rate: 1 },
    ],
    conditions: [
      "Áp dụng cho đơn hàng mới, thanh toán thành công.",
      "Không áp dụng cho đơn hàng bị huỷ hoặc hoàn trả.",
      "Một số ngành hàng và gian hàng có thể bị loại trừ.",
      "Cashback được duyệt sau khi hết thời gian đổi trả.",
    ],
  },
  {
    slug: "lazada",
    name: "Lazada",
    short: "LZ",
    category: "Mua sắm",
    maxRate: 8,
    color: "oklch(0.55 0.19 275)",
    website: "https://lazada.vn",
    description:
      "Sàn thương mại điện tử với LazMall chính hãng, ưu đãi ngân hàng và nhiều chương trình cashback theo ngành hàng.",
    popularity: 92,
    updated: "Hôm nay",
    tiers: [
      { label: "Nhà cửa & đời sống", rate: 8 },
      { label: "Thời trang", rate: 6 },
      { label: "Điện tử", rate: 2.5 },
      { label: "Khác", rate: 1.5 },
    ],
    conditions: [
      "Chỉ áp dụng cho khách hàng mua qua đường dẫn của chương trình.",
      "Không cộng gộp với một số mã giảm giá độc quyền.",
      "Đơn hàng cần được xác nhận giao thành công.",
    ],
  },
  {
    slug: "tiktok-shop",
    name: "TikTok Shop",
    short: "TT",
    category: "Mua sắm",
    maxRate: 6,
    color: "oklch(0.35 0.02 260)",
    website: "https://shop.tiktok.com",
    description:
      "Mua sắm trực tiếp trong ứng dụng TikTok với livestream, video ngắn và nhiều mã giảm giá cho người mua mới.",
    popularity: 88,
    updated: "Hôm nay",
    tiers: [
      { label: "Làm đẹp", rate: 6 },
      { label: "Thời trang", rate: 4 },
      { label: "Gia dụng", rate: 3 },
      { label: "Khác", rate: 1 },
    ],
    conditions: [
      "Áp dụng cho đơn hàng đầu tiên trong ngày.",
      "Không áp dụng cho đơn mua qua livestream của một số nhà bán.",
    ],
  },
  {
    slug: "tiki",
    name: "Tiki",
    short: "TK",
    category: "Mua sắm",
    maxRate: 4,
    color: "oklch(0.6 0.18 250)",
    website: "https://tiki.vn",
    description:
      "Sàn thương mại điện tử với hàng chính hãng, giao nhanh TikiNOW và chính sách đổi trả rõ ràng.",
    popularity: 74,
    updated: "2 ngày trước",
    tiers: [
      { label: "Sách", rate: 4 },
      { label: "Gia dụng", rate: 3 },
      { label: "Điện tử", rate: 1.5 },
      { label: "Khác", rate: 1 },
    ],
    conditions: [
      "Không áp dụng cho sản phẩm từ nhà bán quốc tế.",
      "Đơn hàng phải hoàn tất và không có yêu cầu hoàn tiền.",
    ],
  },
  {
    slug: "agoda",
    name: "Agoda",
    short: "AG",
    category: "Du lịch",
    maxRate: 10,
    color: "oklch(0.55 0.16 285)",
    website: "https://agoda.com",
    description:
      "Đặt phòng khách sạn, homestay và resort trong nước lẫn quốc tế với giá cạnh tranh.",
    popularity: 86,
    updated: "Hôm nay",
    tiers: [
      { label: "Khách sạn quốc tế", rate: 10 },
      { label: "Khách sạn trong nước", rate: 7 },
      { label: "Vé máy bay", rate: 1 },
      { label: "Khác", rate: 2 },
    ],
    conditions: [
      "Cashback tính trên giá phòng chưa bao gồm thuế và phí.",
      "Đơn cần hoàn tất lưu trú mới được duyệt.",
      "Không áp dụng cho đặt phòng huỷ hoặc no-show.",
    ],
  },
  {
    slug: "booking-com",
    name: "Booking.com",
    short: "BK",
    category: "Du lịch",
    maxRate: 6,
    color: "oklch(0.45 0.17 260)",
    website: "https://booking.com",
    description:
      "Nền tảng đặt phòng toàn cầu với chính sách huỷ linh hoạt và hàng triệu chỗ nghỉ.",
    popularity: 80,
    updated: "Hôm nay",
    tiers: [
      { label: "Chỗ nghỉ quốc tế", rate: 6 },
      { label: "Chỗ nghỉ trong nước", rate: 4 },
      { label: "Khác", rate: 2 },
    ],
    conditions: [
      "Cashback duyệt sau khi hoàn tất kỳ nghỉ.",
      "Cần thanh toán trực tiếp qua nền tảng.",
    ],
  },
  {
    slug: "traveloka",
    name: "Traveloka",
    short: "TV",
    category: "Du lịch",
    maxRate: 7,
    color: "oklch(0.6 0.19 240)",
    website: "https://traveloka.com",
    description:
      "Đặt vé máy bay, khách sạn, vé vui chơi và combo du lịch với nhiều ưu đãi theo mùa.",
    popularity: 78,
    updated: "Hôm qua",
    tiers: [
      { label: "Khách sạn", rate: 7 },
      { label: "Vé vui chơi", rate: 5 },
      { label: "Vé máy bay", rate: 1 },
    ],
    conditions: [
      "Không áp dụng cho đơn thanh toán tại chỗ.",
      "Một số combo khuyến mãi bị loại trừ.",
    ],
  },
  {
    slug: "nike",
    name: "Nike",
    short: "NK",
    category: "Thời trang",
    maxRate: 8,
    color: "oklch(0.25 0.01 260)",
    website: "https://nike.com",
    description: "Giày, quần áo và phụ kiện thể thao chính hãng từ cửa hàng trực tuyến Nike.",
    popularity: 70,
    updated: "Hôm nay",
    tiers: [
      { label: "Nguyên giá", rate: 8 },
      { label: "Hàng sale", rate: 3 },
    ],
    conditions: ["Không áp dụng với thẻ quà tặng.", "Chỉ áp dụng cho đơn giao trong nước."],
  },
  {
    slug: "adidas",
    name: "Adidas",
    short: "AD",
    category: "Thời trang",
    maxRate: 7,
    color: "oklch(0.3 0.02 250)",
    website: "https://adidas.com",
    description: "Thời trang thể thao và sneaker chính hãng với nhiều đợt giảm giá trong năm.",
    popularity: 64,
    updated: "3 ngày trước",
    tiers: [
      { label: "Nguyên giá", rate: 7 },
      { label: "Hàng sale", rate: 2 },
    ],
    conditions: ["Không cộng gộp với ưu đãi thành viên.", "Đơn tối thiểu 500.000đ."],
  },
  {
    slug: "samsung",
    name: "Samsung",
    short: "SS",
    category: "Công nghệ",
    maxRate: 3,
    color: "oklch(0.5 0.18 255)",
    website: "https://samsung.com",
    description: "Điện thoại, TV, gia dụng thông minh chính hãng từ Samsung Store Việt Nam.",
    popularity: 66,
    updated: "Hôm nay",
    tiers: [
      { label: "Phụ kiện", rate: 3 },
      { label: "Gia dụng", rate: 2 },
      { label: "Điện thoại", rate: 0.5 },
    ],
    conditions: ["Không áp dụng cho đơn trả góp 0%.", "Loại trừ chương trình thu cũ đổi mới."],
  },
  {
    slug: "fpt-shop",
    name: "FPT Shop",
    short: "FP",
    category: "Công nghệ",
    maxRate: 2,
    color: "oklch(0.6 0.2 30)",
    website: "https://fptshop.com.vn",
    description: "Chuỗi bán lẻ điện thoại, laptop và phụ kiện với bảo hành chính hãng.",
    popularity: 58,
    updated: "Hôm qua",
    tiers: [
      { label: "Phụ kiện", rate: 2 },
      { label: "Laptop", rate: 1 },
      { label: "Điện thoại", rate: 0.5 },
    ],
    conditions: ["Áp dụng cho đơn đặt online, nhận tại cửa hàng hoặc giao hàng."],
  },
  {
    slug: "canva",
    name: "Canva",
    short: "CV",
    category: "Phần mềm",
    maxRate: 25,
    color: "oklch(0.65 0.16 200)",
    website: "https://canva.com",
    description: "Công cụ thiết kế trực tuyến với gói Pro cho cá nhân, nhóm và doanh nghiệp.",
    popularity: 62,
    updated: "Hôm nay",
    tiers: [
      { label: "Gói Pro năm đầu", rate: 25 },
      { label: "Gia hạn", rate: 5 },
    ],
    conditions: ["Chỉ áp dụng cho tài khoản đăng ký mới.", "Không áp dụng khi dùng bản dùng thử."],
  },
  {
    slug: "grab",
    name: "Grab",
    short: "GR",
    category: "Dịch vụ",
    maxRate: 4,
    color: "oklch(0.68 0.16 150)",
    website: "https://grab.com",
    description: "Đặt xe, giao đồ ăn và đi chợ hộ với nhiều mã giảm giá theo khung giờ.",
    popularity: 68,
    updated: "Hôm nay",
    tiers: [
      { label: "GrabFood", rate: 4 },
      { label: "GrabCar", rate: 2 },
    ],
    conditions: ["Áp dụng cho đơn thanh toán không dùng tiền mặt."],
  },
];

export const storeBySlug = (slug: string) => stores.find((s) => s.slug === slug);

export const platformDomains: Record<string, string[]> = {
  shopee: ["shopee.vn"],
  lazada: ["lazada.vn"],
  tiki: ["tiki.vn"],
  "tiktok-shop": ["shop.tiktok.com", "tiktokshop.com"],
  agoda: ["agoda.com"],
  "booking-com": ["booking.com"],
  traveloka: ["traveloka.com"],
  nike: ["nike.com", "nike.com.vn"],
  adidas: ["adidas.com", "adidas.com.vn"],
  samsung: ["samsung.com", "samsung.com.vn"],
  "fpt-shop": ["fptshop.com.vn"],
  canva: ["canva.com"],
  grab: ["grab.com"],
};

export const platformCashbackRates: Record<string, number> = Object.fromEntries(
  stores.map((store) => [store.slug, store.maxRate]),
);

export function getCashbackForPlatform(slug: string, category?: string) {
  const store = storeBySlug(slug);
  if (!store) return platformCashbackRates[slug] ?? 0;
  if (!category) return store.maxRate;

  const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("vi");
  const normalizedCategory = normalize(category);
  const categoryPatterns: Array<[RegExp, RegExp]> = [
    [/phu kien/, /phu kien|op lung|case|cu sac|sac du phong|tai nghe|day cap|cable/],
    [/dien thoai|dien tu/, /dien thoai|iphone|ipad|galaxy|smartphone|samsung|may tinh bang/],
    [/laptop/, /laptop|macbook|may tinh/],
    [/thoi trang|sneaker/, /thoi trang|quan ao|giay|sneaker|nike|adidas/],
    [/lam dep/, /lam dep|my pham|skincare|makeup/],
    [/nha cua|gia dung/, /nha cua|gia dung|noi that/],
    [/khach san|cho nghi/, /khach san|hotel|resort|homestay|cho nghi/],
    [/ve may bay/, /ve may bay|chuyen bay|flight/],
    [/grabfood/, /grabfood|do an|giao do an/],
    [/grabcar/, /grabcar|dat xe/],
  ];
  const tier = store.tiers.find((item) => {
    const normalizedLabel = normalize(item.label);
    if (normalizedCategory.includes(normalizedLabel)) return true;
    return categoryPatterns.some(([labelPattern, queryPattern]) => labelPattern.test(normalizedLabel) && queryPattern.test(normalizedCategory));
  });
  return tier?.rate ?? store.maxRate;
}

export const categories: { icon: string; label: string; slug: string }[] = [
  { icon: "🛒", label: "Mua sắm", slug: "mua-sam" },
  { icon: "✈️", label: "Du lịch", slug: "du-lich" },
  { icon: "🏨", label: "Khách sạn", slug: "khach-san" },
  { icon: "👟", label: "Thời trang", slug: "thoi-trang" },
  { icon: "💻", label: "Công nghệ", slug: "cong-nghe" },
  { icon: "🎓", label: "Học tập", slug: "hoc-tap" },
  { icon: "🎨", label: "Phần mềm", slug: "phan-mem" },
  { icon: "🍔", label: "Ăn uống", slug: "an-uong" },
];

export type CashbackOffer = {
  id: string;
  storeSlug: string;
  provider: string;
  rate: number;
  category: Category;
  note: string;
  updated: string;
  updatedRank: number;
};

export const cashbackOffers: CashbackOffer[] = [
  {
    id: "cb-1",
    storeSlug: "agoda",
    provider: "ShopBack",
    rate: 10,
    category: "Du lịch",
    note: "Khách sạn quốc tế, duyệt sau khi hoàn tất lưu trú.",
    updated: "Hôm nay",
    updatedRank: 0,
  },
  {
    id: "cb-2",
    storeSlug: "lazada",
    provider: "AccessTrade",
    rate: 8,
    category: "Mua sắm",
    note: "Ngành hàng nhà cửa & đời sống, khách mua mới.",
    updated: "Hôm nay",
    updatedRank: 0,
  },
  {
    id: "cb-3",
    storeSlug: "nike",
    provider: "Involve Asia",
    rate: 8,
    category: "Thời trang",
    note: "Áp dụng sản phẩm nguyên giá.",
    updated: "Hôm nay",
    updatedRank: 0,
  },
  {
    id: "cb-4",
    storeSlug: "traveloka",
    provider: "ShopBack",
    rate: 7,
    category: "Du lịch",
    note: "Đặt phòng khách sạn trong và ngoài nước.",
    updated: "Hôm qua",
    updatedRank: 1,
  },
  {
    id: "cb-5",
    storeSlug: "shopee",
    provider: "ShopBack",
    rate: 5,
    category: "Mua sắm",
    note: "Ngành hàng thời trang, giới hạn 200.000đ/đơn.",
    updated: "Hôm nay",
    updatedRank: 0,
  },
  {
    id: "cb-6",
    storeSlug: "tiktok-shop",
    provider: "AccessTrade",
    rate: 6,
    category: "Mua sắm",
    note: "Ngành hàng làm đẹp, đơn đầu tiên trong ngày.",
    updated: "Hôm nay",
    updatedRank: 0,
  },
  {
    id: "cb-7",
    storeSlug: "canva",
    provider: "Impact",
    rate: 25,
    category: "Phần mềm",
    note: "Đăng ký gói Pro năm đầu cho tài khoản mới.",
    updated: "Hôm nay",
    updatedRank: 0,
  },
  {
    id: "cb-8",
    storeSlug: "tiki",
    provider: "Involve Asia",
    rate: 4,
    category: "Mua sắm",
    note: "Ngành hàng sách và văn phòng phẩm.",
    updated: "2 ngày trước",
    updatedRank: 2,
  },
  {
    id: "cb-9",
    storeSlug: "samsung",
    provider: "AccessTrade",
    rate: 3,
    category: "Công nghệ",
    note: "Phụ kiện chính hãng, loại trừ đơn trả góp.",
    updated: "Hôm nay",
    updatedRank: 0,
  },
  {
    id: "cb-10",
    storeSlug: "booking-com",
    provider: "ShopBack",
    rate: 6,
    category: "Du lịch",
    note: "Chỗ nghỉ quốc tế, thanh toán trực tuyến.",
    updated: "Hôm nay",
    updatedRank: 0,
  },
  {
    id: "cb-11",
    storeSlug: "adidas",
    provider: "Involve Asia",
    rate: 7,
    category: "Thời trang",
    note: "Đơn từ 500.000đ, sản phẩm nguyên giá.",
    updated: "3 ngày trước",
    updatedRank: 3,
  },
  {
    id: "cb-12",
    storeSlug: "fpt-shop",
    provider: "AccessTrade",
    rate: 2,
    category: "Công nghệ",
    note: "Phụ kiện và thiết bị thông minh.",
    updated: "Hôm qua",
    updatedRank: 1,
  },
];

export type Voucher = {
  id: string;
  storeSlug: string;
  title: string;
  discount: string;
  code: string;
  minSpend: string;
  expires: string;
  type: "Giảm tiền" | "Giảm %" | "Freeship";
};

export const vouchers: Voucher[] = [
  {
    id: "v-1",
    storeSlug: "shopee",
    title: "Giảm 100.000đ cho đơn thời trang",
    discount: "GIẢM 100K",
    code: "SPFASHION100",
    minSpend: "Đơn từ 500.000đ",
    expires: "30/09/2026",
    type: "Giảm tiền",
  },
  {
    id: "v-2",
    storeSlug: "shopee",
    title: "Freeship toàn quốc",
    discount: "FREESHIP",
    code: "SPFREESHIP",
    minSpend: "Đơn từ 150.000đ",
    expires: "15/09/2026",
    type: "Freeship",
  },
  {
    id: "v-3",
    storeSlug: "lazada",
    title: "Giảm 10% tối đa 150.000đ",
    discount: "GIẢM 10%",
    code: "LZ10OFF",
    minSpend: "Đơn từ 300.000đ",
    expires: "28/09/2026",
    type: "Giảm %",
  },
  {
    id: "v-4",
    storeSlug: "tiki",
    title: "Giảm 80.000đ cho khách hàng mới",
    discount: "GIẢM 80K",
    code: "TIKINEW80",
    minSpend: "Đơn từ 400.000đ",
    expires: "20/09/2026",
    type: "Giảm tiền",
  },
  {
    id: "v-5",
    storeSlug: "agoda",
    title: "Giảm 8% đặt phòng quốc tế",
    discount: "GIẢM 8%",
    code: "AGODA8INT",
    minSpend: "Không yêu cầu tối thiểu",
    expires: "31/10/2026",
    type: "Giảm %",
  },
  {
    id: "v-6",
    storeSlug: "traveloka",
    title: "Giảm 300.000đ combo du lịch",
    discount: "GIẢM 300K",
    code: "TVLCOMBO300",
    minSpend: "Đơn từ 3.000.000đ",
    expires: "05/10/2026",
    type: "Giảm tiền",
  },
  {
    id: "v-7",
    storeSlug: "tiktok-shop",
    title: "Giảm 50.000đ ngành hàng làm đẹp",
    discount: "GIẢM 50K",
    code: "TTBEAUTY50",
    minSpend: "Đơn từ 250.000đ",
    expires: "18/09/2026",
    type: "Giảm tiền",
  },
  {
    id: "v-8",
    storeSlug: "nike",
    title: "Giảm 15% cho sneaker nguyên giá",
    discount: "GIẢM 15%",
    code: "NIKE15",
    minSpend: "Đơn từ 1.500.000đ",
    expires: "25/09/2026",
    type: "Giảm %",
  },
  {
    id: "v-9",
    storeSlug: "canva",
    title: "Giảm 30% gói Canva Pro năm đầu",
    discount: "GIẢM 30%",
    code: "CANVAPRO30",
    minSpend: "Tài khoản đăng ký mới",
    expires: "31/12/2026",
    type: "Giảm %",
  },
  {
    id: "v-10",
    storeSlug: "fpt-shop",
    title: "Giảm 200.000đ khi mua laptop",
    discount: "GIẢM 200K",
    code: "FPTLAP200",
    minSpend: "Đơn từ 10.000.000đ",
    expires: "30/09/2026",
    type: "Giảm tiền",
  },
];

export const popularSearches = [
  "Shopee cashback",
  "Lazada cashback",
  "Agoda cashback",
  "iPhone",
  "Nike",
  "Booking",
  "Canva",
  "TikTok Shop",
];

export const searchExamples = ["Shopee", "Nike Air Force 1", "Agoda", "iPhone", "Booking", "Canva"];

export type PriceRow = {
  storeSlug: string;
  price: number;
  voucher: number;
  voucherLabel: string;
  cashback: number;
};

export const compareProduct = {
  name: "Nike Air Force 1 '07",
  note: "Giày sneaker nam/nữ, màu trắng, size 36–45",
  rows: [
    {
      storeSlug: "shopee",
      price: 2599000,
      voucher: 100000,
      voucherLabel: "-100.000đ",
      cashback: 5,
    },
    { storeSlug: "lazada", price: 2549000, voucher: 50000, voucherLabel: "-50.000đ", cashback: 4 },
    { storeSlug: "tiki", price: 2599000, voucher: 80000, voucherLabel: "-80.000đ", cashback: 3 },
    { storeSlug: "nike", price: 2749000, voucher: 0, voucherLabel: "Không có", cashback: 8 },
  ] as PriceRow[],
};
