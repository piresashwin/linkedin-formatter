import { SessionProvider } from 'next-auth/react'
import React from 'react'

const layout = ({ children }: any) => {
    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    )
}

export default layout