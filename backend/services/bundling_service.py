# services/bundling_service.py

from itertools import combinations
from collections import Counter


def generate_product_bundles(sales, threshold=2):
    """
    Detect frequently bought together products
    threshold = minimum number of times pair appears
    """

    # Group sales by date
    sales_by_date = {}

    for sale in sales:
        sales_by_date.setdefault(sale.sale_date, []).append(sale.product_id)

    pair_counter = Counter()

    for date, product_ids in sales_by_date.items():
        unique_products = list(set(product_ids))

        for pair in combinations(unique_products, 2):
            sorted_pair = tuple(sorted(pair))
            pair_counter[sorted_pair] += 1

    # Filter strong bundles
    strong_pairs = [
        {"product_1": pair[0], "product_2": pair[1], "frequency": count}
        for pair, count in pair_counter.items()
        if count >= threshold
    ]

    return strong_pairs