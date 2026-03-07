import React from 'react'
import { Progress, Empty } from "antd"
import './Analytics.css'

const Analytics = ({alltransaction}) => {
    // Validation: Check if data exists
    if (!alltransaction || !Array.isArray(alltransaction)) {
        return (
            <div className="analytics-container">
                <div className="analytics-card">
                    <div className="card-header">Analytics</div>
                    <div className="card-body">
                        <Empty 
                            description="No transaction data available"
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                    </div>
                </div>
            </div>
        )
    }

    // Validation: Check if there are any transactions
    if (alltransaction.length === 0) {
        return (
            <div className="analytics-container">
                <div className="analytics-card">
                    <div className="card-header">Analytics</div>
                    <div className="card-body">
                        <Empty 
                            description="No transactions to analyze. Add some transactions to see insights!"
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                    </div>
                </div>
            </div>
        )
    }

    // CATEGORY
    const categories = ["salary","tip","project","food","movie","bills","medical","fee","tax"]

    // total transactions
    const totaltransaction = alltransaction.length
    const totalincomeTransactions = alltransaction.filter(transction=> transction.type === "income")
    const totalexpenseTransactions = alltransaction.filter(transction=> transction.type === "expense")
    
    // Validation: Calculate percentages safely
    const totalIncomePercent = totaltransaction > 0 ? (totalincomeTransactions.length/totaltransaction)*100 : 0
    const totalExpensePercent = totaltransaction > 0 ? (totalexpenseTransactions.length/totaltransaction)*100 : 0

    // total turnover
    const totalturnover = alltransaction.reduce((acc,transction)=> acc+transction.amount,0)
    const totalIncomeTurnover = alltransaction.filter(transaction => transaction.type === "income").reduce((acc,transaction)=>acc+transaction.amount,0)
    const totalExpenseTurnover = alltransaction.filter(transaction => transaction.type === "expense").reduce((acc,transaction)=>acc+transaction.amount,0)

    // Validation: Calculate turnover percentages safely
    const totalIncomeTurnoverPercent = totalturnover > 0 ? (totalIncomeTurnover/totalturnover)*100 : 0
    const totalExpenseTurnoverPercent = totalturnover > 0 ? (totalExpenseTurnover/totalturnover)*100 : 0

    // Validation: Format currency safely
    const formatCurrency = (amount) => {
        if (typeof amount !== 'number' || isNaN(amount)) {
            return '₹0'
        }
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount)
    }

    // Validation: Format percentage safely
    const formatPercentage = (value) => {
        if (typeof value !== 'number' || isNaN(value)) {
            return '0.0'
        }
        return value.toFixed(1)
    }

    // Validation: Get category data safely
    const getCategoryData = (type) => {
        return categories.map((category) => {
            const amount = alltransaction
                .filter((transaction) => 
                    transaction.type === type && 
                    transaction.category === category &&
                    typeof transaction.amount === 'number' &&
                    !isNaN(transaction.amount)
                )
                .reduce((acc, transaction) => acc + transaction.amount, 0)
            
            return {
                category,
                amount,
                percentage: type === 'income' && totalIncomeTurnover > 0 
                    ? (amount / totalIncomeTurnover) * 100 
                    : type === 'expense' && totalExpenseTurnover > 0 
                    ? (amount / totalExpenseTurnover) * 100 
                    : 0
            }
        }).filter(item => item.amount > 0)
    }

    const incomeCategories = getCategoryData('income')
    const expenseCategories = getCategoryData('expense')

    return (
        <div className="analytics-container">
            <div className="analytics-grid">
                {/* Total Transactions Card */}
                <div className="analytics-card">
                    <div className="glass-shine"></div>
                    <div className="card-header">
                        Total Transactions
                    </div>
                    <div className="card-body">
                        <div className="stat-row">
                            <div>
                                <span className="stat-label">Income</span>
                                <span className="stat-value">{totalincomeTransactions.length}</span>
                            </div>
                            <div>
                                <span className="stat-label">Expense</span>
                                <span className="stat-value">{totalexpenseTransactions.length}</span>
                            </div>
                        </div>
                        <div className="progress-container">
                            <div className="progress-item">
                                <span className="progress-label">{formatPercentage(totalIncomePercent)}%</span>
                                <Progress 
                                    type="circle" 
                                    strokeColor="#52c41a"
                                    trailColor="rgba(82, 196, 26, 0.2)"
                                    percent={parseFloat(formatPercentage(totalIncomePercent))} 
                                />
                            </div>
                            <div className="progress-item">
                                <span className="progress-label">{formatPercentage(totalExpensePercent)}%</span>
                                <Progress 
                                    type="circle" 
                                    strokeColor="#ff4d4f"
                                    trailColor="rgba(255, 77, 79, 0.2)"
                                    percent={parseFloat(formatPercentage(totalExpensePercent))} 
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Total Turnover Card */}
                <div className="analytics-card">
                    <div className="glass-shine"></div>
                    <div className="card-header">
                        Total Turnover
                    </div>
                    <div className="card-body">
                        <div className="stat-row">
                            <div>
                                <span className="stat-label">Income</span>
                                <span className="stat-value">{formatCurrency(totalIncomeTurnover)}</span>
                            </div>
                            <div>
                                <span className="stat-label">Expense</span>
                                <span className="stat-value">{formatCurrency(totalExpenseTurnover)}</span>
                            </div>
                        </div>
                        <div className="progress-container">
                            <div className="progress-item">
                                <span className="progress-label">{formatPercentage(totalIncomeTurnoverPercent)}%</span>
                                <Progress 
                                    type="circle" 
                                    strokeColor="#52c41a"
                                    trailColor="rgba(82, 196, 26, 0.2)"
                                    percent={parseFloat(formatPercentage(totalIncomeTurnoverPercent))} 
                                />
                            </div>
                            <div className="progress-item">
                                <span className="progress-label">{formatPercentage(totalExpenseTurnoverPercent)}%</span>
                                <Progress 
                                    type="circle" 
                                    strokeColor="#ff4d4f"
                                    trailColor="rgba(255, 77, 79, 0.2)"
                                    percent={parseFloat(formatPercentage(totalExpenseTurnoverPercent))} 
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Categorywise Income */}
            {incomeCategories.length > 0 && (
                <div className="category-section">
                    <div className="category-header">
                        Categorywise Income
                    </div>
                    <div className="category-grid">
                        {incomeCategories.map((item, index) => (
                            <div className="category-card" key={`income-${item.category}-${index}`}>
                                <div className="category-name">{item.category}</div>
                                <div className="category-amount">{formatCurrency(item.amount)}</div>
                                <Progress 
                                    type="circle" 
                                    strokeColor="#52c41a"
                                    trailColor="rgba(82, 196, 26, 0.2)"
                                    percent={parseFloat(formatPercentage(item.percentage))} 
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Categorywise Expense */}
            {expenseCategories.length > 0 && (
                <div className="category-section">
                    <div className="category-header">
                        Categorywise Expense
                    </div>
                    <div className="category-grid">
                        {expenseCategories.map((item, index) => (
                            <div className="category-card" key={`expense-${item.category}-${index}`}>
                                <div className="category-name">{item.category}</div>
                                <div className="category-amount">{formatCurrency(item.amount)}</div>
                                <Progress 
                                    type="circle" 
                                    strokeColor="#ff4d4f"
                                    trailColor="rgba(255, 77, 79, 0.2)"
                                    percent={parseFloat(formatPercentage(item.percentage))} 
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* No categories message */}
            {incomeCategories.length === 0 && expenseCategories.length === 0 && (
                <div className="analytics-card">
                    <div className="card-header">Categories</div>
                    <div className="card-body">
                        <Empty 
                            description="No categorized transactions found"
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export default Analytics