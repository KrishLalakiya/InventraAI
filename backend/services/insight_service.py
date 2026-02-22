# services/insight_service.py

def generate_insights(rebalance_data, cashflow_data):
    insights = []

    # Rebalance insights
    for item in rebalance_data:
        if item["action"] == "REORDER":
            insights.append(
                f"{item['product']} is likely to run out soon. "
                f"Recommended to reorder {item['recommended_quantity']} units."
            )
        elif item["action"] == "OVERSTOCK":
            insights.append(
                f"{item['product']} appears overstocked. "
                f"Consider running a discount campaign."
            )

    # Cashflow insights
    efficiency = cashflow_data.get("efficiency_score", 0)

    if efficiency < 50:
        insights.append("Inventory efficiency is low. Dead stock is affecting cash flow.")
    elif efficiency > 80:
        insights.append("Inventory performance looks strong. Great stock rotation!")

    return insights