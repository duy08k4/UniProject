import type React from "react"
import { Outlet } from "react-router-dom"


// Assets
import UniLogo from "../assets/UniLogo.png"

const LandingPageLayout: React.FC = () => {
    return (
        <div className="">
            {/* Header */}
            <header className="">
                <a href="/">
                    <img src={UniLogo} loading="lazy" />
                </a>

                <nav>asdsad</nav>
            </header>

            {/* Body */}
            <div className="">
                <Outlet />
            </div>
        </div>
    )
}

export default LandingPageLayout