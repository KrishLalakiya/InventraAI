# services/cashflow_service.py

def calculate_inventory_value(products):
    """
    Calculate total inventory value
    """
    return sum(p.current_stock * p.cost_price for p in products)


def build_sales_map(sales):
    """
    Convert sales list into:
    {
        product_id: [qty1, qty2, qty3]
    }
    """
    sales_map = {}

    for sale in sales:
        sales_map.setdefault(sale.product_id, []).append(sale.quantity_sold)

    return sales_map


def detect_dead_stock(products, sales_map):
    """
    Dead stock = avg daily sales < 1
    """
    dead_stock = []

    for product in products:
        product_sales = sales_map.get(product.id, [])

        if len(product_sales) == 0:
            dead_stock.append(product)
            continue

        avg_sales = sum(product_sales) / len(product_sales)

        if avg_sales < 1:
            dead_stock.append(product)

    return dead_stock


def calculate_efficiency(products, sales_map):
    """
    Efficiency = (value of fast moving stock / total value) * 100
    """

    total_value = calculate_inventory_value(products)

    if total_value == 0:
        return 0

    fast_value = 0

    for product in products:
        product_sales = sales_map.get(product.id, [])
        avg_sales = sum(product_sales) / len(product_sales) if product_sales else 0

        if avg_sales >= 1:
            fast_value += product.current_stock * product.cost_price

    return round((fast_value / total_value) * 100, 2)        
# "efficiency_score": round(efficiency_score, 2)
    # }