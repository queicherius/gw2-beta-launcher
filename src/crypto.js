const crypto = require('crypto')
const algorithm = 'aes-256-ctr'
const keyphrase = 'pg7DJ18RsIcgT11WSmnY4tlDbKtOJHGa3H2qGQ892a9Lf7WLe9yVxX36XI20MVFm'

function encrypt (text) {
  let salt = crypto.randomBytes(16).toString('hex')
  localStorage.setItem('salt', salt)

  let cipher = crypto.createCipher(algorithm, salt + keyphrase)
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  return encrypted
}

function decrypt (text) {
  let salt = localStorage.getItem('salt')

  if (!salt) {
    return ''
  }

  try {
    let decipher = crypto.createDecipher(algorithm, salt + keyphrase)
    let decrypted = decipher.update(text, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
  }
  catch (err) {
    return ''
  }
}

module.exports = {encrypt, decrypt}
