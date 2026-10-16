const crypto = require('crypto');

const SENHA = 'minhaSenhaSecreta';
const SALT = 'saltEstatico'; 
const CHAVE_SECRETA = crypto.scryptSync(SENHA, SALT, 32);
/**
 * Decifra os dados empacotados em JSON usando a chave compartilhada.
 * @param {string} pacoteJson - A string JSON gerada pela função criptografar.
 * @returns {string} O texto original em claro.
 */
function criptografar(texto) {
    const iv = crypto.randomBytes(12); 
    const cipher = crypto.createCipheriv('aes-256-gcm', CHAVE_SECRETA, iv);

    let criptografado = cipher.update(texto, 'utf8', 'hex');
    criptografado += cipher.final('hex');

    const authTag = cipher.getAuthTag().toString('hex');

    return JSON.stringify({
        iv: iv.toString('hex'),
        conteudo: criptografado,
        tag: authTag
    });
}

/**
 * Decifra os dados empacotados em JSON usando a chave compartilhada.rafar.
 * @returns {string} O texto original em claro.
 */

function decifrar(pacoteJson) {
    const { iv, conteudo, tag} = JSON.parse(pacoteJson);
    const decipher = crypto.createDecipheriv(
        'aes-256-gcm',
        CHAVE_SECRETA,
        Buffer.from(iv, 'hex')
    );
    decipher.setAuthTag(Buffer.from(tag, 'hex'));

    let decifrado = decipher.update(conteudo, 'hex', 'utf8');
    decifrado += decipher.final('utf8');

    return decifrado;
}

module.exports = {
    criptografar,
    decifrar 
};