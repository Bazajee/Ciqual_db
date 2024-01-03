import express from "express"
import { PrismaClient } from '@prisma/client'


const prisma = new PrismaClient()
const app = express()






app.listen(3000, function() {
    console.log('listening to port 3000')
 })