import { PrismaClient } from '@prisma/client'
import { cConsole, count } from 'console'

const prisma = new PrismaClient()


// import csvtojson from 'csvtojson';
// const jsonFilePath = 'csv_file'
// import csv from 'csv-parser';

import fs from 'fs'



const csvFilePath = 'csv_file/Ciqual.csv'

let csvLines = fs.readFileSync(csvFilePath).toString().split("\r")
let rawData = csvLines.slice(1)

const columnsIndex = [3,7,15,16,17,18,19,20,21,22,23,24,25,26]




function getColumn(indexArray = []) {
    let csvLines = fs.readFileSync(csvFilePath).toString().split("\r")
    let columnsList = csvLines[0].split(';')

    let filterColumns = indexArray.map(index => columnsList[index])

    return filterColumns
}


function getArrayData(array, indexArray =[]) {
    let data = [];

    for (let lineIndex in array) {
        let line = [];
        indexArray.forEach(element => line.push(array[lineIndex].split(";")[element]))
        data.push(line)
    }
    return data
}

///////////////////////////////////////////////////////////////////////////////////////////////////////// PRISMA Function

////GRP
async function consultGrpAsync () {
    const result = await prisma.grp.findMany()
    return result
 }

 async function addGrpAsync (value) {
    if (!value) {
        value = "misc"
    }
    const grp = await prisma.grp.create({
        data: { 
            name: value
        }
    })
}

async function removeGrpValue (idNumber) {
    const result = await prisma.grp.delete({
        where: {
            id : idNumber
        }
    })
    return result, console.log(`Grp:${idNumber} supprimer `)
}

async function findIdGrpAsync (value) {
    let result = await prisma.grp.findUnique({
        where: { 
            name: value
        }
    })
    if (result) {
        return result.id
    } else {return false}
}

async function isInGrpAsync (value) {
    let isIn = false
    let data = await consultGrpAsync()
    for (let object of data) {
        if (object.name === value || object.id === value ){
            isIn = true
        }
    }
    return isIn
}

async function addAllGrp (lines, column) {
    for (let array of getArrayData(lines, column)) {
        let grp = array[0]
        if (!grp) {
            grp = "misc"
        }
        let isIn = false
        let data = await consultGrpAsync()
        for (let object of data) {
            if (object.name === grp ){
                isIn = true
            }
        }
        if (isIn === false ) {
            await addGrpAsync(grp)
        }
    } 
}

////Nutrient
async function addNutrientAsync (list) {
    for (let element of list) {
        const result = await prisma.nutrient.create({
            data: {
                name : element
            }
        })
    }
}

async function findIdNutrientAsync (value){
    let result = await prisma.nutrient.findFirst({
        where: { 
            name: value
        }
    })
    if (result) {
        return result.id
    } else {return false}
    
}

////Food
async function consultFoodAsync () {
    const result = await prisma.food.findMany()
    return result
}

async function addFoodAsync (grpId,name) {
    const food = await prisma.food.create({
        data: { 
            name: name,
            grp_id: grpId,
        }
    })
}

async function removeFoodAsync (idNumber) {
    const result = await prisma.food.delete({
        where: {
            id : idNumber
        }
    })
    return result, console.log(`Grp:${idNumber} is delete `)
}

async function findIdFoodAsync (value) {
    let result = await prisma.food.findFirst({
        where: { 
            name: value
        }
    })
    if (result) {
        return result.id
    } else {return false}
}

async function isInFoodAsync (value) {
    let isIn = false
    let data = await consultFoodAsync()
    for (let object of data) {
        if (object.name === value || object.id === value){
            isIn = true
        }
    }
    return isIn
}

async function addAllFoodAsync(lines, column ) {
    for (let array of getArrayData(lines, column)) {

        let grp = await findIdGrpAsync(array[0])
        if (!grp) {
            grp = 'misc'
        }
        let isIn = false
        let data = await consultFoodAsync()
        for (let object of data) {
            if (object.name === array[1] ){
                isIn = true
            }
        }
        if (!isIn) {
            await addFoodAsync(grp,array[1])
        }
    } 
}



//// addAllData
async function addAllDataAsync(lines, column) {
    for (let array of getArrayData(lines, column)) {
        const nutValueArray = array.slice(2) 
        let grp = await findIdGrpAsync(array[0])
        if (!grp) {
            grp = await findIdGrpAsync('misc')
            if (!grp) {
                await addGrpAsync('misc')
                grp = await findIdGrpAsync('misc')
            }       
        }
        if (!await isInGrpAsync(grp)) {
            await addGrpAsync(array[0])
            grp = await isInGrpAsync(array[0])
        }
        let food = await findIdFoodAsync(array[1])
        if (!food) {
            throw new Error("Error: Food format")
        }
        if (!await isInFoodAsync(food)){
            await addFoodAsync(grp,array[1])
            food = await findIdFoodAsync(array[1])
        }
        for( let i in nutValueArray) {
            
            if (nutValueArray.length !== array.length-2) {
                throw new Error("Error: Incorrect length of Nutvalue")
            }
            if (nutValueArray[i] === "") {
                nutValueArray[i] = "-"
            }
        }
    } 
}











//console.log(getColumn(columnsIndex))
//et x = getArrayData(rawData, columnsIndex)[3]
//console.log(typeof(x[3]))

//consultGrpAsync().then((result) => {console.log(result)})

//addAllGrp(rawData, columnsIndex)

//addNutrientAsync(getColumn(csvLines, columnsIndex).slice(2))

//addAllFoodAsync(rawData, columnsIndex)
//findIdGrpAsync('viandes, œufs, poissons et assimilés').then((result) => {console.log(result)})
//findIdFoodAsync('Terrine ou mousse de légumes').then((result) => {console.log(result)})
//console.log(await findIdFoodAsync("Dessert (aliment moyen)"))
//let x = getColumn( columnsIndex ).slice(2)[0]
//console.log(typeof(x))
//console.log(await findIdNutrientAsync(x))
//addAllDataAsync(rawData, columnsIndex)








  
