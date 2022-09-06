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
            .font(escpos.FontFamily.A)
            .align(escpos.TextAlignment.Center)
            .style([escpos.FontStyle.Bold])
            .size(1, 1)
            .text("This is a BIG text")
            .font(escpos.FontFamily.B)
            .size(0, 0)
            .text("Normal-small text")
            .linearBarcode('1234567', escpos.Barcode1DType.EAN8, new escpos.Barcode1DOptions(2, 100, true, escpos.BarcodeTextPosition.Below, escpos.BarcodeFont.A))
            .qrCode('https://mycompany.com', new escpos.BarcodeQROptions(escpos.QRLevel.L, 6))
            .pdf417('PDF417 data to be encoded here', new escpos.BarcodePDF417Options(3, 3, 0, 0.1, false))
            .feed(5)
            .cut()
            .generateUInt8Array();


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