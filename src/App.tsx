import React from "react";
import './App.css';
import { useTranslation } from 'react-i18next';
import { useLocaleRouting } from './utils/locale';
import { useThemeMode } from './utils/theme';
import { useDocumentTitle } from './utils/useDocumentTitle';

import {
  makeStyles,
  Button,
  Title3,
  Body1,
  Caption1Strong,
  tokens,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  Badge,
  Card,
  CardHeader,
  Link,
} from "@fluentui/react-components";

import { 
  GlobeColor, 
  LocationArrowRegular, 
  DarkThemeRegular, 
  WeatherSunnyRegular, 
  WeatherMoonRegular, 
  HatGraduationRegular, 
  PersonHeartRegular, 
  NotebookRegular, 
  PersonMailRegular, 
  ChatMultipleCheckmarkFilled,
  ChatMultipleFilled,
  VehicleSubwayFilled,
  AirplaneTakeOffRegular,
  PaymentWirelessRegular,
  PersonWalkingRegular,
  AnimalPawPrintRegular,
  ScanCameraFilled,
  GlobeLocationRegular
} from "@fluentui/react-icons";

const useStyles = makeStyles({
  name: {
    fontWeight: tokens.fontWeightSemibold,
    margin: "0",
    background: `#0057b8`,
    color: 'white',
    borderRadius: '4px',
    padding: '0 8px',
    display: 'inline-block',
  },
  actionRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  sectionLabel: {
    color: tokens.colorNeutralForeground3,
    letterSpacing: '0.4px',
  },
  badgeGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    alignItems: 'center',
  },
  beentoSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  beentoList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  beentoItem: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: '6px',
  },
  beentoPlaces: {
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase200,
  },
});

const ThemeToggle: React.FC = () => {
  const { t } = useTranslation();
  const { mode, cycleMode } = useThemeMode();
  const icon = mode === 'auto' ? <DarkThemeRegular /> : mode === 'light' ? <WeatherSunnyRegular /> : <WeatherMoonRegular />;
  const modeLabel = t(`theme.${mode}`);
  return (
    <Button 
      appearance="outline" 
      onClick={cycleMode} 
      icon={icon} 
      aria-label={`${t('theme.toggle')}: ${modeLabel}`}
    />
  );
};

