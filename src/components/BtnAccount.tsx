import { useSession } from 'next-auth/react';
import Link from 'next/link';


export const BtnAccount: React.FC = () => {
    const { data: sessionData } = useSession();

    return (
        <>
            {sessionData && 
            <Link
                href="/account"
            >
                <button className="bg-white p-3 hover:bg-yellow-500">
                    Account
                </button>
            </Link>
            }
        </>
    )
}
