import Nav_Dashboard from '../components/Nav_Dashboard';
import Nav_Top from '../components/Nav_Top';
import './Privacy-Dashboard.scss';
import { useTranslation } from 'react-i18next';



function Privacy_Dashboard() {
    const { t, i18n } = useTranslation();
    return (
        <div >

            <Nav_Top buttonText={t('GobackDashboard')} page={t("PrivacyPolicy")} />
            <div className='body_pravicy_dashboard'>
                <p>
                    {t('Prag1')}
                </p>
                <h1>{t('h1')}</h1>
                <p>
                    {t('Prag2')}
                </p>
                <h1>{t('h2')}</h1>
                <p>
                    {t('Prag3')}
                </p>
                <h1>{t('h3')}</h1>
                <p>
                    {t('Prag4')}
                </p>
                <h1>{t('h4')}</h1>
                <p>
                    {t('Prag5')}
                </p>

            </div>
        </div>

    );
}

export default Privacy_Dashboard;