export const verificarRegistros = async(factura) =>{
    if(!factura.horas || !factura.dias){
        throw new Error('Es requerido alguno de los dos campos (horas o dias)');
    }
}