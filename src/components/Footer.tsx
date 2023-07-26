import { siteConfig } from "~/constants/client/site";


export const Footer: React.FC = () => {

    return (
        <footer className={`${siteConfig.colors.footer}`}>
            <div className="container">
                <div className="flex h-20 py-16 items-center justify-between py-6">
                    <div className={`flex justify-between flex-wrap gap-6 md:gap-10 ${siteConfig.colors.footerText}`}>
                        <p>Business</p>
                        <p>Leadership</p>
                        <p>Innovation</p>
                        <p>Ideas</p>
                        <a href="https://www.filipniklas.com/" target="_blank"><p>Made by Filip Niklas</p></a>
                        <a href="https://github.com/Firgrep/next-office-booking-app" target="_blank"><p>💾 GitHub</p></a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
