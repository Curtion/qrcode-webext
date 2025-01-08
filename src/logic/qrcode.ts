import QRCode from 'qrcode'

const options = {
  margin: 2,
  width: 300,
  height: 300,
}

export async function generateQR(text: string) {
  try {
    return await QRCode.toDataURL(text, options)
  } catch (err) {
    console.error(err)
  }
}
