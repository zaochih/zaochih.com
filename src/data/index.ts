import type { AnyIconName } from '../icons';

export const LOCALES = ['zh-CN', 'zh-TW', 'en-US'] as const;
export type Locale = (typeof LOCALES)[number];

export const SITE_URL = 'https://about.zaochih.com';

export const LOCALE_LABELS: Record<Locale, string> = {
  'zh-CN': '简体中文',
  'zh-TW': '繁體中文',
  'en-US': 'English',
};

export interface Bio {
  /**
   * The bio sentence, with `<b>…</b>` around a term to bold it and
   * `<a href="…">…</a>` around a term to link it.
   */
  template: string;
}

export interface LanguageEntry {
  name: string;
  level: string;
}

export interface ContactLink {
  /** Screen-reader/reader-mode-only platform label prepended to the text (visually hidden — the icon carries this for sighted users). Needed whenever `text` alone doesn't say which platform it is (e.g. two bare "@handle" entries); omit when the text/format is already self-evident (e.g. LinkedIn's `in/`). */
  name?: string;
  /** Icon rendered before the text/name. Omit when there's no suitable non-brand icon. */
  icon?: AnyIconName;
  /** Accessible label for the link (aria-label). */
  alt: string;
  href: string;
  /** Visible handle/address. */
  text: string;
}

export interface ProfileContent {
  documentTitle: string;
  /** Plain-text summary for <meta name="description">, og:description, twitter:description — no rich-text tags. */
  description: string;
  handle: string;
  eyebrows: {
    languages: string;
    tags: string;
    beento: string;
  };
  tagline: string;
  bio: Bio;
  contact: ContactLink[];
  languages: LanguageEntry[];
  tags: string[];
  beento: string[];
  footer: { text: string; href: string };
}

const footer = {
  text: 'github.com/zaochih/zaochih.com',
  href: 'https://github.com/zaochih/zaochih.com',
};

