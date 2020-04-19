
((num = 12345)=>{
    console.log(num);
})()

// 2020-03-15, 5
// 2020-03-16, 7,
// 2020-03-16, 10

interface Diferencias {
    valorContagios: number;
    fechaActualizacion: string;
}

const chile = [{"_id":"5e5f9c3ff127834f0cc52427","Lugar":"Chile","Contagiados":1,"Decesos":0,"Actualizado":"2020-03-04T12:14:39.266Z","__v":0},{"_id":"5e65a50068df483de8d1b877","Lugar":"Chile","Contagiados":5,"Decesos":0,"Actualizado":"2020-03-09T01:57:52.865Z","__v":0},{"_id":"5e6639d6fa98573d54acefdf","Lugar":"Chile","Contagiados":10,"Decesos":0,"Actualizado":"2020-03-09T12:37:45.486Z","__v":0},{"_id":"5e678adebf9a1000296f0074","Lugar":"Chile","Contagiados":13,"Decesos":0,"Actualizado":"2020-03-10T12:40:58.663Z","__v":0},{"_id":"5e67e6c28099c44734efcb1e","Lugar":"Chile","Contagiados":13,"Decesos":0,"Actualizado":"2020-03-10T18:40:30.827Z","__v":0},{"_id":"5e63325e27d547003122b23b","Lugar":"Chile","Contagiados":13,"Decesos":0,"Actualizado":"2020-03-11T18:07:04.462Z","__v":0},{"_id":"5e699f2aff5ecf002f4a37ae","Lugar":"Chile","Contagiados":23,"Decesos":0,"Actualizado":"2020-03-12T02:32:02.256Z","__v":0},{"_id":"5e6b79b5c88a5000298b7a80","Lugar":"Chile","Contagiados":33,"Decesos":0,"Actualizado":"2020-03-13T12:16:42.958Z","__v":0},{"_id":"5e6ea2e2d5820d002fe24098","Lugar":"Chile","Contagiados":61,"Decesos":0,"Actualizado":"2020-03-15T21:49:20.297Z","__v":0},{"_id":"5e6ed876339b880029d6ee3c","Lugar":"Chile","Contagiados":75,"Decesos":0,"Actualizado":"2020-03-16T01:37:55.958Z","__v":0},{"_id":"5e6fd3e94a791f002f8d0650","Lugar":"Chile","Contagiados":155,"Decesos":0,"Actualizado":"2020-03-16T19:30:45.962Z","__v":0},{"_id":"5e7117117e99a40029c241c6","Lugar":"Chile","Contagiados":201,"Decesos":0,"Actualizado":"2020-03-17T18:29:32.910Z","__v":0},{"_id":"5e726c5d1cd67f002ee17fb7","Lugar":"Chile","Contagiados":238,"Decesos":0,"Actualizado":"2020-03-18T18:45:45.126Z","__v":0},{"_id":"5e74fd04c01399002eedfede","Lugar":"Chile","Contagiados":434,"Decesos":0,"Actualizado":"2020-03-20T17:27:28.519Z","__v":0},{"_id":"5e7633f4048cce002702dd22","Lugar":"Chile","Contagiados":537,"Decesos":0,"Actualizado":"2020-03-21T15:34:10.727Z","__v":0},{"_id":"5e76cd0a6cab3e002f3676f8","Lugar":"Chile","Contagiados":537,"Decesos":1,"Actualizado":"2020-03-22T02:27:21.189Z","__v":0},{"_id":"5e77ae44f8deed002fe764bd","Lugar":"Chile","Contagiados":632,"Decesos":1,"Actualizado":"2020-03-22T18:28:18.917Z","__v":0},{"_id":"5e7971152cc7e9002e0b63bf","Lugar":"Chile","Contagiados":746,"Decesos":2,"Actualizado":"2020-03-24T02:31:47.704Z","__v":0},{"_id":"5e7ac65fdcb2a5002e9aa182","Lugar":"Chile","Contagiados":922,"Decesos":2,"Actualizado":"2020-03-25T02:47:57.191Z","__v":0},{"_id":"5e7c1ebb35363e002febc55a","Lugar":"Chile","Contagiados":1142,"Decesos":3,"Actualizado":"2020-03-26T03:17:13.922Z","__v":0},{"_id":"5e7cc9df24acfa002f82fc88","Lugar":"Chile","Contagiados":1306,"Decesos":4,"Actualizado":"2020-03-26T15:27:24.766Z","__v":0},{"_id":"5e7e19ae311fc3002e2e63de","Lugar":"Chile","Contagiados":1610,"Decesos":5,"Actualizado":"2020-03-27T15:20:09.756Z","__v":0},{"_id":"5e800eb870fcf90029b8e797","Lugar":"Chile","Contagiados":1909,"Decesos":6,"Actualizado":"2020-03-29T02:57:58.997Z","__v":0},{"_id":"5e82c2cfb30bd70028f09ee8","Lugar":"Chile","Contagiados":2449,"Decesos":8,"Actualizado":"2020-03-31T04:10:53.300Z","__v":0},{"_id":"5e836b57ec41740029259889","Lugar":"Chile","Contagiados":2738,"Decesos":16,"Actualizado":"2020-03-31T16:09:58.133Z","__v":0},{"_id":"5e84b229ac623d002983759d","Lugar":"Chile","Contagiados":3031,"Decesos":16,"Actualizado":"2020-04-01T15:24:24.475Z","__v":0},{"_id":"5e860623d754250028fd9f8b","Lugar":"Chile","Contagiados":3404,"Decesos":18,"Actualizado":"2020-04-02T15:34:56.318Z","__v":0},{"_id":"5e8759e328862700297c9ff5","Lugar":"Chile","Contagiados":3737,"Decesos":22,"Actualizado":"2020-04-03T15:44:33.895Z","__v":0},{"_id":"5e89f72210c15c0027600873","Lugar":"Chile","Contagiados":4161,"Decesos":27,"Actualizado":"2020-04-05T15:20:00.103Z","__v":0},{"_id":"5e8b4b85a8daf70029c271d9","Lugar":"Chile","Contagiados":4471,"Decesos":34,"Actualizado":"2020-04-06T15:32:18.442Z","__v":0},{"_id":"5e8c913e25c30f17248ec4ab","Lugar":"Chile","Contagiados":4815,"Decesos":37,"Actualizado":"2020-04-07T14:40:36.070Z","__v":0},{"_id":"5e8e030b4aebd30028456de1","Lugar":"Chile","Contagiados":5546,"Decesos":48,"Actualizado":"2020-04-08T16:59:52.236Z","__v":0},{"_id":"5e8f41726171de1788b30def","Lugar":"Chile","Contagiados":5972,"Decesos":57,"Actualizado":"2020-04-09T15:36:01.468Z","__v":0},{"_id":"5e912a3b6bebb8001760bb7b","Lugar":"Chile","Contagiados":6501,"Decesos":65,"Actualizado":"2020-04-11T02:23:52.992Z","__v":0},{"_id":"5e92542f78586000175e7086","Lugar":"Chile","Contagiados":6927,"Decesos":73,"Actualizado":"2020-04-11T23:35:09.471Z","__v":0},{"_id":"5e950231d5409b0017dbd2f4","Lugar":"Chile","Contagiados":7525,"Decesos":82,"Actualizado":"2020-04-14T00:22:06.876Z","__v":0},{"_id":"5e96560d7cb5b700170679d5","Lugar":"Chile","Contagiados":7917,"Decesos":92,"Actualizado":"2020-04-15T00:32:11.467Z","__v":0},{"_id":"5e98b176361d104e30fdfc51","Lugar":"Chile","Contagiados":8807,"Decesos":105,"Actualizado":"2020-04-16T19:25:39.620Z","__v":0},{"_id":"5e9a952d8417ff0017bf7e63","Lugar":"Chile","Contagiados":9252,"Decesos":116,"Actualizado":"2020-04-18T05:50:32.077Z","__v":0}]

