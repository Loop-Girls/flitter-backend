'use strict';
//TODO: revisar nombres de variables y modelos
const { askUser } = require('./lib/utils');
const { mongoose, connectMongoose, Flit} = require('./models');

const FLITS_JSON = './data.json';

main().catch(err => console.error('Error!', err));

 // Espero a que se conecte la BD (para que los mensajes salgan en orden)
async function main() {

  await connectMongoose; 

  const answer = await askUser('Are you sure you want to empty DB and load initial data? (no/yes) ');
  if (answer.toLowerCase() !== 'yes') {
    console.log('DB init aborted! nothing has been done');
    return process.exit(0);
  }

  // Inicializar nuestros modelos
  const flitsResult = await initFlits(FLITS_JSON);
  console.log(`\nFlits: Deleted ${flitsResult.deletedCount}, loaded ${flitsResult.loadedCount} from ${FLITS_JSON}`);

  // Cuando termino, cierro la conexión a la BD
  await mongoose.connection.close();
  console.log('\nDone.');
}

async function initFlits(fichero) {
  try {
    const { deletedCount } = await Flit.deleteMany();
    const loadedCount = await Flit.cargaJson(fichero);
    return { deletedCount, loadedCount };
  } catch (error) {
    return (console.log(error));
  }

}