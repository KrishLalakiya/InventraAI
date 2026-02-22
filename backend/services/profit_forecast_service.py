# services/profit_forecast_service.py

def calculate_profit_forecast(products, sales_map):

    forecast_data = []
    total_revenue = 0
    total_profit = 0

    for product in products:
        product_sales = sales_map.get(product.id, [])

        if not product_sales:
            continue

        # 7-day moving average
        if len(product_sales) < 7:
            avg_daily_sales = sum(product_sales) / len(product_sales)
        else:
            avg_daily_sales = sum(product_sales[-7:]) / 7

        predicted_7_days_sales = avg_daily_sales * 7

        revenue = predicted_7_days_sales * product.selling_price
        profit = predicted_7_days_sales * (product.selling_price - product.cost_price)

        total_revenue += revenue
        total_profit += profit

        forecast_data.append({
            "product": product.name,
            "predicted_sales_next_7_days": round(predicted_7_days_sales, 2),
            "predicted_revenue": round(revenue, 2),
            "predicted_profit": round(profit, 2)
        })

    return {
        "per_product_forecast": forecast_data,
        "total_predicted_revenue": round(total_revenue, 2),
        "total_predicted_profit": round(total_profit, 2)
    }