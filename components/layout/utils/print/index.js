'use server'

import Printer from 'node-thermal-printer'
// import {PosPrinter} from "electron-pos-printer";

// const electron = typeof process !== 'undefined' && process.versions && !!process.versions.electron;

export default async function printReceipt(text){

    try {
        // let printer = new ThermalPrinter({
        //     type: PrinterTypes.EPSON,
        //     interface: 'tcp://localhost:3000',
            
        // });
  
        await Printer.init({
          type: 'epson',
          interface: 'tcp://localhost:3000/',
        //   driver: require(electron ? 'electron-printer' : 'printer')
        });
  
        // Printer.print("Hello World");                               // Append text
        // Printer.println("Hello World"); 
  
        Printer.alignCenter();
        Printer.println(text);
        // Printer.cut();

        // let isConnected = await Printer.isPrinterConnected()        
        let execute = await Printer.execute()
        // let raw = await Printer.raw(Buffer.from("Hello world"));         
        
        // await Printer.printImage('./assets/olaii-logo-black.png')
  
        // console.log(isConnected);
        console.log(text);
        console.log("Print done!",execute);
      
    } catch (error) {
        console.error("Print failed: ", error)
      
    }
}
