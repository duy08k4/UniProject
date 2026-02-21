import styled from 'styled-components';

import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

export function useTheme() {
    const [theme, setTheme] = useState<Theme>(() => {
        return (localStorage.getItem("theme") as Theme) || "light";
    });

    useEffect(() => {
        const root = document.documentElement;

        const isDark =
            theme === "dark" ||
            (theme === "system" &&
                window.matchMedia("(prefers-color-scheme: dark)").matches);

        if (isDark) {
            root.setAttribute("data-theme", "dark");
        } else {
            root.setAttribute("data-theme", "light");
        }

        if (theme === "system") {
            localStorage.removeItem("theme");
        } else {
            localStorage.setItem("theme", theme);
        }
    }, [theme]);

    return { theme, setTheme };
}

const ToggleTheme = () => {
    const { theme, setTheme } = useTheme();

    const toggle = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    return (
        <div className='flex items-center-safe gap-2.5'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`size-6 ${theme === "dark" ? "fill-white" : ""}`}>
                <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.758 17.303a.75.75 0 0 0-1.061-1.06l-1.591 1.59a.75.75 0 0 0 1.06 1.061l1.591-1.59ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.697 7.757a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 0 0-1.061 1.06l1.59 1.591Z" />
            </svg>

            <StyledWrapper>
                <label className="switch">
                    <input type="checkbox" className="checkbox" onChange={toggle} checked={theme === "dark"} />
                    <div className="slider" />
                </label>
            </StyledWrapper>

            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`size-4 ${theme === "dark" ? "fill-white" : ""}`}>
                <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z" clipRule="evenodd" />
            </svg>
        </div>
    );
}

const StyledWrapper = styled.div`
  .checkbox {
    display: none;
  }

  .slider {
    width: 60px;
    height: 30px;
    background-color: lightgray;
    border-radius: 20px;
    overflow: hidden;
    display: flex;
    align-items: center;
    border: 4px solid transparent;
    transition: .3s;
    box-shadow: 0 0 10px 0 rgb(0, 0, 0, 0.25) inset;
    cursor: pointer;
  }

  .slider::before {
    content: '';
    display: block;
    width: 100%;
    height: 100%;
    background-color: #fff;
    transform: translateX(-30px);
    border-radius: 20px;
    transition: .3s;
    box-shadow: 0 0 10px 3px rgb(0, 0, 0, 0.25);
  }

  .checkbox:checked ~ .slider::before {
    transform: translateX(30px);
    box-shadow: 0 0 10px 3px rgb(0, 0, 0, 0.25);
  }

  .checkbox:checked ~ .slider {
    background-color: #499C40;
  }

  .checkbox:active ~ .slider::before {
    transform: translate(0);
  }`;

export default ToggleTheme;
