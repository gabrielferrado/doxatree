const axios = require('axios')
const baseUrl = process.env.PORTFOLIO_API_URL

exports.getPortfolio = async (id) => (await axios.get(`${baseUrl}/${id}`)).data
exports.createPortfolio = async (id, params) =>
  (await axios.post(`${baseUrl}/${id}`, params)).data
exports.updatePortfolio = async (id, params) =>
  (await axios.put(`${baseUrl}/${id}`, params)).data
exports.createLocket = async (portfolioId, params) =>
  (await axios.post(`${baseUrl}/locket/${portfolioId}`, params)).data

exports.getAsset = async (assetId) =>
  (await axios.get(`${baseUrl}/assets/${assetId}`)).data
exports.createAsset = async (locketId, params) =>
  (await axios.post(`${baseUrl}/assets/${locketId}`, params)).data
exports.updateAsset = async (locketId, assetId, params) =>
  (await axios.put(`${baseUrl}/assets/${locketId}/${assetId}`, params)).data
exports.deleteAsset = async (locketId, assetId) =>
  (await axios.delete(`${baseUrl}/assets/${locketId}/${assetId}`)).data
