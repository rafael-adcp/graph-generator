const XLSX = require('xlsx');
const fs = require('fs');
const _ = require('lodash')
const uuidv1 = require('uuid/v1');
const argv = require('yargs').argv
const handlebars = require('handlebars');

function getPercentual(value, totalAmount) {
    return _.ceil(
        (value / totalAmount) * 100, 2
    );
}

const metrics = {
    total: 0,
    subiu: {
        count: 0
    },
    caiu: {
        count: 0
    },
    manteve: {
        count: 0
    }
};


const inverterCoresIcones = argv.inverterCoresIcones ? true : false;

let upClass = 'bg-success'

let downClass = 'bg-danger';

if (inverterCoresIcones) {
    temp = upClass;

    upClass = downClass; // moving trend up to RED
    downClass = temp; // moving trend down to GREEN
}

const ICONS = {
    subiu: `<div class = "${upClass}">subiu <br/>
    <svg class="bi bi-graph-up" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 0h1v16H0V0zm1 15h15v1H1v-1z"/>
    <path fill-rule="evenodd" d="M14.39 4.312L10.041 9.75 7 6.707l-3.646 3.647-.708-.708L7 5.293 9.959 8.25l3.65-4.563.781.624z"/>
    <path fill-rule="evenodd" d="M10 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V4h-3.5a.5.5 0 0 1-.5-.5z"/>
  </svg></div>`,
    caiu: `<div class = "${downClass}">caiu <br/>
    <svg class="bi bi-graph-down" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 0h1v16H0V0zm1 15h15v1H1v-1z"/>
    <path fill-rule="evenodd" d="M14.39 9.041l-4.349-5.436L7 6.646 3.354 3l-.708.707L7 8.061l2.959-2.959 3.65 4.564.781-.625z"/>
    <path fill-rule="evenodd" d="M10 9.854a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 0-1 0v3.5h-3.5a.5.5 0 0 0-.5.5z"/>
  </svg></div>`,
    manteve: `<div class = "bg-info">manteve <br/> -</div>`
}

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
    metrics.total++;
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

    let icon;

    const ultimo = data[data.length - 1];
    const penultimo = data[data.length - 2]

    if (ultimo > penultimo) {
        metrics.subiu.count++;
        icon = ICONS.subiu
    } else if (ultimo < penultimo) {
        metrics.caiu.count++;
        icon = ICONS.caiu
    } else {
        metrics.manteve.count++;
        icon = ICONS.manteve
    }

    handlebarData.generated_graph.push({
        isOpenRow: i == 0 ? true : false,
        data: JSON.stringify(
            _.concat(["Value"], data)
        ),
        allInOnedata: JSON.stringify(
            _.concat([item[firstRowAttributeName]], data)
        ),
        pureData: data,
        name: item[firstRowAttributeName],
        id: "graphic_" + uuidv1().replace(/\-/g, '_'),
        maior: _.max(data),
        media: _.ceil(
            _.mean(data), 2
        ),
        menor: _.min(data),
        monthYear: JSON.stringify(categorias),
        isCloseRow: i == 2 ? true : false,
        icon: icon
    });

    i++;
    if (i === 3) {
        i = 0;
    }
}

// set up your handlebars template
var source = fs.readFileSync('graficos.hb').toString();

// compile the template
var template = handlebars.compile(source);
handlebarData.monthYear = JSON.stringify(categorias, null, 2);
fs.writeFileSync(
    `graph_parsed_from_${argv.fileName}_${uuidv1()}.html`,
    // call template as a function, passing in your data as the context
    template(
        handlebarData
    )
);

var print = ['subiu', 'caiu', 'manteve'];
var analiseAtual = "Cenário atual:";

for (var x of print) {
    analiseAtual += `<br/>${x} => (${metrics[x].count} / ${metrics.total}) = ${getPercentual(metrics[x].count, metrics.total)}%`
}

var tableContent = {
    analiseAtual: analiseAtual,
    data: []
};

for (var item of handlebarData.generated_graph) {
    if (item.pureData.length > 1) { //meaning there is something to compare

        let atual = 0;
        let anterior = 0;
        let i = 0;

        let subiuCount = 0;
        let caiuCount = 0;
        let manteveCount = 0;

        var iconList = [];
        for (var info of item.pureData) {

            anterior = atual;
            atual = info;

            if (i > 0) { //comparison start at the second element, where i = 1

                if (atual > anterior) {
                    subiuCount++;
                    icon = ICONS.subiu
                } else if (atual < anterior) {
                    caiuCount++;
                    icon = ICONS.caiu
                } else {
                    manteveCount++
                    icon = ICONS.manteve
                }
                iconList.push(icon)
            }
            i++;
        }
        tableContent.data.push({
            name: item.name,
            icons: iconList,

            subiuCount: getPercentual(subiuCount, item.pureData.length - 1),
            caiuCount: getPercentual(caiuCount, item.pureData.length - 1),
            manteveCount: getPercentual(manteveCount, item.pureData.length - 1),
            totalCount: item.pureData.length,
        })

    }
}


tableContent.totalAnalises = [];

let anterior, atual = null;

for (var item of categorias) {
    anterior = atual;
    atual = item
    if (anterior != null) {
        tableContent.totalAnalises.push(`${anterior} => ${atual}`)
    }
}

tableContent.data = _.reverse( //becuse we want thing to be ordered DESC instead of ASC
    _.sortBy(tableContent.data, (o) => {
        if (inverterCoresIcones) {//so that we know which one to handle first, following 80/20 principle
            return o.subiuCount;
        } else {
            return o.caiuCount;
        }
    })
)



// set up your handlebars template
var sourceTemplateAnalise = fs.readFileSync('analise.hb').toString();

// compile the template
var templateAnalise = handlebars.compile(sourceTemplateAnalise);


fs.writeFileSync(
    `analise_from_${argv.fileName}_${uuidv1()}.html`,
    // call template as a function, passing in your data as the context
    templateAnalise(
        tableContent
    )
);