const getCurvaContagiados = (casos: any[] = chile) => {
    casos = chile;
    let listaDiferencias: Diferencias[] = [];
    let curvaContagiosPorDia: Diferencias[] = [];
    const fechasInformadas = casos.map(data => new Date(data.Actualizado).toISOString().slice(0,10).replace(/[-]/g, '/'));
    const fechasInformadasPorDia = [...new Set(fechasInformadas)];
    for ( const [idx, caso] of casos.entries() ) {
        const fechaCorta = new Date(caso.Actualizado).toISOString().slice(0,10).replace(/[-]/g, '/');
        if (idx === 0){
            listaDiferencias.push({valorContagios: caso.Contagiados, fechaActualizacion: fechaCorta});
        } else if (caso.Contagiados !== 0) {
            listaDiferencias.push({valorContagios: caso.Contagiados - casos[idx - 1].Contagiados, fechaActualizacion: fechaCorta});
        }
    }
    fechasInformadasPorDia.map(fecha => {
        const valorContagios = listaDiferencias.filter(filtrados => filtrados.fechaActualizacion === fecha).reduce((acc, val) => acc + val.valorContagios, 0);
        curvaContagiosPorDia.push({valorContagios, fechaActualizacion: fecha});
    });

    return curvaContagiosPorDia;
}

const curva = getCurvaContagiados();
console.log(curva);
