
import mongoose from 'mongoose';

export interface Actualizacion {
    Lugar: string;
    Contagiados: number;
    Decesos: number;
    Actualizado: Date;
}

const casoVirusSchema = new mongoose.Schema({
    Lugar: String,
    Contagiados: Number,
    Decesos: Number,
    Actualizado: String,
});

export const ingresaActualizacionInDB = async(new_caso: Actualizacion) => {
    try {
        
        const URI_MONGO = 'mongodb://heroku_hrxh1nwf:em28em9ah37s5b7ucsoqa3q2u7@ds163796.mlab.com:63796/heroku_hrxh1nwf';        
        await mongoose.connect(URI_MONGO, {useNewUrlParser: true, useUnifiedTopology: true} );

        const Caso = mongoose.model('Casos', casoVirusSchema);
    
        const caso = new Caso({ 
            Lugar: new_caso.Lugar,
            Contagiados: new_caso.Contagiados,
            Decesos: new_caso.Decesos,
            Actualizado: new_caso.Actualizado
        });
        
        await caso.save();
     
    } catch (error) { 
        console.log("Error: {ingresaActualizacionInDB} - ",error.message);
        ingresaActualizacionInDB(new_caso);
    }
}


export const getCasoByCountryInDB = async(country: string) => {
    try {
        const URI_MONGO = 'mongodb://heroku_hrxh1nwf:em28em9ah37s5b7ucsoqa3q2u7@ds163796.mlab.com:63796/heroku_hrxh1nwf';        
        await mongoose.connect(URI_MONGO, {useNewUrlParser: true, useUnifiedTopology: true} );
        const Caso = mongoose.model('Casos', casoVirusSchema);

        const first = country.substr(0,1);
        country = country.replace(first, first.toUpperCase());

        const result: any[] = await Caso.find({"Lugar": country});
        
        if (typeof result === "undefined") { throw new Error("Ninguna coincidencia de busqueda"); }
        
        return result;

    } catch (error) {
        getCasoByCountryInDB(country);
        console.log('Error: {getCasoByCountryInDB} - ', error.message);
    }
}