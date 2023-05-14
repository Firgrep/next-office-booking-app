import React from 'react';
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
                <button style={{backgroundColor: "white", padding: "20px"}}>
                    Account
                </button>
            </Link>
            }
        </>
    )
}
