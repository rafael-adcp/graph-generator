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
            <div class="row">
                <div class="col-md-12">
                    {{{analiseAtual}}}
                </div>
            </div>
        <hr>
            <div class="row">
                <div class="col-md-12">
                    <table class="table table-bordered" style = 'text-align: center'>
                            <thead>
                                <tr>
                                    <th scope="col">nome</th>
                                    {{#each totalAnalises}}
                                        <th scope="col">{{this}}</th>
                                    {{/each}}
                                    <th scope="col">Total subiu</th>
                                    <th scope="col">Total caiu</th>
                                    <th scope="col">Total manteve</th>
                                </tr>
                            </thead>
                            <tbody>
                                {{#each data}}
                                    <tr>
                                        <td>{{name}}</td>
                                        {{#each icons}}
                                            <td>{{{this}}}</td>
                                        {{/each}}
                                        <td>{{subiuCount}}%</td>
                                        <td>{{caiuCount}}%</td>
                                        <td>{{{manteveCount}}}%</td>
                                    </tr>
                                {{/each}}
                            </tbody>
                            </table>
                </div>
            </div>
        </div>
    </body>
</html>