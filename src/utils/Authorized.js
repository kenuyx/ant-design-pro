import RenderAuthorized from '../components/Authorized';
import { getAuthentity } from './authentity';

let Authorized = RenderAuthorized(getAuthentity()); // eslint-disable-line

// Reload the rights component
const reloadAuthorized = (currentAuthority) => {
  Authorized = RenderAuthorized(currentAuthority);
};

export { reloadAuthorized };
export default Authorized;
