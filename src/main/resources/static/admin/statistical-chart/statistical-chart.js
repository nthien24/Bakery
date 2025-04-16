$(document).ready(function () {
    (function ($) {
        const BarChart = {
            extends: VueChartJs.Bar,
            mixins: [VueChartJs.mixins.reactiveProp],
            props: ['options'],
            mounted() {
                this.renderChart(this.chartData, this.options)
            }
        }

        function getLabel(date, isMonth) {
            date = moment(date);
            return isMonth ? date.format("D") : "Tháng " + date.format("M");
        }

        function getLabels(date, isMonth) {
            var start = moment(date).startOf(isMonth ? 'month' : 'year')
            var end = moment(date).endOf(isMonth ? 'month' : 'year')
            var labels = []

            while (start <= end) {
                labels.push(getLabel(start, isMonth))
                start.add(1, isMonth ? 'day' : 'month')
            }
            
            return labels
        }

        function getDataset(data, isMonth, labels) {
            var obj = {};

            data.forEach(item => {
                var label = getLabel(item.date, isMonth)

                if (!obj[label]) obj[label] = 0

                obj[label] += item.outStock * item.product.price
            })

            return [
                {
                    label: 'Doanh thu',
                    backgroundColor: '#63c76a',
                    data: labels.map(label => obj[label] || 0)
                }
            ]
        }

        new Vue({
            el: "#container",
            watch: {},
            data: {
                date: moment().toDate(),
                dateType: '0',
                dataCollection: {
                    datasets: null
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                }
            },
            methods: {
                fillData() {
                    var self = this
                    var isMonth = self.dateType == 0;

                    var data = {
                        startDate: moment(this.date).startOf(isMonth ? 'month' : 'year').toDate(),
                        endDate: moment(this.date).endOf(isMonth ? 'month' : 'year').toDate(),
                    };

                    Base.sendApi({
                        url: base_url + "/orders/statistical",
                        data,
                        method: Base.constant.METHOD_POST,
                        onSuccess: function (data) {
                            var labels = getLabels(self.date, isMonth)
                            var datasets = getDataset(data, isMonth, labels)

                            self.dataCollection = {
                                labels,
                                datasets
                            }
                        },
                        onFailed: function (msg) {
                            console.log('fail', msg)
                            self.dataCollection = {
                                datasets: [],
                                labels: getLabels(self.date, isMonth)
                            }
                        }
                    });
                },
                doFormatMoney: function (value) {
                    var data = parseInt(value);
                    return data.toLocaleString("it-IT", {
                        style: "currency",
                        currency: "VND",
                    });
                },
            },
            components: { BarChart, Datepicker: vuejsDatepicker },
            mounted: function () {
                this.fillData()
            },
            computed: {
                isMonth: function () {
                    return this.dateType == 0
                }
            }
        });
    })(jQuery);
});