const App: React.FC = () => {
  useDocumentTitle();
  const styles = useStyles();
  const { t } = useTranslation();
  const { locale, changeLocale } = useLocaleRouting();

  const localeLabels = {
    'zh-CN': '简体中文',
    'zh-TW': '繁體中文',
    'en-US': 'English',
  };

  return (
    <div className="container">
      <Card>
        <CardHeader
          header={
            <Title3 as="h1" className={styles.name}>
              {t('name')}
            </Title3>
          }
          action={
            <div className={styles.actionRow}>
              <Menu>
                <MenuTrigger disableButtonEnhancement>
                  <Button
                    appearance="outline"
                    icon={<GlobeColor />}
                    aria-label={t('common.switchLanguage')}
                  >
                    {localeLabels[locale] || 'English'}
                  </Button>
                </MenuTrigger>
                <MenuPopover>
                  <MenuList>
                    <MenuItem onClick={() => changeLocale('zh-CN')}>简体中文</MenuItem>
                    <MenuItem onClick={() => changeLocale('zh-TW')}>繁體中文</MenuItem>
                    <MenuItem onClick={() => changeLocale('en-US')}>English</MenuItem>
                  </MenuList>
                </MenuPopover>
              </Menu>
              <ThemeToggle />
            </div>
          }
        />

        <div className={styles.content}>
          <Body1>{t('header.description')}</Body1>

          {/* Profile info */}
          <div className={styles.badgeGroup}>
            <Badge appearance="ghost" shape="rounded" size="medium" color="important" icon={<PersonWalkingRegular />}>
              {t('header.born')}
            </Badge>
            <Badge appearance="ghost" shape="rounded" size="medium" icon={<PersonHeartRegular />} color="danger">
              {t('header.home')}
            </Badge>
            <Badge appearance="ghost" shape="rounded" size="medium" icon={<LocationArrowRegular />} color="brand">
              {t('header.location')}
            </Badge>
            <Link href="https://www.fjsmu.edu.cn" target="_blank" rel="nofollow">
              <Badge appearance="ghost" shape="rounded" size="medium" icon={<HatGraduationRegular />} color="success">
                {t('header.education')}
              </Badge>
            </Link>
            <Badge appearance="ghost" shape="rounded" size="medium" icon={<NotebookRegular />} color="warning">
              {t('header.major')}
            </Badge>
          </div>

          {/* Contact */}
          <div className={styles.badgeGroup}>
            <Link href="mailto:hi@zaochih.com" target="_blank">
              <Badge appearance="ghost" shape="rounded" size="medium" color="important" icon={<PersonMailRegular />}>hi#zaochih.com</Badge>
            </Link>
            <Link href="https://x.com/zaochih" target="_blank">
              <Badge appearance="ghost" shape="rounded" size="medium" color="brand" icon={<><svg xmlns="http://www.w3.org/2000/svg" width="14.7px" height="12px" viewBox="0 0 256 209"><path fill="#55acee" d="M256 25.45a105 105 0 0 1-30.166 8.27c10.845-6.5 19.172-16.793 23.093-29.057a105.2 105.2 0 0 1-33.351 12.745C205.995 7.201 192.346.822 177.239.822c-29.006 0-52.523 23.516-52.523 52.52c0 4.117.465 8.125 1.36 11.97c-43.65-2.191-82.35-23.1-108.255-54.876c-4.52 7.757-7.11 16.78-7.11 26.404c0 18.222 9.273 34.297 23.365 43.716a52.3 52.3 0 0 1-23.79-6.57q-.004.33-.003.661c0 25.447 18.104 46.675 42.13 51.5a52.6 52.6 0 0 1-23.718.9c6.683 20.866 26.08 36.05 49.062 36.475c-17.975 14.086-40.622 22.483-65.228 22.483c-4.24 0-8.42-.249-12.529-.734c23.243 14.902 50.85 23.597 80.51 23.597c96.607 0 149.434-80.031 149.434-149.435q0-3.417-.152-6.795A106.8 106.8 0 0 0 256 25.45"/></svg></>}>@zaochih</Badge>
            </Link>
            <Link href="https://linkedin.com/in/caozhi-li" target="_blank">
              <Badge appearance="ghost" shape="rounded" size="medium" color="brand" icon={<svg xmlns="http://www.w3.org/2000/svg" width="48px" height="12px" viewBox="0 0 512 128"><path fill="#0a66c2" d="m202.057 74.971l28.252 34.743H208l-25.143-31.908v31.908h-18.286V18.286h18.286v53.76l23.223-26.332h23.314zm-73.143-31.085a24.78 24.78 0 0 0-20.205 10.971v-9.143h-17.28v64h18.285V79.817a15.91 15.91 0 0 1 15.177-17.646c10.606 0 12.252 10.423 12.252 17.646v29.897h18.286v-33.92c0-20.114-6.675-31.908-26.149-31.908zm163.657 35.291q.105 2.011 0 4.023h-48v.64a16.366 16.366 0 0 0 16.732 13.074a22.95 22.95 0 0 0 16.823-6.308l12.16 9.143a39.4 39.4 0 0 1-29.715 11.794a31.91 31.91 0 0 1-33.828-34.286a32.73 32.73 0 0 1 34.377-33.371c17.189 0 31.451 12.16 31.451 35.291m-17.005-7.863a13.35 13.35 0 0 0-14.537-12.8c-8.04-.869-15.321 4.794-16.458 12.8zM18.286 18.286H0v91.428h54.857V91.43H18.286zm329.143 0h18.285v91.428h-17.28v-6.4a22.31 22.31 0 0 1-18.285 8.229a31.177 31.177 0 0 1-30.263-33.829a30.72 30.72 0 0 1 30.171-33.828a23.95 23.95 0 0 1 17.372 6.4zm1.371 59.428A14.903 14.903 0 0 0 333.989 60.8c-8.747.635-15.375 8.157-14.903 16.914c-.472 8.757 6.156 16.28 14.903 16.915A14.903 14.903 0 0 0 348.8 77.714M73.143 16.457A11.61 11.61 0 0 0 61.714 27.43c0 6.311 5.117 11.428 11.429 11.428S84.57 33.74 84.57 27.43a11.61 11.61 0 0 0-11.428-10.972M64 109.714h18.286v-64H64zM512 9.143v109.714a9.143 9.143 0 0 1-9.143 9.143H393.143a9.143 9.143 0 0 1-9.143-9.143V9.143A9.143 9.143 0 0 1 393.143 0h109.714A9.143 9.143 0 0 1 512 9.143m-91.429 36.571h-18.285v64h18.285zm2.286-18.285c0-6.312-5.117-11.429-11.428-11.429S400 21.117 400 27.429c0 6.311 5.117 11.428 11.429 11.428c6.311 0 11.428-5.117 11.428-11.428m70.857 48.365c0-20.114-6.674-31.908-26.148-31.908a24.78 24.78 0 0 0-20.572 10.971v-9.143h-17.28v64H448V79.817a15.91 15.91 0 0 1 15.177-17.646c10.606 0 12.252 10.423 12.252 17.646v29.897h18.285z"/></svg>}>in/caozhi-li</Badge>
            </Link>
          </div>

          {/* Languages */}
          <div className={styles.badgeGroup}>
            <Badge appearance="ghost" shape="rounded" size="medium" icon={<ChatMultipleCheckmarkFilled />} color="brand">
              {t('header.zh-CN')}
            </Badge>
            <Badge appearance="ghost" shape="rounded" size="medium" icon={<ChatMultipleFilled />} color="informative">
              {t('header.en-US')}
            </Badge>
          </div>

          {/* Interests */}
          <div className={styles.badgeGroup}>
            <Badge appearance="ghost" shape="rounded" size="medium" icon={<VehicleSubwayFilled />} color="brand">
              {t('header.railTransitEnthusiast')}
            </Badge>
            <Badge appearance="ghost" shape="rounded" size="medium" icon={<AirplaneTakeOffRegular />} color="informative">
              {t('header.flightEnthusiast')}
            </Badge>
            <Badge appearance="ghost" shape="rounded" size="medium" icon={<PaymentWirelessRegular />} color="warning">
              {t('header.ham')}
            </Badge>
            <Badge appearance="ghost" shape="rounded" size="medium" icon={<ScanCameraFilled />} color="success">
              {t('header.photography')}
            </Badge>
            <Badge appearance="ghost" shape="rounded" size="medium" icon={<GlobeLocationRegular />} color="important">
              {t('header.geo')}
            </Badge>
            <Badge appearance="ghost" shape="rounded" size="medium" icon={<AnimalPawPrintRegular />} color="danger">
              {t('header.furry')}
            </Badge>
          </div>

          {/* Been to */}
          <div className={styles.beentoSection}>
            <Caption1Strong className={styles.sectionLabel}>{t('header.beento')}</Caption1Strong>
            <div className={styles.beentoList}>
              {(
                [
                  { key: 'henan', color: 'brand' },
                  { key: 'chongqing', color: 'danger' },
                  { key: 'sichuan', color: 'brand' },
                  { key: 'shandong', color: 'informative' },
                  { key: 'shaanxi', color: 'informative' },
                  { key: 'beijing', color: 'informative' },
                  { key: 'hubei', color: 'informative' },
                  { key: 'shanghai', color: 'informative' },
                  { key: 'fujian', color: 'informative' },
                  { key: 'guangdong', color: 'informative' },
                  { key: 'hksar', color: 'informative' },
                ] as const
              ).map(({ key, color }) => (
                <div key={key} className={styles.beentoItem}>
                  <Badge appearance="tint" shape="rounded" size="medium" color={color}>
                    {t(`${key}.name`)}
                  </Badge>
                  <span className={styles.beentoPlaces}>{t(`${key}.places`)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default App;
