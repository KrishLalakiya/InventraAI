def calculate_risk(products, sales_map):
    risk_results = []

    for product in products:
        sales = sales_map.get(product.id, [])
        avg_sales = sum(sales) / len(sales) if sales else 0

        if avg_sales == 0:
            risk = "High"
        elif product.current_stock > avg_sales * 10:
            risk = "Medium"
        else:
            risk = "Low"

        risk_results.append({
            "id": product.id,
            "name": product.name,
            "selling_price": product.selling_price,
            "cost_price": product.cost_price,
            "current_stock": product.current_stock,
            "risk_level": risk
        })

    return risk_results