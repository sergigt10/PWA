
function sumarLento( numero ) {

    return new Promise(  function(resolve, reject){

        setTimeout( function() {

            resolve( numero + 1 );
            // reject( 'Sumar Lento falló' );

        }, 800 );

    });

}

let sumarRapido = (numero) => {

    return new Promise( (resolve, reject) => {

        setTimeout( ()=> {
            
            // resolve( numero + 1 );
            reject( 'Error en sumar rápido' );

        }, 1000 );

    });

}

// Si una de les dues promeses s'executa abans i no dona error i l'altre si. La primera s'executarà correctament, obviant l'altre que té un error.
Promise.race( [ sumarLento(5), sumarRapido(10) ] )
        .then( respuesta => {
            console.log(respuesta);
        })
        .catch( console.log );

