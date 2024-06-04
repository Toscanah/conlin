"use client";

import { useState } from "react";
import { CaretRight, CaretLeft } from "@phosphor-icons/react";

import RidersPageButton from "../RidersPageButton";
import ChangeParamsDialog from "../ChangeParams";
import SessionsPageButton from "../SessionsPageButton";
import Logout from "../Logout";

export default function Sidebar() {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div
      className={`flex gap-2 text-4xl fixed items-center select-none
    left-0 top-1/2 transform -translate-y-1/2
    transition-transform duration-500 
    ${isVisible ? "translate-x-0" : "-translate-x-[72.5%]"}
    hover:cursor-pointer bg-foreground/5 p-2 rounded-r-xl h-[210px]
    `}
    >
      <div className={`w-[130px] ${isVisible ? "" : ""}`}>
        <RidersPageButton />
        <SessionsPageButton />
        <ChangeParamsDialog />
        <Logout />
      </div>
      <div
        className="bg-foreground text-background h-full rounded-r-xl flex items-center p-1 group"
        onClick={() => setIsVisible(!isVisible)}
      >
        <CaretRight
          size={40}
          className={`hover:cursor-pointer p-1 rounded-full transform transition-transform duration-500 group-hover:bg-background/10 ${
            isVisible ? "rotate-[540deg]" : "rotate-0"
          }`}
        />
      </div>
    </div>
  );
}
