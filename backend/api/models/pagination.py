from pydantic import BaseModel


class Pagination(BaseModel):
    total_pages: int
    current_page: int
    has_next: bool
    has_prev: bool
    total_items: int
    page_size: int