export const profile: Record<Locale, ProfileContent> = {
  'zh-CN': {
    documentTitle: '草纸',
    description:
      '双非二本新工科大二学生，生于河南、长于重庆、现居福建，计算机科学与技术专业。',
    handle: '@zaochih',
    eyebrows: {
      languages: '语言',
      tags: '标签',
      beento: '已点亮地区',
    },
    tagline: '双非二本新工科大二学生',
    bio: {
      template:
        '生于 <b>河南</b>，长于 <b>重庆</b>，现暂居 <b>福建</b>。计算机科学与技术专业。',
    },
    contact: [
      {
        icon: 'rss',
        alt: '博客',
        href: 'https://blog.licaoz.com',
        text: '博客',
      },
      {
        icon: 'mail',
        alt: '邮箱',
        href: 'mailto:hi@zaochih.com',
        text: 'hi#zaochih.com',
      },
      {
        name: 'Twitter',
        icon: 'twitter',
        alt: 'Twitter',
        href: 'https://x.com/zaochih',
        text: '@zaochih',
      },
      {
        name: 'GitHub',
        icon: 'github',
        alt: 'GitHub',
        href: 'https://github.com/zaochih',
        text: '@zaochih',
      },
      {
        icon: 'linkedin',
        alt: '领英',
        href: 'https://linkedin.com/in/caozhi-li',
        text: 'in/caozhi-li',
      },
    ],
    languages: [
      { name: '普通话', level: '母语，二甲' },
      { name: '英语', level: '中级，B1' },
    ],
    tags: [
      '轨道交通爱好者',
      '半吊子飞友',
      '业余无线电 A 证<code>BG8LYE</code>',
      '随便拍拍',
      '地理高考生',
      '当心福瑞控！',
      '<rainbow>LGBTQ+</rainbow>',
    ],
    beento: [
      '河南',
      '重庆',
      '四川',
      '山东',
      '陕西',
      '北京',
      '湖北',
      '上海',
      '福建',
      '广东',
      '香港',
    ],
    footer,
  },
  'zh-TW': {
    documentTitle: '草紙',
    description:
      '不知名本科新工科大二學生，生於河南、長於重慶、現居福建，資訊工程專業。',
    handle: '@zaochih',
    eyebrows: {
      languages: '語言',
      tags: '標籤',
      beento: '已點亮地區',
    },
    tagline: '不知名本科新工科大二學生',
    bio: {
      template:
        '生於 <b>河南</b>，長於 <b>重慶</b>，現暫居 <b>福建</b>。資訊工程專業。',
    },
    contact: [
      {
        icon: 'mail',
        alt: '電子郵件',
        href: 'mailto:hi@zaochih.com',
        text: 'hi#zaochih.com',
      },
      {
        name: 'Twitter',
        icon: 'twitter',
        alt: 'Twitter',
        href: 'https://x.com/zaochih',
        text: '@zaochih',
      },
      {
        name: 'GitHub',
        icon: 'github',
        alt: 'GitHub',
        href: 'https://github.com/zaochih',
        text: '@zaochih',
      },
      {
        icon: 'linkedin',
        alt: 'LinkedIn',
        href: 'https://linkedin.com/in/caozhi-li',
        text: 'in/caozhi-li',
      },
    ],
    languages: [
      { name: '普通話', level: '母語，二甲' },
      { name: '英語', level: '中級，B1' },
    ],
    tags: [
      '軌道交通愛好者',
      '半吊子飛友',
      '業餘無線電 A 證<code>BG8LYE</code>',
      '隨便拍拍',
      '地理高考生',
      '當心獸人控！',
      '<rainbow>LGBTQ+</rainbow>',
    ],
    beento: [
      '河南',
      '重慶',
      '四川',
      '山東',
      '陝西',
      '北京',
      '湖北',
      '上海',
      '福建',
      '廣東',
      '香港',
    ],
    footer,
  },
  'en-US': {
    documentTitle: 'Zaochih',
    description:
      'Second-year engineering undergraduate born in Henan, raised in Chongqing, now based in Fujian, China — studying Computer Science and Technology.',
    handle: '@zaochih',
    eyebrows: {
      languages: 'Languages',
      tags: 'Tags',
      beento: 'Regions unlocked',
    },
    tagline:
      'Second-year undergraduate in engineering from a non-prestigious university',
    bio: {
      template:
        'Born in <b>Henan</b>, raised in <b>Chongqing</b>, now based in <b>Fujian</b>, China. Studying <b>Computer Science and Technology</b>.',
    },
    contact: [
      {
        icon: 'mail',
        alt: 'Email',
        href: 'mailto:hi@zaochih.com',
        text: 'hi#zaochih.com',
      },
      {
        name: 'Twitter',
        icon: 'twitter',
        alt: 'Twitter',
        href: 'https://x.com/zaochih',
        text: '@zaochih',
      },
      {
        name: 'GitHub',
        icon: 'github',
        alt: 'GitHub',
        href: 'https://github.com/zaochih',
        text: '@zaochih',
      },
      {
        icon: 'linkedin',
        alt: 'LinkedIn',
        href: 'https://linkedin.com/in/caozhi-li',
        text: 'in/caozhi-li',
      },
    ],
    languages: [
      { name: 'Mandarin', level: 'Native, Grade 2 Level A' },
      { name: 'English', level: 'Intermediate, B1' },
    ],
    tags: [
      'Rail Transit Enthusiast',
      'Semi-pro Flight Enthusiast',
      'Amateur Radio License A (BG8LYE)',
      'Casual Photographer',
      'Geography Lover',
      'Furry',
      '<rainbow>LGBTQ+</rainbow>',
    ],
    beento: [
      'Henan',
      'Chongqing',
      'Sichuan',
      'Shandong',
      'Shaanxi',
      'Beijing',
      'Hubei',
      'Shanghai',
      'Fujian',
      'Guangdong',
      'Hong Kong',
    ],
    footer,
  },
};
