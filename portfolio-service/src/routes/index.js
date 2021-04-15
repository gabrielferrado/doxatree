import {PortfolioController} from "../app/controllers/PortfolioController";
import {LocketController} from "../app/controllers/LocketController";
import {AssetController} from "../app/controllers/AssetController";


const _routes = [
  ['/v1', PortfolioController],
  ['/v1/locket', LocketController],
  ['/v1/assets', AssetController],
];

export const routes = (app) => {
  _routes.forEach((route) => {
    const [url, controller] = route;
    app.use(url, controller);
  });
};
