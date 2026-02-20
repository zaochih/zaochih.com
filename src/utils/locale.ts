import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const SUPPORTED_LOCALES = ['zh-CN', 'zh-TW', 'en-US'] as const;
type SupportedLocale = typeof SUPPORTED_LOCALES[number];

export const useLocaleRouting = () => {
  const navigate = useNavigate();
  const { locale } = useParams<{ locale: string }>();
  const { i18n } = useTranslation();

  useEffect(() => {
    if (locale && SUPPORTED_LOCALES.includes(locale as SupportedLocale)) {
      i18n.changeLanguage(locale);
      // 设置 html 的 lang 属性
      if (typeof document !== 'undefined') {
        document.documentElement.lang = locale;
      }
    }
  }, [locale, i18n]);

  const changeLocale = (newLocale: SupportedLocale) => {
    navigate(`/${newLocale}`);
    // 切换路由时同步设置 lang 属性
    if (typeof document !== 'undefined') {
      document.documentElement.lang = newLocale;
    }
  };

  return { locale: locale as SupportedLocale, changeLocale };
};

export const detectPreferredLocale = (): SupportedLocale => {
  const browserLang = navigator.language || navigator.languages?.[0] || 'en-US';
  
  // If browser language starts with 'zh', determine if it's CN or TW
  if (browserLang.startsWith('zh')) {
    if (browserLang.includes('TW') || browserLang.includes('HK') || browserLang.includes('Hant')) {
      return 'zh-TW';
    }
    return 'zh-CN';
  }
  
  // All other languages go to en-US
  return 'en-US';
};

export const isSupportedLocale = (locale: string): locale is SupportedLocale => {
  return SUPPORTED_LOCALES.includes(locale as SupportedLocale);
};
