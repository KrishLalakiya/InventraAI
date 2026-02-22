# services/forecast_service.py

def forecast_next_7_days(product_id, sales):
    """
    Forecast next 7 days using simple moving average
    """

    # Filter sales for this product
    product_sales = [
        sale.quantity_sold for sale in sales if sale.product_id == product_id
    ]

    if len(product_sales) == 0:
        return 0

    if len(product_sales) < 7:
        avg = sum(product_sales) / len(product_sales)
    else:
        last_7 = product_sales[-7:]
        avg = sum(last_7) / 7

    return round(avg * 7, 2)