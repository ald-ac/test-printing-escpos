var clientPrinters = null;
var _this = this;

//WebSocket settings
JSPM.JSPrintManager.auto_reconnect = true;
JSPM.JSPrintManager.start();
JSPM.JSPrintManager.WS.onStatusChanged = function () {
    if (jspmWSStatus()) {
        //get client installed printers
        JSPM.JSPrintManager.getPrinters().then(function (printersList) {
            clientPrinters = printersList;
            var options = '';
            for (var i = 0; i < clientPrinters.length; i++) {
                options += '<option>' + clientPrinters[i] + '</option>';
            }
            $('#printerName').html(options);
        });
    }
};

//Check JSPM WebSocket status
function jspmWSStatus() {
    if (JSPM.JSPrintManager.websocket_status == JSPM.WSStatus.Open)
        return true;
    else if (JSPM.JSPrintManager.websocket_status == JSPM.WSStatus.Closed) {
        console.warn('JSPrintManager (JSPM) is not installed or not running! Download JSPM Client App from https://neodynamic.com/downloads/jspm');
        return false;
    }
    else if (JSPM.JSPrintManager.websocket_status == JSPM.WSStatus.Blocked) {
        alert('JSPM has blocked this website!');
        return false;
    }
}

//Do printing...
function doPrinting() {
    if (jspmWSStatus()) {

        // Gen sample label featuring logo/image, barcode, QRCode, text, etc by using JSESCPOSBuilder.js

        var escpos = Neodynamic.JSESCPOSBuilder;
        var doc = new escpos.Document();

        // logo image loaded, create ESC/POS commands

        var escposCommands = doc
            .font(escpos.FontFamily.B)
            .align(escpos.TextAlignment.Center)
            .style([escpos.FontStyle.Bold])
            .size(3, 3)
            .text("Red Via Corta")
            .control(escpos.FeedControlSequences.CR)
            .control(escpos.FeedControlSequences.CR)
            .feed(1)
            .font(escpos.FontFamily.C)
            .size(1, 1)
            .align(escpos.TextAlignment.LeftJustification)
            .text("Plaza: "+"OCOTLAN")
            .control(escpos.FeedControlSequences.CR)
            .text("Tramo: "+"ARANDAS - EL DESPERDICIO")
            .control(escpos.FeedControlSequences.CR)
            .text("Tránsito: "+"67"+"       Clase: " + "C9+5")
            .control(escpos.FeedControlSequences.CR)
            .text("EFECTIVO")
            .control(escpos.FeedControlSequences.CR)
            .control(escpos.FeedControlSequences.CR)
            .align(escpos.TextAlignment.LeftJustification)
            .text("1234-5678-9123-4567")
            .qrCode("1234567891234567", new escpos.BarcodeQROptions(escpos.QRLevel.L, 6))
            .text("1234-5678-9123-4567")
            .control(escpos.FeedControlSequences.CR)
            .text("Importe        Iva          Total")
            .text("$1020.69       $163.31      $1184.00")
            .control(escpos.FeedControlSequences.CR)
            .control(escpos.FeedControlSequences.CR)
            .align(escpos.TextAlignment.Center)
            .size(1, 1)
            .text("SOS *445 o al (33) 30014745")
            .control(escpos.FeedControlSequences.CR)
            .size(0,0)
            .text("atencion@redviacorta.mx")
            .control(escpos.FeedControlSequences.CR)
            .text("Sistema de cobro Vehicular")
            .feed(5)
            .cut()

            .font(escpos.FontFamily.A)
            .align(escpos.TextAlignment.Center)
            .style([escpos.FontStyle.Bold])
            .size(1, 1)
            .text("Red Via Corta")
            .control(escpos.FeedControlSequences.CR)
            .control(escpos.FeedControlSequences.CR)
            .feed(1)
            .font(escpos.FontFamily.A)
            .size(1, 1)
            .align(escpos.TextAlignment.RightJustification)
            .text("Plaza: "+"OCOTLAN")
            .control(escpos.FeedControlSequences.CR)
            .text("Tramo: "+"ARANDAS - EL DESPERDICIO")
            .control(escpos.FeedControlSequences.CR)
            .text("Tránsito: "+"67"+"       Clase: " + "C9+5")
            .control(escpos.FeedControlSequences.CR)
            .text("EFECTIVO")
            .control(escpos.FeedControlSequences.CR)
            .control(escpos.FeedControlSequences.CR)
            .align(escpos.TextAlignment.RightJustification)
            .text("1234-5678-9123-4567")
            .qrCode("1234567891234567", new escpos.BarcodeQROptions(escpos.QRLevel.L, 6))
            .text("1234-5678-9123-4567")
            .control(escpos.FeedControlSequences.CR)
            .text("Importe        Iva          Total")
            .text("$1020.69       $163.31      $1184.00")
            .control(escpos.FeedControlSequences.CR)
            .control(escpos.FeedControlSequences.CR)
            .align(escpos.TextAlignment.Center)
            .size(1, 1)
            .text("SOS *445 o al (33) 30014745")
            .control(escpos.FeedControlSequences.CR)
            .size(0,0)
            .control(escpos.FeedControlSequences.CR)
            .control(escpos.FeedControlSequences.CR)
            .control(escpos.FeedControlSequences.CR)
            .control(escpos.FeedControlSequences.CR)
            .text("atencion@redviacorta.mx")
            .control(escpos.FeedControlSequences.CR)
            .text("Sistema de cobro Vehicular")
            .feed(5)
            .cut()

            .generateUInt8Array()


        // create ClientPrintJob
        var cpj = new JSPM.ClientPrintJob();

        // Set Printer info
        var myPrinter = new JSPM.InstalledPrinter($('#printerName').val());
        cpj.clientPrinter = myPrinter;

        // Set the ESC/POS commands
        cpj.binaryPrinterCommands = escposCommands;

        // Send print job to printer!
        cpj.sendToClient();
    }
}