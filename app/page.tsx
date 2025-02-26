'use client'

import Link from "next/link";

const Home = () => {
    return (
        <div>
            <h1>Assistants</h1>
            <Root />
        </div>
    )
};

const Root = () => {

    return (
        <div>
            <div>
                {/* <Link href="/pages/admin">Admin</Link> */}
                <Link href="/pages/seo">SEO</Link>
            </div>
        </div>
    );
};

export default Home;