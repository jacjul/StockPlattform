import { useEffect, useState } from "react"
import BalanceSheet from "../components/tutorial/BalanceSheet"
import CashFlowStatement from "../components/tutorial/CashFlowStatement"
import FinancialRatios from "../components/tutorial/FinancialRatios"
import IncomeStatement from "../components/tutorial/IncomeStatement"

const FundamentalsTutorial = () => {
  const [selectedCompany, setSelectedCompany] = useState<string>(() => {
    return localStorage.getItem("fundamentals:selectedCompany") ?? ""
  })
    const [stepFundamental, setStepFundamental] = useState<number>(0)

  useEffect(() => {
    if (!selectedCompany) return
    localStorage.setItem("fundamentals:selectedCompany", selectedCompany)
  }, [selectedCompany])

  return (
    <div>
    {stepFundamental === 0 && (
      <IncomeStatement
        setStepFundamental={setStepFundamental}
        selectedCompany={selectedCompany}
        setSelectedCompany={setSelectedCompany}
      />
    )}
        {stepFundamental ===1 &&<BalanceSheet setStepFundamental={setStepFundamental} />}
        {stepFundamental ===2 &&<CashFlowStatement setStepFundamental={setStepFundamental} />}
        {stepFundamental ===3 &&<FinancialRatios setStepFundamental={setStepFundamental} />}
    </div>
  )
}

export default FundamentalsTutorial