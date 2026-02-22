from pydantic import BaseModel
from datetime import date

class ProductCreate(BaseModel):
    name: str
    cost_price: float
    selling_price: float
    current_stock: int


class SaleCreate(BaseModel):
    product_id: int
    quantity_sold: int
    sale_date: date