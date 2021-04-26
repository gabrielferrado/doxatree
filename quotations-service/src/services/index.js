import axios from "axios";
import CONSTANTS from "../assets/constants";

class Services {
  ping() {
    try {
      return axios.get("https://data.tradingview.com/ping");
    } catch (e) {
      throw new Error(e.message);
    }
  }

  scanCrypto() {
    return new Promise((resolve) => {
      const ping = this.ping();
      let i = 0;
      let status = 0;
      setInterval(async () => {
        if (i === 0) status = (await ping).status;

        if (status === 200) {
          const response = await axios.post(
            "https://scanner.tradingview.com/crypto/scan",
            CONSTANTS.cryptoBody
          );
          i += 1;
          resolve(console.log(response.data.totalCount, i, "CRYPTO"));
        }

        if (i === 7) i = 0;
      }, 1000);
    });
  }

  scanUSA() {
    return new Promise((resolve) => {
      const ping = this.ping();
      let i = 0;
      let status = 0;
      setInterval(async () => {
        if (i === 0) status = (await ping).status;

        if (status === 200) {
          const response = await axios.post(
            "https://scanner.tradingview.com/america/scan",
            CONSTANTS.stockUSABody
          );
          i += 1;
          resolve(console.log(response.data.totalCount, i, "USA"));
        }

        if (i === 7) i = 0;
      }, 1000);
    });
  }

  scanBR() {
    return new Promise((resolve) => {
      const ping = this.ping();
      let i = 0;
      let status = 0;
      setInterval(async () => {
        if (i === 0) status = (await ping).status;

        if (status === 200) {
          const response = await axios.post(
            "https://scanner.tradingview.com/brazil/scan",
            CONSTANTS.stockBRBody
          );
          i += 1;
          resolve(console.log(response.data.totalCount, i, "BR"));
        }

        if (i === 7) i = 0;
      }, 1000);
    });
  }
}

export default new Services();
