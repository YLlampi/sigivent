$(function () {
    // --- 🎨 Tema Visual Moderno para Highcharts ---
    Highcharts.setOptions({
        colors: ['#5470C6', '#91CC75', '#FAC858', '#EE6666', '#73C0DE', '#3BA272', '#FC8452', '#9A60B4', '#EA7CCC'],
        chart: {
            backgroundColor: 'transparent',
            style: {
                fontFamily: "'Inter', 'Helvetica', 'Arial', sans-serif"
            }
        },
        title: {
            style: {
                color: '#333333',
                fontSize: '18px',
                fontWeight: 'bold'
            }
        },
        subtitle: {
            style: {
                color: '#666666'
            }
        },
        tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            style: {
                color: '#333333'
            },
            borderWidth: 1,
            borderColor: '#E0E0E0',
            borderRadius: 8,
            shadow: true
        },
        legend: {
            itemStyle: {
                color: '#444444'
            },
            itemHoverStyle: {
                color: '#000000'
            }
        }
    });

    // --- 📅 Variables de Fecha ---
    const LIST_MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const complete_date = new Date();
    const year = complete_date.getFullYear();
    const month = complete_date.getMonth();

    // --- 📊 Inicialización de Gráficos ---
    const graphcolumn = Highcharts.chart('container-column', {
        chart: {
            type: 'column'
        },
        title: {
            text: `Reporte de Ventas del Año ${year}`
        },
        xAxis: {
            categories: LIST_MONTHS,
            crosshair: true,
            labels: {
                style: {
                    color: '#666'
                }
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Monto de Venta (S/)'
            },
            labels: {
                style: {
                    color: '#666'
                }
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:12px; font-weight:bold;">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0; text-align: right;"><b>S/ {point.y:,.2f}</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0,
                borderRadius: 4
            }
        },
        series: [] // Se llena con AJAX
    });

    const graphpie = Highcharts.chart('container-pie', {
        chart: {
            type: 'pie'
        },
        title: {
            text: `Ventas por Producto (${LIST_MONTHS[month]} ${year})`
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                innerSize: '60%', // <-- Esto lo convierte en un gráfico de donut
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        textOutline: 'none'
                    }
                }
            }
        },
        series: [] // Se llena con AJAX
    });

    // --- 🔄 Lógica de Carga de Datos (AJAX) ---
    const graph = {
        getSalesYearMonth: function () {
            $.ajax({
                url: window.location.pathname,
                data: { 'action': 'get_graph_sales_year_month' },
                type: 'POST',
                dataType: 'json',
                headers: { 'X-CSRFToken': csrftoken },
                success: function (request) {
                    if (!request.hasOwnProperty('error')) {
                        graphcolumn.addSeries(request);
                    } else {
                        console.error(request.error);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.error(`${errorThrown}: ${textStatus}`);
                }
            });
        },
        getSalesProductsYearMonth: function () {
            $.ajax({
                url: window.location.pathname,
                data: { 'action': 'get_graph_sales_products_year_month' },
                type: 'POST',
                dataType: 'json',
                headers: { 'X-CSRFToken': csrftoken },
                success: function (request) {
                    if (!request.hasOwnProperty('error')) {
                        graphpie.addSeries(request);
                    } else {
                        console.error(request.error);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.error(`${errorThrown}: ${textStatus}`);
                }
            });
        }
    };

    graph.getSalesYearMonth();
    graph.getSalesProductsYearMonth();
});