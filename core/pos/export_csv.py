import csv
from django.http import HttpResponse
from .models import SaleProduct

def export_sales_csv(request):
    """
    Crea y exporta un archivo CSV con el historial detallado de ventas.
    """
    # Define el nombre del archivo que se descargará.
    filename = 'historico_ventas.csv'
    
    # Configura la respuesta HTTP para que el navegador la trate como un archivo CSV.
    response = HttpResponse(
        content_type='text/csv',
        headers={'Content-Disposition': f'attachment; filename="{filename}"'},
    )

    # Crea un escritor de CSV que escribirá en la respuesta HTTP.
    writer = csv.writer(response)

    # Escribe la fila del encabezado en el archivo CSV.
    writer.writerow([
        'fecha_venta',
        'id_producto',
        'nombre_producto',
        'id_categoria',
        'nombre_categoria',
        'cantidad_vendida',
        'precio_unitario',
        'subtotal_linea'
    ])

    # Optimiza la consulta a la base de datos usando select_related.
    # Esto precarga los datos de las tablas relacionadas (Sale, Product, Category)
    # en una sola consulta, evitando múltiples accesos a la base de datos.
    queryset = SaleProduct.objects.select_related('sale', 'product', 'product__category').all()

    # Itera sobre cada detalle de venta y escribe una fila en el CSV.
    for saleproduct in queryset:
        writer.writerow([
            saleproduct.sale.date_joined,
            saleproduct.product.id,
            saleproduct.product.name,
            saleproduct.product.category.id,
            saleproduct.product.category.name,
            saleproduct.cant,
            saleproduct.price,
            saleproduct.subtotal
        ])

    return response