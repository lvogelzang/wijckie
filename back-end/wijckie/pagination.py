import math

from rest_framework import pagination
from rest_framework.response import Response


class DefaultPagination(pagination.PageNumberPagination):
    def get_paginated_response(self, data):
        return Response(
            {
                "pageCount": math.ceil(
                    self.page.paginator.count / self.page.paginator.per_page
                ),
                "results": data,
            }
        )

    def get_paginated_response_schema(self, schema):
        return {
            "type": "object",
            "required": ["pageCount", "results"],
            "properties": {
                "pageCount": {
                    "type": "integer",
                    "example": 123,
                },
                "results": schema,
            },
        }
