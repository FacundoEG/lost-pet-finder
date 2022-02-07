import algoliasearch from "algoliasearch";

/* // COMENTAR ESTO A LA HORA DE HACER DEPLOY!!
import { APP_ID, API_KEY } from "../../keys/algolia"; */

const client = algoliasearch(
  process.env.ALGOLIA_APP_ID /* || APP_ID */,
  process.env.ALGOLIA_API_KEY /* || API_KEY */
);
const index = client.initIndex("pets");

export { index };
