// Guardar en el cache dinámico
function actualizaCacheDinamico( dynamicCache, req, res ) {
    if ( res.ok ) {
        return caches.open( dynamicCache ).then( cache => {
            cache.put( req, res.clone() );
            return res.clone();
        });
    } else {
        return res;
    }
}

// Cache with network update
function actualizaCacheStatico( staticCache, req, APP_SHELL_INMUTABLE ) {   
    // Si se encuentra en el cache inmutable pasa de el sino...
    if ( APP_SHELL_INMUTABLE.includes(req.url) ) {
        // No hace falta actualizar el inmutable
        // console.log('existe en inmutable', req.url );
    } else {
        // Hace el fetch del request
        // Aunque esté en una versión atrás siempre lo vamos a estar actualizando.
        return fetch( req )
                .then( res => {
                    return actualizaCacheDinamico( staticCache, req, res );
                });
    }
}

// Network with cache fallback / update
function manejoApiMensajes( cacheName, req ) {
    if ( req.clone().method === 'POST' ) {
        // POSTEO de un nuevo mensaje
        if ( self.registration.sync ) {
            return req.clone().text().then( body =>{
                // console.log(body);
                const bodyObj = JSON.parse( body );
                return guardarMensaje( bodyObj );
            });
        } else {
            return fetch( req );
        }
    } else {
        return fetch( req ).then( res => {
            // Si lo hizo bien
            if ( res.ok ) {
                actualizaCacheDinamico( cacheName, req, res.clone() );
                return res.clone();
            } else {
                // Si la respuesta no es exitosa respondemos lo que tenemos en el cache
                return caches.match( req );
            }
        }).catch( err => {
            // Si no tengo connexión a Internet
            // Cache
            return caches.match( req );
        });
    }
}

