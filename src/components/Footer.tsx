import { siteConfig } from "~/constants/client/site";


export const Footer: React.FC = () => {

    return (
        <footer className={`${siteConfig.colors.footer}`}>
            <div className="container">
                <div className="flex h-20 items-center justify-between py-6">
                    <div className={`flex gap-6 md:gap-10 ${siteConfig.colors.footerText}`}>
                        <p>Footer comes here</p>
                        <p>item 2</p>
                        <p>item 3</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};
