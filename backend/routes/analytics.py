# routes/analytics.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
import models
from services.bundling_service import generate_product_bundles
from services.rebalance_service import generate_rebalance_recommendations
from services.insight_service import generate_insights
from services.profit_forecast_service import calculate_profit_forecast
from services.risk_service import calculate_risk


from services.cashflow_service import (
    calculate_inventory_value,
    build_sales_map,
    detect_dead_stock,
    calculate_efficiency,
)


from services.forecast_service import forecast_next_7_days


router = APIRouter(prefix="/analytics", tags=["Analytics"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/cashflow")
def get_cashflow(db: Session = Depends(get_db)):

    products = db.query(models.Product).all()
    sales = db.query(models.Sale).all()

    sales_map = build_sales_map(sales)

    total_inventory_value = calculate_inventory_value(products)
    dead_stock = detect_dead_stock(products, sales_map)
    efficiency = calculate_efficiency(products, sales_map)

    return {
        "total_inventory_value": total_inventory_value,
        "efficiency_score": efficiency,
        "dead_stock_products": [p.name for p in dead_stock]
    }


@router.get("/forecast/{product_id}")
def get_forecast(product_id: int, db: Session = Depends(get_db)):

    sales = db.query(models.Sale).all()

    prediction = forecast_next_7_days(product_id, sales)

    return {
        "product_id": product_id,
        "predicted_sales_next_7_days": prediction
    }


@router.get("/bundles")
def get_bundles(db: Session = Depends(get_db)):

    sales = db.query(models.Sale).all()
    products = db.query(models.Product).all()

    bundles = generate_product_bundles(sales)

    # Convert product IDs to names
    product_map = {p.id: p.name for p in products}

    formatted_bundles = []

    for bundle in bundles:
        formatted_bundles.append({
            "product_1": product_map.get(bundle["product_1"]),
            "product_2": product_map.get(bundle["product_2"]),
            "frequency": bundle["frequency"]
        })

    return {
        "suggested_bundles": formatted_bundles
    }


@router.get("/rebalance")
def get_rebalance(db: Session = Depends(get_db)):

    products = db.query(models.Product).all()
    sales = db.query(models.Sale).all()

    # Build sales map
    sales_map = {}
    for sale in sales:
        sales_map.setdefault(sale.product_id, []).append(sale.quantity_sold)

    recommendations = generate_rebalance_recommendations(products, sales_map)

    return {
        "rebalance_recommendations": recommendations
    }

@router.get("/insights")
def get_ai_insights(db: Session = Depends(get_db)):

    products = db.query(models.Product).all()
    sales = db.query(models.Sale).all()

    # Build sales map
    sales_map = {}
    for sale in sales:
        sales_map.setdefault(sale.product_id, []).append(sale.quantity_sold)

    # Rebalance recommendations
    rebalance = generate_rebalance_recommendations(products, sales_map)

    # Cashflow metrics
    total_inventory_value = calculate_inventory_value(products)
    dead_stock = detect_dead_stock(products, sales_map)
    efficiency = calculate_efficiency(products, sales_map)

    cashflow = {
        "total_inventory_value": total_inventory_value,
        "dead_stock_products": [p.name for p in dead_stock],
        "efficiency_score": efficiency
    }

    insights = generate_insights(rebalance, cashflow)

    return {
        "ai_insights": insights
    }
    
@router.get("/risk")
def get_risk_analysis(db: Session = Depends(get_db)):
    products = db.query(models.Product).all()
    sales = db.query(models.Sale).all()

    sales_map = {}
    for sale in sales:
        sales_map.setdefault(sale.product_id, []).append(sale.quantity_sold)

    result = calculate_risk(products, sales_map)

    return {"risk_analysis": result}


@router.get("/profit-forecast")
def get_profit_forecast(db: Session = Depends(get_db)):

    products = db.query(models.Product).all()
    sales = db.query(models.Sale).all()

    # Build sales map
    sales_map = {}
    for sale in sales:
        sales_map.setdefault(sale.product_id, []).append(sale.quantity_sold)

    result = calculate_profit_forecast(products, sales_map)

    return result