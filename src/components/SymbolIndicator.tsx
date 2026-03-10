import React from 'react'
import { FaAngleUp,FaAngleDown,FaAnglesDown,FaAnglesUp } from "react-icons/fa6";
type Direction="up_much" |"up" |"down" |"down_much"
type SymbolIndicatorProps ={
    direction :Direction 

}
const SymbolIndicator = ({direction}:SymbolIndicatorProps) => {

  return (
    <div className="hidden justify-self-center md:block">
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-600/80 bg-slate-800/90">
        {direction ==="up_much" && <FaAnglesUp className="text-emerald-400"/> }
        {direction ==="up"&& <FaAngleUp className="text-emerald-400"/> }
        {direction ==="down_much" && <FaAnglesDown className="text-rose-400"/> }
        {direction ==="down"&& <FaAngleDown className="text-rose-400"/> }
      </span>
    </div >
  )
}

export default SymbolIndicator