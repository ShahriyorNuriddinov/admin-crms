"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
export function DarkMode() {
  const { setTheme } = useTheme();
  const [check, setCheck] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("as");
      setCheck(JSON.parse(saved as string) || false);
    }
  }, []);

  const toggleTheme = () => {
    const newCheck = !check;
    setCheck(newCheck);
    setTheme(newCheck ? "light" : "dark");
    if (typeof window !== "undefined") {
      localStorage.setItem("as", JSON.stringify(newCheck));
    }
  };
  return (
    <>
      <div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            setTheme("light");
            setCheck(!check);
            if (typeof window !== "undefined") {
              localStorage.setItem("as", JSON.stringify(!check));
            }
            toggleTheme();
          }}
          className={` ${!check ? "hidden" : "flex"}`}
        >
          <Moon
            className={` absolute h-[1.2rem] w-[1.2rem]  scale-100 transition-all dark:rotate-0 dark:scale-100`}
          />
        </Button>
        <Button
          className={` ${check ? "hidden" : "flex"}`}
          variant="outline"
          size="icon"
          onClick={() => {
            setTheme("dark");
            setCheck(!check);
            if (typeof window !== "undefined") {
              localStorage.setItem("as", JSON.stringify(!check));
            }
            toggleTheme();
          }}
        >
          <Sun
            className={` h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-100`}
          />
        </Button>
      </div>
    </>
  );
}
