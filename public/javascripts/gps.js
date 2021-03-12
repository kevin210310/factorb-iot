console.log(id);

axios({ 
    method: 'POST', 
    url: 'http://127.0.0.1:3000/api/get_devices', 
    headers: {
        Authorization: "Bearer Token"
    }, 
    data: { 
        id: id
    }
}).then((res) => {
    
    console.log(res.data);
    notification("success", "Recuperación de Datos Exitosa.");
    
    let devices = `<b class="font-weight-light">Dispositivos: ${res.data.length} encontrados.</b>`;
    document.getElementById('devices').innerHTML = devices;
    
    for(let i = 0 ; i < res.data.length ; i ++){

    }
    
}).catch((err) => {

    console.log(err);
    notification("error", "Recuperación de Datos Fallida.");
});