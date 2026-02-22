# services/rebalance_service.py

def generate_rebalance_recommendations(products, sales_map):

    recommendations = []

    for product in products:
        product_sales = sales_map.get(product.id, [])

        if not product_sales:
            continue

        # Simple 7-day moving average
        if len(product_sales) < 7:
            avg_daily = sum(product_sales) / len(product_sales)
        else:
            avg_daily = sum(product_sales[-7:]) / 7

        predicted_next_7_days = avg_daily * 7

        current_stock = product.current_stock

        # Safety buffer (20%)
        required_stock = predicted_next_7_days * 1.2

        difference = required_stock - current_stock

        if difference > 5:
            recommendations.append({
                "product": product.name,
                "action": "REORDER",
                "recommended_quantity": round(difference)
            })

        elif current_stock > predicted_next_7_days * 1.5:
            recommendations.append({
                "product": product.name,
                "action": "OVERSTOCK",
                "excess_stock": round(current_stock - predicted_next_7_days)
            })

    return recommendations