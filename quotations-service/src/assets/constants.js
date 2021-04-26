const CONSTANTS = {
  cryptoBody: {
    filter: [
      {
        left: "name",
        operation: "nempty",
      },
      {
        left: "exchange",
        operation: "equal",
        right: "BINANCE",
      },
    ],
    columns: ["name", "close", "description"],
    sort: {
      sortBy: "name",
      sortOrder: "asc",
    },
    range: [0, 9999],
  },
  stockUSABody: {
    filter: [
      {
        left: "name",
        operation: "nempty",
      },
      {
        left: "exchange",
        operation: "in_range",
        right: ["AMEX", "NASDAQ", "NYSE"],
      },
    ],
    options: {
      lang: "en",
    },
    symbols: {
      query: {
        types: [],
      },
      tickers: [],
    },
    columns: ["name", "close|1", "description"],
    sort: {
      sortBy: "name",
      sortOrder: "desc",
    },
    range: [0, 99999],
  },
  stockBRBody: {
    filter: [
      {
        left: "name",
        operation: "nempty",
      },
    ],
    options: {
      lang: "en",
    },
    symbols: {
      query: {
        types: [],
      },
      tickers: [],
    },
    columns: ["name", "close|1", "description"],
    sort: {
      sortBy: "name",
      sortOrder: "desc",
    },
    range: [0, 99999],
  },
};

export default CONSTANTS;
