'use strict';
//TODO: revisar nombres de variables y modelos
const { askUser } = require('./lib/utils');
const { mongoose, connectMongoose, Flip} = require('./models');

const FLIPS_JSON = './data.json';

main().catch(err => console.error('Error!', err));

 // Espero a que se conecte la BD (para que los mensajes salgan en orden)
async function main() {

  await connectMongoose; 

  const answer = await askUser('Are you sure you want to empty DB and load initial data? (no) ');
  if (answer.toLowerCase() !== 'yes') {
    console.log('DB init aborted! nothing has been done');
    return process.exit(0);
  }

  // Inicializar nuestros modelos
  const flipsResult = await initFlips(FLIPS_JSON);
  console.log(`\nFlips: Deleted ${flipsResult.deletedCount}, loaded ${flipsResult.loadedCount} from ${FLIPS_JSON}`);

  // Cuando termino, cierro la conexión a la BD
  await mongoose.connection.close();
  console.log('\nDone.');
}

async function initFlips(fichero) {
  try {
    const { deletedCount } = await Flip.deleteMany();
    const loadedCount = await Flip.cargaJson(fichero);
    return { deletedCount, loadedCount };
  } catch (error) {
    return (console.log(error));
  }

}