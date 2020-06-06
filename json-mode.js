const XLSX = require('xlsx');
const fs = require('fs');
const _ = require('lodash')
const uuidv1 = require('uuid/v1');
const argv = require('yargs').argv
const handlebars = require('handlebars');

if (!argv.fileName) {
    throw new Error('--fileName must be provided');
}

if (!argv.tabName) {
    throw new Error('--tabName must be provided');
}

var workbook = XLSX.readFile(`./${argv.fileName}.xlsx`);

if (!workbook.SheetNames.includes(argv.tabName)) {
    throw new Error(`excel file doesnt contains a tab named: "${argv.tabName}" available ones are "${workbook.SheetNames.join(", ")}"`)
}

const sheet = workbook.Sheets[argv.tabName];
const jsonSheet = XLSX.utils.sheet_to_json(sheet);

const categorias = [];

const handlebarData = {
    generated_graph: []
};

var i = 0;
let firstRowAttributeName;
let fetchColumns = true;
for (var item of jsonSheet) {
    if (fetchColumns) {
        fetchColumns = false;
        firstRowAttributeName = Object.keys(item)[0]; //C10
        for (var attribute in item) {
            if (attribute != firstRowAttributeName) {
                categorias.push(
                    attribute
                )
            }
        }
    }

    var data = [];

    for (var categoria of categorias) {
        data.push(
            item[categoria] ? _.ceil(item[categoria], 2) : 0
        )
    }

    handlebarData.generated_graph.push({
        isOpenRow: i == 0 ? true : false,
        data: JSON.stringify(
            _.concat(["Value"], data)
        ),
        name: item[firstRowAttributeName],
        id: "graphic_" + uuidv1().replace(/\-/g, '_'),
        maior: _.max(data),
        media: _.ceil(
            _.mean(data), 2
        ),
        menor: _.min(data),
        monthYear: JSON.stringify(categorias),
        isCloseRow: i == 2 ? true : false,
    });

    i++;
    if (i === 3) {
        i = 0;
    }
}

// set up your handlebars template
var source = fs.readFileSync('template.hb').toString();

// compile the template
var template = handlebars.compile(source);

fs.writeFileSync(
    `graph_parsed_from_${argv.fileName}_${uuidv1()}.html`,
    // call template as a function, passing in your data as the context
    template(
        handlebarData
    )
);

console.log(
    JSON.stringify(
        handlebarData, null, 2
    )
)