const { PDFDocument } = require( 'pdf-lib');
const express = require( 'express')
const bodyParser = require( 'body-parser')
const fetch = require( 'node-fetch');

const app = express()
const port = 4000
app.use(bodyParser.json()); // Para datos en formato JSON
app.use(bodyParser.urlencoded({ extended: true })); // Para datos codificados en URL
app.use(express.static(__dirname + '/public')); // Para servir archivos estáticos

const data = {
  nBoleta: 'Número de Boleta',
  cliente: 'Nombre del Cliente',
  address: 'Dirección Principal',
  address2: 'Dirección Secundaria',
  ci: 'CI del Cliente',
  phone: 'Número de Teléfono',
  fecha: 'Fecha',
  vence: 'Fecha de Vencimiento',
  matricula: 'IAG 3123',
  totalAPagar: 'Total a Pagar',
  total: 'Total',
  montoIva: 'Monto de IVA',
  subTotal: 'Subtotal',
  monto: 'Monto',
  precioU: 'Precio Unitario',
  description: 'Descripción',
  codigo: 'Código',
  modelo: 'Modelo',
  cantidad: 'Cantidad',
  kmts: '123300',
  iva: 'IVA',

}
async function main (data){
  const FONTSIZE_DEFAULT = 9;


///////////////////
  const url = 'https://drive.google.com/u/0/uc?id=14X7-FPXpWZPSiLEdpTcpF_uJtVKg7ZAH&export=download'
  // const buffer = fs.readFileSync(url)

  // use node fetch to get the pdf bytes from the url
  const response = await fetch(url)
  const buffer = await response.arrayBuffer()

  const pdfDoc = await PDFDocument.load(buffer)

  const form = pdfDoc.getForm()

  setDataInForm(form, data)
  const pdfBytes = await pdfDoc.save()
  return pdfBytes

  // fs.writeFile(`${data.nBoleta}-${data.ci}.pdf`, pdfBytes, (err) => {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     console.log("File written successfully\n");
  //   }
  // });
}

function setDataInForm(form, data) {
  form.getTextField('Cliente').setText(data.cliente)
  form.getTextField('address').setText(data.address)
  form.getTextField('address2').setText(data.address2)
  form.getTextField('ci').setText(data.ci)
  form.getTextField('phone').setText(data.phone)
  form.getTextField('fecha').setText(data.fecha)
  form.getTextField('vence').setText(data.vence)
  form.getTextField('nBoleta').setText(data.nBoleta)
  form.getTextField('matricula').setText(data.matricula)
  form.getTextField('totalAPagar').setText(data.totalAPagar)
  form.getTextField('total').setText(data.total)
  form.getTextField('montoIva').setText(data.montoIva)
  form.getTextField('subTotal').setText(data.subTotal)
  form.getTextField('monto').setText(data.monto)
  form.getTextField('precioU').setText(data.precioU)
  form.getTextField('description').setText(data.description)
  form.getTextField('codigo').setText(data.codigo)
  form.getTextField('modelo').setText(data.modelo)
  form.getTextField('cantidad').setText(data.cantidad)
  form.getTextField('kmts').setText(data.kmts)
  form.getTextField('iva').setText(data.iva)
}


// main()

function calcularMontoIva(data){
  const newMontoIva = parseFloat(data.monto) * 0.22 
  data.montoIva = newMontoIva.toFixed(2).toString()
  data.iva = '22'
}

function calcularMonto(data) {
  data.monto = (parseFloat(data.precioU) * parseFloat(data.cantidad)).toFixed(2).toString()
}

function calcularSubTotal(data){
  data.subTotal = data.motno
}

function calcularTotal(data){
  const newTotal = parseFloat(data.subTotal) + parseFloat(data.montoIva)
  data.total = newTotal.toFixed(2).toString()
}

app.post('/generate', async (req, res) => {
  const data = req.body
  
  calcularMontoIva(data)
  // calcularMonto(data)
  // calcularSubTotal(data)
  // calcularTotal(data)

  console.log("Data: ",data)

  if (data === undefined) {
    res.status(400).send('Invalid request')
    return
  }
  const pdfBytes = await main(data)

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="' + data.nBoleta + '-' + data.cliente + '.pdf"');

  res.send(Buffer.from(pdfBytes, 'base64')); // Si los bytes están en formato base64
})

app.get('/', function(req, res) {
    res.render('index.html');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

module.exports = app;