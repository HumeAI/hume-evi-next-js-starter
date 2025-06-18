"use client";

import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";
import Github from "./logos/GitHub";
import pkg from "@/package.json";
import { useTheme } from "next-themes";

export const Nav = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div
      className={"fixed top-0 right-0 px-4 py-2 flex items-center h-14 z-50"}
    >
      <div className={"ml-auto flex items-center gap-1"}>
        <Button
          onClick={() => {
            window.open(pkg.homepage, "_blank", "noopener noreferrer");
          }}
          variant={"ghost"}
          className={"ml-auto flex items-center gap-1.5 rounded-full"}
        >
          <span>
            <Github className={"size-4"} />
          </span>
          <span>Star on GitHub</span>
        </Button>
        <Button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          variant={"ghost"}
          className={"ml-auto flex items-center gap-1.5 rounded-full"}
        >
          <span>
            {theme === "dark" ? (
              <Sun className={"size-4"} />
            ) : (
              <Moon className={"size-4"} />
            )}
          </span>
          <span>{theme === 'dark' ? "Light" : "Dark"} Mode</span>
        </Button>
      </div>
    </div>
  );
};
