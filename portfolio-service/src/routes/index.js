import AssetController from "../app/controllers/AssetController";
import LocketController from "../app/controllers/LocketController";
import PortfolioController from "../app/controllers/PortfolioController";
import GroupController from "../app/controllers/GroupController";

const _routes = [
  ["/v1/portfolios", PortfolioController],
  ["/v1/locket", LocketController],
  ["/v1/assets", AssetController],
  ["/v1/groups", GroupController],
];

const routes = (app) => {
  _routes.forEach((route) => {
    const [url, controller] = route;
    app.use(url, controller);
  });
};

export default routes;
