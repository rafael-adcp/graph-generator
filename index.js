const XLSX = require('xlsx');
const fs = require('fs');
const _ = require('lodash')
const uuidv1 = require('uuid/v1');
const argv = require('yargs').argv

if (!argv.fileName) {
    throw new Error('--fileName must be provided');
}

if (!argv.tabName) {
    throw new Error('--tabName must be provided');
}

var workbook = XLSX.readFile(`./${argv.fileName}.xlsx`);

if(!workbook.SheetNames.includes(argv.tabName)) {
    throw new Error(`excel file doesnt contains a tab named: "${argv.tabName}" available ones are "${workbook.SheetNames.join(", ")}"`)
}

const sheet = workbook.Sheets[argv.tabName];

var range = XLSX.utils.decode_range(sheet['!ref']);

const maxColumn = range.e.c;
const parsed = {};

//reading investiment options
for (let rowNum = 9; rowNum <= range.e.r; rowNum++) {
    const investimentName = sheet[
        XLSX.utils.encode_cell(
            {
                r: rowNum,
                c: 2 // means column C
            }
        )
    ];

    if (investimentName) {
        parsed[investimentName.v] = [];

        //3 means column D, which is where the values starts
        for (var columnNum = 3; columnNum <= maxColumn; columnNum++) {
            const value = sheet[
                XLSX.utils.encode_cell(
                    {
                        r: rowNum,
                        c: columnNum
                    }
                )
            ];

            let finalValue = 0;
            if (value) {
                if (rowNum == 9) { // those are the dates
                    finalValue = value.w;
                } else {// those are the $
                    finalValue = _.ceil(value.v, 2);
                }
            } else {
                //console.log(`not found for row ${rowNum} column ${columnNum}`)
            }
            parsed[investimentName.v].push(finalValue)
        }
    } else {
        // console.log(`not found for row ${rowNum}`)
    }
}

const handlebars = require('handlebars');

// set up your handlebars template
var source = fs.readFileSync('template.hb').toString();

// compile the template
var template = handlebars.compile(source);

const handlebarData = {
    generated_graph: []
};


let i = 0;
for (var item in parsed) {
    if (item != "time") {
        const min = _.ceil(
            _.min(parsed[item]),
            2
        );

        const average = _.ceil(
            _.mean(parsed[item]),
            2
        );

        const max = _.ceil(
            _.max(parsed[item]),
            2
        );

        //adding a label that will appear when hovering the graphs
        parsed[item].unshift("Value");

        handlebarData.generated_graph.push({
            isOpenRow: i == 0 ? true : false,
            data: JSON.stringify(parsed[item]),
            name: item,
            id: "graphic_" + uuidv1().replace(/\-/g, '_'),
            maior: max,
            media: average,
            menor: min,
            monthYear: JSON.stringify(parsed["time"]),
            isCloseRow: i == 2 ? true : false
        })
        i++;

        if (i === 3) {
            i = 0;
        }
    }
}

// call template as a function, passing in your data as the context
var parsedString = template(
    handlebarData
);

fs.writeFileSync(`graph_parsed_from_${argv.fileName}_${uuidv1()}.html`, parsedString);