<html>
<header>
    <!-- Load D3.js -->
    <script src="./node_modules//d3/dist//d3.min.js"></script>

    <!-- Load billboard.js with style -->
    <script src="./node_modules/billboard.js/dist/billboard.js"></script>
    <link rel="stylesheet" href="./node_modules/billboard.js/dist/billboard.css">

    <!-- Load bootstrap style -->
    <link rel="stylesheet" href="./node_modules/bootstrap/dist/css/bootstrap.css">

    <style>

    </style>
</header>

    <body>
        <div class="container-fluid">
        <hr>
        <div class="row">
            <div class="col-md-12">
             <div id="all-in-one"></div>
                            <script>
                                var chart = bb.generate({
                                    data: {
                                        columns: [
                                             {{#each generated_graph}}
                                            {{{ allInOnedata }}},
                                            {{/each}}
                                        ],
                                        labels: true
                                    },
                                    "tooltip": {
                                        "order": "desc"
                                    },
                                     zoom: {
                                        enabled: {
                                            type: "drag"
                                        }
                                    },
                                    
                                    axis : {
                                        
                                        x: {
                                            label: {
                                                text: 'date',
                                            },
                                            type: "category",
                                            categories: {{{ monthYear }}} ,
                                            tick: {
                                                    fit: false, //makes x axis shows nicely,
                                                },
                                        },
                                         y: {
                                             label: {
                                                text: 'value',
                                            },
                                        }
                                    },
                                

                                    bindto: '#all-in-one',
                                    title: {
                                        text: 'All in one'
                                    },

                                    grid: {
                                        x: {
                                            show: true
                                        },
                                        
                                        y: {
                                            show: true,
                                        }
                                    },
                                    legend: {
                                        show: true
                                    }
                                });
                            </script>
            </div>
        </div>

        <div class="row">
            <div class="col-md-12">
             <div id="current-pie"></div>
                            <script>
                                var chart = bb.generate({
                                    
                                    data: {
                                        type: "pie",
                                        columns: [
                                             {{#each generated_graph}}
                                            {{{ pieData }}},
                                            {{/each}}
                                        ],
                                        labels: true
                                    },
                                    "tooltip": {
                                        "order": "desc"
                                    },
                                     zoom: {
                                        enabled: {
                                            type: "drag"
                                        }
                                    },
                                    
                                    axis : {
                                        
                                        x: {
                                            label: {
                                                text: 'date',
                                            },
                                            type: "category",
                                            categories: {{{ monthYear }}} ,
                                            tick: {
                                                    fit: false, //makes x axis shows nicely,
                                                },
                                        },
                                         y: {
                                             label: {
                                                text: 'value',
                                            },
                                        }
                                    },
                                

                                    bindto: '#current-pie',
                                    title: {
                                        text: 'Last entry % per category'
                                    },

                                    grid: {
                                        x: {
                                            show: true
                                        },
                                        
                                        y: {
                                            show: true,
                                        }
                                    },
                                    legend: {
                                        show: true
                                    }
                                });
                            </script>
            </div>
        </div>
        <hr>
                    <div class="row">
        {{#each generated_pie_graph}}
                
                        <div class="col-sm-4">
                            <div id="{{uuid}}"></div>
                            <script>
                                var chart = bb.generate({
                                    data: {
                                        type: "pie",
                                        columns: 
                                            {{{ data }}}      
                                        ,
                                        labels: true
                                    },
                                     zoom: {
                                        enabled: {
                                            type: "drag"
                                        }
                                    },
                                    
                                    axis : {
                                        
                                        x: {
                                            label: {
                                                text: 'date',
                                            },
                                            type: "category",
                                            tick: {
                                                    fit: false, //makes x axis shows nicely,
                                                },
                                        },
                                         y: {
                                             label: {
                                                text: 'value',
                                            }
                                        }
                                    },
                                

                                    bindto: '#{{uuid}}',
                                    title: {
                                        text: '{{name}}'
                                    },

                                    legend: {
                                        show: false
                                    }
                                });
                            </script>
                        </div>
                        
                
            {{/each}}
            </div>





            <hr>
            <div class="row">
            {{#each generated_graph}}
                
                        <div class="col-sm-4">
                            <div id="{{id}}"></div>
                            <script>
                                var chart = bb.generate({
                                    data: {
                                        columns: [
                                            {{{ data }}}      
                                        ],
                                        labels: true
                                    },
                                     zoom: {
                                        enabled: {
                                            type: "drag"
                                        }
                                    },
                                    
                                    axis : {
                                        
                                        x: {
                                            label: {
                                                text: 'date',
                                            },
                                            type: "category",
                                            categories: {{{ monthYear }}} ,
                                            tick: {
                                                    fit: false, //makes x axis shows nicely,
                                                },
                                        },
                                         y: {
                                             label: {
                                                text: 'value',
                                            },
                                            min: {{ menor }}
                                        }
                                    },
                                

                                    bindto: '#{{id}}',
                                    title: {
                                        text: '{{name}}'
                                    },

                                    grid: {
                                        x: {
                                            show: true
                                        },
                                        
                                        y: {
                                            show: true,
                                            lines: [
                                                { value: {{media}}, class: '', text: 'Media: {{media}}'},
                                                
                                            ]
                                        }
                                    },
                                    legend: {
                                        show: false
                                    }
                                });
                            </script>
                            <table class="table table-bordered" style = 'text-align: center'>
                            <thead>
                                <tr>
                                    <th scope="col">Menor</th>
                                    <th scope="col">Media</th>
                                    <th scope="col">Maior</th>
                                    <th scope="col">Análise<br/>(X-1) -> X</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{{menor}}</td>
                                    <td>{{media}}</td>
                                    <td>{{maior}}</td>
                                    <td>{{{icon}}}</td>
                                </tr>
                            </tbody>
                            </table>
                        </div>
            {{/each}}
            </div>
        </div>
    </body>
</html>