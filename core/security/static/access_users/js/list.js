const datatable = {
    instance: null,
    dateRangeInput: null,

    list: function (loadAll = false) {
        const startDate = this.dateRangeInput.data('daterangepicker').startDate.format('YYYY-MM-DD');
        const endDate = this.dateRangeInput.data('daterangepicker').endDate.format('YYYY-MM-DD');

        const parameters = {
            'action': 'search',
            'start_date': loadAll ? '' : startDate,
            'end_date': loadAll ? '' : endDate,
        };

        const dataTableOptions = {
            responsive: true,
            destroy: true,
            deferRender: true,
            ajax: {
                url: pathname,
                type: 'POST',
                data: parameters,
                dataSrc: "",
                headers: {
                    'X-CSRFToken': csrftoken
                }
            },
            order: [[2, "desc"], [3, "desc"]],
            columns: [
                { "data": "id" },
                { "data": "user.username" },
                { "data": "date_joined" },
                { "data": "time_joined" },
                { "data": "ip_address" },
                { "data": "id" },
            ],
            columnDefs: [
                {
                    targets: [-1],
                    class: 'text-center',
                    orderable: false,
                    render: function (data, type, row) {
                        return `<a href="${pathname}delete/${row.id}/" class="btn btn-danger btn-xs btn-flat"><i class="fas fa-trash-alt"></i></a>`;
                    }
                },
            ],
            initComplete: function (settings, json) {
                
            }
        };

        this.instance = $('#data').DataTable(dataTableOptions);
    },
};

$(function () {
    datatable.dateRangeInput = $('input[name="date_range"]');

    datatable.dateRangeInput.daterangepicker({
        language: 'auto',
        startDate: new Date(),
        locale: {
            format: 'YYYY-MM-DD',
        }
    });

    $('.drp-buttons').hide();

    $('.btnSearch').on('click', function () {
        datatable.list(false);
    });

    $('.btnSearchAll').on('click', function () {
        datatable.list(true);
    });

    datatable.list(false);
});