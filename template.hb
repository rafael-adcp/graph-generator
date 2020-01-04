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
            {{#each generated_graph}}
                {{#if isOpenRow }}
                    <hr>
                    <div class="row">
                {{/if}}
                        <div class="col-sm-4">
                            <div id="{{id}}"></div>
                            <script>
                                var chart = bb.generate({
                                    data: {
                                        columns: [
                                            {{{ data }}}      
                                        ],
                                        //labels: true
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
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{{menor}}</td>
                                    <td>{{media}}</td>
                                    <td>{{maior}}</td>
                                </tr>
                            </tbody>
                            </table>
                        </div>
                        
                {{#if isCloseRow }}
                    </div>
                {{/if}}
            {{/each}}
        </div>
    </body>
</html>